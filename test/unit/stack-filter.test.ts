import { describe, expect, it } from 'vitest'
import { filterByStack, parseStackQuery, stackOptions } from '../../shared/utils/stackFilter'
import type { StackId } from '../../shared/utils/stack'

const projects: { name: string; stack: StackId[] }[] = [
  { name: 'a', stack: ['vue', 'typescript', 'pwa'] },
  { name: 'b', stack: ['vue', 'typescript', 'svgo'] },
  { name: 'c', stack: ['go', 'udp'] },
]

describe('stackOptions', () => {
  it('counts projects per technology, most used first, then by name', () => {
    expect(stackOptions(projects).map(({ id, count }) => `${id}:${count}`)).toEqual([
      'typescript:2',
      'vue:2',
      'go:1',
      'pwa:1',
      'svgo:1',
      'udp:1',
    ])
  })

  it('uses display labels', () => {
    expect(stackOptions(projects).find((o) => o.id === 'vue')?.label).toBe('Vue 3')
  })

  it('counts a technology listed twice in one project once', () => {
    expect(stackOptions([{ stack: ['vue', 'vue'] }])).toEqual([
      { id: 'vue', label: 'Vue 3', count: 1 },
    ])
  })

  it('returns nothing for no projects', () => {
    expect(stackOptions([])).toEqual([])
  })
})

describe('filterByStack', () => {
  it('keeps only projects with the technology, in their order', () => {
    expect(filterByStack(projects, 'vue').map((p) => p.name)).toEqual(['a', 'b'])
  })

  it('returns every project when nothing is selected', () => {
    expect(filterByStack(projects, null)).toBe(projects)
  })

  it('returns nothing for a technology no project uses', () => {
    expect(filterByStack(projects, 'nuxt')).toEqual([])
  })
})

describe('parseStackQuery', () => {
  it('accepts a known technology', () => {
    expect(parseStackQuery('web-workers')).toBe('web-workers')
  })

  it.each([
    ['an unknown id', 'react'],
    ['an empty value', ''],
    ['a repeated parameter', ['vue', 'go']],
    ['no parameter', undefined],
    ['an inherited object key', 'toString'],
  ])('ignores %s', (_, value) => {
    expect(parseStackQuery(value)).toBeNull()
  })
})
