(() => {
  const $ = s => document.querySelector(s);
  // Twinkling stars + shooting stars
  const sky = $('#sky');
  for (let i = 0; i < 90; i++) {
    const s = document.createElement('i'); s.className = 'star';
    s.style.cssText = `left:${Math.random()*100}%;top:${Math.random()*100}%;--d:${2+Math.random()*4}s;--l:${-Math.random()*5}s;` +
      (Math.random() > .85 ? 'width:5px;height:5px;' : '');
    sky.appendChild(s);
  }
  for (let i = 0; i < 3; i++) {
    const s = document.createElement('i'); s.className = 'shoot';
    s.style.cssText = `left:${55+Math.random()*40}%;top:${Math.random()*40}%;animation-delay:${i*2.3}s;animation-duration:${6+i*2}s`;
    sky.appendChild(s);
  }

  // Typewriter with rotating messages
  const lines = [
    'The page you’re looking for took an unplanned detour.',
    'Our compass is spinning, but this destination doesn’t exist.',
    'Let’s get you back to somewhere beautiful.'
  ];
  const out = $('#typed'); let li = 0, ci = 0, del = false;
  (function tick() {
    const t = lines[li];
    out.textContent = t.slice(0, ci);
    let wait = del ? 28 : 55;
    if (!del && ci === t.length) { wait = 2200; del = true; }
    else if (del && ci === 0) { del = false; li = (li + 1) % lines.length; wait = 400; }
    else ci += del ? -1 : 1;
    setTimeout(tick, wait);
  })();

  // Mouse / touch parallax
  const stage = $('#stage');
  addEventListener('pointermove', e => {
    const x = (e.clientX / innerWidth - .5) * 20, y = (e.clientY / innerHeight - .5) * 20;
    stage.style.transform = `translate(${x}px,${y}px)`;
  });

  // Back button: go to previous page, fall back to home
  $('#backBtn').addEventListener('click', () => {
    const sameSite = document.referrer && new URL(document.referrer).origin === location.origin;
    if (history.length > 1 && sameSite) history.back();
    else if (history.length > 1 && !document.referrer) history.back();
    else {
      const t = $('#toast'); t.textContent = 'No previous page, taking you home…'; t.classList.add('show');
      setTimeout(() => location.href = 'index.html', 1100);
    }
  });
})();