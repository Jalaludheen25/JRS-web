// Run from the repository root (E:/development/JRS): node jrs-website/scripts/build-inventory.mjs
// Builds docs/01-url-inventory.md from the crawl of the live WordPress site.
import fs from 'fs';
const inv = JSON.parse(fs.readFileSync('docs/source-content/live-site-inventory.json', 'utf8'));
const kw = {
 '/': 'marine spare parts supplier Abu Dhabi / UAE',
 '/about/': 'marine and power generation spare parts supplier Abu Dhabi',
 '/contact/': 'brand / contact',
 '/products/': 'replacement engine spare parts',
 '/engine-parts/': '—',
 '/industries/': '—',
 '/blogs/': '—',
 '/turbocharger-overhauls-in-abu-dhabi/': 'turbocharger overhauls in Abu Dhabi; marine turbocharger overhaul Abu Dhabi',
 '/cylinder-heads-components-in-abu-dhabi/': 'cylinder head and components in Abu Dhabi',
 '/liners-anti-polishing-rings-in-abu-dhabi/': 'liners anti polishing rings in Abu Dhabi',
 '/fuel-injection-systems-components-in-abu-dhabi/': 'fuel injection systems & components in Abu Dhabi',
 '/pistons-piston-rings-in-abu-dhabi/': 'pistons & piston rings in Abu Dhabi',
 '/engine-overhaul-service-in-abu-dhabi/': 'marine engine overhaul service Abu Dhabi',
 '/coolers-heat-exchangers-in-abu-dhabi/': 'coolers & heat exchangers in Abu Dhabi',
 '/ultrasonic-cleaning-for-parts-in-abu-dhabi/': 'ultrasonic cleaning for parts in Abu Dhabi',
 '/performance-tuning-optimization/': 'marine engine performance tuning Abu Dhabi',
 '/automatic-voltage-regulator-supplier-in-uae/': 'automatic voltage regulator supplier in UAE',
 '/power-generation/': 'power generation spare parts UAE',
 '/filters/': 'marine filters in Abu Dhabi',
 '/turbochargers-cartridges-in-abu-dhabi/': 'turbochargers & cartridges in Abu Dhabi; marine engine turbocharger Abu Dhabi; parts of turbocharger Abu Dhabi',
 '/outboard-engine-repair-overhaul-in-abu-dhabi/': 'outboard engine repair & overhaul in Abu Dhabi',
 '/routine-maintenance-diagnostics-in-abu-dhabi/': 'routine maintenance & diagnostics Abu Dhabi',
 '/boats-maintenance-and-services/': 'boats maintenance and services Abu Dhabi',
 '/marine-products-and-services/': 'top quality marine products and services in Abu Dhabi',
 '/cummins-engine-spare-parts/': 'Cummins engine spare parts (UAE, Saudi, Oman, GCC); Cummins engine spare parts in Oman',
 '/yanmar-marine-engine-spare-parts-supplier/': 'Yanmar marine engine spare parts supplier (GCC)',
 '/wartsila-marine-engine-spare-parts-supplier/': 'Wärtsilä marine engine spare parts supplier in UAE',
 '/engine-bearings-in-abu-dhabi/': 'marine engine bearings Abu Dhabi',
 '/diesel-fuel-injection-parts-in-abu-dhabi/': 'diesel fuel injection parts in Abu Dhabi',
 '/fuel-injector-spare-parts-and-repair-in-abu-dhabi/': 'fuel injector spare parts and repair Abu Dhabi',
 '/lorange-injectors-and-pumps-repair/': "L'Orange injectors and pumps repair",
 '/wartsila-engine-spare-parts-in-saudi-arabia/': 'Wärtsilä engine spare parts in Saudi Arabia',
 '/yanmar-marine-engine-spare-parts-supplier-in-uae/': 'Yanmar marine engine spare parts (supplier) in UAE',
 '/cummins-engine-spare-parts-for-marine-and-industrial/': 'Cummins engine spare parts marine & industrial',
 '/yanmar-marine-engine-spare-parts-for-marine-operations/': 'Yanmar marine engine spare parts in Oman / supplier',
 '/cummins-engine-spare-parts-in-uae/': 'Cummins engine spare parts in UAE',
 '/cummins-engine-spare-parts-supplier-saudi-arabia/': 'Cummins engine spare parts in Saudi (Arabia)',
 '/optimizing-engine-performance-with-yanmar-spare-parts-in-saudi-arabia/': 'Yanmar spare parts Saudi Arabia',
 '/cummins-spare-parts-in-kuwait/': 'Cummins spare parts supplier in Kuwait',
};
const action = {
 '/engine-parts/': ['301 → /products/', 'Empty page (no H1, ~0 body copy). Consolidate into the products hub.'],
 '/error/': ['301 → /', 'Junk post. Remove from index.'],
 '/error-page/': ['301 → /', 'Junk page. Remove from index.'],
 '/author/tklmarketing01gmail-com/': ['301 → /blogs/', 'Author archive exposes an email-derived slug.'],
 '/industries/': ['KEEP (rebuilt)', 'Currently empty; becomes the Industries hub.'],
 '/products/': ['KEEP (rebuilt)', 'Becomes the products hub.'],
};
const rows = inv.map(p => {
  const path = new URL(p.url).pathname;
  const [status, note] = action[path] || ['KEEP', ''];
  const newUrl = status.startsWith('301') ? status.replace('301 → ', '') : path;
  const esc = s => (s || '—').replace(/\|/g, '·').replace(/&amp;/g, '&').replace(/&#8217;/g, "'");
  const h1 = p.h1.length ? [...new Set(p.h1)].join(' / ') : '— (missing)';
  return { path, line: `| \`${path}\` | ${esc(p.title)} | ${esc(h1)} | ${esc(kw[path])} | ${p.desc ? 'yes' : '**missing**'} | ${status} | \`${newUrl}\` | ${note} |` };
});
const order = ['/', '/about/', '/products/', '/contact/'];
rows.sort((a, b) => (order.indexOf(a.path) + 1 || 99) - (order.indexOf(b.path) + 1 || 99) || a.path.localeCompare(b.path));
fs.writeFileSync('docs/_inventory-table.md',
 '| Old URL | Current title | Current H1 | Primary keyword intent | Meta desc. | Status | New URL | Notes |\n|---|---|---|---|---|---|---|---|\n' + rows.map(r => r.line).join('\n') + '\n');
console.log(rows.length, 'rows');
