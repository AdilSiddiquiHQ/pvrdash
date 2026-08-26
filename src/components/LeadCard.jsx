import React, { useState, useEffect } from 'react';

export default function LeadCard({ lead, activeFounder, onStatusUpdate }) {
  const [copied, setCopied] = useState(false);
  const [copyText, setCopyText] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const {
    lead_id,
    brand_or_channel_name,
    mentorship_vertical,
    founder_name,
    raw_instagram_handle,
    instagram_profile_url,
    twitter_x_url,
    linkedin_url,
    youtube_channel_url,
    direct_founder_email,
    email_domain_type,
    email_source,
    lead_tier,
    target_retainer,
    wvp_status,
    funnel_tech_stack,
    platform_gap_status,
    backend_offer,
    student_proof_summary,
    best_video_url,
    best_video_title,
    video_hook_compliment,
    email_subject_line,
    email_body_pitch,
    mobile_dm_pitch,
    story_swipe_up_hook,
    outreach_status,
    last_action_by,
    last_action_at,
    rowIndex
  } = lead;

  // Calculate elapsed time for follow-up triggers
  const getFollowUpStatus = () => {
    if (!last_action_at) return { due: false };
    
    const lastActionDate = new Date(last_action_at);
    const now = new Date();
    const elapsedHrs = (now - lastActionDate) / (1000 * 60 * 60);

    const checkDue = (targetHours, phaseName) => {
      if (elapsedHrs >= targetHours) {
        return { due: true, hoursOver: Math.floor(elapsedHrs - targetHours), label: `Due: ${phaseName}` };
      }
      return { due: false };
    };

    switch (outreach_status) {
      case 'Phase 1':
        return checkDue(48, 'FU #1');
      case 'Phase 2':
        return checkDue(48, 'FU #2');
      case 'Phase 3':
        return checkDue(48, 'FU #3');
      case 'Phase 4':
        return checkDue(168, 'FU #4');
      default:
        return { due: false };
    }
  };

  const fuState = getFollowUpStatus();

  // Helper to extract direct link to Instagram DMs (ig.me/m/username)
  const getInstagramDMUrl = () => {
    if (!raw_instagram_handle) return instagram_profile_url;
    // Strip "@" symbol, trailing slashes, or profile paths to get pure handle
    const username = raw_instagram_handle.replace('@', '').trim().split('/')[0];
    return `https://ig.me/m/${username}`;
  };

  // Copy helper
  const handleCopy = (text, label) => {
    navigator.clipboard.writeText(text);
    setCopyText(label);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Open profile and copy DM script
  const handleDMAction = (url, pitchText, type) => {
    if (!url) return;
    handleCopy(pitchText, `${type} Pitch`);
    window.open(url, '_blank');
  };

  // Open email mailto link
  const handleEmailAction = () => {
    if (!direct_founder_email) return;
    const subject = encodeURIComponent(email_subject_line || 'quick question');
    const body = encodeURIComponent(email_body_pitch || '');
    window.open(`mailto:${direct_founder_email}?subject=${subject}&body=${body}`, '_blank');
  };

  // Status transition progression
  const getNextStatus = () => {
    switch (outreach_status) {
      case 'Phase 1': return 'Phase 2';
      case 'Phase 2': return 'Phase 3';
      case 'Phase 3': return 'Phase 4';
      case 'Phase 4': return 'Phase 5';
      case 'Phase 5': return 'Phase 6';
      default: return null;
    }
  };

  const nextStatus = getNextStatus();

  // Keyboard hotkeys tracking (triggered on hover or keyboard focus)
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ignore if user is typing in a text field
      const activeEl = document.activeElement;
      if (activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'SELECT' || activeEl.tagName === 'TEXTAREA')) {
        return;
      }

      if (!isHovered) return;

      const key = e.key.toLowerCase();
      
      if (key === 'm' && direct_founder_email) {
        e.preventDefault();
        handleEmailAction();
      } else if (key === 'i' && instagram_profile_url) {
        e.preventDefault();
        handleDMAction(getInstagramDMUrl(), mobile_dm_pitch, 'Instagram');
      } else if (key === 'x' && twitter_x_url) {
        e.preventDefault();
        handleDMAction(twitter_x_url, mobile_dm_pitch, 'Twitter/X');
      } else if (key === 's' && story_swipe_up_hook && instagram_profile_url) {
        e.preventDefault();
        handleDMAction(getInstagramDMUrl(), story_swipe_up_hook, 'Story Reply');
      } else if (key === 'd' || key === 'enter') {
        if (nextStatus) {
          e.preventDefault();
          onStatusUpdate(lead, nextStatus);
        }
      } else if (key === 'q') {
        e.preventDefault();
        onStatusUpdate(lead, 'Disqualified');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isHovered, lead, nextStatus]);

  return (
    <div 
      className={`lead-card ${fuState.due ? 'due-highlight' : ''} ${lead_tier.includes('Tier 1') ? 'whale-card' : ''} ${isHovered ? 'hovered-glow' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsHovered(true)}
      onBlur={() => setIsHovered(false)}
      tabIndex="0"
    >
      
      {/* Due Banner */}
      {fuState.due && (
        <div className="due-banner">
          🚨 {fuState.label} (+{fuState.hoursOver}h)
        </div>
      )}

      {/* Header Info */}
      <div className="card-header">
        <div className="title-area">
          <h3 className="brand-name" title={brand_or_channel_name}>{brand_or_channel_name}</h3>
          <span className="founder-name">👤 {founder_name || 'Unknown'}</span>
        </div>
        <span className={`tier-badge ${lead_tier.includes('Tier 1') ? 'tier-1' : lead_tier.includes('Tier 2') ? 'tier-2' : 'tier-3'}`}>
          {lead_tier.includes('Tier 1') ? 'Whale' : lead_tier.includes('Tier 2') ? 'Core' : 'Emerg'}
        </span>
      </div>

      {/* Badges and tags in a single compact row */}
      <div className="badge-row">
        {wvp_status === 'Legitimate Flexer (WVP-Passed)' ? (
          <span className="compact-badge wvp" title="WVP verified luxury creator">💎 WVP</span>
        ) : (
          <span className="compact-badge standard">✓ Std</span>
        )}
        
        {direct_founder_email && (
          <>
            {email_domain_type === 'Direct Personal Domain' && (
              <span className="compact-badge email-direct" title="Lands directly in founder inbox">⚡ Direct</span>
            )}
            {email_domain_type === 'Personal Inbox' && (
              <span className="compact-badge email-mobile" title="Direct mobile inbox">⚡ Mobile</span>
            )}
            {email_domain_type === 'Shared Corporate Platform' && (
              <span className="compact-badge email-shared" title="Multiple mentors share this corporate domain. Prioritize DMs.">⚠️ Shared</span>
            )}
          </>
        )}
        
        <span className="vertical-label" title={mentorship_vertical}>📁 {mentorship_vertical.split(' Mentors')[0]}</span>
      </div>

      {/* Outreach Action Controls (Compact horizontal icons row with key shortcut hints) */}
      <div className="compact-actions-row">
        {direct_founder_email && (
          <button 
            className="icon-action-btn email" 
            onClick={handleEmailAction}
            title={`Open Mail to ${direct_founder_email} (Hotkey: M)`}
          >
            ✉️ <span className="btn-lbl">Mail</span>
            <kbd className="shortcut-cap">M</kbd>
          </button>
        )}

        {instagram_profile_url && (
          <button 
            className="icon-action-btn ig" 
            onClick={() => handleDMAction(getInstagramDMUrl(), mobile_dm_pitch, 'Instagram')}
            title="Copy DM & open Instagram chat window directly (Hotkey: I)"
          >
            📸 <span className="btn-lbl">IG DM</span>
            <kbd className="shortcut-cap">I</kbd>
          </button>
        )}

        {twitter_x_url && (
          <button 
            className="icon-action-btn x" 
            onClick={() => handleDMAction(twitter_x_url, mobile_dm_pitch, 'Twitter/X')}
            title="Copy DM & open Twitter/X (Hotkey: X)"
          >
            🐦 <span className="btn-lbl">X DM</span>
            <kbd className="shortcut-cap">X</kbd>
          </button>
        )}

        {story_swipe_up_hook && instagram_profile_url && (
          <button 
            className="icon-action-btn story" 
            onClick={() => handleDMAction(getInstagramDMUrl(), story_swipe_up_hook, 'Story Reply')}
            title="Copy swipe hook & open Instagram chat window directly (Hotkey: S)"
          >
            📲 <span className="btn-lbl">Swipe</span>
            <kbd className="shortcut-cap">S</kbd>
          </button>
        )}
      </div>

      {/* Collapsible Details Accordion */}
      <div className="accordion-section">
        <button 
          className="accordion-toggle" 
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? '▲ Hide Details' : '▼ View Details / Copy Pitch'}
        </button>
        
        {isExpanded && (
          <div className="accordion-content">
            <div className="detail-item">
              <strong>Funnel Stack:</strong> {funnel_tech_stack || 'None'}
            </div>
            {backend_offer && (
              <div className="detail-item">
                <strong>Backend Offer:</strong> {backend_offer}
              </div>
            )}
            {student_proof_summary && (
              <div className="detail-item">
                <strong>Proof:</strong> {student_proof_summary}
              </div>
            )}
            {best_video_url && (
              <div className="detail-item">
                <strong>Best Video:</strong> <a href={best_video_url} target="_blank" rel="noreferrer" className="detail-link">{best_video_title}</a>
              </div>
            )}
            {video_hook_compliment && (
              <div className="detail-item quote-item" onClick={() => handleCopy(video_hook_compliment, 'Hook')}>
                <strong>Compliment Hook:</strong> <span className="click-copy-lbl">"{video_hook_compliment}"</span>
              </div>
            )}
            
            {/* View Full Pitch Content inside accordion */}
            <div className="pitch-preview-box">
              <div className="pitch-preview-header">
                <span>Active DM Pitch Script</span>
                <button onClick={() => handleCopy(mobile_dm_pitch, 'DM Copy')}>Copy</button>
              </div>
              <pre className="pitch-pre-text">{mobile_dm_pitch}</pre>
            </div>
          </div>
        )}
      </div>

      {/* State Transitions & Footer (Sleek layout with hotkey badges) */}
      <div className="card-footer">
        <div className="status-meta">
          {last_action_by && (
            <span className="sender-meta">
              Sent by: <strong>{last_action_by === 'partner_a' ? 'P-A' : 'P-B'}</strong>
            </span>
          )}
          {last_action_at && (
            <span className="time-meta">
              🕒 {new Date(last_action_at).toLocaleDateString(undefined, {month: 'numeric', day: 'numeric'})}
            </span>
          )}
        </div>

        <div className="transition-controls">
          <button 
            className="footer-btn dq" 
            onClick={() => onStatusUpdate(lead, 'Disqualified')}
            title="Disqualify (Hotkey: Q)"
          >
            ❌ DQ <kbd className="shortcut-cap inline">Q</kbd>
          </button>

          {['Phase 1', 'Phase 2', 'Phase 3', 'Phase 4', 'Phase 5'].includes(outreach_status) && (
            <button 
              className="footer-btn replied" 
              onClick={() => onStatusUpdate(lead, 'Replied')}
              title="Mark as Replied"
            >
              💬 Rep
            </button>
          )}

          <button 
            className="footer-btn booked" 
            onClick={() => onStatusUpdate(lead, 'Call Booked')}
            title="Call Booked"
          >
            🤝 Book
          </button>

          {nextStatus && (
            <button 
              className="footer-btn done" 
              onClick={() => onStatusUpdate(lead, nextStatus)}
              title={`Move to ${nextStatus} (Hotkey: Enter / D)`}
            >
              Done ➔ <kbd className="shortcut-cap inline done-key">D</kbd>
            </button>
          )}
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
