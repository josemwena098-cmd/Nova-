// ---------- Nav scroll state ----------
const nav = document.getElementById('siteNav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
});

// ---------- Reveal on scroll ----------
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); });
}, {threshold:.14});
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// ---------- Animated counters ----------
const counters = document.querySelectorAll('.count');
const cio = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const el = e.target;
      const target = +el.dataset.target;
      let cur = 0;
      const step = Math.max(1, Math.round(target/40));
      const iv = setInterval(() => {
        cur += step;
        if (cur >= target) { cur = target; clearInterval(iv); }
        el.textContent = cur;
      }, 30);
      cio.unobserve(el);
    }
  });
}, {threshold:.6});
counters.forEach(c => cio.observe(c));

// ---------- Particle canvas ----------
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');
let W, H, particles;
function resize(){
  W = canvas.width = canvas.offsetParent ? window.innerWidth : window.innerWidth;
  H = canvas.height = document.querySelector('.hero').offsetHeight;
  canvas.style.width = window.innerWidth + 'px';
  canvas.style.height = H + 'px';
}
function initParticles(){
  particles = Array.from({length: Math.min(70, Math.floor(window.innerWidth/22))}, () => ({
    x: Math.random()*W, y: Math.random()*H,
    r: Math.random()*1.6+.4,
    vx: (Math.random()-.5)*.25, vy: (Math.random()-.5)*.25,
    c: Math.random() > .5 ? '0,224,255' : '30,94,255'
  }));
}
function tick(){
  ctx.clearRect(0,0,W,H);
  particles.forEach(p => {
    p.x += p.vx; p.y += p.vy;
    if(p.x<0)p.x=W; if(p.x>W)p.x=0; if(p.y<0)p.y=H; if(p.y>H)p.y=0;
    ctx.beginPath();
    ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
    ctx.fillStyle = `rgba(${p.c},.7)`;
    ctx.fill();
  });
  requestAnimationFrame(tick);
}
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
resize(); initParticles();
if(!reduceMotion){ tick(); }
window.addEventListener('resize', () => { resize(); initParticles(); });

// ---------- Project showcase filter ----------
const showcaseData = {
  website: {title:'Websites', desc:'Business, portfolio and corporate websites built for speed, clarity and conversion.', tags:['Corporate site','Landing page','Portfolio']},
  app: {title:'Mobile Apps', desc:'Native-feeling mobile and web applications designed around real user workflows.', tags:['iOS/Android','Web App','Internal Tools']},
  ai: {title:'AI Systems', desc:'AI-powered assistants and tools that plug directly into a business\'s workflow.', tags:['Chat Assistant','AI Automation','Business Intelligence']},
  bot: {title:'Bots', desc:'WhatsApp and automation bots that handle real customer conversations at scale.', tags:['WhatsApp Bot','Support Bot','Workflow Bot']},
  ecommerce: {title:'E-Commerce', desc:'Digital storefronts built to sell, from catalogue to checkout.', tags:['Online Store','Payments','Inventory']},
  brand: {title:'Brand Design', desc:'Visual identity systems — logos, colour, type — built to carry a business everywhere it shows up.', tags:['Logo','Identity System','Graphics']}
};
const panel = document.getElementById('showcasePanel');
function renderShowcase(key){
  const d = showcaseData[key];
  panel.innerHTML = `<h4>${d.title}</h4><p>${d.desc}</p><div class="tags">${d.tags.map(t=>`<span>${t}</span>`).join('')}</div>`;
}
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    renderShowcase(btn.dataset.key);
  });
});
renderShowcase('website');

// ---------- Contact form (mailto, no backend) ----------
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('cf-name').value.trim();
    const email = document.getElementById('cf-email').value.trim();
    const subject = document.getElementById('cf-subject').value.trim() || 'New project inquiry — JOSVEXA';
    const message = document.getElementById('cf-message').value.trim();
    const body = `Name: ${name}\nEmail: ${email}\n\n${message}`;
    window.location.href = `mailto:josvexatechnology@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    const note = document.getElementById('formNote');
    note.textContent = 'Your email app should now be open with the message ready — hit send there to reach us.';
    note.style.color = 'var(--cyan)';
  });
}

// ---------- JOSVEXA AI — pre-written FAQ assistant (no external API) ----------
const aiFloatBtn = document.getElementById('aiFloatBtn');
const aiPanel = document.getElementById('aiPanel');
const aiCloseBtn = document.getElementById('aiCloseBtn');
const aiBody = document.getElementById('aiBody');
const aiInput = document.getElementById('aiInput');
const aiSendBtn = document.getElementById('aiSendBtn');
const aiChips = document.getElementById('aiChips');

aiFloatBtn.addEventListener('click', () => aiPanel.classList.toggle('open'));
aiCloseBtn.addEventListener('click', () => aiPanel.classList.remove('open'));

const aiKnowledge = [
  { keys:['service','services','offer','huduma','what do you do','what you do','mnafanya nini'],
    a:"JOSVEXA offers 9 services: Web Development, App Development, AI Solutions, Automation, Graphics & Branding, WhatsApp Solutions, E-Commerce, Cloud & Digital Systems, and Cybersecurity. Which one do you need help with?",
    sw:"JOSVEXA tunatoa huduma 9: Web Development, App Development, AI Solutions, Automation, Graphics & Branding, WhatsApp Solutions, E-Commerce, Cloud & Digital Systems, na Cybersecurity. Ni ipi unayohitaji?" },
  { keys:['website','web dev','web development','tovuti'],
    a:"We build modern, responsive, high-performance websites — from business sites to portfolios and landing pages. Want a quote for yours?",
    sw:"Tunajenga website za kisasa, zenye kasi na zinazofanya kazi vizuri kwenye simu na computer — biashara, portfolio au landing page. Unataka nikusaidie kuanzisha yako?" },
  { keys:['app','mobile','application','programu'],
    a:"We design and build mobile and web applications for modern users, from concept through to launch.",
    sw:"Tunatengeneza programu (app) za simu na web, kuanzia wazo hadi kukamilika na kuwekwa sokoni." },
  { keys:['artificial intelligence','ai solution',' ai ','ai,','ai.','ai?','automation ya ai'],
    a:"Our AI Solutions team builds intelligent AI-powered tools and assistants — like this one — tailored to your business needs.",
    sw:"Timu yetu ya AI inatengeneza AI assistants na tools kama hii unayotumia sasa, kulingana na mahitaji ya biashara yako." },
  { keys:['automation','automate','automatiki'],
    a:"We build smart automation systems that take repetitive manual tasks off your team's plate.",
    sw:"Tunatengeneza mifumo ya automation inayopunguza kazi za kurudia rudia kwa timu yako." },
  { keys:['graphic','branding','brand','logo','design'],
    a:"Our Graphics & Branding service covers professional visual identities — logos, colour systems and digital graphics.",
    sw:"Huduma ya Graphics & Branding inahusisha logo, rangi za brand na graphics za kidijitali za kitaalamu." },
  { keys:['ecommerce', 'e-commerce', 'store', 'shop', 'duka'],
    a:"Our E-Commerce service covers full digital stores — catalogue, payments and inventory — built for modern businesses.",
    sw:"Tunatengeneza maduka ya mtandaoni kamili — bidhaa, malipo na stock — kwa ajili ya biashara yako." },
  { keys:['cloud'],
    a:"We build scalable cloud and digital infrastructure so your systems can grow with your business.",
    sw:"Tunajenga mifumo ya cloud inayoweza kukua sambamba na biashara yako." },
  { keys:['security', 'cybersecurity', 'secure', 'usalama'],
    a:"Cybersecurity is built into how we work — security-focused solutions and best practices across every project.",
    sw:"Usalama wa kidijitali (cybersecurity) upo ndani ya kila project tunayofanya." },
  { keys:['contact', 'email', 'reach', 'phone', 'number', 'wasiliana'],
    a:"You can reach JOSVEXA by email at josvexatechnology@gmail.com or on WhatsApp at +255 772 991 908. There's also a message form in the Contact section below.",
    sw:"Unaweza kutuwasiliana kupitia email josvexatechnology@gmail.com au WhatsApp +255 772 991 908. Pia kuna fomu ya kutuma ujumbe kwenye sehemu ya Contact." },
  { keys:['location', 'where', 'based', 'address', 'country', 'wapi'],
    a:"JOSVEXA Technology is based in Tanzania 🇹🇿, building digital experiences for clients across Africa and worldwide.",
    sw:"JOSVEXA Technology tupo Tanzania 🇹🇿, tukihudumia wateja Afrika na dunia nzima." },
  { keys:['start', 'project', 'quote', 'price', 'cost', 'hire', 'begin', 'bei', 'gharama', 'anza'],
    a:"To start a project, tell me briefly what you need (e.g. a website, an app, AI system) and I'll point you to the right next step — or send us a message via WhatsApp / the Contact form and the team will follow up directly.",
    sw:"Kuanza project, niambie kwa ufupi unahitaji nini (mfano website, app, AI system) na nitakuelekeza hatua inayofuata — au tuma ujumbe kupitia WhatsApp au fomu ya Contact na timu itakujibu moja kwa moja." },
  { keys:['ceo', 'founder', 'leader', 'owner', 'kiongozi'],
    a:"JOSVEXA is led by its CEO, focused on innovation, creativity and building modern digital solutions — see the Leadership section on this page for more.",
    sw:"JOSVEXA inaongozwa na CEO wake, mwenye lengo la innovation na kutengeneza digital solutions za kisasa — angalia sehemu ya Leadership kwenye ukurasa huu." },
  { keys:['vision', 'mission', 'values', 'dira', 'dhamira'],
    a:"Our vision is building technology that creates opportunities. Our mission is turning ideas into useful digital solutions. Our values: Innovation, Creativity, Excellence, Growth.",
    sw:"Dira yetu ni kujenga technology inayotengeneza fursa. Dhamira yetu ni kugeuza mawazo kuwa digital solutions muhimu. Misingi yetu: Innovation, Creativity, Excellence, Growth." },
  { keys:['hi', 'hello', 'hey', 'mambo', 'habari', 'vipi', 'salaam'],
    a:"Hello! 👋 I'm the JOSVEXA AI. Ask me about our services, how to start a project, or how to reach the team.",
    sw:"Habari! 👋 Mimi ni JOSVEXA AI. Niulize kuhusu huduma zetu, jinsi ya kuanza project, au namna ya kuwasiliana na timu." },
  { keys:['thank', 'thanks', 'asante'],
    a:"You're welcome! Anything else you'd like to know about JOSVEXA?",
    sw:"Karibu sana! Kuna kitu kingine ungependa kujua kuhusu JOSVEXA?" }
];

function isSwahili(t){
  const swWords = ['habari','mambo','vipi','naomba','nataka','msaada','tafadhali','ninahitaji','ndio','hapana','asante','karibu','ni nini','ipi','wapi','bei','gharama','wasiliana','unafanya','mnafanya'];
  return swWords.some(w => t.includes(w));
}

function aiRespond(text){
  const t = text.toLowerCase();
  const sw = isSwahili(t);
  const hit = aiKnowledge.find(k => k.keys.some(key => t.includes(key)));
  if (hit) return sw && hit.sw ? hit.sw : hit.a;
  return sw
    ? "Naweza kukusaidia na maswali kuhusu huduma za JOSVEXA, project, na mawasiliano. Jaribu kuuliza kuhusu website, AI, WhatsApp solutions, au jinsi ya kuanza project — au tuma email josvexatechnology@gmail.com kwa kingine chochote."
    : "I can help with questions about JOSVEXA's services, projects and contact details. Try asking about web development, AI solutions, WhatsApp, or how to start a project — or email josvexatechnology@gmail.com for anything else.";
}

function addMsg(text, who){
  const div = document.createElement('div');
  div.className = `ai-msg ${who}`;
  div.textContent = text;
  aiBody.appendChild(div);
  aiBody.scrollTop = aiBody.scrollHeight;
}

function addTyping(){
  const div = document.createElement('div');
  div.className = 'ai-msg bot ai-typing';
  div.textContent = '···';
  aiBody.appendChild(div);
  aiBody.scrollTop = aiBody.scrollHeight;
  return div;
}

function handleUserMessage(text){
  if(!text.trim()) return;
  addMsg(text, 'user');
  aiInput.value = '';
  const typingEl = addTyping();
  setTimeout(() => {
    typingEl.remove();
    addMsg(aiRespond(text), 'bot');
  }, 450);
}

aiSendBtn.addEventListener('click', () => handleUserMessage(aiInput.value));
aiInput.addEventListener('keydown', (e) => { if(e.key === 'Enter') handleUserMessage(aiInput.value); });
aiChips.addEventListener('click', (e) => {
  const chip = e.target.closest('.ai-chip');
  if(!chip) return;
  const map = {services:'What services do you offer?', contact:'How can I contact you?', ai:'Tell me about AI solutions', start:'How do I start a project?'};
  handleUserMessage(map[chip.dataset.q] || chip.textContent);
});
