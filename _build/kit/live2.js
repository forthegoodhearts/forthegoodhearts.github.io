const { chromium } = require('playwright');
const base = process.argv[2], paths = process.argv.slice(3);
(async () => { const b = await chromium.launch();
 for (const vp of [{n:'desk',w:1366,h:900},{n:'phone',w:390,h:844}]) {
  const p = await b.newPage({viewport:{width:vp.w,height:vp.h}}); const bad=[];
  p.on('response', r => { if (r.status()>=400 && r.url().startsWith(base)) bad.push(r.status()+' '+r.url()); });
  for (const u of paths) await p.goto(base+u,{waitUntil:'networkidle',timeout:90000});
  await p.goto(base+'search/?s=quran',{waitUntil:'networkidle',timeout:90000}); await p.waitForTimeout(1500);
  const hits = await p.$$eval('#results h3', e=>e.length);
  await p.goto(base,{waitUntil:'networkidle',timeout:90000});
  const robots = await p.$eval('meta[name=robots]', e=>e.content).catch(()=>'none');
  const tree = await p.$$eval('.dtree a', e=>e.length).catch(()=>0);
  await p.screenshot({path:`shots/live2-${vp.n}.png`});
  console.log(vp.n, 'search', hits, 'tree links', tree, 'robots', robots, 'errors', bad.length, bad.slice(0,3).join(' \n')); await p.close(); }
 await b.close(); })();
