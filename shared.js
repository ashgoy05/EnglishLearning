// ── Storage ───────────────────────────────────────────────────────────
const Store = {
  get: (k, def) => { try { const v = localStorage.getItem('aec_' + k); return v !== null ? JSON.parse(v) : def; } catch { return def; } },
  set: (k, v) => { try { localStorage.setItem('aec_' + k, JSON.stringify(v)); } catch {} }
};

// ── Speech Engine ─────────────────────────────────────────────────────
const Speech = {
  voices: [],
  selected: null,
  rate: 0.88,

  init() {
    const load = () => {
      const all = window.speechSynthesis.getVoices();
      const enUS = all.filter(v => v.lang === 'en-US');
      this.voices = enUS.length ? enUS : all.filter(v => v.lang.startsWith('en'));
      const pref = ['Samantha', 'Google US English', 'Microsoft Zira', 'Alex', 'Karen'];
      let best = null;
      pref.forEach(n => { if (!best) best = this.voices.find(v => v.name.includes(n)); });
      this.selected = best || this.voices[0] || null;
      this.populateSelects();
    };
    if (window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = load;
      load();
    }
  },

  populateSelects() {
    document.querySelectorAll('.voice-select').forEach(sel => {
      sel.innerHTML = '';
      this.voices.forEach((v, i) => {
        const o = document.createElement('option');
        o.value = i; o.textContent = v.name;
        if (v === this.selected) o.selected = true;
        sel.appendChild(o);
      });
      sel.onchange = () => { this.selected = this.voices[parseInt(sel.value)] || null; };
    });
  },

  speak(text, btnEl) {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    if (this.selected) u.voice = this.selected;
    u.rate = this.rate; u.pitch = 1.0;
    if (btnEl) {
      btnEl.classList.add('speaking');
      u.onend = () => btnEl.classList.remove('speaking');
    }
    window.speechSynthesis.speak(u);
  },

  speakId(id, btnEl) {
    const item = VOCAB.find(v => v.id === id);
    if (item) this.speak(item.word, btnEl);
  }
};

// ── Vocab Data (180 words, 12 categories) ────────────────────────────
const VOCAB = [
  // EVERYDAY LIFE
  { id:'ev01', cat:'everyday', word:'Errand', ph:'/ˈɛr.ɪnd/', pos:'noun', def:'A short trip to do a task like buying groceries or mailing a package.', use:'I need to run a few errands before dinner tonight.' },
  { id:'ev02', cat:'everyday', word:'Potluck', ph:'/ˈpɒt.lʌk/', pos:'noun', def:'A meal where every guest brings a dish to share.', use:'We are having a potluck at work on Friday — I am bringing biryani!' },
  { id:'ev03', cat:'everyday', word:'Rain check', ph:'/reɪn tʃɛk/', pos:'idiom', def:'A polite way to decline now but promise to do something later.', use:'I cannot come tonight — can I take a rain check for next week?' },
  { id:'ev04', cat:'everyday', word:'Head out', ph:'/hɛd aʊt/', pos:'phrasal verb', def:'To leave a place.', use:'We are heading out around six — do you want to come?' },
  { id:'ev05', cat:'everyday', word:'Hang out', ph:'/hæŋ aʊt/', pos:'phrasal verb', def:'To spend casual, unplanned time with someone.', use:'We hung out at the mall all Saturday afternoon.' },
  { id:'ev06', cat:'everyday', word:'Catch up', ph:'/kætʃ ʌp/', pos:'phrasal verb', def:'To talk with someone after a long time and share what has been happening.', use:'Let us catch up over coffee this weekend!' },
  { id:'ev07', cat:'everyday', word:'Touch base', ph:'/tʌtʃ beɪs/', pos:'idiom', def:'To briefly contact someone to check in or share quick information.', use:'I will touch base with you after the meeting tomorrow.' },
  { id:'ev08', cat:'everyday', word:'Go-to', ph:'/ˈɡoʊ.tuː/', pos:'adjective', def:'Your best or most reliable choice for something.', use:'Thai Garden is my go-to spot whenever I want a quick lunch.' },
  { id:'ev09', cat:'everyday', word:'RSVP', ph:'/ˌɑːr.ɛs.viːˈpiː/', pos:'verb', def:'To respond to an invitation confirming whether you will attend.', use:'Please RSVP by Friday so we know how many seats to arrange.' },
  { id:'ev10', cat:'everyday', word:'Lighten up', ph:'/ˈlaɪ.tən ʌp/', pos:'phrasal verb', def:'To relax and stop taking things too seriously.', use:'Come on, lighten up — it is just a friendly game!' },
  { id:'ev11', cat:'everyday', word:'Laid-back', ph:'/ˌleɪdˈbæk/', pos:'adjective', def:'Relaxed and easygoing, not easily stressed.', use:'The neighborhood has a very laid-back vibe — everyone is friendly and chill.' },
  { id:'ev12', cat:'everyday', word:'Shoot the breeze', ph:'/ʃuːt ðə briːz/', pos:'idiom', def:'To chat casually with no specific purpose.', use:'We just sat on the porch and shot the breeze for a couple of hours.' },
  { id:'ev13', cat:'everyday', word:'Pull over', ph:'/pʊl ˈoʊ.vər/', pos:'phrasal verb', def:'To steer a vehicle to the side of the road and stop.', use:'The police officer asked the driver to pull over immediately.' },
  { id:'ev14', cat:'everyday', word:'Bear with me', ph:'/bɛr wɪð miː/', pos:'idiom', def:'Please be patient while I do or explain something.', use:'Bear with me for just one moment while I look that up for you.' },
  { id:'ev15', cat:'everyday', word:'Figure out', ph:'/ˈfɪɡ.ər aʊt/', pos:'phrasal verb', def:'To understand or solve something after thinking about it.', use:'I finally figured out how to use the self-checkout machine at Walmart.' },

  // TECH & WORK
  { id:'tw01', cat:'tech', word:'Bandwidth', ph:'/ˈbænd.wɪdθ/', pos:'noun', def:'In work culture: a person\'s available time and mental capacity for tasks.', use:'I do not have the bandwidth to take on another project this sprint.' },
  { id:'tw02', cat:'tech', word:'Ping', ph:'/pɪŋ/', pos:'verb', def:'To send a quick message or notification to someone.', use:'Ping me on Slack when the build is done and we can review it.' },
  { id:'tw03', cat:'tech', word:'Deep dive', ph:'/diːp daɪv/', pos:'noun', def:'A thorough, detailed examination of a topic or problem.', use:'Let us do a deep dive into the analytics before presenting to the client.' },
  { id:'tw04', cat:'tech', word:'Sync up', ph:'/sɪŋk ʌp/', pos:'phrasal verb', def:'To communicate and align with a colleague on shared work.', use:'Can we sync up tomorrow morning before the client presentation?' },
  { id:'tw05', cat:'tech', word:'Scalable', ph:'/ˈskeɪ.lə.bəl/', pos:'adjective', def:'Able to grow and handle increased demand without breaking.', use:'We need a scalable architecture before we go live with a million users.' },
  { id:'tw06', cat:'tech', word:'Pivot', ph:'/ˈpɪv.ɪt/', pos:'verb', def:'To change the direction or strategy of a product or company significantly.', use:'After the user research, we decided to pivot and focus on mobile only.' },
  { id:'tw07', cat:'tech', word:'Leverage', ph:'/ˈlev.ər.ɪdʒ/', pos:'verb', def:'To use a resource or advantage to its maximum benefit.', use:'We can leverage our existing API instead of building a new one from scratch.' },
  { id:'tw08', cat:'tech', word:'Workaround', ph:'/ˈwɜːk.ə.raʊnd/', pos:'noun', def:'A temporary solution that bypasses a known problem.', use:'We found a workaround for the login bug while the engineers fix the root cause.' },
  { id:'tw09', cat:'tech', word:'Onboarding', ph:'/ˈɒn.bɔː.dɪŋ/', pos:'noun', def:'The process of integrating a new employee or user into a system.', use:'The new hire onboarding at our company takes about two weeks to complete.' },
  { id:'tw10', cat:'tech', word:'Bottleneck', ph:'/ˈbɒt.əl.nɛk/', pos:'noun', def:'A point of congestion in a process that slows everything down.', use:'The code review process is our biggest bottleneck right now — PRs sit for days.' },
  { id:'tw11', cat:'tech', word:'Agile', ph:'/ˈædʒ.aɪl/', pos:'adjective/noun', def:'A software development method using short work cycles and constant feedback.', use:'Our team works in two-week Agile sprints with daily standup meetings.' },
  { id:'tw12', cat:'tech', word:'Sprint', ph:'/sprɪnt/', pos:'noun', def:'A fixed period of work in Agile development, usually one to two weeks.', use:'We shipped three new features in the last sprint — the team is on a roll.' },
  { id:'tw13', cat:'tech', word:'Stakeholder', ph:'/ˈsteɪk.hoʊl.dər/', pos:'noun', def:'Anyone who has an interest or investment in a project or decision.', use:'We need buy-in from all the stakeholders before we can move forward.' },
  { id:'tw14', cat:'tech', word:'Bandwidth (internet)', ph:'/ˈbænd.wɪdθ/', pos:'noun', def:'The maximum data transfer rate of a network connection.', use:'The video keeps buffering — I think there is a bandwidth issue on the office network.' },
  { id:'tw15', cat:'tech', word:'Iterate', ph:'/ˈɪt.ə.reɪt/', pos:'verb', def:'To improve something by repeatedly going through cycles of testing and refinement.', use:'We shipped a rough version first and then iterated based on customer feedback.' },

  // GROCERY & FOOD
  { id:'gr01', cat:'grocery', word:'Produce', ph:'/ˈproʊ.djuːs/', pos:'noun', def:'Fresh fruits and vegetables sold in a grocery store.', use:'I always head to the produce section first thing when I walk into Kroger.' },
  { id:'gr02', cat:'grocery', word:'Aisle', ph:'/aɪl/', pos:'noun', def:'A walkway between shelves in a store. The S is completely silent.', use:'Excuse me, which aisle is the peanut butter in?' },
  { id:'gr03', cat:'grocery', word:'Bulk', ph:'/bʌlk/', pos:'adjective', def:'Buying large quantities of items at a lower price per unit.', use:'I save a lot of money buying oats and rice in bulk from Costco.' },
  { id:'gr04', cat:'grocery', word:'Expiration date', ph:'/ˌɛk.spɪˈreɪ.ʃən deɪt/', pos:'noun', def:'The date printed on food after which it may no longer be safe to eat.', use:'Always check the expiration date on milk before putting it in your cart.' },
  { id:'gr05', cat:'grocery', word:'Deli', ph:'/ˈdɛl.i/', pos:'noun', def:'A store section with freshly sliced meats, cheeses, and prepared foods.', use:'I picked up some sliced turkey and provolone from the deli counter.' },
  { id:'gr06', cat:'grocery', word:'Generic', ph:'/dʒɪˈnɛr.ɪk/', pos:'adjective', def:'A store-brand product that is equivalent to name brands but cheaper.', use:'The generic ibuprofen works exactly the same and is half the price.' },
  { id:'gr07', cat:'grocery', word:'Coupon', ph:'/ˈkjuː.pɒn/', pos:'noun', def:'A voucher giving you a discount on a specific product.', use:'I saved eight dollars on groceries this week just by using coupons.' },
  { id:'gr08', cat:'grocery', word:'Organic', ph:'/ɔːrˈɡæn.ɪk/', pos:'adjective', def:'Food produced without synthetic pesticides or artificial additives.', use:'Whole Foods has a great organic section but prices are higher than Aldi.' },
  { id:'gr09', cat:'grocery', word:'Self-checkout', ph:'/sɛlf ˈtʃɛk.aʊt/', pos:'noun', def:'A lane where you scan and pay for your own items without a cashier.', use:'The regular lines are long — let us just use the self-checkout lane.' },
  { id:'gr10', cat:'grocery', word:'Rain check (store)', ph:'/reɪn tʃɛk/', pos:'noun', def:'A store voucher to buy a sale item later when it is currently out of stock.', use:'The rotisserie chicken is sold out but the manager gave me a rain check.' },
  { id:'gr11', cat:'grocery', word:'Loyalty card', ph:'/ˈlɔɪ.əl.ti kɑːrd/', pos:'noun', def:'A store membership card that earns you points or discounts over time.', use:'Swipe your loyalty card at Jewel-Osco to get the member price on everything.' },
  { id:'gr12', cat:'grocery', word:'Unit price', ph:'/ˈjuː.nɪt praɪs/', pos:'noun', def:'The price per standard unit such as per ounce or per pound for comparing value.', use:'Always check the unit price on the shelf tag to find the best deal.' },
  { id:'gr13', cat:'grocery', word:'Cart', ph:'/kɑːrt/', pos:'noun', def:'The wheeled basket you push around a store to collect items. Called a trolley in the UK.', use:'Grab a cart by the entrance — we have a long list today.' },
  { id:'gr14', cat:'grocery', word:'Checkout lane', ph:'/ˈtʃɛk.aʊt leɪn/', pos:'noun', def:'One of the lines at a grocery store where you pay for your items.', use:'Express checkout lanes are for customers with fifteen items or fewer.' },
  { id:'gr15', cat:'grocery', word:'Frozen section', ph:'/ˈfroʊ.zən ˈsɛk.ʃən/', pos:'noun', def:'The refrigerated aisle in a grocery store containing frozen foods.', use:'The frozen section at Costco has great Indian meals if you are in a hurry.' },

  // MEDICAL
  { id:'md01', cat:'medical', word:'Copay', ph:'/ˈkoʊ.peɪ/', pos:'noun', def:'The fixed amount you pay for a doctor visit or prescription under your insurance plan.', use:'My copay for a specialist visit is forty dollars with my current insurance.' },
  { id:'md02', cat:'medical', word:'Deductible', ph:'/dɪˈdʌk.tɪ.bəl/', pos:'noun', def:'The amount you must pay yourself before your insurance starts covering costs.', use:'My deductible is two thousand dollars, so I pay out of pocket until I reach that.' },
  { id:'md03', cat:'medical', word:'Urgent care', ph:'/ˈɜːr.dʒənt kɛr/', pos:'noun', def:'A walk-in clinic for illnesses that are not life-threatening emergencies.', use:'For a bad fever go to urgent care — the ER will take hours and cost much more.' },
  { id:'md04', cat:'medical', word:'Referral', ph:'/rɪˈfɜːr.əl/', pos:'noun', def:'An official document from your primary doctor allowing you to see a specialist.', use:'My insurance requires a referral before I can visit a dermatologist.' },
  { id:'md05', cat:'medical', word:'In-network', ph:'/ɪn ˈnɛt.wɜːrk/', pos:'adjective', def:'A doctor or hospital that has a contract with your insurance for lower rates.', use:'Always call ahead to confirm the clinic is in-network before your appointment.' },
  { id:'md06', cat:'medical', word:'Prescription', ph:'/prɪˈskrɪp.ʃən/', pos:'noun', def:'A written order from a doctor authorizing you to purchase a specific medication.', use:'The doctor sent my prescription directly to CVS so I can pick it up tonight.' },
  { id:'md07', cat:'medical', word:'OTC', ph:'/ˌoʊ.tiːˈsiː/', pos:'noun', def:'Over-the-counter medication available without a doctor\'s prescription.', use:'Tylenol and Ibuprofen are OTC so you can buy them right off the shelf.' },
  { id:'md08', cat:'medical', word:'Follow-up', ph:'/ˈfɒl.oʊ ʌp/', pos:'noun', def:'A second appointment scheduled to monitor your health after initial treatment.', use:'The surgeon wants to see me for a follow-up appointment in three weeks.' },
  { id:'md09', cat:'medical', word:'Out-of-pocket', ph:'/aʊt əv ˈpɒk.ɪt/', pos:'adjective', def:'Medical costs you pay entirely yourself without any insurance coverage.', use:'After hitting my deductible the out-of-pocket costs dropped significantly.' },
  { id:'md10', cat:'medical', word:'PCP', ph:'/piː.siː.piː/', pos:'noun', def:'Primary Care Physician — your main doctor for general health and routine checkups.', use:'I need to establish a PCP first before I can get any specialist referrals.' },
  { id:'md11', cat:'medical', word:'Prior authorization', ph:'/ˈpraɪər ˌɔː.θər.ɪˈzeɪ.ʃən/', pos:'noun', def:'Insurance company approval required before certain procedures or medications are covered.', use:'The insurance needs prior authorization before they will cover my MRI scan.' },
  { id:'md12', cat:'medical', word:'Copayment', ph:'/ˈkoʊ.peɪ.mənt/', pos:'noun', def:'The share of medical costs you pay each time you receive a specific service.', use:'My copayment for generic drugs is just ten dollars at any participating pharmacy.' },
  { id:'md13', cat:'medical', word:'EOB', ph:'/iː.oʊ.biː/', pos:'noun', def:'Explanation of Benefits — a statement from your insurance showing what was covered.', use:'I received an EOB in the mail after my annual physical — insurance covered everything.' },
  { id:'md14', cat:'medical', word:'Annual physical', ph:'/ˈæn.juː.əl ˈfɪz.ɪ.kəl/', pos:'noun', def:'A yearly preventive health checkup with your doctor, usually covered fully by insurance.', use:'Schedule your annual physical in January — most insurance plans cover it at one hundred percent.' },
  { id:'md15', cat:'medical', word:'Formulary', ph:'/ˈfɔːr.mjʊ.lər.i/', pos:'noun', def:'A list of prescription drugs covered by your specific insurance plan.', use:'Check the formulary before filling a prescription to see if it is covered at a lower tier.' },

  // HOME & HOUSING
  { id:'hm01', cat:'home', word:'HOA', ph:'/eɪtʃ.oʊˈeɪ/', pos:'noun', def:'Homeowners Association — manages rules and monthly fees in a neighborhood.', use:'Our HOA does not allow parking on the street overnight — everyone must use their driveway.' },
  { id:'hm02', cat:'home', word:'Utility', ph:'/juːˈtɪl.ɪ.ti/', pos:'noun', def:'Essential home services such as electricity, gas, water, and internet.', use:'Utilities in Missouri run about one hundred fifty to two hundred dollars per month.' },
  { id:'hm03', cat:'home', word:'Curb appeal', ph:'/kɜːrb əˈpiːl/', pos:'noun', def:'How attractive your home looks from the street to potential buyers or neighbors.', use:'We repainted the front door and added flowers to boost the curb appeal before listing.' },
  { id:'hm04', cat:'home', word:'Lease', ph:'/liːs/', pos:'noun', def:'A legal contract to rent a property for a fixed period, typically twelve months.', use:'We signed a one-year lease in Ballwin and the landlord covers water and trash.' },
  { id:'hm05', cat:'home', word:'Down payment', ph:'/daʊn ˈpeɪ.mənt/', pos:'noun', def:'The upfront cash you pay when purchasing a home, typically ten to twenty percent.', use:'We have been saving aggressively for the down payment on our first house.' },
  { id:'hm06', cat:'home', word:'Equity', ph:'/ˈɛk.wɪ.ti/', pos:'noun', def:'The share of your home\'s value that you truly own after subtracting your mortgage balance.', use:'After five years of mortgage payments we have built up about seventy thousand in equity.' },
  { id:'hm07', cat:'home', word:'Escrow', ph:'/ˈɛs.kroʊ/', pos:'noun', def:'An account that holds your property tax and insurance funds as part of your monthly payment.', use:'About three hundred dollars of my mortgage payment goes into escrow each month.' },
  { id:'hm08', cat:'home', word:'Walkthrough', ph:'/ˈwɔːk.θruː/', pos:'noun', def:'An inspection visit to a property before you buy or move in to verify its condition.', use:'We did a final walkthrough the morning before signing the closing documents.' },
  { id:'hm09', cat:'home', word:'Fixture', ph:'/ˈfɪk.stʃər/', pos:'noun', def:'A permanent object attached to a home like lighting, faucets, or built-in shelving.', use:'The contract says all fixtures stay with the house including the kitchen chandelier.' },
  { id:'hm10', cat:'home', word:'Homeowners insurance', ph:'/ˈhoʊm.oʊ.nərz ɪnˈʃʊər.əns/', pos:'noun', def:'Insurance that covers damage to your home and liability on your property.', use:'Your mortgage lender will require you to carry homeowners insurance at all times.' },
  { id:'hm11', cat:'home', word:'Closing costs', ph:'/ˈkloʊ.zɪŋ kɒsts/', pos:'noun', def:'Fees paid at the final step of buying a home, typically two to five percent of the price.', use:'We were surprised by the closing costs — they added almost eight thousand dollars to our expenses.' },
  { id:'hm12', cat:'home', word:'Appraisal', ph:'/əˈpreɪ.zəl/', pos:'noun', def:'A professional assessment of a home\'s current market value by a licensed appraiser.', use:'The bank ordered an appraisal to confirm the home is worth what we agreed to pay.' },
  { id:'hm13', cat:'home', word:'Property tax', ph:'/ˈprɒp.ər.ti tæks/', pos:'noun', def:'Annual tax paid to the local government based on the assessed value of your home.', use:'Property taxes in the Chicago suburbs can be surprisingly high — check before buying.' },
  { id:'hm14', cat:'home', word:'Refinance', ph:'/ˌriːˈfaɪ.næns/', pos:'verb', def:'To replace your existing mortgage with a new one at a lower interest rate.', use:'When rates dropped we refinanced and cut our monthly payment by two hundred dollars.' },
  { id:'hm15', cat:'home', word:'Townhouse', ph:'/ˈtaʊn.haʊs/', pos:'noun', def:'A multi-floor home that shares side walls with neighbors, typically in a row.', use:'We started in a two-bedroom townhouse before saving enough to buy a single family home.' },

  // DRIVING
  { id:'dr01', cat:'driving', word:'Merge', ph:'/mɜːrdʒ/', pos:'verb', def:'To move your car smoothly from one lane into another stream of traffic.', use:'Merge onto I-270 North and keep right until you pass the I-70 interchange.' },
  { id:'dr02', cat:'driving', word:'Yield', ph:'/jiːld/', pos:'verb', def:'To slow down and let another driver or pedestrian go first.', use:'At that intersection you must yield to traffic on the main road before turning.' },
  { id:'dr03', cat:'driving', word:'Carpool', ph:'/ˈkɑːr.puːl/', pos:'verb', def:'To share a car ride with others heading in the same direction to save fuel and time.', use:'Four of us carpool to the office every Tuesday and Thursday to beat the traffic.' },
  { id:'dr04', cat:'driving', word:'Fender bender', ph:'/ˈfɛn.dər ˌbɛn.dər/', pos:'noun', def:'A minor car accident that causes small, non-serious damage to one or both vehicles.', use:'There was a fender bender on 40 near the Lindbergh exit which is why traffic is backed up.' },
  { id:'dr05', cat:'driving', word:'Right of way', ph:'/raɪt əv weɪ/', pos:'noun', def:'The legal right for a vehicle or pedestrian to proceed ahead of others.', use:'In Missouri pedestrians have the right of way at all marked crosswalks — always stop.' },
  { id:'dr06', cat:'driving', word:'Detour', ph:'/ˈdiː.tʊər/', pos:'noun', def:'An alternate route you take because the regular road is closed or blocked.', use:'There is a detour on Chesterfield Parkway due to water main work this whole week.' },
  { id:'dr07', cat:'driving', word:'Tollway', ph:'/ˈtoʊl.weɪ/', pos:'noun', def:'A highway where you pay a fee to drive, usually managed electronically.', use:'Take I-88 West — it is a tollway but it is much faster than taking Route 20.' },
  { id:'dr08', cat:'driving', word:'Parallel parking', ph:'/ˈpær.ə.lɛl ˈpɑːr.kɪŋ/', pos:'noun', def:'Parking alongside a curb in a space between two other parked vehicles.', use:'Downtown Clayton requires a lot of parallel parking so practice it before driving there.' },
  { id:'dr09', cat:'driving', word:'Registration', ph:'/ˌrɛdʒ.ɪˈstreɪ.ʃən/', pos:'noun', def:'The official Missouri document proving your vehicle is legally registered with the state.', use:'Keep your proof of insurance and registration in your glove compartment at all times.' },
  { id:'dr10', cat:'driving', word:'DMV', ph:'/diː.ɛm.viː/', pos:'noun', def:'Department of Motor Vehicles — the government office handling licenses and registrations.', use:'You need to visit the DMV within thirty days of moving to Missouri to update your license.' },
  { id:'dr11', cat:'driving', word:'Rush hour', ph:'/rʌʃ aʊər/', pos:'noun', def:'The busiest time on roads during morning and evening work commutes.', use:'Avoid I-270 during rush hour — it is completely gridlocked between four and six thirty.' },
  { id:'dr12', cat:'driving', word:'HOV lane', ph:'/eɪtʃ.oʊ.viː leɪn/', pos:'noun', def:'High-Occupancy Vehicle lane reserved for cars with two or more passengers.', use:'Take the HOV lane during rush hour — it moves twice as fast as regular traffic.' },
  { id:'dr13', cat:'driving', word:'Gas mileage', ph:'/ɡæs ˈmaɪ.lɪdʒ/', pos:'noun', def:'How far a car can travel per gallon of gasoline, measuring fuel efficiency.', use:'My Camry gets thirty-two miles per gallon on the highway — great gas mileage.' },
  { id:'dr14', cat:'driving', word:'Tailgate', ph:'/ˈteɪl.ɡeɪt/', pos:'verb', def:'To drive dangerously close to the car in front of you.', use:'Do not tailgate on the highway — it is dangerous and illegal in Missouri.' },
  { id:'dr15', cat:'driving', word:'Four-way stop', ph:'/fɔːr.weɪ stɒp/', pos:'noun', def:'An intersection where all four directions have stop signs and cars take turns.', use:'At a four-way stop the car that arrived first goes first — it is first come first served.' },

  // FINANCE
  { id:'fn01', cat:'finance', word:'Credit score', ph:'/ˈkrɛd.ɪt skɔːr/', pos:'noun', def:'A number from 300 to 850 rating how reliably you repay borrowed money.', use:'You need a credit score above 700 to qualify for the best mortgage interest rates.' },
  { id:'fn02', cat:'finance', word:'APR', ph:'/ˌeɪ.piːˈɑːr/', pos:'noun', def:'Annual Percentage Rate — the yearly interest cost on a loan or credit card.', use:'That card has a 24 percent APR so always pay the full balance every single month.' },
  { id:'fn03', cat:'finance', word:'Direct deposit', ph:'/daɪˈrɛkt dɪˈpɒz.ɪt/', pos:'noun', def:'Your employer automatically sends your paycheck to your bank account electronically.', use:'Set up direct deposit with HR on day one so your first paycheck goes straight to your account.' },
  { id:'fn04', cat:'finance', word:'W-2', ph:'/ˈdʌb.əl.juː tuː/', pos:'noun', def:'A tax document your employer sends each January showing your annual earnings and taxes withheld.', use:'File your W-2 with TurboTax before the April 15th deadline to avoid any late penalties.' },
  { id:'fn05', cat:'finance', word:'Routing number', ph:'/ˈruː.tɪŋ ˈnʌm.bər/', pos:'noun', def:'A nine-digit number identifying your bank, required for electronic transfers and direct deposit.', use:'Your routing number is the first set of nine digits printed on the bottom left of any check.' },
  { id:'fn06', cat:'finance', word:'HSA', ph:'/eɪtʃ.ɛsˈeɪ/', pos:'noun', def:'Health Savings Account — a triple tax-advantaged account for qualified medical expenses.', use:'Maxing out your HSA every year is one of the best tax moves available to Americans.' },
  { id:'fn07', cat:'finance', word:'401k', ph:'/fɔːr.oʊ.wʌnˈkeɪ/', pos:'noun', def:'An employer retirement savings plan that reduces taxable income and often includes employer matching.', use:'Always contribute at least enough to your 401k to capture the full employer match — it is free money.' },
  { id:'fn08', cat:'finance', word:'Overdraft', ph:'/ˈoʊ.vər.dræft/', pos:'noun', def:'When you spend more than your available bank balance resulting in a fee from your bank.', use:'I got hit with a 35-dollar overdraft fee — I forgot my rent cleared the same day as groceries.' },
  { id:'fn09', cat:'finance', word:'Net pay', ph:'/nɛt peɪ/', pos:'noun', def:'Your actual take-home pay after federal taxes, state taxes, and all deductions are removed.', use:'My salary is ninety thousand gross but my net pay works out to about fifty-eight hundred a month.' },
  { id:'fn10', cat:'finance', word:'FICO score', ph:'/ˈfaɪ.koʊ skɔːr/', pos:'noun', def:'The most widely used credit scoring model in the United States, ranging from 300 to 850.', use:'Lenders pull your FICO score when you apply for a mortgage, car loan, or credit card.' },
  { id:'fn11', cat:'finance', word:'Compound interest', ph:'/ˈkɒm.paʊnd ˈɪn.trɪst/', pos:'noun', def:'Interest calculated on both the initial amount and the accumulated interest from prior periods.', use:'The earlier you invest in your 401k the more you benefit from compound interest over decades.' },
  { id:'fn12', cat:'finance', word:'Tax bracket', ph:'/tæks ˈbræk.ɪt/', pos:'noun', def:'A range of income taxed at a specific rate in the US progressive federal income tax system.', use:'Getting a raise can push you into a higher tax bracket but only the extra income is taxed higher.' },
  { id:'fn13', cat:'finance', word:'Capital gains', ph:'/ˈkæp.ɪ.təl ɡeɪnz/', pos:'noun', def:'The profit made from selling an asset like stocks or real estate for more than you paid.', use:'If you hold a stock for over one year the capital gains tax rate is lower than ordinary income.' },
  { id:'fn14', cat:'finance', word:'Escrow (mortgage)', ph:'/ˈɛs.kroʊ/', pos:'noun', def:'A portion of your monthly mortgage payment held to pay property taxes and insurance.', use:'Your monthly mortgage payment includes principal, interest, and escrow for taxes and insurance.' },
  { id:'fn15', cat:'finance', word:'1099', ph:'/wʌn.oʊ.naɪn.naɪn/', pos:'noun', def:'A tax form for freelancers and contractors showing income received without employer tax withholding.', use:'As a contractor I receive a 1099 from each client instead of a W-2 from an employer.' },

  // SPORTS & LEISURE
  { id:'sp01', cat:'sports', word:'Tailgate (sports)', ph:'/ˈteɪl.ɡeɪt/', pos:'noun/verb', def:'A pre-game parking lot party with food, drinks, and fans celebrating before a sporting event.', use:'We tailgated for two hours before the Cardinals game — had burgers and watched pre-game.' },
  { id:'sp02', cat:'sports', word:'Fantasy league', ph:'/ˈfæn.tə.si liːɡ/', pos:'noun', def:'A competition where you manage a virtual sports team using real player statistics.', use:'I am in a fantasy football league with my coworkers — it makes every Sunday game exciting.' },
  { id:'sp03', cat:'sports', word:'Overtime', ph:'/ˈoʊ.vər.taɪm/', pos:'noun', def:'Extra time added to a tied game to determine a winner, called extra time in soccer elsewhere.', use:'The Blues game went into overtime and they finally scored at the two-minute mark.' },
  { id:'sp04', cat:'sports', word:'Ballpark figure', ph:'/ˈbɔːl.pɑːrk ˈfɪɡ.ər/', pos:'idiom', def:'A rough estimate that is approximately correct, not an exact number.', use:'Give me a ballpark figure on the renovation cost so I can decide whether to proceed.' },
  { id:'sp05', cat:'sports', word:'Rain out', ph:'/reɪn aʊt/', pos:'phrasal verb', def:'When a game or outdoor event is cancelled due to rain or bad weather.', use:'The Cardinals game was rained out last night — they will play a doubleheader on Sunday.' },
  { id:'sp06', cat:'sports', word:'Playoff', ph:'/ˈpleɪ.ɒf/', pos:'noun', def:'A series of games after the regular season to determine the champion.', use:'The Blues made the playoffs three years in a row which is impressive for a mid-market team.' },
  { id:'sp07', cat:'sports', word:'Down to the wire', ph:'/daʊn tə ðə ˈwaɪər/', pos:'idiom', def:'Something decided at the very last possible moment, extremely close to the end.', use:'The election results were down to the wire — the winner was not called until midnight.' },
  { id:'sp08', cat:'sports', word:'Rookie', ph:'/ˈrʊk.i/', pos:'noun', def:'A first-year player in a professional sport, or more broadly anyone new to something.', use:'The rookie quarterback played like a veteran — nobody expected that level of composure.' },
  { id:'sp09', cat:'sports', word:'March Madness', ph:'/mɑːrtʃ ˈmæd.nɪs/', pos:'noun', def:'The annual NCAA college basketball tournament held every March, a huge American cultural event.', use:'The office bracket challenge for March Madness is more competitive than any actual work project.' },
  { id:'sp10', cat:'sports', word:'Bench', ph:'/bɛntʃ/', pos:'verb', def:'To remove a player from the game or to be set aside from the main activity.', use:'The coach benched the star player for missing practice — even top performers face consequences.' },
  { id:'sp11', cat:'sports', word:'Slam dunk', ph:'/slæm dʌŋk/', pos:'noun/idiom', def:'A basketball shot above the rim. Also means a sure thing or an obvious decision.', use:'Hiring her was a slam dunk — she had exactly the skills and experience we needed.' },
  { id:'sp12', cat:'sports', word:'Game plan', ph:'/ɡeɪm plæn/', pos:'noun', def:'A strategic plan for achieving a goal, originally from sports coaching.', use:'What is our game plan for winning this client? We need to prepare before Tuesday\'s meeting.' },
  { id:'sp13', cat:'sports', word:'Curveball', ph:'/ˈkɜːrv.bɔːl/', pos:'noun', def:'A surprising or unexpected problem that throws off your plans.', use:'The client threw us a curveball by requesting bilingual materials two days before the deadline.' },
  { id:'sp14', cat:'sports', word:'Level the playing field', ph:'/ˈlɛv.əl ðə ˈpleɪ.ɪŋ fiːld/', pos:'idiom', def:'To make conditions fair and equal for all participants.', use:'The new scholarship program levels the playing field for first-generation college students.' },
  { id:'sp15', cat:'sports', word:'Touchdown', ph:'/ˈtʌtʃ.daʊn/', pos:'noun', def:'A six-point score in American football. Also used to mean achieving a goal.', use:'We finally got the deal signed — touchdown! The whole team went out to celebrate.' },

  // SCHOOL & EDUCATION
  { id:'sc01', cat:'school', word:'GPA', ph:'/dʒiː.piː.eɪ/', pos:'noun', def:'Grade Point Average — a number from 0 to 4.0 measuring a student\'s academic performance.', use:'You need a 3.5 GPA or higher to qualify for most merit-based college scholarships.' },
  { id:'sc02', cat:'school', word:'Syllabus', ph:'/ˈsɪl.ə.bəs/', pos:'noun', def:'A document outlining the schedule, topics, assignments, and rules for a course.', use:'Read the syllabus on the first day — it has the exam dates and grading breakdown.' },
  { id:'sc03', cat:'school', word:'Office hours', ph:'/ˈɒf.ɪs aʊərz/', pos:'noun', def:'Scheduled time when a teacher or professor is available to meet students individually.', use:'Visit your professor during office hours if you are struggling — they genuinely want to help.' },
  { id:'sc04', cat:'school', word:'Dean\'s list', ph:'/diːnz lɪst/', pos:'noun', def:'An academic honor roll for students who achieved excellent grades in a semester.', use:'She made the Dean\'s List every single semester throughout her four years at university.' },
  { id:'sc05', cat:'school', word:'Extracurricular', ph:'/ˌɛk.strə.kəˈrɪk.jʊ.lər/', pos:'adjective', def:'Activities and clubs outside of regular academic coursework.', use:'American college applications look closely at extracurricular activities and community involvement.' },
  { id:'sc06', cat:'school', word:'Tuition', ph:'/tjuːˈɪʃ.ən/', pos:'noun', def:'The fee charged by a school or university for academic instruction.', use:'In-state tuition at Missouri University is less than half the cost of out-of-state tuition.' },
  { id:'sc07', cat:'school', word:'Financial aid', ph:'/faɪˈnæn.ʃəl eɪd/', pos:'noun', def:'Money granted or loaned to help students pay for college education costs.', use:'Fill out the FAFSA every year to see what federal financial aid you qualify for.' },
  { id:'sc08', cat:'school', word:'Semester', ph:'/sɪˈmɛs.tər/', pos:'noun', def:'One of two main academic periods in an American school year, usually about 15 weeks.', use:'The spring semester runs from January through May at most American universities.' },
  { id:'sc09', cat:'school', word:'Valedictorian', ph:'/ˌvæl.ɪˈdɪk.tɔːr.i.ən/', pos:'noun', def:'The student with the highest academic ranking in a graduating class who gives the commencement speech.', use:'Being valedictorian at an American high school is a huge honor and helps with college applications.' },
  { id:'sc10', cat:'school', word:'Homeroom', ph:'/ˈhoʊm.ruːm/', pos:'noun', def:'A classroom where students start the school day for attendance and announcements.', use:'In American middle school and high school students report to homeroom first thing every morning.' },
  { id:'sc11', cat:'school', word:'Credit hour', ph:'/ˈkrɛd.ɪt aʊər/', pos:'noun', def:'A unit measuring coursework completed, typically one credit per weekly contact hour.', use:'Most bachelor\'s degrees in the US require completing one hundred twenty credit hours total.' },
  { id:'sc12', cat:'school', word:'Commencement', ph:'/kəˈmɛns.mənt/', pos:'noun', def:'The formal graduation ceremony marking the end of academic study.', use:'The commencement ceremony for engineering graduates is held at the main stadium in May.' },
  { id:'sc13', cat:'school', word:'SAT', ph:'/ɛs.eɪ.tiː/', pos:'noun', def:'Standardized Admissions Test — a college entrance exam measuring math and reading skills.', use:'Many colleges became test-optional during COVID but the SAT is still widely used today.' },
  { id:'sc14', cat:'school', word:'Internship', ph:'/ˈɪn.tɜːn.ʃɪp/', pos:'noun', def:'A temporary work placement, usually for students, to gain practical industry experience.', use:'Landing a summer internship at a tech company in the US is extremely competitive but worth it.' },
  { id:'sc15', cat:'school', word:'Greek life', ph:'/ɡriːk laɪf/', pos:'noun', def:'Fraternities and sororities — social organizations at American colleges named with Greek letters.', use:'Greek life is a huge part of social culture at many large American state universities.' },

  // WEATHER & SEASONS
  { id:'wt01', cat:'weather', word:'Wind chill', ph:'/wɪnd tʃɪl/', pos:'noun', def:'How cold the air actually feels on exposed skin due to the combination of temperature and wind.', use:'It is only 20 degrees but the wind chill makes it feel like negative five — dress in layers!' },
  { id:'wt02', cat:'weather', word:'Heat index', ph:'/hiːt ˈɪn.dɛks/', pos:'noun', def:'How hot the air actually feels when humidity is combined with the air temperature.', use:'It is 95 degrees today with a heat index of 108 — stay hydrated and limit outdoor time.' },
  { id:'wt03', cat:'weather', word:'Tornado watch', ph:'/tɔːrˈneɪ.doʊ wɒtʃ/', pos:'noun', def:'Conditions are favorable for tornado development — be prepared but no confirmed sighting yet.', use:'A tornado watch is in effect until 9 PM so keep an eye on weather alerts tonight.' },
  { id:'wt04', cat:'weather', word:'Tornado warning', ph:'/tɔːrˈneɪ.doʊ ˈwɔːr.nɪŋ/', pos:'noun', def:'A tornado has been spotted or confirmed by radar — take shelter immediately.', use:'The tornado warning siren went off so we went straight to our basement until it passed.' },
  { id:'wt05', cat:'weather', word:'Black ice', ph:'/blæk aɪs/', pos:'noun', def:'A thin, nearly invisible layer of ice on roads that is extremely dangerous for drivers.', use:'Drive very slowly on Route 40 this morning — there are reports of black ice near Chesterfield.' },
  { id:'wt06', cat:'weather', word:'Sleet', ph:'/sliːt/', pos:'noun', def:'A mixture of rain and snow, or ice pellets that fall during winter storms.', use:'The forecast calls for sleet tomorrow morning which will make the morning commute dangerous.' },
  { id:'wt07', cat:'weather', word:'Humidity', ph:'/hjuːˈmɪd.ɪ.ti/', pos:'noun', def:'The amount of water vapor present in the air, making hot weather feel even more oppressive.', use:'St. Louis summers have brutal humidity — eighty-five degrees feels like over one hundred.' },
  { id:'wt08', cat:'weather', word:'Winter storm advisory', ph:'/ˈwɪn.tər stɔːrm ədˈvaɪ.zər.i/', pos:'noun', def:'An official notice of an upcoming winter storm with significant snow, ice, or cold.', use:'A winter storm advisory has been issued for the metro area — expect three to five inches tonight.' },
  { id:'wt09', cat:'weather', word:'Partly cloudy', ph:'/ˈpɑːrt.li ˈklaʊ.di/', pos:'adjective', def:'Weather with some clouds mixed with sunshine, common phrase in American weather forecasts.', use:'The forecast says partly cloudy with a high of 72 — perfect weather for a walk at Lone Elk.' },
  { id:'wt10', cat:'weather', word:'Arctic blast', ph:'/ˈɑːrk.tɪk blɑːst/', pos:'noun', def:'A sudden surge of extremely cold polar air moving into a region rapidly.', use:'An arctic blast is sweeping through the Midwest this week — temperatures dropping to single digits.' },
  { id:'wt11', cat:'weather', word:'Overcast', ph:'/ˈoʊ.vər.kæst/', pos:'adjective', def:'The sky is completely covered with clouds with no sunshine visible at all.', use:'It has been overcast and gloomy for five days straight — I cannot wait for sunshine again.' },
  { id:'wt12', cat:'weather', word:'Frost advisory', ph:'/frɒst ədˈvaɪ.zər.i/', pos:'noun', def:'An official warning that temperatures will drop low enough to freeze outdoor plants and surfaces.', use:'There is a frost advisory tonight — bring your potted plants indoors before sundown.' },
  { id:'wt13', cat:'weather', word:'Flood warning', ph:'/flʌd ˈwɔːr.nɪŋ/', pos:'noun', def:'An official alert that flooding is occurring or is expected to occur very soon in the area.', use:'The National Weather Service issued a flood warning for the Meramec River — avoid low-lying roads.' },
  { id:'wt14', cat:'weather', word:'Feels like', ph:'/fiːlz laɪk/', pos:'phrase', def:'The apparent temperature accounting for wind, humidity, and other factors affecting perception.', use:'It is 30 degrees but with the wind chill it feels like 18 — wear your thickest coat today.' },
  { id:'wt15', cat:'weather', word:'Doppler radar', ph:'/ˈdɒp.lər ˈreɪ.dɑːr/', pos:'noun', def:'Weather tracking technology showing real-time precipitation, movement, and storm intensity.', use:'Check the Doppler radar on the KMOV weather app before heading out — storms are moving in fast.' },

  // SOCIAL & CULTURE
  { id:'cu01', cat:'culture', word:'Dutch treat', ph:'/dʌtʃ triːt/', pos:'noun', def:'When everyone in a group pays for their own meal or activity separately.', use:'We went Dutch at dinner — it is just easier when there are eight people at the table.' },
  { id:'cu02', cat:'culture', word:'Happy hour', ph:'/ˈhæp.i ˈaʊər/', pos:'noun', def:'A bar or restaurant promotion usually from 4 to 7 PM offering discounts on drinks and appetizers.', use:'The whole team goes to happy hour on Fridays at the bar near the office in Clayton.' },
  { id:'cu03', cat:'culture', word:'Small talk', ph:'/smɔːl tɔːk/', pos:'noun', def:'Light, casual conversation about everyday topics like weather, sports, or weekend plans.', use:'Americans love small talk in elevators and waiting rooms — always have a friendly line ready.' },
  { id:'cu04', cat:'culture', word:'Ghosting', ph:'/ˈɡoʊs.tɪŋ/', pos:'noun', def:'Abruptly cutting off all communication with someone without any warning or explanation.', use:'He ghosted after the third interview — never replied to follow-up emails or calls.' },
  { id:'cu05', cat:'culture', word:'Networking', ph:'/ˈnɛt.wɜːr.kɪŋ/', pos:'noun', def:'Deliberately building professional relationships that may lead to career or business opportunities.', use:'LinkedIn is the primary tool for professional networking among immigrants building careers in the US.' },
  { id:'cu06', cat:'culture', word:'Block party', ph:'/ˈblɒk ˌpɑːr.ti/', pos:'noun', def:'A neighborhood outdoor party where the street is temporarily closed and residents gather together.', use:'Our subdivision holds a huge block party every Fourth of July — everyone brings a dish.' },
  { id:'cu07', cat:'culture', word:'Potluck', ph:'/ˈpɒt.lʌk/', pos:'noun', def:'A social gathering where each guest brings one dish to share with the entire group.', use:'Our office potluck is the best day of the year — people bring food from every culture imaginable.' },
  { id:'cu08', cat:'culture', word:'Tip (gratuity)', ph:'/tɪp/', pos:'noun', def:'A voluntary payment given to service workers on top of the bill, typically 18 to 22 percent in the US.', use:'Tipping 20 percent at sit-down restaurants is considered standard etiquette in America.' },
  { id:'cu09', cat:'culture', word:'HOA meeting', ph:'/eɪtʃ.oʊˈeɪ ˈmiː.tɪŋ/', pos:'noun', def:'A regular neighborhood association gathering where rules, fees, and community issues are discussed.', use:'The HOA meeting is Tuesday night — they are voting on whether to build a new community pool.' },
  { id:'cu10', cat:'culture', word:'Yard sale', ph:'/jɑːrd seɪl/', pos:'noun', def:'A sale where homeowners sell unwanted household items in their front yard or driveway.', use:'We held a yard sale before moving and made over three hundred dollars selling old stuff.' },
  { id:'cu11', cat:'culture', word:'BYOB', ph:'/biː.waɪ.oʊ.biː/', pos:'abbreviation', def:'Bring Your Own Bottle — guests are expected to bring their own alcoholic beverages to a gathering.', use:'The dinner party is BYOB — bring whatever wine or beer you enjoy and we will share.' },
  { id:'cu12', cat:'culture', word:'Rain check (social)', ph:'/reɪn tʃɛk/', pos:'idiom', def:'A polite way to decline an invitation now while expressing genuine interest in rescheduling later.', use:'I have a work deadline this weekend but can I take a rain check and join you guys next time?' },
  { id:'cu13', cat:'culture', word:'Cookout', ph:'/ˈkʊk.aʊt/', pos:'noun', def:'An outdoor gathering where food is grilled or barbecued, popular in American summer culture.', use:'We are having a cookout on Memorial Day weekend — burgers, hot dogs, and corn on the cob.' },
  { id:'cu14', cat:'culture', word:'Potluck (Thanksgiving)', ph:'/ˈpɒt.lʌk/', pos:'noun', def:'Sharing the cooking responsibility for Thanksgiving by each family bringing one dish.', use:'Our multicultural Thanksgiving potluck had turkey, biryani, tamales, and jerk chicken all together.' },
  { id:'cu15', cat:'culture', word:'Inclusive', ph:'/ɪnˈkluː.sɪv/', pos:'adjective', def:'Actively welcoming and accepting people of all backgrounds, identities, and experiences.', use:'Our workplace culture is genuinely inclusive — everyone is encouraged to bring their full self.' },

  // PARENTING & FAMILY
  { id:'pr01', cat:'parenting', word:'Playdate', ph:'/ˈpleɪ.deɪt/', pos:'noun', def:'A scheduled time for children to play together, arranged by their parents.', use:'My daughter has a playdate at Emma\'s house this Saturday afternoon.' },
  { id:'pr02', cat:'parenting', word:'PTA', ph:'/piː.tiː.eɪ/', pos:'noun', def:'Parent-Teacher Association — a school organization where parents and teachers collaborate.', use:'Joining the PTA is a great way to meet other parents and stay involved at your child\'s school.' },
  { id:'pr03', cat:'parenting', word:'Carpool (school)', ph:'/ˈkɑːr.puːl/', pos:'noun', def:'A rotation where parents take turns driving groups of children to and from school.', use:'We are in a carpool with four families on our street — I drive Mondays and Thursdays.' },
  { id:'pr04', cat:'parenting', word:'Drop-off line', ph:'/drɒp ɒf laɪn/', pos:'noun', def:'A designated lane at school where parents stop briefly to let children out of the car.', use:'The drop-off line at our elementary school moves quickly — in and out in about five minutes.' },
  { id:'pr05', cat:'parenting', word:'Sleepover', ph:'/ˈsliːp.oʊ.vər/', pos:'noun', def:'When a child spends the night at a friend\'s house, very common in American childhood.', use:'My son is going to his best friend\'s sleepover — they will stay up way too late watching movies.' },
  { id:'pr06', cat:'parenting', word:'Field trip', ph:'/fiːld trɪp/', pos:'noun', def:'A school-organized educational trip to a location outside the classroom.', use:'The class is going on a field trip to the Saint Louis Zoo next Tuesday.' },
  { id:'pr07', cat:'parenting', word:'Back-to-school night', ph:'/bæk tə skuːl naɪt/', pos:'noun', def:'An evening event where parents visit their child\'s school and meet teachers before the year begins.', use:'Back-to-school night is August 21st — parents meet the teachers and see the classroom setup.' },
  { id:'pr08', cat:'parenting', word:'Report card', ph:'/rɪˈpɔːrt kɑːrd/', pos:'noun', def:'A document sent home to parents showing their child\'s grades and teacher comments.', use:'Report cards come home every nine weeks so parents stay informed about academic progress.' },
  { id:'pr09', cat:'parenting', word:'Daycare', ph:'/ˈdeɪ.kɛr/', pos:'noun', def:'A licensed facility that provides supervised care for young children during working hours.', use:'Good daycare in Ballwin has a long waitlist — sign up months before you actually need it.' },
  { id:'pr10', cat:'parenting', word:'Summer camp', ph:'/ˈsʌm.ər kæmp/', pos:'noun', def:'A supervised program where children participate in outdoor, creative, or sports activities during summer.', use:'Our kids go to a STEM summer camp at Webster University every July — they absolutely love it.' },
  { id:'pr11', cat:'parenting', word:'Parent-teacher conference', ph:'/ˈpɛər.ənt ˈtiː.tʃər ˈkɒn.fər.əns/', pos:'noun', def:'A scheduled meeting between a parent and teacher to discuss a student\'s progress and needs.', use:'Parent-teacher conferences are twice a year — always attend even if your child is doing well.' },
  { id:'pr12', cat:'parenting', word:'IEP', ph:'/aɪ.iː.piː/', pos:'noun', def:'Individualized Education Program — a legal plan for students who need special learning accommodations.', use:'If your child has a learning difference ask the school about an IEP to get the right support.' },
  { id:'pr13', cat:'parenting', word:'Pediatrician', ph:'/ˌpiː.di.əˈtrɪʃ.ən/', pos:'noun', def:'A doctor who specializes in the healthcare of infants, children, and adolescents.', use:'Find a pediatrician before the baby arrives — the best ones in Ballwin have long wait lists.' },
  { id:'pr14', cat:'parenting', word:'Car seat', ph:'/kɑːr siːt/', pos:'noun', def:'A specially designed child safety seat required by law for young children in vehicles.', use:'Missouri law requires children under 4 to ride in an approved car seat at all times.' },
  { id:'pr15', cat:'parenting', word:'Trick or treat', ph:'/trɪk ɔːr triːt/', pos:'noun', def:'The Halloween tradition where children in costumes go door-to-door collecting candy.', use:'Trick or treat night in our neighborhood is magical — hundreds of kids walk the streets in costumes.' },

  // IDIOMS & EXPRESSIONS
  { id:'id01', cat:'idioms', word:'Bite the bullet', ph:'/baɪt ðə ˈbʊl.ɪt/', pos:'idiom', def:'To endure a painful or difficult situation with courage because it is unavoidable.', use:'I had to bite the bullet and call the IRS — I had been avoiding it for months.' },
  { id:'id02', cat:'idioms', word:'Break the ice', ph:'/breɪk ðə aɪs/', pos:'idiom', def:'To do or say something to relieve tension and make people feel comfortable in a new social situation.', use:'The team-building game really helped break the ice among the new employees on day one.' },
  { id:'id03', cat:'idioms', word:'Hit the nail on the head', ph:'/hɪt ðə neɪl ɒn ðə hɛd/', pos:'idiom', def:'To describe or identify something with complete accuracy.', use:'You hit the nail on the head — that is exactly the problem with our current onboarding process.' },
  { id:'id04', cat:'idioms', word:'Spill the beans', ph:'/spɪl ðə biːnz/', pos:'idiom', def:'To accidentally or deliberately reveal a secret or surprise.', use:'Please do not spill the beans about the surprise party — Maya has no idea it is happening.' },
  { id:'id05', cat:'idioms', word:'Under the weather', ph:'/ˈʌn.dər ðə ˈwɛð.ər/', pos:'idiom', def:'Feeling slightly ill or unwell but not seriously sick.', use:'I am feeling a bit under the weather today so I am working from home just to be safe.' },
  { id:'id06', cat:'idioms', word:'Ballpark figure', ph:'/ˈbɔːl.pɑːrk ˈfɪɡ.ər/', pos:'idiom', def:'A rough, approximate estimate that is close but not perfectly precise.', use:'Just give me a ballpark figure on the renovation — I want to know if it is worth exploring.' },
  { id:'id07', cat:'idioms', word:'On the same page', ph:'/ɒn ðə seɪm peɪdʒ/', pos:'idiom', def:'When everyone involved in a situation has the same understanding and information.', use:'Before we present to the board let us make sure everyone is on the same page about our numbers.' },
  { id:'id08', cat:'idioms', word:'Bite off more than you can chew', ph:'/baɪt ɒf mɔːr ðæn juː kæn tʃuː/', pos:'idiom', def:'To take on more responsibilities or tasks than you can realistically handle.', use:'I joined three committees at once and completely bit off more than I could chew last semester.' },
  { id:'id09', cat:'idioms', word:'The ball is in your court', ph:'/ðə bɔːl ɪz ɪn jɔːr kɔːrt/', pos:'idiom', def:'It is now your turn to take action or make a decision.', use:'I sent the proposal last week — the ball is in their court now and we just have to wait.' },
  { id:'id10', cat:'idioms', word:'Back to square one', ph:'/bæk tə skwɛr wʌn/', pos:'idiom', def:'To return to the very beginning after a failed attempt or major setback.', use:'The client rejected the entire concept so we are back to square one with the design.' },
  { id:'id11', cat:'idioms', word:'The elephant in the room', ph:'/ðə ˈɛl.ɪ.fənt ɪn ðə ruːm/', pos:'idiom', def:'An obvious serious problem or topic that people are deliberately avoiding discussing.', use:'The budget cuts are the elephant in the room that nobody wants to address in our team meetings.' },
  { id:'id12', cat:'idioms', word:'Burning the midnight oil', ph:'/ˈbɜːr.nɪŋ ðə ˈmɪd.naɪt ɔɪl/', pos:'idiom', def:'Working very late into the night on an important project or deadline.', use:'I have been burning the midnight oil all week to finish this deliverable before Friday.' },
  { id:'id13', cat:'idioms', word:'Beat around the bush', ph:'/biːt əˈraʊnd ðə bʊʃ/', pos:'idiom', def:'To avoid getting to the point by talking around a topic instead of stating it directly.', use:'Stop beating around the bush and just tell me directly whether you want the job or not.' },
  { id:'id14', cat:'idioms', word:'Cost an arm and a leg', ph:'/kɒst ən ɑːrm ænd ə lɛɡ/', pos:'idiom', def:'To be extremely expensive, much more than expected or considered reasonable.', use:'Childcare in the suburbs costs an arm and a leg — it is basically a second mortgage payment.' },
  { id:'id15', cat:'idioms', word:'Hit the ground running', ph:'/hɪt ðə ɡraʊnd ˈrʌn.ɪŋ/', pos:'idiom', def:'To begin a new project or job with immediate energy, enthusiasm, and productivity.', use:'The new developer hit the ground running and shipped his first feature in the opening week.' },
];

const CATS = {
  everyday: { label: 'Everyday Life', icon: '🏠', color: 'badge-blue' },
  tech:     { label: 'Tech & Work',   icon: '💻', color: 'badge-teal' },
  grocery:  { label: 'Grocery & Food',icon: '🛒', color: 'badge-green' },
  medical:  { label: 'Medical',       icon: '🏥', color: 'badge-red' },
  home:     { label: 'Home & Housing',icon: '🔑', color: 'badge-amber' },
  driving:  { label: 'Driving',       icon: '🚗', color: 'badge-purple' },
  finance:  { label: 'Finance',       icon: '💰', color: 'badge-green' },
  sports:   { label: 'Sports & Idioms',icon:'🏈', color: 'badge-amber' },
  school:   { label: 'School',        icon: '🎓', color: 'badge-teal' },
  weather:  { label: 'Weather',       icon: '🌦️', color: 'badge-blue' },
  culture:  { label: 'Social & Culture',icon:'🎉',color: 'badge-pink' },
  parenting:{ label: 'Parenting',     icon: '👨‍👩‍👧', color: 'badge-purple' },
  idioms:   { label: 'Idioms',        icon: '💬', color: 'badge-pink' },
};

// ── Helpers ───────────────────────────────────────────────────────────
function speakText(text, btn) { Speech.speak(text, btn); }

function makeSpeakBtn(text, label = '🔊 Listen') {
  return `<button class="speak-btn" onclick="speakText('${text.replace(/'/g, "\\'")}', this)">
    <svg viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/></svg>
    ${label}</button>`;
}

function getProgress() {
  return Store.get('progress', { completedDays: [], xp: 0, streak: 0 });
}
function saveProgress(p) { Store.set('progress', p); }

function updateNavBadges() {
  const p = getProgress();
  const streakEl = document.getElementById('nav-streak');
  const xpEl = document.getElementById('nav-xp');
  if (streakEl) streakEl.textContent = `🔥 ${p.streak} day streak`;
  if (xpEl) xpEl.textContent = `⚡ ${p.xp} XP`;
}

function renderNav(activePage) {
  const pages = [
    { href: 'index.html',    label: 'Home',    icon: '🏠' },
    { href: 'learn.html',    label: 'Learn',   icon: '📚' },
    { href: 'reading.html',  label: 'Reading', icon: '📖' },
    { href: 'quiz.html',     label: 'Quiz',    icon: '🧠' },
  ];
  return `<nav>
    <a href="index.html" class="nav-logo">🇺🇸 <span>Ameri</span>Speak</a>
    <div class="nav-links">
      ${pages.map(p => `<a href="${p.href}" class="${p.href === activePage ? 'active' : ''}">
        <span class="nav-icon">${p.icon}</span><span>${p.label}</span></a>`).join('')}
    </div>
    <div class="nav-right">
      <div class="streak-badge" id="nav-streak">🔥 0 day streak</div>
      <div class="xp-badge" id="nav-xp">⚡ 0 XP</div>
    </div>
  </nav>`;
}
