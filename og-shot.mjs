import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1200, height: 630 } });
await p.goto('file:///tmp/og.html');
await p.waitForTimeout(1200); // font load
await p.screenshot({ path: 'public/og-default.png' });
await b.close();
console.log('og-default.png written');
