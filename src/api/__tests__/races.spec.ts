import { describe, beforeEach, it, expect, vi, afterEach } from 'vitest'
import { getNextRaces } from '../races'
import type { NextRacesResponse } from '../types'
import { after } from 'node:test'

describe('getNextRaces', () => {
  let nowSpy: vi.SpyInstance

  beforeEach(() => {
    nowSpy = vi.spyOn(Date, 'now').mockImplementation(() => 1700000000000)
  })

  afterEach(() => {
    nowSpy.mockRestore()
    vi.resetAllMocks()
  })

  it('should fetch and return the next races sorted by start time', async () => {
    const mockResponse: NextRacesResponse = {
      data: {
        race_summaries: {
          race1: { race_id: 'race1', advertised_start: { seconds: 1700000600 }, category_id: '1' },
          race2: { race_id: 'race2', advertised_start: { seconds: 1700000200 }, category_id: '2' },
          race3: { race_id: 'race3', advertised_start: { seconds: 1700000400 }, category_id: '2' }
        }
      }
    }

    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      } as Response)
    )

    const result = await getNextRaces('all')
    expect(result).toHaveLength(3)
    expect(result.map((r) => r.race_id)).toEqual(['race2', 'race3', 'race1'])
  })

  it('should filter out races that started more than one minute ago', async () => {
    nowSpy.mockImplementation(() => 1700000060000)
    const mockResponse: NextRacesResponse = {
      data: {
        race_summaries: {
          race1: { race_id: 'race1', advertised_start: { seconds: 1700000000 }, category_id: '1' },
          race2: { race_id: 'race2', advertised_start: { seconds: 1700000200 }, category_id: '2' },
          race3: { race_id: 'race3', advertised_start: { seconds: 1700000400 }, category_id: '2' }
        }
      }
    }

    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      } as Response)
    )

    const result = await getNextRaces('all')
    expect(result).toHaveLength(2)
    expect(result.map((r) => r.race_id)).toEqual(['race2', 'race3'])
  })

  it('should filter races by category ID', async () => {
    const mockResponse: NextRacesResponse = {
      data: {
        race_summaries: {
          race1: { race_id: 'race1', advertised_start: { seconds: 1700000600 }, category_id: '1' },
          race2: { race_id: 'race2', advertised_start: { seconds: 1700000200 }, category_id: '2' }
        }
      }
    }

    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      } as Response)
    )

    const result = await getNextRaces('1')
    expect(result).toHaveLength(1)
    expect(result[0].category_id).toBe('1')
  })

  it('should throw an error if fetch fails', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: false,
        status: 500
      } as Response)
    )

    await expect(getNextRaces('all')).rejects.toThrow('HTTP error! status: 500')
  })
})
