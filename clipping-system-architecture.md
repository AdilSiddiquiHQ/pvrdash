# Clipping Agency OS - Technical Integration & Automation Architecture
*System Context and Integration Specification between Google Spark and the Web Dashboard*

This document serves as the persistent technical specification for the Clipping Agency Dashboard and its integration with the Google Spark always-on AI agent.

---

## 1. Active Skills & Current Configuration

```
┌──────────────────────────────┐     ┌──────────────────────────────┐     ┌──────────────────────────────┐
│  clipping-lead-generator     │ ──► │  clipping-outreach-writer    │ ──► │ clipping-master-orchestrator │
│  - 22 Mentorship Verticals   │     │  - Anti-BS Copywriting Rules │     │  - 09:00 AM Dispatch Deck    │
│  - 1:5 Lead Tier Ratio       │     │  - Peer-to-Peer FSI Emails   │     │  - CRM / Google Sheets Sync  │
│  - Wealth Verification (WVP) │     │  - Mobile DMs (<70 words)    │     │  - End-to-End Orchestration  │
│  - Multi-Host Mapping        │     │  - Story Swipe-Up Hooks      │     │  - Inbound & Sales Scripts   │
└──────────────────────────────┘     └──────────────────────────────┘     └──────────────────────────────┘
```

### A. clipping-lead-generator
- **Target Niche Coverage:** Identifies educators, coaches, and mastermind founders across **22 High-Ticket Verticals**.
- **1:5 Lead Tier Diversification Ratio:** Enforces batch composition to balance volume and sales cycle lengths:
  - **1 Tier 1 Whale** (100k–250k+ audience): Target retainer of **$4,000–$5,000+/mo**.
  - **5 Tier 2/3 Quick-Win Mentors** (10k–100k audience): Direct founder inbox access, low friction, target retainer of **$1,500–$3,500/mo**.
- **Wealth Verification Protocol (WVP):** Discards low-value creators and qualifies "Legitimate Flexers" using a 4-step gate:
  1. *Core Business Cashflow Engine:* Confirms primary operational revenue outside of coaching.
  2. *High-Ticket Backend Offer:* Verifies a $1,500–$8,000+ mentorship program.
  3. *Student Case Study Proof:* Inspects public testimonials.
  4. *Long-Form Video Library:* Requires ≥3 educational long-form videos (>10 mins) within the last 45 days.
- **Recency & Activity Guardrails:** Requires at least 1 video uploaded in the last 14–30 days and ≥1,000 views per video on accounts over 50k followers.
- **Multi-Host Podcast Mapping:** Automatically splits multi-host shows into individual founder/host records.
- **Dual Email & Tech Stack Extraction:** Identifies direct founder emails and detects GHL, Calendly, ClickFunnels, Typeform, Stripe, and Skool.

### B. clipping-outreach-writer
- **Anti-BS Copywriting Philosophy:** Eliminates corporate buzzwords. Uses peer-to-peer laptop style copywriting.
- **Direct Email Format (FSI):** All-lowercase, peer-to-peer, single-concept compliment citing exact metrics/concepts, strictly under 150 words.
- **Mobile Instagram & Twitter/X DMs:** Optimized for single mobile screen, strictly under 70 words.
- **Story Swipe-Up Pattern Interrupts:** Lifestyle/casual hooks designed to bypass the "Requests" folder.
- **Chris Voss-Style "No-Oriented" CTAs:** (e.g., *"Are you totally against me sending over a 45-second video..."*).
- **4-Step Follow-Up Sequence:** Structured progression on Day 3 (Tactical video question), Day 5 (Loom pitch offer), Day 7 (Case study drop), and Day 14 (Pattern interrupt).

---

## 2. Google Sheets / CRM Schema (30 Fields)

Google Sheets rows follow this exact schema. Columns AC and AD are populated by the Dashboard to help Spark coordinate follow-up schedules.

| Col | Field Name | Data Type | Description / Formatting Rules |
| :--- | :--- | :--- | :--- |
| **A** | `lead_id` | String | Unique identifier (e.g., `LEAD-20260826-001`) |
| **B** | `scraped_date` | Date | YYYY-MM-DD format |
| **C** | `brand_or_channel_name` | String | Company, podcast show, or channel name |
| **D** | `mentorship_vertical` | String | 1 of the 22 standardized verticals |
| **E** | `founder_name` | String | Full name of individual creator/host |
| **F** | `raw_instagram_handle` | String | Handle starting with `@` (e.g., `@jerrynorton`) |
| **G** | `instagram_profile_url` | URL | Direct link to Instagram profile |
| **H** | `twitter_x_url` | URL | Direct link or empty string |
| **I** | `linkedin_url` | URL | Direct link or empty string |
| **J** | `youtube_channel_url` | URL | Primary long-form YouTube channel URL |
| **K** | `direct_founder_email` | String | Verified direct email address |
| **L** | `email_domain_type` | Enum | `Direct Personal Domain` \| `Shared Corporate Platform` \| `Personal Inbox` |
| **M** | `email_source` | Enum | `Privacy Policy` \| `Mobile IG` \| `YT About` \| `Linktree` \| `LinkedIn` |
| **N** | `lead_tier` | Enum | `Tier 1 (Whale)` \| `Tier 2 (Core)` \| `Tier 3 (Emerging)` |
| **O** | `target_retainer` | String | Proposed retainer range (e.g., `$2,500 - $3,500/mo`) |
| **P** | `wvp_status` | Enum | `Standard Verified` \| `Legitimate Flexer (WVP-Passed)` |
| **Q** | `funnel_tech_stack` | String | Comma-separated detected tools (e.g., `GHL, Calendly, Stripe`) |
| **R** | `platform_gap_status` | Enum | `High-Gap (Inactive Short-Form)` \| `Omnichannel Active` |
| **S** | `backend_offer` | String | Backend program name and pricing |
| **T** | `student_proof_summary` | String | Case study notes and reference URL |
| **U** | `best_video_url` | URL | URL of highest-performing video in past 60 days |
| **V** | `best_video_title` | String | Title of best video |
| **W** | `video_hook_compliment` | String | 1-sentence contextual video hook compliment |
| **X** | `email_subject_line` | String | Lowercase subject |
| **Y** | `email_body_pitch` | String | Active generated email copy (FSI or active follow-up message) |
| **Z** | `mobile_dm_pitch` | String | Active generated DM copy (FSI or active follow-up message) |
| **AA** | `story_swipe_up_hook` | String | Real-time contextual story-reply hook |
| **AB** | `outreach_status` | Enum | `Ready for Copy` \| `Phase 1` \| `Phase 2` \| `Phase 3` \| `Phase 4` \| `Phase 5` \| `Phase 6` \| `Replied` \| `Call Booked` \| `Closed` \| `Disqualified` |
| **AC** | `last_action_by` | String | ID of the founder who sent the last message (`partner_a` \| `partner_b`) |
| **AD** | `last_action_at` | Timestamp | ISO Date-Time of the last outreach send event (e.g. `2026-08-26T10:15:30Z`) |

---

## 3. Double-Cron Split Pipeline (Google Spark Scheduling Flow)

To optimize resources and only generate outreach assets when needed, Google Spark splits its tasks into two separated daily cron workflows:

### Chronological Execution Flow:

```
┌────────────────────────────────────────────────────────┐
│             CRON JOB 1: SCRAPE (08:00 AM)              │
│  - Sources 30 fresh leads across 22 Verticals          │
│  - Runs WVP legitimacy qualification filters           │
│  - Appends rows (Columns A - W)                        │
│  - Sets Column AB (outreach_status) = 'Ready for Copy' │
└────────────────────────────────────────────────────────┘
                            │ (40-Minute Gap)
                            ▼
┌────────────────────────────────────────────────────────┐
│         CRON JOB 2: COPY GENERATOR (08:40 AM)          │
│  - Sweeps Sheet for 'Ready for Copy' leads             │
│  - Sweeps active columns for due follow-up triggers    │
│  - Writes personalized pitches (Columns X - AA)        │
│  - Advances outreach_status state values               │
└────────────────────────────────────────────────────────┘
```

---

## 4. Google Spark Job Execution Details

### Job 1: Daily Scraper (e.g., 08:00 AM)
1. **Task:** Search for and scrape 30 leads following the **1:5 Lead Tier Ratio**.
2. **Write:** Append 30 rows to the sheet, filling Columns A to W.
3. **Status:** Explicitly set Column AB (`outreach_status`) to `Ready for Copy`.

### Job 2: Dynamic Copy Generator (e.g., 08:40 AM)
1. **Task A (Initial Cold Pitch):**
   - Find all rows where Column AB (`outreach_status`) = `Ready for Copy`.
   - Extract the `video_hook_compliment` (Column W) and generate the personalized FSI Email, Mobile DM, and Story Swipe-Up script.
   - Write templates into Columns X, Y, Z, and AA.
   - Update Column AB (`outreach_status`) to `Phase 1`.
2. **Task B (Dynamic Follow-Ups):**
   - Retrieve all leads currently in outreach phases: `Phase 1`, `Phase 2`, `Phase 3`, or `Phase 4`.
   - Calculate elapsed time since `last_action_at` (Column AD).
   - If the time gap matches the trigger sequence:
     - **Phase 1 -> Phase 2:** Triggered **48 hours** after Phase 1 outreach was sent.
     - **Phase 2 -> Phase 3:** Triggered **48 hours** after Phase 2 outreach was sent.
     - **Phase 3 -> Phase 4:** Triggered **48 hours** after Phase 3 outreach was sent.
     - **Phase 4 -> Phase 5:** Triggered **7 days** after Phase 4 outreach was sent.
   - For any lead that is **due for its next follow-up**:
     - Pull the creator's latest long-form video or milestone if needed (for contextual relevance).
     - Generate the specific follow-up message matching the target phase script parameters (see Section 2).
     - Write the new copy directly into Column Y (`email_body_pitch`) and Column Z (`mobile_dm_pitch`), overwriting the old FSI copy.
     - Leave `outreach_status` in its current state (e.g., `Phase 2`) so the dashboard highlights the lead card inside that column as "Follow-Up Ready" for the founder.
     - *(Note: The status only updates to the next phase number when the founder clicks "Done" in the dashboard, which writes the timestamp to Column AD, restarting the countdown).*
