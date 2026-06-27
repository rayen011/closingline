-- ClosingLine — system template seed (one per category to start).
-- prompt_structure is the instruction sent to Claude; placeholder_fields drive
-- the generator form. Safe to re-run: clears system rows first.

delete from templates where is_system = true;

insert into templates (category, title, prompt_structure, placeholder_fields) values
(
  'buyer_followup',
  'Post-Showing Follow-Up',
  'Write a warm, professional follow-up email to a buyer after a property showing. Reference the specific property and the single highlight provided. Gauge their interest and invite a next step (questions, a second viewing, or making an offer). Keep it to 120-160 words.',
  '[{"key":"client_name","label":"Client name","type":"text"},{"key":"property_address","label":"Property address","type":"text"},{"key":"highlight","label":"Key highlight they liked","type":"text"}]'
),
(
  'listing',
  'Listing Description',
  'Write a compelling MLS-style listing description for the property below. Lead with the strongest selling point, weave in the key features naturally, and close with a call to schedule a viewing. Avoid clichés. 100-150 words.',
  '[{"key":"property_address","label":"Property address","type":"text"},{"key":"beds_baths","label":"Beds / baths","type":"text"},{"key":"features","label":"Standout features","type":"textarea"}]'
),
(
  'negotiation',
  'Counter-Offer Response',
  'Write a measured, professional email responding to a counter-offer. Acknowledge their position, restate the value, and present the counter clearly while keeping the deal moving. Confident but collaborative. 120-170 words.',
  '[{"key":"client_name","label":"Recipient name","type":"text"},{"key":"property_address","label":"Property address","type":"text"},{"key":"offer_details","label":"Counter terms","type":"textarea"}]'
),
(
  'open_house',
  'Open House Invitation',
  'Write an inviting email announcing an open house. Include the date, time, and address; highlight one reason to attend; and create gentle urgency. Friendly and brief. 90-130 words.',
  '[{"key":"property_address","label":"Property address","type":"text"},{"key":"date_time","label":"Date & time","type":"text"},{"key":"highlight","label":"One reason to attend","type":"text"}]'
),
(
  'price_reduction',
  'Price Reduction Announcement',
  'Write a positive email announcing a price reduction on a listing. Frame it as a fresh opportunity, restate the property value, and prompt a viewing before it moves. Avoid sounding desperate. 100-140 words.',
  '[{"key":"property_address","label":"Property address","type":"text"},{"key":"new_price","label":"New price","type":"text"},{"key":"highlight","label":"Key selling point","type":"text"}]'
),
(
  'closing',
  'Closing Congratulations',
  'Write a warm congratulations email to a client on closing. Celebrate the milestone, thank them for their trust, and invite future referrals naturally. Heartfelt, not salesy. 90-130 words.',
  '[{"key":"client_name","label":"Client name","type":"text"},{"key":"property_address","label":"Property address","type":"text"}]'
),
(
  'cold_outreach',
  'Cold Outreach to Prospect',
  'Write a respectful cold outreach email to a potential seller or buyer. Open with a relevant local hook, establish credibility briefly, and propose a low-pressure next step. Concise and human. 90-130 words.',
  '[{"key":"prospect_name","label":"Prospect name","type":"text"},{"key":"area","label":"Neighborhood / area","type":"text"},{"key":"hook","label":"Local hook (recent sale, market trend)","type":"textarea"}]'
);
