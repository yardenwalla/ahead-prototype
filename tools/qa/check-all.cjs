// Dependency-free release checks. Run from the repo root with Node 20+.
const fs = require('node:fs'), path = require('node:path'), vm = require('node:vm');
const {spawnSync} = require('node:child_process');
process.chdir(path.resolve(__dirname,'../..'));
for(const name of fs.readdirSync('js').filter(x=>x.endsWith('.js')))
  new vm.Script(fs.readFileSync('js/'+name,'utf8'),{filename:name});
const html=fs.readFileSync('index.html','utf8');
for(const match of html.matchAll(/(?:src|href)="((?:js|css)\/[^"?]+)"/g))
  if(!fs.existsSync(match[1]))throw Error('Missing asset '+match[1]);
console.log('JavaScript syntax and local assets: passed');
for(const script of ['content-journeys.cjs','pronouns.cjs','beta-readiness.cjs','recommendation-quality.cjs','progression-followups.cjs','editorial-contracts.cjs','stage-rules.cjs']) {
  const run=spawnSync(process.execPath,[path.join(__dirname,script)],{stdio:'inherit'});
  if(run.status!==0)process.exit(run.status||1);
}
console.log('All automated app checks passed. Run python3 tools/qa/link-check.py for external links.');
