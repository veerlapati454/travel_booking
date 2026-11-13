(() => {
const $ = (s, p = document) => p.querySelector(s);
const $$ = (s, p = document) => [...p.querySelectorAll(s)];
const money = n => '₹' + Math.round(n).toLocaleString('en-IN');
const WISH_KEY = 'voyago_wishlist', SEARCH_KEY = 'voyago_search';
const state = { dest:'', guests:2, rooms:1, maxPrice:30000, minRating:0, sort:'rec', wishOnly:false, nights:0, chip:'' };
let wishlist = [];
try { wishlist = JSON.parse(localStorage.getItem(WISH_KEY)) || []; } catch { wishlist = []; }
const saveWish = () => { try { localStorage.setItem(WISH_KEY, JSON.stringify(wishlist)); } catch {} };

/* Toast */
let tt; const toast = m => { const t = $('#toast'); t.textContent = m; t.classList.add('show'); clearTimeout(tt); tt = setTimeout(() => t.classList.remove('show'), 2400); };

/* Header, nav, progress */
const header = $('#header'), burger = $('#burger'), nav = $('#nav');
burger.addEventListener('click', () => { const o = nav.classList.toggle('open'); burger.setAttribute('aria-expanded', o); });
$$('a', nav).forEach(a => a.addEventListener('click', () => { nav.classList.remove('open'); burger.setAttribute('aria-expanded', false); }));
const sections = $$('main section[id]');
addEventListener('scroll', () => {
  const y = scrollY, h = document.documentElement.scrollHeight - innerHeight;
  header.classList.toggle('scrolled', y > 40);
  $('#progress').style.width = (y / h * 100) + '%';
  $('#toTop').classList.toggle('show', y > 600);
  const cur = sections.filter(s => s.offsetTop - 140 <= y).pop();
  $$('a', nav).forEach(a => a.classList.toggle('active', cur && a.hash === '#' + cur.id));
}, { passive:true });
$('#toTop').addEventListener('click', () => scrollTo({ top:0 }));
$('#year').textContent = new Date().getFullYear();

/* Hero rotating word */
const words = ['in Goa','in Manali','in Jaipur','in Kerala','in Bali','in Dubai']; let wi = 0;
setInterval(() => { const s = $('#swap'); wi = (wi + 1) % words.length; s.classList.remove('out'); void s.offsetWidth; s.textContent = words[wi]; s.classList.add('out'); }, 2600);

/* Stat counters */
const counters = $$('[data-count]');
const runCount = el => { const end = +el.dataset.count, dec = +el.dataset.dec || 0, t0 = performance.now();
  const f = t => { const p = Math.min((t - t0) / 1600, 1), e = 1 - Math.pow(1 - p, 3); el.textContent = (end * e).toLocaleString('en-IN', { minimumFractionDigits:dec, maximumFractionDigits:dec }) + (end > 100 ? '+' : ''); if (p < 1) requestAnimationFrame(f); };
  requestAnimationFrame(f); };
counters.forEach(c => { const io = new IntersectionObserver((es, o) => es.forEach(e => { if (e.isIntersecting) { runCount(c); o.disconnect(); } }), { threshold:.6 }); io.observe(c); });

/* Search form: dates */
const ci = $('#checkIn'), co = $('#checkOut'), msg = $('#searchMsg');
const iso = d => new Date(d.getTime() - d.getTimezoneOffset() * 6e4).toISOString().slice(0, 10);
const today = new Date(); ci.min = iso(today);
const setMsg = (el, t, ok) => { el.textContent = t; el.className = 'form-msg ' + (t ? (ok ? 'ok' : 'err') : ''); };
function validateDates(show = true) {
  if (!ci.value && !co.value) { state.nights = 0; return true; }
  if (!ci.value || !co.value) { show && setMsg(msg, 'Choose both check-in and check-out dates.'); return false; }
  if (ci.value < ci.min) { show && setMsg(msg, 'Check-in cannot be in the past.'); return false; }
  if (co.value <= ci.value) { show && setMsg(msg, 'Check-out must be after check-in.'); return false; }
  state.nights = Math.round((new Date(co.value) - new Date(ci.value)) / 864e5);
  if (state.nights > 30) { show && setMsg(msg, 'Stays are limited to 30 nights.'); return false; }
  return true;
}
ci.addEventListener('change', () => {
  if (ci.value) { const n = new Date(ci.value); n.setDate(n.getDate() + 1); co.min = iso(n); if (co.value && co.value <= ci.value) co.value = ''; }
  setMsg(msg, ''); if (validateDates(false)) renderHotels();
});
co.addEventListener('change', () => { setMsg(msg, ''); if (validateDates()) renderHotels(); });

/* Guests & rooms */
const gp = $('#guestPanel'), gt = $('#guestToggle');
const limits = { guests:[1, 12], rooms:[1, 6] };
function updGuests() {
  $('#vGuests').textContent = state.guests; $('#vRooms').textContent = state.rooms;
  $('#guestLabel').textContent = `${state.guests} Guest${state.guests > 1 ? 's' : ''} · ${state.rooms} Room${state.rooms > 1 ? 's' : ''}`;
}
gt.addEventListener('click', () => { const o = gp.classList.toggle('open'); gt.setAttribute('aria-expanded', o); });
document.addEventListener('click', e => { if (!e.target.closest('.guests')) { gp.classList.remove('open'); gt.setAttribute('aria-expanded', false); } });
$$('.step button').forEach(b => b.addEventListener('click', () => {
  const k = b.dataset.k, [mn, mx] = limits[k]; state[k] = Math.min(mx, Math.max(mn, state[k] + +b.dataset.d));
  if (state.rooms > state.guests) state.rooms = state.guests;           // each room needs a guest
  if (state.guests > state.rooms * 4) state.guests = state.rooms * 4;   // max 4 guests per room
  updGuests(); renderHotels();
}));

/* Destination data list + search */
$('#destList').innerHTML = destinations.map(d => `<option value="${d.name}">${d.country}</option>`).join('');
$('#destInput').addEventListener('input', e => { state.dest = ''; const v = e.target.value.trim().toLowerCase(); const m = destinations.find(d => d.name.toLowerCase() === v); if (m) { state.dest = m.id; syncDest(); renderHotels(); } else if (!v) { syncDest(); renderHotels(); } });
$('#searchForm').addEventListener('submit', e => {
  e.preventDefault();
  const v = $('#destInput').value.trim().toLowerCase();
  if (v) {
    const m = destinations.find(d => d.name.toLowerCase().includes(v) || d.country.toLowerCase().includes(v) || d.tag.toLowerCase().includes(v));
    if (!m) return setMsg(msg, 'No destination found. Try Goa, Manali, Jaipur, Kerala, Bali or Dubai.');
    state.dest = m.id; $('#destInput').value = m.name;
  } else state.dest = '';
  if (!validateDates()) return;
  setMsg(msg, state.nights ? `Showing stays for ${state.nights} night${state.nights > 1 ? 's' : ''}.` : 'Tip: add dates to see total price estimates.', true);
  try { localStorage.setItem(SEARCH_KEY, JSON.stringify({ dest:$('#destInput').value, ci:ci.value, co:co.value, guests:state.guests, rooms:state.rooms })); } catch {}
  syncDest(); renderHotels(); $('#hotels').scrollIntoView({ behavior:'smooth' });
});

/* Destination cards */
function renderDestinations() {
  $('#destGrid').innerHTML = destinations.map((d, i) => `
    <button class="dest" data-id="${d.id}" style="background:linear-gradient(145deg,${d.g[0]},${d.g[1]})" data-aos="fade-up" data-aos-delay="${i * 80}">
      <img class="bg" src="${imgUrl(d.photo, 700)}" alt="${d.name}, ${d.country}" loading="lazy" onerror="this.remove()">
      <span class="pill">${d.tag}</span><h3>${d.name}</h3><small>${d.country} · from ${money(d.from)}/night</small></button>`).join('');
  $$('.dest').forEach(c => c.addEventListener('click', () => {
    state.dest = state.dest === c.dataset.id ? '' : c.dataset.id;
    $('#destInput').value = state.dest ? destinations.find(d => d.id === state.dest).name : '';
    syncDest(); renderHotels(); if (state.dest) $('#hotels').scrollIntoView({ behavior:'smooth' });
  }));
}
function syncDest() {
  $$('.dest').forEach(c => c.classList.toggle('sel', c.dataset.id === state.dest));
  $('#chips').innerHTML = [`<button class="chip ${!state.dest ? 'on' : ''}" data-id="">All</button>`, ...destinations.map(d => `<button class="chip ${state.dest === d.id ? 'on' : ''}" data-id="${d.id}">${d.name}</button>`)].join('');
  $$('.chip').forEach(c => c.addEventListener('click', () => { state.dest = c.dataset.id; $('#destInput').value = state.dest ? destinations.find(d => d.id === state.dest).name : ''; syncDest(); renderHotels(); }));
}

/* Price estimation: nights x rooms x rate + 12% tax */
const estimate = h => { const n = state.nights || 1, sub = h.price * n * state.rooms; return { sub, tax:sub * .12, total:sub * 1.12 }; };

/* Hotels */
function filtered() {
  let l = hotels.filter(h => (!state.dest || h.dest === state.dest) && h.price <= state.maxPrice && h.rating >= state.minRating && (!state.wishOnly || wishlist.includes(h.id)));
  const s = { pl:(a, b) => a.price - b.price, ph:(a, b) => b.price - a.price, rt:(a, b) => b.rating - a.rating, nm:(a, b) => a.name.localeCompare(b.name) }[state.sort];
  return s ? l.sort(s) : l;
}
function renderHotels() {
  const list = filtered(), grid = $('#hotelGrid');
  grid.innerHTML = list.map((h, i) => { const e = estimate(h), d = destinations.find(x => x.id === h.dest), on = wishlist.includes(h.id);
    return `<article class="hotel" style="animation-delay:${i * 60}ms">
      <div class="h-img" style="background:linear-gradient(135deg,${h.g[0]},${h.g[1]})"><img src="${imgUrl(h.photo, 640)}" alt="${h.name}" loading="lazy" onerror="this.remove()">
        <button class="heart ${on ? 'on' : ''}" data-id="${h.id}" aria-label="${on ? 'Remove from' : 'Add to'} wishlist" aria-pressed="${on}"><svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M12 21s-7.500-4.600-9.600-9.200C.9 8.600 2.600 5 6 5c2 0 3.400 1.100 4 2.300h4C14.600 6.100 16 5 18 5c3.400 0 5.100 3.600 3.600 6.800C19.500 16.400 12 21 12 21z"/></svg></button>
        <div class="rate"><svg class="st" viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M12 2l3 6.500 7 .9-5.200 4.800 1.400 7L12 17.800 5.800 21.200l1.400-7L2 9.400l7-.9z"/></svg> ${h.rating.toFixed(1)} (${h.reviews})</div></div>
      <div class="h-body"><h3>${h.name}</h3><div class="loc">${d.name}, ${d.country}</div>
        <div class="tags">${h.amenities.map(a => `<span>${a}</span>`).join('')}</div>
        <div class="h-foot"><div class="price"><b>${money(h.price)}</b><small>per night</small>
          <small>${money(e.total)} total · ${state.nights || 1} night${(state.nights || 1) > 1 ? 's' : ''}, ${state.rooms} room${state.rooms > 1 ? 's' : ''} incl. tax</small></div>
          <button class="btn book" data-id="${h.id}">Book now</button></div></div></article>`; }).join('');
  $('#emptyState').hidden = list.length > 0;
  $('#resultInfo').textContent = `${list.length} stay${list.length !== 1 ? 's' : ''} found${state.dest ? ' in ' + destinations.find(d => d.id === state.dest).name : ''}${state.nights ? ` for ${state.nights} night${state.nights > 1 ? 's' : ''}` : ''}.`;
  $$('.heart', grid).forEach(b => b.addEventListener('click', () => toggleWish(+b.dataset.id)));
  $$('.book', grid).forEach(b => b.addEventListener('click', () => { const h = hotels.find(x => x.id === +b.dataset.id), e = estimate(h);
    toast(`${h.name}: ${money(e.sub)} + ${money(e.tax)} tax = ${money(e.total)}`); }));
}

/* Wishlist */
function updWish() { $('#wishCount').textContent = wishlist.length; const b = $('#wishNav'); b.classList.remove('bump'); void b.offsetWidth; b.classList.add('bump'); }
function toggleWish(id) {
  const i = wishlist.indexOf(id); i > -1 ? wishlist.splice(i, 1) : wishlist.push(id);
  saveWish(); updWish(); toast(i > -1 ? 'Removed from wishlist' : 'Saved to wishlist');
  if (state.wishOnly) renderHotels(); else { const b = $(`.heart[data-id="${id}"]`); if (b) { b.classList.toggle('on', i === -1); b.setAttribute('aria-pressed', i === -1); } }
}
$('#wishNav').addEventListener('click', () => { state.wishOnly = true; $('#wishOnly').checked = true; renderHotels(); $('#hotels').scrollIntoView({ behavior:'smooth' }); });

/* Filters */
$('#priceRange').addEventListener('input', e => { state.maxPrice = +e.target.value; $('#priceVal').textContent = money(state.maxPrice); renderHotels(); });
$('#ratingSel').addEventListener('change', e => { state.minRating = +e.target.value; renderHotels(); });
$('#sortSel').addEventListener('change', e => { state.sort = e.target.value; renderHotels(); });
$('#wishOnly').addEventListener('change', e => { state.wishOnly = e.target.checked; renderHotels(); });
$('#resetBtn').addEventListener('click', () => {
  Object.assign(state, { dest:'', maxPrice:30000, minRating:0, sort:'rec', wishOnly:false });
  $('#priceRange').value = 30000; $('#priceVal').textContent = money(30000); $('#ratingSel').value = 0; $('#sortSel').value = 'rec'; $('#wishOnly').checked = false; $('#destInput').value = '';
  syncDest(); renderHotels();
});

/* Offers + coupon copy */
$('#offerGrid').innerHTML = offers.map((o, i) => `<article class="offer" style="background-image:linear-gradient(135deg,${o.g[0]}e6,${o.g[1]}cc),url(${imgUrl(o.photo, 600)})" data-aos="zoom-in-up" data-aos-delay="${i * 100}">
  <span class="tag">${o.tag}</span><h3>${o.title}</h3><p>${o.desc}</p>
  <div class="coupon"><code>${o.code}</code><button class="copy-btn" data-code="${o.code}">Copy code</button></div></article>`).join('');
$$('.copy-btn').forEach(b => b.addEventListener('click', async () => {
  const code = b.dataset.code;
  try { await navigator.clipboard.writeText(code); }
  catch { const t = document.createElement('textarea'); t.value = code; document.body.appendChild(t); t.select(); document.execCommand('copy'); t.remove(); }
  b.textContent = 'Copied'; b.classList.add('done'); toast(`Coupon ${code} copied`);
  setTimeout(() => { b.textContent = 'Copy code'; b.classList.remove('done'); }, 2000);
}));

/* Testimonial slider */
let cur = 0, timer;
$('#slides').innerHTML = testimonials.map(t => `<div class="slide"><div class="avatar">${t.name[0]}</div><q>${t.text}</q><div class="stars" aria-label="${t.rating} out of 5">${'<svg class="st" viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M12 2l3 6.500 7 .9-5.200 4.800 1.400 7L12 17.800 5.800 21.200l1.400-7L2 9.400l7-.9z"/></svg>'.repeat(t.rating)}</div><b>${t.name}</b><br><small>${t.city}</small></div>`).join('');
$('#dots').innerHTML = testimonials.map((_, i) => `<button aria-label="Go to review ${i + 1}"></button>`).join('');
function go(i) { cur = (i + testimonials.length) % testimonials.length; $('#slides').style.transform = `translateX(-${cur * 100}%)`; $$('#dots button').forEach((d, k) => d.classList.toggle('on', k === cur)); }
const auto = () => { clearInterval(timer); timer = setInterval(() => go(cur + 1), 5000); };
$('#prev').addEventListener('click', () => { go(cur - 1); auto(); });
$('#next').addEventListener('click', () => { go(cur + 1); auto(); });
$$('#dots button').forEach((d, i) => d.addEventListener('click', () => { go(i); auto(); }));
let sx = 0; const sl = $('#slider');
sl.addEventListener('touchstart', e => sx = e.touches[0].clientX, { passive:true });
sl.addEventListener('touchend', e => { const dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 50) { go(cur + (dx < 0 ? 1 : -1)); auto(); } });
sl.addEventListener('mouseenter', () => clearInterval(timer)); sl.addEventListener('mouseleave', auto);
go(0); auto();

/* Newsletter validation */
$('#newsForm').addEventListener('submit', e => {
  e.preventDefault();
  const n = $('#newsName'), m = $('#newsEmail'), out = $('#newsMsg'); [n, m].forEach(i => i.classList.remove('bad'));
  const bad = (el, t) => { el.classList.add('bad'); setMsg(out, t); el.focus(); };
  if (n.value.trim().length < 2) return bad(n, 'Please enter your name (at least 2 characters).');
  if (!m.value.trim()) return bad(m, 'Please enter your email address.');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(m.value.trim())) return bad(m, 'That email looks incomplete. Try name@example.com.');
  setMsg(out, `Thanks ${n.value.trim().split(' ')[0]}! Check ${m.value.trim()} to confirm.`, true);
  toast('Subscribed successfully'); e.target.reset();
});

/* Init */
$('.hero').style.setProperty('--hero-img', `url(${imgUrl(HERO_PHOTO, 1600)})`);
try { const s = JSON.parse(localStorage.getItem(SEARCH_KEY)); if (s) { $('#destInput').value = s.dest || ''; state.guests = s.guests || 2; state.rooms = s.rooms || 1; const m = destinations.find(d => d.name === s.dest); if (m) state.dest = m.id;
  if (s.ci && s.ci >= ci.min) { ci.value = s.ci; const n = new Date(s.ci); n.setDate(n.getDate() + 1); co.min = iso(n); if (s.co && s.co > s.ci) co.value = s.co; } validateDates(false); } } catch {}
renderDestinations(); syncDest(); updGuests(); renderHotels(); $('#wishCount').textContent = wishlist.length;
if (window.AOS) AOS.init({ duration:900, once:true, offset:70, easing:'ease-out-cubic' });
else $$('[data-aos]').forEach(el => el.style.opacity = 1);
})();
