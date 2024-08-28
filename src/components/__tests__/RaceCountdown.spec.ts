import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import RaceCountdown from '../RaceCountdown.vue'

describe('RaceCountdown', () => {
  let nowSpy: vi.SpyInstance
  let intervalSpy: vi.SpyInstance
  let clearIntervalSpy: vi.SpyInstance

  beforeEach(() => {
    nowSpy = vi.spyOn(Date, 'now').mockImplementation(() => 1700000000000)
    intervalSpy = vi.spyOn(global, 'setInterval')
    clearIntervalSpy = vi.spyOn(global, 'clearInterval')
  })

  afterEach(() => {
    nowSpy.mockRestore()
    intervalSpy.mockRestore()
    clearIntervalSpy.mockRestore()
  })

  it('renders the initial countdown correctly', async () => {
    const wrapper = mount(RaceCountdown, {
      props: { startTime: 1700000063 }
    })

    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toBe('1m 3s')
  })

  it('updates the countdown correctly', async () => {
    const wrapper = mount(RaceCountdown, {
      props: { startTime: 1700000063 }
    })

    nowSpy.mockImplementation(() => 1700000000000)
    intervalSpy.mock.calls[0][0]()
    await wrapper.vm.$nextTick()
    expect(wrapper.text()).toBe('1m 3s')

    nowSpy.mockImplementation(() => 1700000001000)
    intervalSpy.mock.calls[0][0]()
    await wrapper.vm.$nextTick()
    expect(wrapper.text()).toBe('1m 2s')
  })

  it('stops the countdown when time reaches zero', async () => {
    const wrapper = mount(RaceCountdown, {
      props: { startTime: 1700000001 }
    })

    nowSpy.mockImplementation(() => 1700000000000)
    intervalSpy.mock.calls[0][0]()
    await wrapper.vm.$nextTick()
    expect(wrapper.text()).toBe('1s')

    nowSpy.mockImplementation(() => 1700000001000)
    intervalSpy.mock.calls[0][0]()
    await wrapper.vm.$nextTick()
    expect(wrapper.text()).toBe('NOW')
  })
})
