import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { flushPromises } from '@vue/test-utils'
import { mount } from '@vue/test-utils'
import NextRaces from '../NextRaces.vue'
import { getNextRaces } from '@/api/races'
import type { RaceSummary } from '@/api/types'

// Mock the getNextRaces function
vi.mock('@/api/races', () => ({
  getNextRaces: vi.fn()
}))

describe('NextRaces', () => {
  const mockRaces: RaceSummary[] = [
    {
      race_id: '1',
      meeting_name: 'Launceston',
      race_number: 8,
      advertised_start: { seconds: 1700000006 },
      category_id: '1',
      race_comment: 'Sample race comment',
      race_comment_alternative: 'Sample alternative race comment',
      additional_data: '{}',
      generated: 1,
      silk_base_url: 'http://example.com'
    },
    {
      race_id: '2',
      meeting_name: 'Hobart',
      race_number: 5,
      advertised_start: { seconds: 1700000600 },
      category_id: '2',
      race_comment: 'Sample race comment 2',
      race_comment_alternative: 'Sample alternative race comment 2',
      additional_data: '{}',
      generated: 1,
      silk_base_url: 'http://example.com'
    }
  ]
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
    vi.resetAllMocks()
  })

  it('renders race details correctly', async () => {
    ;(getNextRaces as vi.Mock).mockResolvedValue(mockRaces)

    const wrapper = mount(NextRaces, {
      props: { selectedCategory: 'all' }
    })

    await flushPromises()
    expect(getNextRaces as vi.Mock).toHaveBeenCalledTimes(1)
    expect(getNextRaces as vi.Mock).toHaveBeenCalledWith('all')
    expect(wrapper.findAllComponents({ name: 'RaceDetail' })).toHaveLength(2)
  })

  it('handles errors correctly', async () => {
    ;(getNextRaces as vi.Mock).mockRejectedValue(new Error('API error'))

    const wrapper = mount(NextRaces, {
      props: { selectedCategory: 'all' }
    })

    await flushPromises()

    expect(wrapper.text()).toContain('Error: API error')
  })

  it('updates race list when selectedCategory prop changes', async () => {
    ;(getNextRaces as vi.Mock).mockResolvedValue(mockRaces)

    const wrapper = mount(NextRaces, {
      props: { selectedCategory: 'all' }
    })

    await flushPromises()

    expect(wrapper.findAllComponents({ name: 'RaceDetail' })).toHaveLength(2)
    expect(getNextRaces as vi.Mock).toHaveBeenCalledTimes(1)
    expect(getNextRaces as vi.Mock).toHaveBeenCalledWith('all')

    ;(getNextRaces as vi.Mock).mockResolvedValue([mockRaces[0]])
    await wrapper.setProps({ selectedCategory: '1' })
    await flushPromises()

    expect(wrapper.findAllComponents({ name: 'RaceDetail' })).toHaveLength(1)
    expect(getNextRaces as vi.Mock).toHaveBeenCalledTimes(2)
    expect(getNextRaces as vi.Mock).toHaveBeenCalledWith('1')
  })

  it('updates race list when the earliest race started 1 minute ago', async () => {
    ;(getNextRaces as vi.Mock).mockResolvedValue(mockRaces)
    nowSpy.mockImplementation(() => 1700000060000)

    const wrapper = mount(NextRaces, {
      props: { selectedCategory: 'all' }
    })

    await flushPromises()

    expect(wrapper.findAllComponents({ name: 'RaceDetail' })).toHaveLength(2)
    expect(getNextRaces as vi.Mock).toHaveBeenCalledTimes(1)

    ;(getNextRaces as vi.Mock).mockResolvedValue([mockRaces[1]])

    nowSpy.mockImplementation(() => 1700000067000)
    intervalSpy.mock.calls[0][0]()

    await flushPromises()

    expect(wrapper.findAllComponents({ name: 'RaceDetail' })).toHaveLength(1)
    expect(getNextRaces as vi.Mock).toHaveBeenCalledTimes(2)
  })
})
