import React, { useState, useEffect, useRef } from 'react';
import { getDynamicPitch, getInstagramUrl } from '../utils/pitchHelper';

const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

// Synthesize modern success chime using Web Audio API + trigger haptics
const playSuccessSound = (volume = 0.5) => {
  try {
    if (navigator.vibrate) {
      navigator.vibrate([30, 20, 30]);
    }
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sine';
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    const now = ctx.currentTime;
    osc.frequency.setValueAtTime(587.33, now); // D5 Note
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.15); // A5 Note
    
    gain.gain.setValueAtTime(0.12 * volume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
    
    osc.start(now);
    osc.stop(now + 0.3);
  } catch (e) {}
};

// Synthesize downward DQ sound + trigger haptics
const playDqSound = (volume = 0.5) => {
  try {
    if (navigator.vibrate) {
      navigator.vibrate(65);
    }
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sine';
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    const now = ctx.currentTime;
    osc.frequency.setValueAtTime(440, now); // A4
    osc.frequency.exponentialRampToValueAtTime(220, now + 0.18); // A3 (slide down)
    
    gain.gain.setValueAtTime(0.1 * volume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
    
    osc.start(now);
    osc.stop(now + 0.22);
  } catch (e) {}
};

// Synthesize premium double chime for Whales (Tier 1) + trigger haptics
const playWhaleSound = (volume = 0.5) => {
  try {
    if (navigator.vibrate) {
      navigator.vibrate([70, 30, 70, 30, 110]);
    }
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    
    const playChime = (frequency, delay, duration) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      const now = ctx.currentTime + delay;
      osc.frequency.setValueAtTime(frequency, now);
      
      gain.gain.setValueAtTime(0.08 * volume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
      
      osc.start(now);
      osc.stop(now + duration);
    };
    
    playChime(880, 0, 0.25); // A5 note
    playChime(1318.51, 0.08, 0.35); // E6 note
  } catch (e) {}
};

export default function ZenSprint({ leads, activeFounder, onStatusUpdate, onClose }) {
  // Session Resume Memory: Restore previous sprint card index if valid
  const [currentIndex, setCurrentIndex] = useState(() => {
    const cachedIndex = localStorage.getItem('zen_sprint_index');
    return cachedIndex ? parseInt(cachedIndex, 10) : 0;
  });

  const [copied, setCopied] = useState(false);
  const [copyText, setCopyText] = useState("");
  const [activeChannel, setActiveChannel] = useState("ig"); // 'ig' or 'email'
  
  // Dual-Channel Auto-Flow Step: 1 = IG DM, 2 = Email compose
  const [subStep, setSubStep] = useState(1);
  const [autoLaunch, setAutoLaunch] = useState(false); // Off by default for safety, easily toggled

  // Volumetric Audio Controller
  const [audioVolume, setAudioVolume] = useState(() => {
    const cachedVol = localStorage.getItem('zen_sprint_volume');
    return cachedVol ? parseFloat(cachedVol) : 0.5;
  });

  // Swipe gesture configuration
  const [swipeThreshold, setSwipeThreshold] = useState(() => {
    const cachedThreshold = localStorage.getItem('zen_swipe_threshold');
    return cachedThreshold ? parseInt(cachedThreshold, 10) : 80;
  });

  // Horizontal Speed Countdown states (15 seconds)
  const [timeLeft, setTimeLeft] = useState(15);
  
  // Touch gestures states
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  // Skip state for focus listeners to prevent loop double-triggers
  const launchRef = useRef(false);

  // 1. Filter out leads with missing coordinates to prevent workflow locks
  const sprintLeads = leads
    .filter(lead => {
      // Must have at least one channel to message
      if (!lead.instagram_profile_url && !lead.direct_founder_email) return false;
      
      if (lead.outreach_status === 'Phase 1') return true;
      if (['Phase 2', 'Phase 3', 'Phase 4', 'Phase 5'].includes(lead.outreach_status)) {
        // Ensure this follow-up belongs to the active logged-in founder
        if (lead.last_action_by !== activeFounder) return false;
        
        // Dynamic helper to check if due
        if (!lead.last_action_at) return false;
        const lastActionDate = new Date(lead.last_action_at);
        const now = new Date();
        const elapsedHrs = (now - lastActionDate) / (1000 * 60 * 60);
        
        switch (lead.outreach_status) {
          case 'Phase 2':
          case 'Phase 3':
            return elapsedHrs >= 48;
          case 'Phase 4':
            return elapsedHrs >= 168;
          default:
            return false;
        }
      }
      return false;
    })
    .sort((a, b) => {
      // Sort Whale Tier 1 leads first
      const aWhale = a.lead_tier.includes('Tier 1') ? 1 : 0;
      const bWhale = b.lead_tier.includes('Tier 1') ? 1 : 0;
      return bWhale - aWhale;
    });

  const activeLead = sprintLeads[currentIndex];

  // Sync index to local storage to enable Session Resume
  useEffect(() => {
    localStorage.setItem('zen_sprint_index', currentIndex.toString());
  }, [currentIndex]);

  // Sync swipe sensitivity calibration
  useEffect(() => {
    localStorage.setItem('zen_swipe_threshold', swipeThreshold.toString());
  }, [swipeThreshold]);

  // Sync volume controller
  useEffect(() => {
    localStorage.setItem('zen_sprint_volume', audioVolume.toString());
  }, [audioVolume]);

  // Trigger Whale Alert chime on Tier 1 load
  useEffect(() => {
    if (activeLead && activeLead.lead_tier.includes('Tier 1')) {
      playWhaleSound(audioVolume);
    }
  }, [currentIndex, activeLead]);

  // 15-second horizontal countdown timer
  useEffect(() => {
    setTimeLeft(15);
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [currentIndex, subStep]);

  const activeIg = activeLead ? getInstagramUrl(activeLead.raw_instagram_handle, activeLead.instagram_profile_url) : { url: '', clean: '' };

  const getEmailUrl = (email, subjectLine, bodyPitch) => {
    const subject = encodeURIComponent(subjectLine || 'quick question');
    const body = encodeURIComponent(bodyPitch || '');
    return `mailto:${email}?subject=${subject}&body=${body}`;
  };

  const fallbackExecCopy = (text) => {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.top = '-9999px';
    textArea.style.left = '-9999px';
    textArea.setAttribute('readonly', '');
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try { document.execCommand('copy'); } catch (err) {}
    document.body.removeChild(textArea);
  };

  const handleCopy = (text, label) => {
    if (!text) return;
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).catch(() => fallbackExecCopy(text));
    } else {
      fallbackExecCopy(text);
    }
    setCopyText(label);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  // Dual-channel sequencing trigger
  const executeDone = () => {
    if (!activeLead) return;
    
    // Play success sound
    playSuccessSound(audioVolume);
    
    // Determine next phase status
    const getNextStatus = (status) => {
      switch (status) {
        case 'Phase 1': return 'Phase 2';
        case 'Phase 2': return 'Phase 3';
        case 'Phase 3': return 'Phase 4';
        case 'Phase 4': return 'Phase 5';
        default: return 'Phase 6';
      }
    };

    const nextStatus = getNextStatus(activeLead.outreach_status);
    onStatusUpdate(activeLead, nextStatus);

    // Reset sub-step and load next lead
    setSubStep(1);
    launchRef.current = false;
    
    const nextIndex = currentIndex + 1;
    if (nextIndex < sprintLeads.length) {
      setCurrentIndex(nextIndex);
    } else {
      localStorage.removeItem('zen_sprint_index');
      setCurrentIndex(nextIndex);
    }
  };

  // Direct composition trigger based on current step
  const executeStepLaunch = () => {
    if (!activeLead) return;
    launchRef.current = true;
    
    if (subStep === 1) {
      if (activeIg.url) {
        handleCopy(getDynamicPitch(activeLead, 'dm'), 'Instagram Pitch');
        window.open(activeIg.url, isMobileDevice ? '_self' : '_blank');
      } else {
        setSubStep(2);
      }
    } else {
      const emailData = getDynamicPitch(activeLead, 'email');
      handleCopy(emailData.body, 'Email Pitch');
      window.open(getEmailUrl(activeLead.direct_founder_email, emailData.subject, emailData.body), '_blank');
    }
  };

  // Tab refocus listener to automate Dual-Channel transition
  useEffect(() => {
    const handleFocus = () => {
      if (!activeLead || !launchRef.current) return;
      const isDmOnly = !activeLead.direct_founder_email || activeLead.direct_founder_email.toLowerCase().includes('dm');
      
      // User just returned from sending!
      if (subStep === 1) {
        if (!isDmOnly) {
          setSubStep(2);
          launchRef.current = false;
          if (autoLaunch) {
            setTimeout(() => {
              const emailData = getDynamicPitch(activeLead, 'email');
              window.open(getEmailUrl(activeLead.direct_founder_email, emailData.subject, emailData.body), '_blank');
              launchRef.current = true;
            }, 600);
          }
        } else {
          // If DM only, we're done!
          executeDone();
        }
      } else if (subStep === 2) {
        // Email sent, advance to next lead!
        executeDone();
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [currentIndex, subStep, activeLead, autoLaunch, audioVolume]);

  // Auto-launch the first channel (IG) on card mount
  useEffect(() => {
    if (activeLead && autoLaunch && subStep === 1) {
      const timer = setTimeout(() => {
        executeStepLaunch();
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, autoLaunch]);

  // Keyboard navigation listeners
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!activeLead) return;

      const activeEl = document.activeElement;
      if (activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'SELECT' || activeEl.tagName === 'TEXTAREA')) {
        return;
      }

      const key = e.key.toLowerCase();

      if (e.code === 'Space') {
        e.preventDefault();
        executeStepLaunch();
      } else if (e.code === 'Enter' || key === 'd') {
        e.preventDefault();
        executeDone();
      } else if (key === 'q') {
        e.preventDefault();
        onStatusUpdate(activeLead, 'Disqualified');
        playDqSound(audioVolume);
        setSubStep(1);
        setCurrentIndex(prev => prev + 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, subStep, activeLead, audioVolume]);

  // Touch Swipe gestures logic
  const handleTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > swipeThreshold;
    const isRightSwipe = distance < -swipeThreshold;

    if (isLeftSwipe) {
      // Swipe Left = DQ
      onStatusUpdate(activeLead, 'Disqualified');
      playDqSound(audioVolume);
      setSubStep(1);
      setCurrentIndex(prev => prev + 1);
    } else if (isRightSwipe) {
      // Swipe Right = Skip / Done
      executeDone();
    }
  };

  if (!activeLead) {
    return (
      <div className="zen-sprint-container empty">
        <div className="zen-empty-card">
          <h2>🧘 Sprint Complete!</h2>
          <p>You have cleared all active leads in this queue. Great job!</p>
          <button className="zen-close-btn" onClick={onClose}>Return to Kanban Board</button>
        </div>
      </div>
    );
  }

  const isTier1 = activeLead.lead_tier.includes('Tier 1');
  const targetGoal = 30;
  const sprintPercentage = Math.min(100, (currentIndex / targetGoal) * 100);

  // Timezone localized advice
  const getLeadLocalTime = (email) => {
    let offset = -5;
    let label = "US Eastern (EST)";
    if (email) {
      const emailLower = email.toLowerCase().trim();
      if (emailLower.endsWith('.uk') || emailLower.endsWith('.co.uk')) {
        offset = 0;
        label = "United Kingdom (GMT)";
      } else if (emailLower.endsWith('.au')) {
        offset = 10;
        label = "Australia (AEST)";
      }
    }
    const utc = new Date().getTime() + new Date().getTimezoneOffset() * 60000;
    const localTime = new Date(utc + 3600000 * offset);
    const hrs = localTime.getHours();
    let advice = "🟢 High Reply Window";
    let type = "high";
    if (hrs >= 22 || hrs < 7) {
      advice = "🔴 Creator Sleeping";
      type = "low";
    } else if (hrs >= 18 || hrs < 9) {
      advice = "🟡 After-Hours";
      type = "medium";
    }
    return {
      timeStr: localTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      label,
      advice,
      type
    };
  };

  const timezoneInfo = getLeadLocalTime(activeLead.direct_founder_email);

  return (
    <div className="zen-sprint-container">
      {/* 15-second horizontal speed countdown bar */}
      <div className="speed-countdown-container">
        <div 
          className={`speed-countdown-fill ${timeLeft <= 4 ? 'critical' : ''}`}
          style={{ width: `${(timeLeft / 15) * 100}%` }}
        />
      </div>

      {/* Header controls with Goal Ring Progress */}
      <div className="zen-header">
        <div className="zen-progress">
          <div className="goal-ring-wrapper" title={`Daily progress: ${currentIndex} / ${targetGoal} sent`}>
            <svg width="28" height="28" viewBox="0 0 36 36" className="goal-ring-svg">
              <path className="ring-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="3" />
              <path className="ring-fill" strokeDasharray={`${sprintPercentage}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="var(--color-violet)" strokeWidth="3" strokeLinecap="round" />
            </svg>
            <span className="goal-ring-text">{currentIndex}</span>
          </div>
          <span>Lead <strong>{currentIndex + 1}</strong> of <strong>{sprintLeads.length}</strong></span>
        </div>

        {/* Dynamic Dual-Step Indicator for the active sprint */}
        <div className="dual-step-indicator">
          {(!activeLead.direct_founder_email || activeLead.direct_founder_email.toLowerCase().includes('dm')) ? (
            <span className="step-badge active">Step 1: 📸 IG DM Only</span>
          ) : (
            <>
              <span className={`step-badge ${subStep === 1 ? 'active' : 'done'}`}>Step 1: 📸 IG DM</span>
              <span className="arrow-sep">➔</span>
              <span className={`step-badge ${subStep === 2 ? 'active' : ''}`}>Step 2: ✉️ Email</span>
            </>
          )}
        </div>

        {/* Volumetric Audio Slider & Auto-Launch controls */}
        <div className="header-controls-group">
          <div className="volume-slider-container" title="Adjust success sound volume">
            <span>🔊</span>
            <input 
              type="range" 
              min="0" 
              max="1" 
              step="0.1" 
              value={audioVolume}
              onChange={(e) => setAudioVolume(parseFloat(e.target.value))}
            />
          </div>

          <label className="toggle-label" title="Automatically copy and launch DMs/Emails">
            <input 
              type="checkbox" 
              checked={autoLaunch} 
              onChange={(e) => setAutoLaunch(e.target.checked)} 
            />
            <span>Auto-Launch</span>
          </label>

          <button className="zen-close-btn" onClick={onClose}>✕ Close</button>
        </div>
      </div>

      <div className="zen-content-grid">
        {/* Left Side: Active Card console */}
        <div className="zen-active-pane">
          <div 
            className={`zen-card ${isTier1 ? 'whale-glow' : ''}`}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div className="zen-card-header">
              <div>
                <h2>{activeLead.brand_or_channel_name}</h2>
                <span className="zen-founder">👤 {activeLead.founder_name || 'Unknown'}</span>
              </div>
              <span className={`tier-badge ${isTier1 ? 'tier-1' : 'tier-2'}`}>
                {isTier1 ? 'Whale' : 'Core'}
              </span>
            </div>

            {/* Smart Local Time Zone Advisory Banner */}
            <div className={`timezone-badge ${timezoneInfo.type}`}>
              🕒 {timezoneInfo.label} Time: <strong>{timezoneInfo.timeStr}</strong> &bull; {timezoneInfo.advice}
            </div>

            <div className="badge-row">
              <span className="compact-badge wvp">💎 {activeLead.wvp_status.includes('Passed') ? 'WVP' : 'Std'}</span>
              <span className="vertical-label">📁 {activeLead.mentorship_vertical.split(' Mentors')[0]}</span>
            </div>

            {/* Primary Action Sequence Buttons */}
            <div className="zen-mobile-controls stacked">
              {subStep === 1 ? (
                activeIg.clean ? (
                  <a 
                    href={activeIg.url}
                    target={isMobileDevice ? "_self" : "_blank"}
                    rel="noopener noreferrer"
                    style={{ textDecoration: 'none', flex: 1 }}
                    className="zen-action-btn primary" 
                    onClick={() => {
                      handleCopy(getDynamicPitch(activeLead, 'dm'), 'Instagram Pitch');
                      launchRef.current = true;
                    }}
                  >
                    <span className="btn-icon">📲</span>
                    <div className="btn-text-container">
                      <strong>Copy & Open IG (@{activeIg.clean})</strong>
                      <small>Step 1 &bull; Press Space (Desktop)</small>
                    </div>
                  </a>
                ) : (
                  <button 
                    className="zen-action-btn secondary"
                    style={{ opacity: 0.8, flex: 1 }}
                    onClick={() => setSubStep(2)}
                  >
                    <span className="btn-icon">⚠️</span>
                    <div className="btn-text-container">
                      <strong>No Valid IG (Click for Step 2)</strong>
                      <small>Skip to Email Step</small>
                    </div>
                  </button>
                )
              ) : (
                <a 
                  href={(!activeLead.direct_founder_email || activeLead.direct_founder_email.toLowerCase().includes('dm')) ? '#' : getEmailUrl(activeLead.direct_founder_email, getDynamicPitch(activeLead, 'email').subject, getDynamicPitch(activeLead, 'email').body)}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ textDecoration: 'none' }}
                  className="zen-action-btn secondary" 
                  onClick={() => {
                    handleCopy(getDynamicPitch(activeLead, 'email').body, 'Email Pitch');
                    launchRef.current = true;
                  }}
                >
                  <span className="btn-icon">✉️</span>
                  <div className="btn-text-container">
                    <strong>Launch Auto-Email</strong>
                    <small>Step 2 &bull; Press Space</small>
                  </div>
                </a>
              )}

              <button className="zen-action-btn success" onClick={executeDone}>
                <span className="btn-icon">➔</span>
                <div className="btn-text-container">
                  <strong>Mark Outreach Sent & Next</strong>
                  <small>Press Enter / D (Desktop)</small>
                </div>
              </button>
            </div>

            {/* Mobile swipe threshold calibration settings */}
            <div className="swipe-calibration-control">
              <label>Swipe Sensitivity:</label>
              <input 
                type="range" 
                min="40" 
                max="180" 
                value={swipeThreshold} 
                onChange={(e) => setSwipeThreshold(parseInt(e.target.value, 10))} 
              />
              <span>{swipeThreshold}px</span>
            </div>

            {/* Quick transition footer options */}
            <div className="zen-footer-row">
              <button className="footer-btn dq" onClick={() => { onStatusUpdate(activeLead, 'Disqualified'); playDqSound(audioVolume); setSubStep(1); setCurrentIndex(prev => prev + 1); }} title="Hotkey: Q">
                ❌ Disqualify <kbd className="shortcut-cap inline">Q</kbd>
              </button>
              <button className="footer-btn skip" onClick={() => { setSubStep(1); setCurrentIndex(prev => prev + 1); }}>
                ⏭️ Skip
              </button>
            </div>
          </div>

          {/* Quick-edit pitch window */}
          <div className="zen-pitch-box">
            <div className="pitch-preview-header">
              <span>Active Script ({subStep === 1 ? 'DM' : 'Email'})</span>
              {/* Floating Copyable Bubble */}
              <button 
                className="floating-copy-bubble"
                onClick={() => handleCopy(subStep === 1 ? getDynamicPitch(activeLead, 'dm') : getDynamicPitch(activeLead, 'email').body, 'Pitch')}
                title="Copy current pitch text"
              >
                📋 Re-Copy
              </button>
            </div>
            {subStep === 2 && getDynamicPitch(activeLead, 'email').subject && (
              <div className="email-subject-preview">
                <strong>Subject:</strong> {getDynamicPitch(activeLead, 'email').subject}
              </div>
            )}
            <pre className="pitch-pre-text">{subStep === 1 ? getDynamicPitch(activeLead, 'dm') : getDynamicPitch(activeLead, 'email').body}</pre>
          </div>
        </div>

        {/* Right Side: Lead detail list */}
        <div className="zen-details-pane">
          <div className="detail-card">
            <h3>Creator & Niche Details</h3>
            <div className="detail-list">
              <div className="detail-item">
                <strong>Student Proof:</strong> {activeLead.student_proof_summary || 'None'}
              </div>
              <div className="detail-item">
                <strong>Offer:</strong> {activeLead.backend_offer || 'Unknown'}
              </div>
              <div className="detail-item">
                <strong>Funnel Stack:</strong> {activeLead.funnel_tech_stack || 'None'}
              </div>
              <div className="detail-item">
                <strong>Instagram Hook Compliment:</strong>
                <p className="hook-quote" onClick={() => handleCopy(activeLead.video_hook_compliment, 'Hook')}>
                  "{activeLead.video_hook_compliment}"
                </p>
              </div>
              {activeLead.best_video_url && (
                <div className="detail-item">
                  <strong>Video Referenced:</strong> 
                  <a href={activeLead.best_video_url} target="_blank" rel="noreferrer" className="detail-link block-link">
                    🎬 {activeLead.best_video_title}
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Copy Alert Toast */}
      {copied && (
        <div className="toast">
          📋 Copied <strong>{copyText}</strong>!
        </div>
      )}
    </div>
  );
}
