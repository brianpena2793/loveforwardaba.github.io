/* Optional Google Analytics loads only after an explicit, unexpired choice. */
(() => {
  'use strict';
  const key = 'lfaba-analytics-consent-v1';
  const tag = 'G-2XF2CKHJZ8';
  const lifetime = 180 * 24 * 60 * 60 * 1000;
  const excluded = /\/(?:contact|privacy|hipaa)\.html\/?$/.test(location.pathname);
  const spanish = document.documentElement.lang === 'es';
  let loaded = false;
  let returnFocus = null;
  let observer;
  const text = spanish ? {
    title: 'Su privacidad importa',
    description: 'Con su permiso, usamos Google Analytics para entender el uso del sitio. Puede aceptar o rechazar los análisis opcionales y cambiar su decisión en Configuración de cookies. El idioma elegido se guarda por separado.',
    accept: 'Aceptar análisis', reject: 'Rechazar análisis', policy: 'Política de privacidad',
    accepted: 'Análisis aceptados.', rejected: 'Análisis rechazados.',
  } : {
    title: 'Your privacy matters',
    description: 'With your permission, we use Google Analytics to understand website use. Accept or reject optional analytics and change your choice anytime in Cookie settings. Your language preference is saved separately.',
    accept: 'Accept analytics', reject: 'Reject analytics', policy: 'Privacy policy',
    accepted: 'Analytics accepted.', rejected: 'Analytics rejected.',
  };
  function readChoice() {
    try {
      const value = JSON.parse(localStorage.getItem(key));
      if (value && ['accepted', 'rejected'].includes(value.choice) && Number.isFinite(value.time)
        && value.time <= Date.now() && Date.now() - value.time < lifetime) return value.choice;
    } catch (_) {}
    return null;
  }
  function clearCookies() {
    const names = document.cookie.split(';').map(item => item.trim().split('=')[0])
      .filter(name => /^(_ga(?:_|$)|_gid$|_gat(?:_|$)|_gac_)/.test(name));
    const labels = location.hostname.split('.');
    const domains = [''];
    for (let i = 0; i < labels.length - 1; i++) {
      domains.push(labels.slice(i).join('.'), '.' + labels.slice(i).join('.'));
    }
    const parts = location.pathname.split('/').filter(Boolean);
    const paths = new Set(['/']);
    for (let i = 1; i < parts.length; i++) paths.add('/' + parts.slice(0, i).join('/'));
    names.forEach(name => domains.forEach(domain => paths.forEach(path => {
      document.cookie = name + '=; Max-Age=0; Path=' + path + (domain ? '; Domain=' + domain : '') + '; SameSite=Lax';
      if (path !== '/') document.cookie = name + '=; Max-Age=0; Path=' + path + '/' + (domain ? '; Domain=' + domain : '') + '; SameSite=Lax';
    })));
  }
  function startAnalytics() {
    if (loaded || excluded) return;
    loaded = true;
    window['ga-disable-' + tag] = false;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', tag, { allow_google_signals: false, allow_ad_personalization_signals: false });
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + tag;
    document.head.appendChild(script);
  }
  window['ga-disable-' + tag] = true;
  let choice = readChoice();
  if (choice === 'accepted') startAnalytics();
  else clearCookies();

  const banner = document.createElement('section');
  banner.className = 'analytics-banner';
  banner.hidden = true;
  banner.setAttribute('aria-labelledby', 'analytics-consent-title');
  banner.innerHTML = '<div class="analytics-banner-inner"><div class="analytics-banner-copy"><h2 id="analytics-consent-title"></h2><p id="analytics-consent-description"></p><a class="analytics-policy"></a></div><div class="analytics-banner-actions"><button type="button" data-analytics="accept"></button><button type="button" data-analytics="reject"></button></div></div>';
  banner.querySelector('h2').textContent = text.title;
  banner.querySelector('p').textContent = text.description;
  const policy = banner.querySelector('a');
  policy.textContent = text.policy;
  policy.href = spanish ? 'es/privacy.html' : 'privacy.html';
  const accept = banner.querySelector('[data-analytics="accept"]');
  const reject = banner.querySelector('[data-analytics="reject"]');
  accept.textContent = text.accept;
  reject.textContent = text.reject;
  document.body.appendChild(banner);
  const status = document.createElement('p');
  status.className = 'analytics-status';
  status.setAttribute('role', 'status');
  document.body.appendChild(status);
  const originalPadding = document.body.style.paddingBottom;
  function reserveSpace() {
    document.body.style.paddingBottom = banner.hidden ? originalPadding : banner.getBoundingClientRect().height + 'px';
  }
  function show(fromSettings) {
    banner.hidden = false;
    reserveSpace();
    if (fromSettings) accept.focus();
  }
  function hide() {
    banner.hidden = true;
    reserveSpace();
    if (returnFocus) { returnFocus.focus(); returnFocus = null; }
  }
  function save(value) {
    choice = value;
    try { localStorage.setItem(key, JSON.stringify({ choice: value, time: Date.now() })); } catch (_) {}
    hide();
    status.textContent = value === 'accepted' ? text.accepted : text.rejected;
    if (value === 'accepted') startAnalytics();
    else {
      window['ga-disable-' + tag] = true;
      clearCookies();
      // Unload an already accepted tag immediately when consent is withdrawn.
      if (loaded) location.reload();
    }
  }
  accept.addEventListener('click', () => save('accepted'));
  reject.addEventListener('click', () => save('rejected'));
  document.querySelectorAll('[data-cookie-settings]').forEach(button => button.addEventListener('click', () => {
    returnFocus = button;
    show(true);
  }));
  window.addEventListener('resize', reserveSpace);
  if ('ResizeObserver' in window) {
    observer = new ResizeObserver(reserveSpace);
    observer.observe(banner);
  }
  window.addEventListener('storage', event => {
    if (event.key !== key && event.key !== null) return;
    choice = readChoice();
    if (choice !== 'accepted') {
      window['ga-disable-' + tag] = true;
      clearCookies();
      if (loaded) { location.reload(); return; }
    } else startAnalytics();
    if (choice) hide(); else show(false);
  });
  if (!choice) show(false);
})();
