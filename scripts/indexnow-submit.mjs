// Submit every sitemap URL to IndexNow (Bing, Yandex, Seznam and Naver share the
// endpoint; Google does not participate). Batched at 10k URLs per POST, the
// protocol maximum. Safe to re-run after any content change.
//
// The key is the 32-hex file in public/ whose content equals its own name; it
// was generated 2026-09-02 and must stay served at https://www.farmersmarkets.io/<key>.txt
import { readdirSync, readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const HOST = 'www.farmersmarkets.io'
const PUBLIC = join(dirname(fileURLToPath(import.meta.url)), '..', 'public')
const keyFile = readdirSync(PUBLIC).find((f) => /^[0-9a-f]{32}[.]txt$/.test(f) && readFileSync(join(PUBLIC, f), 'utf8').trim() === f.slice(0, 32))
if (!keyFile) { console.error('no IndexNow key file in public/'); process.exit(1) }
const KEY = keyFile.slice(0, 32)

const live = await fetch(`https://${HOST}/${KEY}.txt`)
if (live.status !== 200 || (await live.text()).trim() !== KEY) { console.error(`key file is not live yet at https://${HOST}/${KEY}.txt (HTTP ${live.status}); deploy first`); process.exit(1) }

const xml = await (await fetch(`https://${HOST}/sitemap.xml`)).text()
const urls = [...xml.matchAll(/<loc>([^<]+)<[/]loc>/g)].map((m) => m[1])
console.log(`sitemap URLs: ${urls.length}`)

for (let i = 0; i < urls.length; i += 10000) {
  const batch = urls.slice(i, i + 10000)
  const res = await fetch('https://api.indexnow.org/indexnow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({ host: HOST, key: KEY, keyLocation: `https://${HOST}/${KEY}.txt`, urlList: batch }),
  })
  console.log(`batch ${i / 10000 + 1}: ${batch.length} URLs -> HTTP ${res.status}`)
  await new Promise((r) => setTimeout(r, 2000))
}
console.log('DONE')
