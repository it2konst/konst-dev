import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'
import ProjectCard from '~/components/project/ProjectCard.vue'
import type { Project } from '~/composables/useProjects'

const base = {
  id: 'projects/projects/demo.json',
  stem: 'projects/demo',
  extension: 'json',
  meta: {},
  slug: 'demo',
  name: 'demo',
  date: '2026-11',
  status: 'live',
  featured: false,
  summary: { en: 'An English summary.', ru: 'Русское описание.' },
  highlights: { en: ['One'], ru: ['Один'] },
  stack: ['vue', 'typescript'],
  links: { repo: 'https://github.com/it2konst/demo', demo: 'https://demo.example' },
  cover: { src: '/projects/demo/cover.webp', alt: { en: 'Screenshot', ru: 'Скриншот' } },
} as unknown as Project

describe('ProjectCard', () => {
  it('shows the summary, date, stack and both links', async () => {
    const wrapper = await mountSuspended(ProjectCard, { props: { project: base } })
    expect(wrapper.find('h2').text()).toBe('demo')
    expect(wrapper.text()).toContain('An English summary.')
    expect(wrapper.find('time').attributes('datetime')).toBe('2026-11')
    expect(wrapper.find('time').text()).toBe('November 2026')
    expect(wrapper.findAll('.stack-tags__item').map((tag) => tag.text())).toEqual([
      'Vue 3',
      'TypeScript',
    ])
    const links = wrapper.findAll('a').map((a) => a.attributes('href'))
    expect(links).toEqual(['https://demo.example', 'https://github.com/it2konst/demo'])
  })

  it('names the project in each link for screen readers', async () => {
    const wrapper = await mountSuspended(ProjectCard, { props: { project: base } })
    const links = wrapper.findAll('a')
    expect(links.map((a) => a.text())).toEqual(['Live demo', 'Source code'])
    // The accessible name starts with the visible text, as WCAG 2.5.3 asks
    expect(links.map((a) => a.attributes('aria-label'))).toEqual([
      'Live demo: demo',
      'Source code: demo',
    ])
  })

  it('uses the cover alt text and loads the image lazily', async () => {
    const wrapper = await mountSuspended(ProjectCard, { props: { project: base } })
    const img = wrapper.find('img')
    expect(img.attributes('alt')).toBe('Screenshot')
    expect(img.attributes('loading')).toBe('lazy')
  })

  it('shows a terminal instead of a cover, a status label, and no demo link', async () => {
    const project = {
      ...base,
      status: 'in-progress',
      cover: undefined,
      terminal: ['demo run'],
      links: { repo: base.links.repo },
    } as unknown as Project
    const wrapper = await mountSuspended(ProjectCard, { props: { project } })
    expect(wrapper.find('img').exists()).toBe(false)
    expect(wrapper.find('.terminal__line').text()).toBe('demo run')
    expect(wrapper.find('.project__status').text()).toBe('In progress')
    expect(wrapper.findAll('a')).toHaveLength(1)
  })

  it('can render its title as h3 inside another section', async () => {
    const wrapper = await mountSuspended(ProjectCard, { props: { project: base, headingLevel: 3 } })
    expect(wrapper.find('h3').exists()).toBe(true)
  })
})
