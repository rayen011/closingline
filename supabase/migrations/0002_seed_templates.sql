-- ClosingLine — system template seed (2-3 per category).
-- prompt_structure is the instruction sent to Claude; placeholder_fields drive
-- the generator form. Safe to re-run: clears system rows first.

delete from templates where is_system = true;

insert into templates (category, title, prompt_structure, placeholder_fields) values

-- ── Buyer Follow-Up ─────────────────────────────────────────────────────────
(
  'buyer_followup',
  'Post-Showing Follow-Up',
  'Write a warm, professional follow-up email to a buyer after a property showing. Reference the specific property and the single highlight provided. Gauge their interest and invite a next step (questions, a second viewing, or making an offer). Keep it to 120-160 words.',
  '[{"key":"client_name","label":"Client name","type":"text"},{"key":"property_address","label":"Property address","type":"text"},{"key":"highlight","label":"Key highlight they liked","type":"text"}]'
),
(
  'buyer_followup',
  'No-Show Follow-Up',
  'Write a gracious, no-pressure email to a buyer who missed a scheduled showing. Assume life got busy, offer to reschedule, and keep the door open. Friendly and brief. 80-110 words.',
  '[{"key":"client_name","label":"Client name","type":"text"},{"key":"property_address","label":"Property address","type":"text"},{"key":"scheduled_time","label":"Original time","type":"text"}]'
),
(
  'buyer_followup',
  'Buyer Check-In',
  'Write a light nurture email to a buyer you have not spoken with in a while. Reference what they were looking for, share that new inventory is coming up, and ask if they are still searching. Warm, not pushy. 90-120 words.',
  '[{"key":"client_name","label":"Client name","type":"text"},{"key":"area","label":"Area they want","type":"text"},{"key":"criteria","label":"What they are looking for","type":"textarea"}]'
),

-- ── Listing Description ─────────────────────────────────────────────────────
(
  'listing',
  'Listing Description',
  'Write a compelling MLS-style listing description for the property below. Lead with the strongest selling point, weave in the key features naturally, and close with a call to schedule a viewing. Avoid cliches. 100-150 words.',
  '[{"key":"property_address","label":"Property address","type":"text"},{"key":"beds_baths","label":"Beds / baths","type":"text"},{"key":"features","label":"Standout features","type":"textarea"}]'
),
(
  'listing',
  'Just Listed Announcement',
  'Write a short, energetic "just listed" announcement to send to the agent''s sphere and past clients. Lead with the headline feature and price, create urgency, and invite them to share with anyone searching. 80-120 words.',
  '[{"key":"property_address","label":"Property address","type":"text"},{"key":"price","label":"List price","type":"text"},{"key":"headline_feature","label":"Headline feature","type":"text"}]'
),
(
  'listing',
  'Luxury Listing Feature',
  'Write an aspirational, refined description for a luxury property. Sell the lifestyle as much as the home, highlight the signature features, and maintain an elegant, understated tone. 120-170 words.',
  '[{"key":"property_address","label":"Property address","type":"text"},{"key":"signature_features","label":"Signature features","type":"textarea"},{"key":"lifestyle","label":"Lifestyle / location appeal","type":"text"}]'
),

-- ── Negotiation ─────────────────────────────────────────────────────────────
(
  'negotiation',
  'Counter-Offer Response',
  'Write a measured, professional email responding to a counter-offer. Acknowledge their position, restate the value, and present the counter clearly while keeping the deal moving. Confident but collaborative. 120-170 words.',
  '[{"key":"client_name","label":"Recipient name","type":"text"},{"key":"property_address","label":"Property address","type":"text"},{"key":"offer_details","label":"Counter terms","type":"textarea"}]'
),
(
  'negotiation',
  'Offer Submission Cover Note',
  'Write a persuasive cover note to the listing agent submitting a buyer''s offer. Present the terms clearly, highlight what makes these buyers strong (financing, flexibility, motivation), and keep a collegial tone. 110-150 words.',
  '[{"key":"listing_agent_name","label":"Listing agent name","type":"text"},{"key":"property_address","label":"Property address","type":"text"},{"key":"offer_terms","label":"Offer terms","type":"textarea"},{"key":"buyer_strengths","label":"Buyer strengths","type":"text"}]'
),
(
  'negotiation',
  'Multiple-Offers Notice',
  'Write a clear, fair email notifying a buyer that the property has received multiple offers. Explain the highest-and-best process, give the deadline, and encourage their strongest terms without pressure. 100-140 words.',
  '[{"key":"client_name","label":"Client name","type":"text"},{"key":"property_address","label":"Property address","type":"text"},{"key":"deadline","label":"Highest & best deadline","type":"text"}]'
),

-- ── Open House ──────────────────────────────────────────────────────────────
(
  'open_house',
  'Open House Invitation',
  'Write an inviting email announcing an open house. Include the date, time, and address; highlight one reason to attend; and create gentle urgency. Friendly and brief. 90-130 words.',
  '[{"key":"property_address","label":"Property address","type":"text"},{"key":"date_time","label":"Date & time","type":"text"},{"key":"highlight","label":"One reason to attend","type":"text"}]'
),
(
  'open_house',
  'Open House Thank-You',
  'Write a warm thank-you email to someone who attended an open house. Thank them for coming, gauge their interest in the property, and offer a private showing or to answer questions. 90-120 words.',
  '[{"key":"attendee_name","label":"Attendee name","type":"text"},{"key":"property_address","label":"Property address","type":"text"}]'
),

-- ── Price Reduction ─────────────────────────────────────────────────────────
(
  'price_reduction',
  'Price Reduction Announcement',
  'Write a positive email announcing a price reduction on a listing. Frame it as a fresh opportunity, restate the property value, and prompt a viewing before it moves. Avoid sounding desperate. 100-140 words.',
  '[{"key":"property_address","label":"Property address","type":"text"},{"key":"new_price","label":"New price","type":"text"},{"key":"highlight","label":"Key selling point","type":"text"}]'
),
(
  'price_reduction',
  'Seller Price-Reduction Update',
  'Write a candid but reassuring email to a seller recommending or confirming a price reduction. Reference the market feedback, frame the new price as a strategy to drive activity, and set clear expectations for next steps. Professional and supportive. 120-160 words.',
  '[{"key":"seller_name","label":"Seller name","type":"text"},{"key":"property_address","label":"Property address","type":"text"},{"key":"new_price","label":"Proposed new price","type":"text"},{"key":"rationale","label":"Market feedback / rationale","type":"textarea"}]'
),

-- ── Closing / Congrats ──────────────────────────────────────────────────────
(
  'closing',
  'Closing Congratulations',
  'Write a warm congratulations email to a client on closing. Celebrate the milestone, thank them for their trust, and invite future referrals naturally. Heartfelt, not salesy. 90-130 words.',
  '[{"key":"client_name","label":"Client name","type":"text"},{"key":"property_address","label":"Property address","type":"text"}]'
),
(
  'closing',
  'Closing Day Logistics',
  'Write a clear, organized email walking a client through closing-day logistics. Confirm the date, time, and location, list what to bring, and reassure them you will be there. Calm and precise. 110-150 words.',
  '[{"key":"client_name","label":"Client name","type":"text"},{"key":"closing_date_time","label":"Closing date & time","type":"text"},{"key":"location","label":"Closing location","type":"text"},{"key":"items_to_bring","label":"What to bring","type":"textarea"}]'
),
(
  'closing',
  'Post-Close Referral Ask',
  'Write a friendly check-in email a few weeks after closing. Make sure they are settling in, offer ongoing help, and warmly ask if they know anyone else looking to buy or sell. Genuine, low-pressure. 90-120 words.',
  '[{"key":"client_name","label":"Client name","type":"text"},{"key":"property_address","label":"Property address","type":"text"}]'
),

-- ── Cold Outreach ───────────────────────────────────────────────────────────
(
  'cold_outreach',
  'Cold Outreach to Prospect',
  'Write a respectful cold outreach email to a potential seller or buyer. Open with a relevant local hook, establish credibility briefly, and propose a low-pressure next step. Concise and human. 90-130 words.',
  '[{"key":"prospect_name","label":"Prospect name","type":"text"},{"key":"area","label":"Neighborhood / area","type":"text"},{"key":"hook","label":"Local hook (recent sale, market trend)","type":"textarea"}]'
),
(
  'cold_outreach',
  'Expired Listing Outreach',
  'Write a tactful outreach email to an owner whose listing recently expired. Acknowledge the frustration without criticizing the prior agent, offer a fresh perspective, and propose a no-obligation conversation. Confident and empathetic. 110-150 words.',
  '[{"key":"owner_name","label":"Owner name","type":"text"},{"key":"property_address","label":"Property address","type":"text"},{"key":"value_prop","label":"Your fresh approach","type":"textarea"}]'
),
(
  'cold_outreach',
  'FSBO Outreach',
  'Write a respectful outreach email to a for-sale-by-owner. Compliment their initiative, avoid being pushy, offer genuinely useful help (pricing, exposure, paperwork), and leave the door open. Warm and non-salesy. 100-140 words.',
  '[{"key":"owner_name","label":"Owner name","type":"text"},{"key":"property_address","label":"Property address","type":"text"}]'
);
