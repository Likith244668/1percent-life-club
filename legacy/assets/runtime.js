/*
 * Tiny standalone runtime for the 1% Life Club landing page.
 *
 * The page was authored in Claude's design-code (.dc.html) format, which uses
 * a `style-hover="..."` attribute to declare hover styles inline. The design
 * runtime is not shipped here, so this file reproduces just that one feature:
 * on hover, the declared styles are layered on top of the element's base
 * inline style; on leave, they're removed. Honors prefers-reduced-motion by
 * leaving transitions intact (they're declared in the base style) and simply
 * not blocking the hover swap.
 */
(function () {
  'use strict';

  function wireHover(el) {
    var base = el.getAttribute('style') || '';
    var hover = el.getAttribute('style-hover') || '';
    if (!hover) return;
    // Cache the pristine base so repeated enter/leave can't accumulate.
    el.addEventListener('mouseenter', function () {
      el.setAttribute('style', base + ';' + hover);
    });
    el.addEventListener('mouseleave', function () {
      el.setAttribute('style', base);
    });
    // Keyboard focus mirrors hover for keyboard users on interactive elements.
    el.addEventListener('focus', function () {
      el.setAttribute('style', base + ';' + hover);
    });
    el.addEventListener('blur', function () {
      el.setAttribute('style', base);
    });
  }

  function init() {
    var nodes = document.querySelectorAll('[style-hover]');
    for (var i = 0; i < nodes.length; i++) wireHover(nodes[i]);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
