import { mountSuspended } from '@nuxt/test-utils/runtime'
import { beforeEach, describe, expect, it } from 'vitest'
import ThemeSwitch from '~/components/ui/ThemeSwitch.vue'
import LocaleSwitch from '~/components/ui/LocaleSwitch.vue'

describe('ThemeSwitch', () => {
  beforeEach(() => {
    useColorMode().preference = 'system'
  })

  it('marks exactly one option as pressed', async () => {
    const wrapper = await mountSuspended(ThemeSwitch)
    const pressed = wrapper.findAll('button[aria-pressed="true"]')
    expect(pressed).toHaveLength(1)
    expect(pressed[0]!.text()).toBe('System')
  })

  it('sets the chosen theme', async () => {
    const wrapper = await mountSuspended(ThemeSwitch)
    await wrapper.find('button[title="Dark"]').trigger('click')
    expect(useColorMode().preference).toBe('dark')
    expect(wrapper.find('button[title="Dark"]').attributes('aria-pressed')).toBe('true')
  })
})

describe('LocaleSwitch', () => {
  it('links to the same page in Russian', async () => {
    const wrapper = await mountSuspended(LocaleSwitch, { route: '/projects' })
    const link = wrapper.find('a')
    expect(link.attributes('href')).toBe('/ru/projects')
    expect(link.attributes('hreflang')).toBe('ru-RU')
    expect(link.text()).toBe('RU')
  })
})
