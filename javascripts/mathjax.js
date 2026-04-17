(() => {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return;
  }

  window.MathJax = {
    tex: {
      inlineMath: [['$', '$'], ['\\(', '\\)']],
      displayMath: [['$$', '$$'], ['\\[', '\\]']],
      processEscapes: true,
      processEnvironments: true,
    },
    options: {
      skipHtmlTags: ['script', 'noscript', 'style', 'textarea', 'pre', 'code'],
    },
    startup: {
      typeset: false,
    },
  };

  let scriptPromise;
  let queued = false;
  let typesetting = false;

  function loadMathJax() {
    if (window.MathJax?.typesetPromise) {
      return Promise.resolve(window.MathJax);
    }

    if (scriptPromise) {
      return scriptPromise;
    }

    scriptPromise = new Promise((resolve, reject) => {
      const existing = document.querySelector('script[data-mathjax]');
      if (existing) {
        existing.addEventListener('load', () => resolve(window.MathJax), { once: true });
        existing.addEventListener('error', reject, { once: true });
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://unpkg.zhihu.com/mathjax@3/es5/tex-mml-chtml.js';
      script.async = true;
      script.dataset.mathjax = 'true';
      script.addEventListener('load', () => resolve(window.MathJax), { once: true });
      script.addEventListener('error', reject, { once: true });
      document.head.appendChild(script);
    });

    return scriptPromise;
  }

  async function typesetMath() {
    const mathJax = window.MathJax;
    if (!mathJax?.typesetPromise) {
      return;
    }

    if (typesetting) {
      return;
    }

    typesetting = true;
    try {
      await mathJax.typesetPromise([document.body]);
    } catch (error) {
      console.error('MathJax typeset failed', error);
    } finally {
      typesetting = false;
    }
  }

  function queueTypeset() {
    if (queued) {
      return;
    }

    queued = true;
    window.requestAnimationFrame(async () => {
      queued = false;
      await loadMathJax();
      await typesetMath();
    });
  }

  const observer = new MutationObserver((mutations) => {
    if (typesetting) {
      return;
    }

    for (const mutation of mutations) {
      if (mutation.type === 'childList' && (mutation.addedNodes.length || mutation.removedNodes.length)) {
        queueTypeset();
        break;
      }
    }
  });

  function init() {
    queueTypeset();
    if (document.body) {
      observer.observe(document.body, { childList: true, subtree: true });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }

  window.addEventListener('popstate', queueTypeset);
  window.addEventListener('hashchange', queueTypeset);
})();
