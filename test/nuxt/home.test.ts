import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'
import PacketHeading from '~/components/home/PacketHeading.vue'
import ProjectTile from '~/components/project/ProjectTile.vue'
import type { Project } from '~/composables/useProjects'

describe('PacketHeading', () => {
  it('gives screen readers the plain sentence and hides the animated letters', async () => {
    const wrapper = await mountSuspended(PacketHeading, {
      props: { text: "Hi, I'm Konstantin.", id: 'hero-title' },
    })
    const heading = wrapper.find('h1#hero-title')
    expect(heading.find('.visually-hidden').text()).toBe("Hi, I'm Konstantin.")
    expect(heading.find('.packet-heading__visual').attributes('aria-hidden')).toBe('true')
  })

  it('renders one animated span per letter, each with its delay', async () => {
    const wrapper = await mountSuspended(PacketHeading, { props: { text: 'Hi you' } })
    const chars = wrapper.findAll('.packet-heading__char')
    expect(chars.map((c) => c.text()).join('')).toBe('Hiyou')
    for (const char of chars) {
      expect(char.attributes('style')).toMatch(/--delay: \d+ms/)
    }
  })

  it('keeps words together so lines break only between them', async () => {
    const wrapper = await mountSuspended(PacketHeading, { props: { text: 'Hi you' } })
    expect(wrapper.findAll('.packet-heading__word').map((w) => w.text())).toEqual(['Hi', 'you'])
  })
})

const project = {
  id: 'projects/projects/demo.json',
  stem: 'projects/demo',
  extension: 'json',
  meta: {},
  slug: 'demo',
  name: 'demo',
  date: '2026-11',
  status: 'in-progress',
  featured: true,
  summary: { en: 'An English summary.', ru: 'Русское описание.' },
  highlights: { en: ['One'], ru: ['Один'] },
  stack: ['vue'],
  links: { repo: 'https://github.com/it2konst/demo' },
  terminal: ['demo run'],
} as unknown as Project

describe('ProjectTile', () => {
  it('shows the name as an h3 link to the project page, the date line and the summary', async () => {
    const wrapper = await mountSuspended(ProjectTile, { props: { project } })
    const link = wrapper.find('h3 a')
    expect(link.text()).toBe('demo')
    expect(link.attributes('href')).toBe('/projects/demo')
    expect(wrapper.find('time').attributes('datetime')).toBe('2026-11')
    expect(wrapper.find('.project-meta__status').text()).toBe('In progress')
    expect(wrapper.text()).toContain('An English summary.')
  })

  it('links the picture too, hidden from the keyboard and screen readers', async () => {
    const wrapper = await mountSuspended(ProjectTile, { props: { project } })
    const media = wrapper.find('a.tile__media')
    expect(media.attributes('href')).toBe('/projects/demo')
    expect(media.attributes('tabindex')).toBe('-1')
    expect(media.attributes('aria-hidden')).toBe('true')
    expect(media.find('.terminal__line').text()).toBe('demo run')
  })
})

describe('ProjectTerminal', () => {
  it('keeps the command text intact while splitting it into unbreakable words', async () => {
    const { default: ProjectTerminal } = await import('~/components/project/ProjectTerminal.vue')
    const wrapper = await mountSuspended(ProjectTerminal, {
      props: { lines: ['game-tun run -c /etc/game-tun.json'], label: 'Commands' },
    })
    expect(wrapper.find('.terminal__line').text()).toBe('game-tun run -c /etc/game-tun.json')
    expect(wrapper.findAll('.terminal__token').map((t) => t.text())).toEqual([
      'game-tun',
      'run',
      '-c',
      '/etc/game-tun.json',
    ])
  })
})
