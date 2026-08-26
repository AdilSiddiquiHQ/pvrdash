import React, { useState, useEffect } from 'react';
import LeadBoard from './components/LeadBoard';
import ZenSprint from './components/ZenSprint';

// Premium mock data fallback if Apps Script endpoint is not set up yet
const MOCK_LEADS = [
  {
    lead_id: "LEAD-20260826-001",
    scraped_date: "2026-08-26",
    brand_or_channel_name: "Flipping Mastery TV",
    mentorship_vertical: "Real Estate House Flipping Mentors",
    founder_name: "Jerry Norton",
    raw_instagram_handle: "@jerrynorton",
    instagram_profile_url: "https://instagram.com/jerrynorton",
    twitter_x_url: "https://x.com/jerrynorton",
    linkedin_url: "https://linkedin.com/in/jerrynorton",
    youtube_channel_url: "https://youtube.com/@FlippingMasteryTV",
    direct_founder_email: "jerry@flippingmastery.com",
    email_domain_type: "Direct Personal Domain",
    email_source: "Privacy Policy",
    lead_tier: "Tier 1 (Whale: 100k-250k+)",
    target_retainer: "$4,000 - $5,000/mo",
    wvp_status: "Legitimate Flexer (WVP-Passed)",
    funnel_tech_stack: "GoHighLevel, Calendly, ClickFunnels, Stripe",
    platform_gap_status: "High-Gap (Inactive Short-Form)",
    backend_offer: "Fast Track Flip Mentorship ($4,800)",
    student_proof_summary: "Testimonial page showcasing student transaction checks of $10,000+",
    best_video_url: "https://youtube.com/watch?v=example1",
    best_video_title: "How to Flip a House With No Money Down",
    video_hook_compliment: "Loved that breakdown of yours on keeping acquisition margins above 25% using private money partners instead of hard money lenders.",
    email_subject_line: "quick question about your house flipping videos",
    email_body_pitch: "hey jerry,\n\nloved that breakdown of yours on keeping acquisition margins above 25% using private money partners instead of hard money lenders. honestly one of the only realistic setups for people scaling flips in this market.\n\nquick question - you have over 800 raw videos on youtube breaking down deals on-site. ever thought about turning those archives into a fleet of short-form pages?\n\nmy team chops your raw files into daily short-form clips, posts them across 5 to 10 sub-channels, and drives that traffic straight into your Fast Track Flip funnel. we handle editing, posting, and comments completely.\n\nare you totally against me sending over a 45-second video showing how we would set up the first 3 sub-channels for you?\n\nno worries if not.\n\nbest,\nadil",
    mobile_dm_pitch: "yo jerry, loved your video on private money structuring for flips. especially the 25% margin guardrail.\n\nquick question - you have hundreds of hours of raw deal walkthroughs. ever thought about turning those archives into a fleet of short-form pages?\n\nmy team chops your videos, posts across 5 sub-channels, and drives traffic to your mentorship. we handle everything.\n\nare you totally against seeing a 45s video on how it works?",
    story_swipe_up_hook: "that new construction project layout is clean, we could easily pull 3 viral breakdowns from that walkthrough alone",
    outreach_status: "Phase 1",
    last_action_by: "partner_a",
    last_action_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago (DUE!)
    rowIndex: 2
  },
  {
    lead_id: "LEAD-20260826-002",
    scraped_date: "2026-08-26",
    brand_or_channel_name: "Forex Mentors International",
    mentorship_vertical: "Forex Day Trading Mentors",
    founder_name: "Zack Mitchell",
    raw_instagram_handle: "@zack_fx",
    instagram_profile_url: "https://instagram.com/zack_fx",
    twitter_x_url: "",
    linkedin_url: "",
    youtube_channel_url: "https://youtube.com/@zack_fx",
    direct_founder_email: "zack.mitchell@gmail.com",
    email_domain_type: "Personal Inbox",
    email_source: "Mobile IG",
    lead_tier: "Tier 2 (Core: 30k-100k)",
    target_retainer: "$2,500 - $3,500/mo",
    wvp_status: "Standard Verified",
    funnel_tech_stack: "Calendly, Stripe",
    platform_gap_status: "High-Gap (Inactive Short-Form)",
    backend_offer: "VIP Inner Circle Discord ($299/mo)",
    student_proof_summary: "Testimonials pinned in IG highlights showing prop firm passing logs",
    best_video_url: "https://youtube.com/watch?v=example2",
    best_video_title: "My 3-Step Risk Management Formula",
    video_hook_compliment: "Loved the risk breakdown on your TradingView sessions, especially your formula on cutting positions at 0.5% risk on news releases.",
    email_subject_line: "quick question about your forex videos",
    email_body_pitch: "hey zack,\n\nloved the risk breakdown on your TradingView sessions, especially your formula on cutting positions at 0.5% risk on news releases. most realistic risk control guide i've seen.\n\nquick question - you have dozens of raw chart streams. ever thought about turning those files into a fleet of short-form pages?\n\nmy team chops your raw files into daily short-form clips, posts them across 5 sub-channels, and drives that traffic straight into your VIP Discord funnel. we handle editing, posting, and comments completely.\n\nare you totally against me sending over a 45-second video showing how we would set up the first 3 sub-channels for you?\n\nno worries if not.\n\nbest,\nadil",
    mobile_dm_pitch: "yo zack, loved your video on risk management. especially cutting positions at 0.5% risk on news.\n\nquick question - you have dozens of raw chart streams. ever thought about turning those files into a fleet of short-form pages?\n\nmy team chops your videos, posts across 5 sub-channels, and drives traffic to your VIP Discord. we handle everything.\n\nare you totally against seeing a 45s video on how it works?",
    story_swipe_up_hook: "insane profit split on that prop account, we should definitely cut that reaction stream into a short",
    outreach_status: "Phase 1",
    last_action_by: "",
    last_action_at: "",
    rowIndex: 3
  },
  {
    lead_id: "LEAD-20260826-003",
    scraped_date: "2026-08-26",
    brand_or_channel_name: "Wholesaling Inc",
    mentorship_vertical: "Real Estate Wholesaling Mentors",
    founder_name: "Brent Daniels",
    raw_instagram_handle: "@brentdaniels_ttp",
    instagram_profile_url: "https://instagram.com/brentdaniels_ttp",
    twitter_x_url: "https://x.com/brent_ttp",
    linkedin_url: "",
    youtube_channel_url: "https://youtube.com/@WholesalingInc",
    direct_founder_email: "brent@wholesalinginc.com",
    email_domain_type: "Shared Corporate Platform",
    email_source: "YT About",
    lead_tier: "Tier 1 (Whale: 100k-250k+)",
    target_retainer: "$4,000 - $5,000/mo",
    wvp_status: "Legitimate Flexer (WVP-Passed)",
    funnel_tech_stack: "GoHighLevel, Calendly, Stripe",
    platform_gap_status: "Omnichannel Active",
    backend_offer: "TTP Cold Calling Coaching ($5,000)",
    student_proof_summary: "Scores of reviews and video case studies showing students closing wholesale spreads",
    best_video_url: "https://youtube.com/watch?v=example3",
    best_video_title: "How to Build a Cold Calling Script",
    video_hook_compliment: "Loved the breakdown on skipping greeting fluff to lock the seller's attention inside the first 4 seconds of a cold call.",
    email_subject_line: "quick question about your cold calling scripts",
    email_body_pitch: "hey brent,\n\nloved the breakdown on skipping greeting fluff to lock the seller's attention inside the first 4 seconds of a cold call. pure execution logic.\n\nquick question - you have hundreds of raw phone conversations. ever thought about turning those audio files into a fleet of short-form pages?\n\nmy team chops your raw files into daily short-form clips, posts them across 5 to 10 sub-channels, and drives that traffic straight into your TTP coaching funnel. we handle editing, posting, and comments completely.\n\nare you totally against me sending over a 45-second video showing how we would set up the first 3 sub-channels for you?\n\nno worries if not.\n\nbest,\nadil",
    mobile_dm_pitch: "yo brent, loved your cold call script breakdown. especially skipping greetings to lock attention in 4s.\n\nquick question - you have hundreds of raw phone vids. ever thought about turning those files into a fleet of short-form pages?\n\nmy team chops your videos, posts across 5 sub-channels, and drives traffic to TTP. we handle everything.\n\nare you totally against seeing a 45s video on how it works?",
    story_swipe_up_hook: "that live cold calling session on stage was fire, we should clip the objection handling sequence",
    outreach_status: "Phase 2",
    last_action_by: "partner_b",
    last_action_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago (Not due yet)
    rowIndex: 4
  },
  {
    lead_id: "LEAD-20260826-004",
    scraped_date: "2026-08-26",
    brand_or_channel_name: "Bubble Dev Academy",
    mentorship_vertical: "High-Ticket No-Code SaaS Mentors",
    founder_name: "Adil Vance",
    raw_instagram_handle: "@adil_nocode",
    instagram_profile_url: "https://instagram.com/adil_nocode",
    twitter_x_url: "",
    linkedin_url: "",
    youtube_channel_url: "https://youtube.com/@bubbledev",
    direct_founder_email: "adil@bubbledev.io",
    email_domain_type: "Direct Personal Domain",
    email_source: "Privacy Policy",
    lead_tier: "Tier 3 (Emerging: 10k-30k)",
    target_retainer: "$1,500 - $2,000/mo",
    wvp_status: "Standard Verified",
    funnel_tech_stack: "GoHighLevel, Calendly, Stripe",
    platform_gap_status: "High-Gap (Inactive Short-Form)",
    backend_offer: "No-Code MVP Bootcamp ($1,999)",
    student_proof_summary: "Testimonial page showcasing student SaaS MVP launches on ProductHunt",
    best_video_url: "https://youtube.com/watch?v=example4",
    best_video_title: "How to Build a SaaS in 48 Hours with Bubble",
    video_hook_compliment: "Loved the Bubble integration logic, especially your custom workflow on parsing Webhook payloads without third-party plugins.",
    email_subject_line: "quick question about your bubble tutorials",
    email_body_pitch: "hey adil,\n\nloved the Bubble integration logic, especially your custom workflow on parsing Webhook payloads without third-party plugins. extremely clean implementation.\n\nquick question - you have dozens of raw visual build sessions. ever thought about turning those archives into a fleet of short-form pages?\n\nmy team chops your raw files into daily short-form clips, posts them across 5 sub-channels, and drives that traffic straight into your MVP bootcamp funnel. we handle editing, posting, and comments completely.\n\nare you totally against me sending over a 45-second video showing how we would set up the first 3 sub-channels for you?\n\nno worries if not.\n\nbest,\nadil",
    mobile_dm_pitch: "yo adil, loved your video on Bubble webhooks. especially parsing payloads directly without plugins.\n\nquick question - you have dozens of raw build sessions. ever thought about turning those archives into a fleet of short-form pages?\n\nmy team chops your videos, posts across 5 sub-channels, and drives traffic to your bootcamp. we handle everything.\n\nare you totally against seeing a 45s video on how it works?",
    story_swipe_up_hook: "new custom GPT app layout is looking clean, we could easily highlight this visual build sequence",
    outreach_status: "Replied",
    last_action_by: "partner_a",
    last_action_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    rowIndex: 5
  }
];

export default function App() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Identity Management (Active Authenticated Partner Session)
  const [user, setUser] = useState(() => {
    const cached = localStorage.getItem('authSession');
    return cached ? JSON.parse(cached) : null;
  });

  const activeFounder = user ? user.activeFounder : 'partner_a';

  // Login Form Inputs
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [verticalFilter, setVerticalFilter] = useState('All');
  const [tierFilter, setTierFilter] = useState('All');
  const [wvpFilter, setWvpFilter] = useState('All');
  const [zenMode, setZenMode] = useState(false);
  const [dueOnlyFilter, setDueOnlyFilter] = useState(false);

  const endpoint = import.meta.env.VITE_APPS_SCRIPT_URL;
  const isMock = !endpoint || endpoint.includes('AKfycbz_placeholder');

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setLoginError('');
    const u = loginUsername.trim().toLowerCase();
    const p = loginPassword.trim();

    if (u === 'farhan' && p === 'farhan') {
      const session = { username: 'Farhan', activeFounder: 'partner_a' };
      setUser(session);
      localStorage.setItem('authSession', JSON.stringify(session));
    } else if (u === 'ninja' && p === 'ninja') {
      const session = { username: 'Ninja', activeFounder: 'partner_b' };
      setUser(session);
      localStorage.setItem('authSession', JSON.stringify(session));
    } else {
      setLoginError('Invalid Username or Password');
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('authSession');
  };

  // Load leads data
  const loadLeads = async () => {
    setLoading(true);
    setError(null);
    
    if (isMock) {
      // Use local storage for mock data persistence so the UI updates persist during session
      const cached = localStorage.getItem('leads_cache');
      if (cached) {
        setLeads(JSON.parse(cached));
      } else {
        setLeads(MOCK_LEADS);
        localStorage.setItem('leads_cache', JSON.stringify(MOCK_LEADS));
      }
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(endpoint);
      const json = await res.json();
      if (json.status === 'success') {
        setLeads(json.data);
      } else {
        setError(json.message || 'Failed to fetch spreadsheet data');
        setLeads(MOCK_LEADS); // Fallback
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setError('Could not connect to Google Sheets. Using mock fallback data.');
      // Load fallback cache if exists
      const cached = localStorage.getItem('leads_cache');
      setLeads(cached ? JSON.parse(cached) : MOCK_LEADS);
    } finally {
      setLoading(false);
    }
  };

  const [pendingSyncs, setPendingSyncs] = useState([]);

  // Sync any pending offline updates back to Google Sheets
  const syncOfflineUpdates = async () => {
    const cached = localStorage.getItem('pending_syncs');
    if (!cached) return;
    const list = JSON.parse(cached);
    if (list.length === 0) return;

    const remaining = [];
    for (const item of list) {
      try {
        const updateUrl = `${endpoint}?action=update&lead_id=${item.lead_id}&rowIndex=${item.rowIndex}&status=${encodeURIComponent(item.status)}&sent_by=${item.sent_by}`;
        const res = await fetch(updateUrl);
        const data = await res.json();
        if (data.status !== 'success') {
          remaining.push(item);
        }
      } catch (err) {
        remaining.push(item);
      }
    }

    setPendingSyncs(remaining);
    localStorage.setItem('pending_syncs', JSON.stringify(remaining));
  };

  useEffect(() => {
    loadLeads();
    
    // Load offline cached syncs
    const cachedPending = localStorage.getItem('pending_syncs');
    if (cachedPending) {
      setPendingSyncs(JSON.parse(cachedPending));
    }

    window.addEventListener('online', syncOfflineUpdates);
    return () => window.removeEventListener('online', syncOfflineUpdates);
  }, []);

  // Update lead status
  const handleStatusUpdate = async (lead, newStatus) => {
    const timestamp = new Date().toISOString();
    
    // 1. Optimistic Local State Update
    const updatedLeads = leads.map(l => {
      if (l.lead_id === lead.lead_id) {
        return {
          ...l,
          outreach_status: newStatus,
          last_action_by: activeFounder,
          last_action_at: timestamp
        };
      }
      return l;
    });

    setLeads(updatedLeads);
    localStorage.setItem('leads_cache', JSON.stringify(updatedLeads));

    // 2. Network Sync (Google Sheets API call with Offline Caching Guard)
    if (!isMock) {
      try {
        const updateUrl = `${endpoint}?action=update&lead_id=${lead.lead_id}&rowIndex=${lead.rowIndex}&status=${encodeURIComponent(newStatus)}&sent_by=${activeFounder}`;
        const res = await fetch(updateUrl);
        const data = await res.json();
        if (data.status !== 'success') {
          throw new Error(data.message || 'Update failed');
        }
      } catch (err) {
        console.warn('Network sync failed. Saving update locally to retry offline.', err);
        const newUpdate = {
          lead_id: lead.lead_id,
          rowIndex: lead.rowIndex,
          status: newStatus,
          sent_by: activeFounder
        };
        const updatedPending = [...pendingSyncs, newUpdate];
        setPendingSyncs(updatedPending);
        localStorage.setItem('pending_syncs', JSON.stringify(updatedPending));
      }
    }
  };

  // Reset Cache (For Mock testing)
  const handleResetCache = () => {
    localStorage.removeItem('leads_cache');
    setLeads(MOCK_LEADS);
  };

  // Metric Computations (Outreach completed today)
  const getDailyMetrics = () => {
    const todayStr = new Date().toDateString();
    
    const mySentCount = leads.filter(l => {
      if (!l.last_action_at || l.last_action_by !== activeFounder) return false;
      return new Date(l.last_action_at).toDateString() === todayStr;
    }).length;

    const partnerId = activeFounder === 'partner_a' ? 'partner_b' : 'partner_a';
    const partnerSentCount = leads.filter(l => {
      if (!l.last_action_at || l.last_action_by !== partnerId) return false;
      return new Date(l.last_action_at).toDateString() === todayStr;
    }).length;

    const repliedCount = leads.filter(l => l.outreach_status === 'Replied').length;
    const totalOutbound = leads.filter(l => l.last_action_at !== "").length;

    return { mySentCount, partnerSentCount, repliedCount, totalOutbound };
  };

  const metrics = getDailyMetrics();

  // Unique lists for filtering dropdowns
  const verticals = ['All', ...new Set(leads.map(l => l.mentorship_vertical))];
  const tiers = ['All', 'Whale', 'Core', 'Emerging'];

  // Helper to check which leads are overdue for follow-up
  const getDueFollowUps = (allLeads) => {
    return allLeads.filter(lead => {
      if (!lead.last_action_at) return false;
      const lastActionDate = new Date(lead.last_action_at);
      const now = new Date();
      const elapsedHrs = (now - lastActionDate) / (1000 * 60 * 60);
      
      switch (lead.outreach_status) {
        case 'Phase 1':
        case 'Phase 2':
        case 'Phase 3':
          return elapsedHrs >= 48; // 48 hours elapsed
        case 'Phase 4':
          return elapsedHrs >= 168; // 7 days (168 hours) elapsed
        default:
          return false;
      }
    });
  };

  const dueFollowUpsCount = getDueFollowUps(leads).length;

  const filteredLeads = leads.filter(l => {
    const matchesSearch = 
      l.brand_or_channel_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.founder_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.raw_instagram_handle.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesVertical = verticalFilter === 'All' || l.mentorship_vertical === verticalFilter;
    
    const matchesTier = tierFilter === 'All' || 
      (tierFilter === 'Whale' && l.lead_tier.includes('Tier 1')) ||
      (tierFilter === 'Core' && l.lead_tier.includes('Tier 2')) ||
      (tierFilter === 'Emerging' && l.lead_tier.includes('Tier 3'));

    const matchesWvp = wvpFilter === 'All' ||
      (wvpFilter === 'WVP Verified' && l.wvp_status === 'Legitimate Flexer (WVP-Passed)') ||
      (wvpFilter === 'Standard' && l.wvp_status !== 'Legitimate Flexer (WVP-Passed)');

    // Hide Disqualified leads from the main Pipeline board view
    const notDQ = l.outreach_status !== 'Disqualified';

    return matchesSearch && matchesVertical && matchesTier && matchesWvp && notDQ;
  });

  const displayLeads = dueOnlyFilter ? getDueFollowUps(filteredLeads) : filteredLeads;

  if (!user) {
    return (
      <div className="login-wrapper">
        <div className="bg-glow-blob one"></div>
        <div className="bg-glow-blob two"></div>
        
        <form className="login-card" onSubmit={handleLoginSubmit}>
          <div className="login-logo">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19.8 4H4.2C3.0 4 2 5.0 2 6.2V17.8C2 19.0 3.0 20 4.2 20H19.8C21.0 20 22 19.0 22 17.8V6.2C22 5.0 21.0 4 19.8 4Z" stroke="url(#loginLogoGrad)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M7 4V20" stroke="url(#loginLogoGrad)" strokeWidth="2"/>
              <path d="M17 4V20" stroke="url(#loginLogoGrad)" strokeWidth="2"/>
              <path d="M10 9L15 12L10 15V9Z" fill="url(#loginLogoGrad)"/>
              <defs>
                <linearGradient id="loginLogoGrad" x1="2" y1="4" x2="22" y2="20" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#5e6ad2"/>
                  <stop offset="1" stopColor="#06b6d4"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
          
          <h2>Clipping Agency OS</h2>
          <p className="login-subtitle">Sign in with your partner credentials</p>
          
          {loginError && <div className="login-error-alert">⚠️ {loginError}</div>}
          
          <div className="login-input-group">
            <label htmlFor="username">Partner Username</label>
            <input 
              id="username"
              type="text" 
              placeholder="e.g. farhan" 
              value={loginUsername}
              onChange={(e) => setLoginUsername(e.target.value)}
              required
            />
          </div>

          <div className="login-input-group">
            <label htmlFor="password">Secret Password</label>
            <input 
              id="password"
              type="password" 
              placeholder="••••••••" 
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              required
            />
          </div>
          
          <button type="submit" className="login-submit-btn">
            Unlock Console ➔
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="app-container">
      {/* Atmospheric mesh glow blobs */}
      <div className="bg-glow-blob one"></div>
      <div className="bg-glow-blob two"></div>
      
      {/* Top Banner Navigation */}
      <header className="app-header">
        <div className="header-brand">
          <span className="brand-logo">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19.8 4H4.2C3.0 4 2 5.0 2 6.2V17.8C2 19.0 3.0 20 4.2 20H19.8C21.0 20 22 19.0 22 17.8V6.2C22 5.0 21.0 4 19.8 4Z" stroke="url(#logoGrad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M7 4V20" stroke="url(#logoGrad)" strokeWidth="1.5"/>
              <path d="M17 4V20" stroke="url(#logoGrad)" strokeWidth="1.5"/>
              <path d="M2 12H7" stroke="url(#logoGrad)" strokeWidth="1.5"/>
              <path d="M17 12H22" stroke="url(#logoGrad)" strokeWidth="1.5"/>
              <path d="M2 8H7" stroke="url(#logoGrad)" strokeWidth="1.5"/>
              <path d="M2 16H7" stroke="url(#logoGrad)" strokeWidth="1.5"/>
              <path d="M17 8H22" stroke="url(#logoGrad)" strokeWidth="1.5"/>
              <path d="M17 16H22" stroke="url(#logoGrad)" strokeWidth="1.5"/>
              <path d="M10 9L15 12L10 15V9Z" fill="url(#logoGrad)"/>
              <defs>
                <linearGradient id="logoGrad" x1="2" y1="4" x2="22" y2="20" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#5e6ad2"/>
                  <stop offset="1" stopColor="#06b6d4"/>
                </linearGradient>
              </defs>
            </svg>
          </span>
          <div>
            <h1>Clipping Agency OS</h1>
            <p className="subtitle">B2B Outbound Outreach & CRM Pipeline</p>
          </div>
        </div>

        {/* Compact Session Badge to prevent mobile zooming & wrap issues */}
        <div className="founder-session-header">
          <span className="live-pulse-dot"></span>
          <span className="session-username">Active: <strong>{user.username}</strong></span>
          <button className="logout-btn" onClick={handleLogout} title="Sign out of partner session">
            Logout
          </button>
        </div>
      </header>

      {/* Offline Sync Banner Alert */}
      {pendingSyncs.length > 0 && (
        <div className="offline-sync-banner" onClick={syncOfflineUpdates} title="Click to manually retry syncing offline data to Google Sheets">
          ⚠️ <strong>Offline Sync Active:</strong> {pendingSyncs.length} outreach status updates saved locally in cache. Tap to force retry sync.
        </div>
      )}

      {/* Analytics Dashboard Header (Custom SVG Bento cards) */}
      <section className="analytics-bar">
        <div className="metric-card">
          <div className="metric-card-header">
            <span className="metric-title">My Sent Today</span>
            <svg className="metric-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
          </div>
          <span className="metric-value">{metrics.mySentCount} <small>/ 30 Target</small></span>
          <div className="progress-bg">
            <div className="progress-fill" style={{ width: `${Math.min(100, (metrics.mySentCount / 30) * 100)}%` }}></div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-card-header">
            <span className="metric-title">Partner's Sent Today</span>
            <svg className="metric-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          </div>
          <span className="metric-value">{metrics.partnerSentCount}</span>
          <span className="metric-desc">Co-founder tracking status</span>
        </div>

        <div className="metric-card">
          <div className="metric-card-header">
            <span className="metric-title">Total Active Replies</span>
            <svg className="metric-icon replied-color" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          </div>
          <span className="metric-value replied-color">{metrics.repliedCount}</span>
          <span className="metric-desc">Leads in negotiation</span>
        </div>

        <div className="metric-card">
          <div className="metric-card-header">
            <span className="metric-title">Total Outreach Sent</span>
            <svg className="metric-icon total-color" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
          </div>
          <span className="metric-value total-color">{metrics.totalOutbound}</span>
          <span className="metric-desc">All historical pitches logged</span>
        </div>
      </section>

      {/* Filters Toolbar */}
      <section className="toolbar">
        <div className="search-bar">
          <span className="search-icon">🔍</span>
          <input 
            type="text" 
            placeholder="Search creator, channel, or IG handle..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <div className="select-container">
            <label>Vertical</label>
            <select value={verticalFilter} onChange={(e) => setVerticalFilter(e.target.value)}>
              {verticals.map(v => <option key={v} value={v}>{v}</option>)}
            </select>
          </div>

          <div className="select-container">
            <label>Tier</label>
            <select value={tierFilter} onChange={(e) => setTierFilter(e.target.value)}>
              {tiers.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          <div className="select-container">
            <label>WVP Level</label>
            <select value={wvpFilter} onChange={(e) => setWvpFilter(e.target.value)}>
              <option value="All">All Leads</option>
              <option value="WVP Verified">💎 WVP Verified Only</option>
              <option value="Standard">✓ Standard Only</option>
            </select>
          </div>

          {/* Zen Toggle Button */}
          <button 
            className={`zen-toggle-btn ${zenMode ? 'active' : ''}`} 
            onClick={() => setZenMode(!zenMode)} 
            title="Start Zen Sprint Mode (Single Card view)"
          >
            ⚡ {zenMode ? 'Exit Zen' : 'Zen Sprint'}
          </button>

          {/* Due Follow-ups Toggle Button */}
          <button 
            className={`due-toggle-btn ${dueOnlyFilter ? 'active' : ''}`} 
            onClick={() => setDueOnlyFilter(!dueOnlyFilter)} 
            title="Show overdue follow-up leads only"
          >
            ⚠️ Due Only ({dueFollowUpsCount})
          </button>

          <button className="refresh-btn" onClick={loadLeads} title="Reload latest Google Sheet database rows">
            🔄 Sync Sheets
          </button>

          {isMock && (
            <button className="reset-cache-btn" onClick={handleResetCache} title="Reset demo cache to initial state">
              🧹 Reset Demo
            </button>
          )}
        </div>
      </section>

      {/* Integration Info Alert for Local fallback */}
      {isMock && (
        <div className="integration-alert">
          💡 <strong>Demo Mode:</strong> Running dashboard with mock data because <code>VITE_APPS_SCRIPT_URL</code> is at its default placeholder in <code>.env</code>. The status updates will save locally in your browser's localStorage cache. Link your Google Sheet via Apps Script to enable live database synchronizations!
        </div>
      )}

      {/* Board / Zen Sprint Rendering */}
      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Fetching master Google Sheets database...</p>
        </div>
      ) : error && leads.length === 0 ? (
        <div className="error-container">
          <p className="error-msg">⚠️ {error}</p>
          <button className="retry-btn" onClick={loadLeads}>Retry Sync</button>
        </div>
      ) : zenMode ? (
        <ZenSprint 
          leads={displayLeads}
          activeFounder={activeFounder}
          onStatusUpdate={handleStatusUpdate}
          onClose={() => setZenMode(false)}
        />
      ) : (
        <LeadBoard 
          leads={displayLeads} 
          activeFounder={activeFounder} 
          onStatusUpdate={handleStatusUpdate} 
        />
      )}
    </div>
  );
}
