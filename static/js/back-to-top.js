(function() {
  'use strict';

  // Build the button
  var btn = document.createElement('button');
  btn.className = 'back-to-top';
  btn.setAttribute('aria-label', 'Back to top');
  btn.setAttribute('type', 'button');
  btn.innerHTML = '&gt; top';
  document.body.appendChild(btn);

  // Show/hide based on scroll position (more than one viewport down)
  var ticking = false;
  function updateVisibility() {
    if (window.scrollY > window.innerHeight) {
      btn.classList.add('is-visible');
    } else {
      btn.classList.remove('is-visible');
    }
    ticking = false;
  }

  window.addEventListener('scroll', function() {
    if (!ticking) {
      window.requestAnimationFrame(updateVisibility);
      ticking = true;
    }
  }, { passive: true });

  // Initial check (in case the page loads already scrolled — anchor links, restored scroll position)
  updateVisibility();

  // Click handler: swift, accelerating scroll back to top
  btn.addEventListener('click', function() {
    // Respect users who've asked the OS to reduce motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      window.scrollTo(0, 0);
      return;
    }

    var startY = window.scrollY;
    // Distance-aware duration — keeps short pages snappy and long pages from feeling rushed
    var duration = Math.min(600, Math.max(300, startY * 0.2));
    var startTime = performance.now();

    function step(now) {
      var elapsed = now - startTime;
      var progress = Math.min(elapsed / duration, 1);
      // Quadratic ease-in: starts gentle, accelerates into landing
      var eased = progress * progress;
      window.scrollTo(0, startY * (1 - eased));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    }

    window.requestAnimationFrame(step);
  });
})();
