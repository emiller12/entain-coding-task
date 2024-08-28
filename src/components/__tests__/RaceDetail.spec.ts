import { describe, it, vi, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import RaceDetail from '../RaceDetail.vue'
import RaceCountdown from '../RaceCountdown.vue'
import type { RaceSummary } from '@/api/types'

// Mock the RaceCountdown component
vi.mock('../RaceCountdown.vue', () => ({
  default: {
    name: 'RaceCountdown',
    template: '<div></div>',
    props: ['startTime']
  }
}))

describe('RaceDetail', () => {
  const race: RaceSummary = {
    meeting_name: 'Launceston',
    race_number: 8,
    advertised_start: { seconds: 1700000000 },
    category_id: '1',
    race_comment: 'Sample race comment',
    race_comment_alternative: 'Sample alternative race comment',
    additional_data: '{}',
    generated: 1,
    silk_base_url: 'http://example.com'
  }

  it('renders race details correctly', () => {
    const wrapper = mount(RaceDetail, {
      props: { race }
    })

    expect(wrapper.find('.race-meeting').text()).toBe('Launceston')
    expect(wrapper.find('.race-number').text()).toBe('8')
  })

  it('passes the correct start time to RaceCountdown', () => {
    const wrapper = mount(RaceDetail, {
      props: { race }
    })

    const countdown = wrapper.findComponent(RaceCountdown)
    expect(countdown.props('startTime')).toBe(1700000000)
  })
})
