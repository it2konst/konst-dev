// Checks a built static site: every local file that a page refers to in
// src, srcset or href must exist in the output. Catches images that the
// build forgot to generate, which a static host would answer with 404.
//
// Usage: node scripts/check-assets.mjs [output dir]   (default: .output/public)
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { join, resolve } from 'node:path'

const root = resolve(process.argv[2] ?? '.output/public')

function* htmlFiles(dir) {
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry)
    if (statSync(path).isDirectory()) yield* htmlFiles(path)
    else if (entry.endsWith('.html')) yield path
  }
}

function decodeEntities(value) {
  return value.replaceAll('&amp;', '&').replaceAll('&#x2F;', '/')
}

/** Local URLs from src="", href="" and every candidate in srcset="". */
function localUrls(html) {
  const urls = []
  for (const [, attr, value] of html.matchAll(/\s(src|href|srcset)="([^"]*)"/g)) {
    const candidates =
      attr === 'srcset' ? value.split(',').map((c) => c.trim().split(/\s+/)[0]) : [value]
    for (const candidate of candidates) {
      const url = decodeEntities(candidate ?? '')
      if (url.startsWith('/') && !url.startsWith('//')) urls.push(url)
    }
  }
  return urls
}

/** A page link like /projects or /ru/ maps to a directory with index.html. */
function exists(url) {
  const path = decodeURI(url.split(/[?#]/)[0])
  const file = join(root, path)
  return (
    existsSync(file) ||
    existsSync(join(file, 'index.html')) ||
    existsSync(`${file.replace(/\/$/, '')}.html`)
  )
}

const missing = new Map()
let pages = 0
let checked = 0
for (const page of htmlFiles(root)) {
  pages++
  for (const url of localUrls(readFileSync(page, 'utf8'))) {
    checked++
    if (!exists(url)) {
      const from = page.slice(root.length)
      missing.set(url, [...(missing.get(url) ?? []), from])
    }
  }
}

if (missing.size) {
  console.error(`Missing files in ${root}:`)
  for (const [url, from] of missing) console.error(`  ${url}\n    used by ${from.join(', ')}`)
  process.exit(1)
}
console.log(`All ${checked} local links in ${pages} pages point to existing files.`)
