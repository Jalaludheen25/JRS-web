/*
 * Reveal safety net (inlined at the very top of <head>, plain ES5 so it runs in any browser).
 *
 * Scroll-reveal animations server-render their *starting* state (opacity 0, lines masked, images clipped).
 * If the site's JavaScript never runs — no JS, blocked scripts, in-app browsers, a failed chunk download, or
 * a browser too old for the bundle — those sections would stay invisible. So:
 *   - html.reveal is set here, before first paint. CSS only honours the hidden starting states while it is set.
 *     With JavaScript disabled this never runs, so everything is visible.
 *   - If a script fails to load or throws a syntax error, or the app has not started within 3.5 s of
 *     DOMContentLoaded, html.reveal-fallback is added and every [data-reveal] element is shown as final.
 *   - The app sets window.__jrsHydrated on mount (SmoothScroll), which cancels the fallback.
 * CSS: globals.css § Reveal safety net.
 */
export const REVEAL_GUARD = `(function(){var d=document.documentElement;d.className+=' reveal';
function fail(){if(!window.__jrsHydrated&&d.className.indexOf('reveal-fallback')<0){d.className+=' reveal-fallback';}}
window.addEventListener('error',function(e){var t=e&&e.target;if((t&&t.tagName==='SCRIPT')||(e&&/SyntaxError|Unexpected|Can't find variable|is not defined|is not a function/.test(String(e.message)))){fail();}},true);
document.addEventListener('DOMContentLoaded',function(){setTimeout(fail,3500);});})();`;
