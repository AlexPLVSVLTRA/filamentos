import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import fs from 'fs';
const [,, mode, ...rest] = process.argv;
const browser = await chromium.launch({ args: ['--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist','--enable-webgl'] });
const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
page.on('console', m => console.log('console:', m.text()));
page.on('pageerror', e => console.log('pageerror:', e.message));
await page.goto('http://localhost:8123/promo.html');
await page.waitForFunction(() => window.ready === true, null, { timeout: 120000 });
const N = await page.evaluate(() => window.N);
const frames = mode === 'all' ? [...Array(N).keys()] : rest.map(Number);
const out = mode === 'all' ? 'frames' : 'preview';
fs.mkdirSync(out, { recursive: true });
const t0 = Date.now();
for (const f of frames) {
  await page.evaluate(f => window.renderAt(f), f);
  await page.screenshot({ path: `${out}/${String(f).padStart(4,'0')}.jpg`, type: 'jpeg', quality: 93 });
  if (f % 30 === 0) console.log('frame', f, ((Date.now()-t0)/1000).toFixed(1)+'s');
}
await browser.close();
