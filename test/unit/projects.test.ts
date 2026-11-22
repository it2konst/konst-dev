import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { projectFileSchema, projectSchema } from '../../shared/schema/project'
import { STACK } from '../../shared/utils/stack'

// The same checks Nuxt Content runs at build time, plus the ones that span
// several fields or the file system, so a broken project file fails CI with
// a readable message.
const contentDir = fileURLToPath(new URL('../../content/projects/', import.meta.url))
const publicDir = fileURLToPath(new URL('../../public', import.meta.url))

const files = readdirSync(contentDir).filter((file) => file.endsWith('.json'))
const projects = files.map((file) => ({
  file,
  slug: file.replace(/\.json$/, ''),
  data: JSON.parse(readFileSync(`${contentDir}${file}`, 'utf8')) as unknown,
}))

function issues(data: unknown): string[] {
  const result = projectFileSchema.safeParse(data)
  return result.success ? [] : result.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`)
}

describe('project files', () => {
  it('exist', () => {
    expect(projects.length).toBeGreaterThan(0)
  })

  it.each(projects)('$file matches the schema', ({ data }) => {
    expect(issues(data)).toEqual([])
  })

  it.each(projects)('$file has a URL-safe file name', ({ slug }) => {
    expect(slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/)
  })

  it.each(projects)('$file keeps its cover in its own folder, and the file exists', (project) => {
    const { cover } = projectSchema.parse(project.data)
    if (!cover) return
    expect(cover.src.startsWith(`/projects/${project.slug}/`)).toBe(true)
    expect(existsSync(`${publicDir}${cover.src}`), cover.src).toBe(true)
  })

  it.each(projects)('$file uses no em or en dashes', ({ file }) => {
    expect(readFileSync(`${contentDir}${file}`, 'utf8')).not.toMatch(/[\u2013\u2014]/)
  })

  it('has unique names', () => {
    const names = projects.map((p) => projectSchema.parse(p.data).name)
    expect(new Set(names).size).toBe(names.length)
  })
})

describe('project schema', () => {
  const valid = {
    name: 'demo',
    date: '2026-05',
    status: 'live',
    featured: false,
    summary: { en: 'A demo.', ru: 'Демо.' },
    highlights: { en: ['One'], ru: ['Один'] },
    stack: ['vue'],
    links: { repo: 'https://github.com/it2konst/demo', demo: 'https://demo.example' },
    cover: { src: '/projects/demo/cover.webp', alt: { en: 'Screenshot', ru: 'Скриншот' } },
  }

  it('accepts a complete project', () => {
    expect(issues(valid)).toEqual([])
  })

  it('rejects a missing translation', () => {
    expect(issues({ ...valid, summary: { en: 'Only English' } })).not.toEqual([])
  })

  it('rejects highlight lists of different lengths', () => {
    expect(issues({ ...valid, highlights: { en: ['One', 'Two'], ru: ['Один'] } })).not.toEqual([])
  })

  it('rejects an unknown technology', () => {
    expect(issues({ ...valid, stack: ['vue', 'react-native'] })).not.toEqual([])
  })

  it('rejects a date that is not YYYY-MM', () => {
    expect(issues({ ...valid, date: '2026-13' })).not.toEqual([])
    expect(issues({ ...valid, date: '05.2026' })).not.toEqual([])
  })

  it('rejects a repository outside GitHub and plain http links', () => {
    expect(issues({ ...valid, links: { repo: 'https://gitlab.com/x/y' } })).not.toEqual([])
    expect(
      issues({ ...valid, links: { repo: valid.links.repo, demo: 'http://demo.example' } }),
    ).not.toEqual([])
  })

  it('needs a cover or a terminal snippet', () => {
    const { cover: _cover, ...withoutCover } = valid
    expect(issues(withoutCover)).not.toEqual([])
    expect(issues({ ...withoutCover, terminal: ['demo run'] })).toEqual([])
  })

  it('needs a demo link for a live project with a user interface', () => {
    expect(issues({ ...valid, links: { repo: valid.links.repo } })).not.toEqual([])
  })
})

describe('stack list', () => {
  it('has unique labels', () => {
    const labels = Object.values(STACK).map((item) => item.label)
    expect(new Set(labels).size).toBe(labels.length)
  })
})
