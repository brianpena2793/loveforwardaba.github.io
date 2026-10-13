/* Keep explicit language links shareable; storage is optional. */
(() => {
  const url = new URL(window.location.href);
  const spanish = /\/es\//.test(url.pathname);
  const requested = url.searchParams.get('lang');
  let saved;
  try { saved = localStorage.getItem('lfaba-language'); } catch (_) {}
  const language = requested === 'en' || requested === 'es'
    ? requested : (spanish ? 'es' : saved);
  if (language !== 'en' && language !== 'es') return;
  try { localStorage.setItem('lfaba-language', language); } catch (_) {}
  if ((language === 'es') !== spanish) {
    const name = url.pathname.split('/').pop() || 'index.html';
    const base = spanish ? url.pathname.replace(/es\/[^/]*$/, '') : url.pathname.replace(/[^/]*$/, '');
    url.pathname = base + (language === 'es' ? 'es/' : '') + name;
    window.location.replace(url.href);
  }
})();
