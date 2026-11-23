import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'
import StackFilter from '~/components/project/StackFilter.vue'
import StackTags from '~/components/project/StackTags.vue'

const options = [
  { id: 'vue', label: 'Vue 3', count: 2 },
  { id: 'go', label: 'Go', count: 1 },
] as const

async function mountFilter(modelValue: 'vue' | 'go' | null) {
  return mountSuspended(StackFilter, {
    props: { options: [...options], total: 3, modelValue },
  })
}

describe('StackFilter', () => {
  it('lists "All" and every option with its count', async () => {
    const wrapper = await mountFilter(null)
    const buttons = wrapper.findAll('button').map((b) => b.text().replace(/\s+/g, ' '))
    expect(buttons).toEqual(['All 3', 'Vue 3 2', 'Go 1'])
  })

  it('marks the selected option as pressed', async () => {
    const wrapper = await mountFilter('go')
    const pressed = wrapper.findAll('button[aria-pressed="true"]')
    expect(pressed).toHaveLength(1)
    expect(pressed[0]!.text()).toContain('Go')
  })

  it('selects a technology', async () => {
    const wrapper = await mountFilter(null)
    await wrapper.findAll('button')[1]!.trigger('click')
    expect(wrapper.emitted('update:modelValue')).toEqual([['vue']])
  })

  it('clears the filter when the selected technology is pressed again', async () => {
    const wrapper = await mountFilter('vue')
    await wrapper.findAll('button')[1]!.trigger('click')
    expect(wrapper.emitted('update:modelValue')).toEqual([[null]])
  })

  it('clears the filter with "All"', async () => {
    const wrapper = await mountFilter('go')
    await wrapper.findAll('button')[0]!.trigger('click')
    expect(wrapper.emitted('update:modelValue')).toEqual([[null]])
  })

  it('is a labelled group', async () => {
    const wrapper = await mountFilter(null)
    const group = wrapper.find('[role="group"]')
    const label = wrapper.find(`#${group.attributes('aria-labelledby')}`)
    expect(label.text()).toBe('Filter by technology')
  })
})

describe('StackTags', () => {
  it('renders plain tags by default', async () => {
    const wrapper = await mountSuspended(StackTags, { props: { stack: ['vue', 'go'] } })
    expect(wrapper.findAll('a')).toHaveLength(0)
    expect(wrapper.text()).toContain('Vue 3')
  })

  it('links each tag to the filtered project list when linked', async () => {
    const wrapper = await mountSuspended(StackTags, {
      props: { stack: ['web-workers'], linked: true },
    })
    const link = wrapper.find('a')
    expect(link.attributes('href')).toBe('/projects?stack=web-workers')
    expect(link.attributes('aria-label')).toBe('Show projects with Web Workers')
  })
})
