import React, { useState, useEffect } from 'react';

// Synthesize modern success chime using Web Audio API
const playSuccessSound = () => {
  try {
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
    
    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
    
    osc.start(now);
    osc.stop(now + 0.3);
  } catch (e) {}
};

// Synthesize downward DQ sound
const playDqSound = () => {
  try {
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
    
    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
    
    osc.start(now);
    osc.stop(now + 0.22);
  } catch (e) {}
};

export default function ZenSprint({ leads, activeFounder, onStatusUpdate, onClose }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const [copyText, setCopyText] = useState("");
  const [activeChannel, setActiveChannel] = useState("ig"); // 'ig' or 'email'
  
  // Touch gestures swipe states
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  // Helper to check follow-up due status
  const checkLeadDue = (lead) => {
    if (!lead.last_action_at) return false;
    const lastActionDate = new Date(lead.last_action_at);
    const now = new Date();
    const elapsedHrs = (now - lastActionDate) / (1000 * 60 * 60);
    
    switch (lead.outreach_status) {
      case 'Phase 1':
      case 'Phase 2':
      case 'Phase 3':
        return elapsedHrs >= 48;
      case 'Phase 4':
        return elapsedHrs >= 168;
      default:
        return false;
    }
  };

  // Estimate lead timezone/local time and output best outreach advice
  const getLeadLocalTime = (email) => {
    let offset = -5; // Default US Eastern Time (UTC -5)
    let timezoneLabel = "US Eastern (EST)";
    
    if (email) {
      const emailLower = email.toLowerCase().trim();
      if (emailLower.endsWith('.uk') || emailLower.endsWith('.co.uk')) {
        offset = 0; // London GMT/BST
        timezoneLabel = "United Kingdom (GMT/BST)";
      } else if (emailLower.endsWith('.au')) {
        offset = 10; // Sydney AEST
        timezoneLabel = "Australia (AEST)";
      } else if (emailLower.endsWith('.ca')) {
        offset = -5; // Canada EST
        timezoneLabel = "Canada (EST)";
      }
    }
    
    const utc = new Date().getTime() + new Date().getTimezoneOffset() * 60000;
    const localTime = new Date(utc + 3600000 * offset);
    const hours = localTime.getHours();
    
    let windowState = "🟢 High Reply Window (Active Hours)";
    let level = "high";
    
    if (hours >= 22 || hours < 7) {
      windowState = "🔴 Low Reply Window (Creator Sleeping)";
      level = "low";
    } else if (hours >= 18 || hours < 9) {
      windowState = "🟡 Medium Reply Window (After-Hours)";
      level = "medium";
    }
    
    return {
      timeStr: localTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      timezoneLabel,
      windowState,
      level
    };
  };

  // Sort Sprint leads: 1. Overdue Follow-ups first, 2. Whale Tier 1 next
  const sprintLeads = leads
    .filter(lead => ['Phase 1', 'Phase 2', 'Phase 3', 'Phase 4', 'Phase 5'].includes(lead.outreach_status))
    .sort((a, b) => {
      const aDue = checkLeadDue(a) ? 1 : 0;
      const bDue = checkLeadDue(b) ? 1 : 0;
      if (bDue !== aDue) return bDue - aDue;
      
      const aWhale = a.lead_tier.includes('Tier 1') ? 1 : 0;
      const bWhale = b.lead_tier.includes('Tier 1') ? 1 : 0;
      return bWhale - aWhale;
    });

  const activeLead = sprintLeads[currentIndex];

  // Helper to construct ig.me direct DM links
  const getInstagramDMUrl = (handle, profileUrl) => {
    if (!handle) return profileUrl;
    const username = handle.replace('@', '').trim().split('/')[0];
    return `https://ig.me/m/${username}`;
  };

  const handleCopy = (text, label) => {
    navigator.clipboard.writeText(text);
    setCopyText(label);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  // Auto-copy lead copy to clipboard on load
  useEffect(() => {
    if (activeLead) {
      const activePitch = activeChannel === 'ig' ? activeLead.mobile_dm_pitch : activeLead.email_body_pitch;
      if (activePitch) {
        navigator.clipboard.writeText(activePitch)
          .then(() => {
            setCopyText(`Auto-copied ${activeChannel === 'ig' ? 'DM' : 'Email'}`);
            setCopied(true);
            setTimeout(() => setCopied(false), 1200);
          })
          .catch(() => {});
      }
    }
  }, [currentIndex, activeChannel]);

  // Direct DM outreach handler
  const handleDMAction = (url, pitchText, type) => {
    if (!url) return;
    handleCopy(pitchText, `${type} Pitch`);
    window.open(url, '_blank');
  };

  const handleEmailAction = (email, subjectLine, bodyPitch) => {
    if (!email) return;
    const subject = encodeURIComponent(subjectLine || 'quick question');
    const body = encodeURIComponent(bodyPitch || '');
    handleCopy(bodyPitch, "Email Pitch");
    window.open(`mailto:${email}?subject=${subject}&body=${body}`, '_blank');
  };

  // Determine next status state
  const getNextStatus = (status) => {
    switch (status) {
      case 'Phase 1': return 'Phase 2';
      case 'Phase 2': return 'Phase 3';
      case 'Phase 3': return 'Phase 4';
      case 'Phase 4': return 'Phase 5';
      case 'Phase 5': return 'Phase 6';
      default: return null;
    }
  };

  const executeAction = () => {
    if (!activeLead) return;
    
    if (activeChannel === 'ig') {
      const igUrl = getInstagramDMUrl(activeLead.raw_instagram_handle, activeLead.instagram_profile_url);
      if (igUrl) {
        handleDMAction(igUrl, activeLead.mobile_dm_pitch, 'Instagram');
      } else if (activeLead.twitter_x_url) {
        handleDMAction(activeLead.twitter_x_url, activeLead.mobile_dm_pitch, 'Twitter/X');
      }
    } else {
      handleEmailAction(activeLead.direct_founder_email, activeLead.email_subject_line, activeLead.email_body_pitch);
    }
  };

  const executeDone = () => {
    if (!activeLead) return;
    const nextStatus = getNextStatus(activeLead.outreach_status);
    if (nextStatus) {
      onStatusUpdate(activeLead, nextStatus);
      playSuccessSound();
    }
    
    // Auto-advance
    const nextIndex = currentIndex + 1;
    if (nextIndex < sprintLeads.length) {
      setCurrentIndex(nextIndex);
      // Pre-copy the next pitch automatically
      const nextLead = sprintLeads[nextIndex];
      const nextPitch = activeChannel === 'ig' ? nextLead.mobile_dm_pitch : nextLead.email_body_pitch;
      if (nextPitch) {
        navigator.clipboard.writeText(nextPitch)
          .then(() => {
            setCopyText(`Auto-copied Next ${activeChannel === 'ig' ? 'DM' : 'Email'}`);
            setCopied(true);
            setTimeout(() => setCopied(false), 1200);
          })
          .catch(() => {});
      }
    } else {
      setCurrentIndex(nextIndex);
    }
  };

  // Keyboard navigation listeners (Space, Enter, R for Replied, B for Booked)
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
        executeAction();
      } else if (e.code === 'Enter') {
        e.preventDefault();
        executeDone();
      } else if (key === 'r') {
        e.preventDefault();
        onStatusUpdate(activeLead, 'Replied');
        playSuccessSound();
        executeDone();
      } else if (key === 'b') {
        e.preventDefault();
        onStatusUpdate(activeLead, 'Call Booked');
        playSuccessSound();
        executeDone();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, activeLead, activeChannel, sprintLeads]);

  // Touch Swipe Gesture Handlers
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
    const isLeftSwipe = distance > 70;
    const isRightSwipe = distance < -70;

    if (isLeftSwipe) {
      // Swipe Left = DQ
      onStatusUpdate(activeLead, 'Disqualified');
      playDqSound();
      executeDone();
    } else if (isRightSwipe) {
      // Swipe Right = Sent / Done
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

  const nextStatus = getNextStatus(activeLead.outreach_status);
  const isDue = checkLeadDue(activeLead);
  const timezoneInfo = getLeadLocalTime(activeLead.direct_founder_email);

  // Calculate goal progress for current session target (30)
  const targetGoal = 30;
  const sprintPercentage = Math.min(100, (currentIndex / targetGoal) * 100);

  return (
    <div className="zen-sprint-container">
      {/* Header controls with Goal Ring Progress */}
      <div className="zen-header">
        <div className="zen-progress">
          {/* Daily Goal Ring SVG */}
          <div className="goal-ring-wrapper" title={`Daily progress: ${currentIndex} / ${targetGoal} sent`}>
            <svg width="28" height="28" viewBox="0 0 36 36" className="goal-ring-svg">
              <path className="ring-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="3" />
              <path className="ring-fill" strokeDasharray={`${sprintPercentage}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="var(--color-violet)" strokeWidth="3" strokeLinecap="round" />
            </svg>
            <span className="goal-ring-text">{currentIndex}</span>
          </div>
          <span>Sprint &bull; Lead <strong>{currentIndex + 1}</strong> of <strong>{sprintLeads.length}</strong></span>
        </div>

        {/* Channel Switcher */}
        <div className="zen-channel-switcher">
          <button 
            className={`channel-tab-btn ${activeChannel === 'ig' ? 'active' : ''}`}
            onClick={() => setActiveChannel('ig')}
          >
            📸 DM Pitch
          </button>
          {activeLead.direct_founder_email && (
            <button 
              className={`channel-tab-btn ${activeChannel === 'email' ? 'active' : ''}`}
              onClick={() => setActiveChannel('email')}
            >
              ✉️ Email Pitch
            </button>
          )}
        </div>

        <button className="zen-close-btn" onClick={onClose}>✕ Exit Zen</button>
      </div>

      <div className="zen-content-grid">
        {/* Left Side: Active Card console */}
        <div className="zen-active-pane">
          <div 
            className={`zen-card ${isDue ? 'due-highlight' : ''}`}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {isDue && (
              <div className="due-banner">
                🚨 Follow-Up Overdue
              </div>
            )}

            <div className="zen-card-header">
              <div>
                <h2>{activeLead.brand_or_channel_name}</h2>
                <span className="zen-founder">👤 {activeLead.founder_name || 'Unknown'}</span>
              </div>
              <span className={`tier-badge ${activeLead.lead_tier.includes('Tier 1') ? 'tier-1' : activeLead.lead_tier.includes('Tier 2') ? 'tier-2' : 'tier-3'}`}>
                {activeLead.lead_tier.includes('Tier 1') ? 'Whale' : activeLead.lead_tier.includes('Tier 2') ? 'Core' : 'Emerg'}
              </span>
            </div>

            {/* Smart Local Time Zone Advisory Banner */}
            <div className={`timezone-badge ${timezoneInfo.level}`}>
              🕒 {timezoneInfo.timezoneLabel} Time: <strong>{timezoneInfo.timeStr}</strong> &bull; {timezoneInfo.windowState}
            </div>

            <div className="badge-row">
              <span className="compact-badge wvp">💎 {activeLead.wvp_status.includes('Passed') ? 'WVP' : 'Std'}</span>
              {activeLead.direct_founder_email && (
                <span className="compact-badge email-direct">✉️ {activeLead.email_domain_type.split(' ')[0]}</span>
              )}
              <span className="vertical-label">📁 {activeLead.mentorship_vertical.split(' Mentors')[0]}</span>
            </div>

            {/* Large Mobile-Friendly Actions row */}
            <div className="zen-mobile-controls">
              <button className="zen-action-btn primary" onClick={executeAction}>
                <span className="btn-icon">📲</span>
                <div className="btn-text-container">
                  <strong>Copy & Open {activeChannel === 'ig' ? 'DM' : 'Email'}</strong>
                  <small>Press Space (Desktop)</small>
                </div>
              </button>

              <button className="zen-action-btn success" onClick={executeDone}>
                <span className="btn-icon">➔</span>
                <div className="btn-text-container">
                  <strong>Mark Outreach Sent</strong>
                  <small>Press Enter (Desktop)</small>
                </div>
              </button>
            </div>

            <div className="mobile-swipe-indicator">
              <span>← Swipe Left to DQ</span>
              <span>Swipe Right to Send →</span>
            </div>

            {/* Quick transition footer options */}
            <div className="zen-footer-row">
              <button className="footer-btn dq" onClick={() => { onStatusUpdate(activeLead, 'Disqualified'); playDqSound(); executeDone(); }} title="Hotkey: Q">
                ❌ Disqualify <kbd className="shortcut-cap inline">Q</kbd>
              </button>
              <button className="footer-btn replied" onClick={() => { onStatusUpdate(activeLead, 'Replied'); playSuccessSound(); executeDone(); }} title="Hotkey: R">
                💬 Replied <kbd className="shortcut-cap inline">R</kbd>
              </button>
              <button className="footer-btn booked" onClick={() => { onStatusUpdate(activeLead, 'Call Booked'); playSuccessSound(); executeDone(); }} title="Hotkey: B">
                🤝 Booked <kbd className="shortcut-cap inline">B</kbd>
              </button>
            </div>
          </div>

          {/* Quick-edit pitch window */}
          <div className="zen-pitch-box">
            <div className="pitch-preview-header">
              <span>Active Outreach Script ({activeChannel === 'ig' ? 'DM' : 'Email'})</span>
              <button onClick={() => handleCopy(activeChannel === 'ig' ? activeLead.mobile_dm_pitch : activeLead.email_body_pitch, 'Pitch')}>Copy Script</button>
            </div>
            {activeChannel === 'email' && activeLead.email_subject_line && (
              <div className="email-subject-preview">
                <strong>Subject:</strong> {activeLead.email_subject_line}
              </div>
            )}
            <pre className="pitch-pre-text">{activeChannel === 'ig' ? activeLead.mobile_dm_pitch : activeLead.email_body_pitch}</pre>
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
