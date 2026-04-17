(() => {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return;
  }

  if (document.getElementById('umami-analytics')) {
    return;
  }

  const script = document.createElement('script');
  script.id = 'umami-analytics';
  script.defer = true;
  script.src = 'https://u.bangwu.top/script.js';
  script.dataset.websiteId = 'da0f0e9a-3d68-4e79-bd2d-2ed6e1e281ba';
  document.head.appendChild(script);
})();
