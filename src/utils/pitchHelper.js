export const sanitizeInstagramHandle = (handle, profileUrl) => {
  let raw = handle || profileUrl || '';
  if (!raw) return '';
  raw = String(raw).trim();

  // Strip query params and hashes
  raw = raw.split('?')[0].split('#')[0];

  // Parse URLs
  if (raw.includes('instagram.com') || raw.includes('ig.me')) {
    const parts = raw.split('/').filter(Boolean);
    const igMeIdx = parts.indexOf('m');
    if (igMeIdx !== -1 && parts[igMeIdx - 1] && parts[igMeIdx - 1].includes('ig.me')) {
      raw = parts[igMeIdx + 1] || '';
    } else {
      const domainIdx = parts.findIndex(p => p.includes('instagram.com'));
      if (domainIdx !== -1 && parts[domainIdx + 1]) {
        const seg = parts[domainIdx + 1];
        if (['direct', 'reels', 'p', 'stories', 'explore', 'accounts'].includes(seg.toLowerCase())) {
          if (seg.toLowerCase() === 'direct' && parts[domainIdx + 2] === 't' && parts[domainIdx + 3]) {
            raw = parts[domainIdx + 3];
          } else {
            raw = '';
          }
        } else {
          raw = seg;
        }
      }
    }
  }

  raw = raw.replace(/@/g, '').trim();

  const invalid = ['n/a', 'na', 'none', 'null', 'undefined', 'not_found', 'notfound', 'no_ig', 'noig', 'direct', 'p', 'reels', 'stories', '-'];
  if (!raw || invalid.includes(raw.toLowerCase())) {
    return '';
  }

  const match = raw.match(/^[a-zA-Z0-9._]{1,30}$/);
  return match ? match[0] : '';
};

export const getInstagramUrl = (handle, profileUrl) => {
  const clean = sanitizeInstagramHandle(handle, profileUrl);
  if (!clean) return { url: '', clean: '' };

  return {
    url: `https://www.instagram.com/${clean}/`,
    clean
  };
};

export const getDynamicPitch = (lead, channel) => {
  const name = lead.founder_name ? lead.founder_name.split(' ')[0].toLowerCase() : 'there';
  const niche = lead.mentorship_vertical ? lead.mentorship_vertical.split(' Mentors')[0].toLowerCase() : 'space';
  const channelName = lead.brand_or_channel_name || 'your channel';

  if (channel === 'email') {
    switch (lead.outreach_status) {
      case 'Phase 1':
        return { subject: lead.email_subject_line, body: lead.email_body_pitch };
      case 'Phase 2':
        return { 
          subject: `re: ${lead.email_subject_line || 'quick question'}`, 
          body: `hey ${name},\n\njust floating this to the top of your inbox. did you have any thoughts on turning those raw videos into short-form assets?\n\nbest,\nadil` 
        };
      case 'Phase 3':
        return { 
          subject: `re: ${lead.email_subject_line || 'quick question'}`, 
          body: `hey ${name},\n\ni actually went ahead and made a quick 45-second loom video showing exactly how we'd structure the first 3 sub-channels for ${channelName}.\n\nmind if i send the link over?\n\nbest,\nadil` 
        };
      case 'Phase 4':
        return { 
          subject: `re: ${lead.email_subject_line || 'quick question'}`, 
          body: `hey ${name},\n\nnot sure if you saw my last note, but we recently helped another creator in the ${niche} space add an extra $20k MRR using this exact short-form system.\n\nare you open to a quick 5-min chat to see if it makes sense for you?\n\nbest,\nadil` 
        };
      case 'Phase 5':
        return { 
          subject: `re: ${lead.email_subject_line || 'quick question'}`, 
          body: `hey ${name},\n\nat this point i'll assume it's not a priority right now, so i'll stop reaching out.\n\nif things change and you want to scale your content, you know where to find me.\n\nbest,\nadil` 
        };
      default:
        return { subject: lead.email_subject_line, body: lead.email_body_pitch };
    }
  } else {
    // DM
    switch (lead.outreach_status) {
      case 'Phase 1':
        return lead.mobile_dm_pitch;
      case 'Phase 2':
        return `yo ${name}, just bubbling this up. did you have any thoughts on setting up those short-form pages?`;
      case 'Phase 3':
        return `hey ${name}, i actually made a quick 45s loom showing exactly how we'd structure the sub-channels for ${channelName}. mind if i drop the link here?`;
      case 'Phase 4':
        return `yo ${name}, not sure if you saw my last message, but we just helped another creator in the ${niche} space add $20k MRR with this system. open to a quick 5-min chat?`;
      case 'Phase 5':
        return `hey ${name}, assuming this isn't a priority right now so i'll stop bugging you haha. if you ever want to scale the content, let me know!`;
      default:
        return lead.mobile_dm_pitch;
    }
  }
};
