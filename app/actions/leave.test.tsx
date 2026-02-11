import { describe, it, expect, vi, beforeEach } from 'vitest'
import { approveLeaveRequest, submitLeaveRequest } from './leave'

// Mock Supabase
const mockSupabase = {
  auth: {
    getUser: vi.fn(),
  },
  from: vi.fn(),
}

// Mock createClient
vi.mock('@/lib/supabase/server', () => ({
  createClient: () => Promise.resolve(mockSupabase),
}))

// Mock revalidatePath
vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}))

describe('approveLeaveRequest', () => {
  const mockRequestId = 'req-123'
  const mockManagerId = 'mgr-123'
  const mockUserId = 'user-123'

  beforeEach(() => {
    vi.clearAllMocks()
    
    // Default auth mock
    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: { id: mockManagerId } },
    })
  })

  it('correctly deducts wettelijk leave first', async () => {
    const mockRequest = {
      id: mockRequestId,
      user_id: mockUserId,
      minutes_requested: 100, // Requesting 100 mins
      status: 'pending',
    }

    const mockBalances = [
      { id: 'bal-1', user_id: mockUserId, type: 'bovenwettelijk', balance_minutes: 200, expiration_date: '2027-01-01' },
      { id: 'bal-2', user_id: mockUserId, type: 'wettelijk', balance_minutes: 50, expiration_date: '2026-07-01' },
      { id: 'bal-3', user_id: mockUserId, type: 'wettelijk', balance_minutes: 60, expiration_date: '2026-08-01' },
    ]

    // Setup DB mocks
    const selectMock = vi.fn()
    const eqMock = vi.fn()
    const singleMock = vi.fn()
    const gtMock = vi.fn()
    const gteMock = vi.fn()
    const orderMock = vi.fn()
    const updateMock = vi.fn()

    mockSupabase.from.mockImplementation((table) => {
      if (table === 'leave_requests') {
        return {
          select: selectMock.mockReturnThis(),
          eq: eqMock.mockReturnThis(),
          single: singleMock.mockResolvedValue({ data: mockRequest, error: null }),
          update: updateMock.mockReturnThis(),
        }
      }
      if (table === 'leave_balances') {
        return {
          select: selectMock.mockReturnThis(),
          eq: eqMock.mockReturnThis(),
          gt: gtMock.mockReturnThis(),
          gte: gteMock.mockReturnThis(),
          order: orderMock.mockResolvedValue({ data: mockBalances, error: null }), // Returns unordered list from DB mock
          update: updateMock.mockReturnThis(),
        }
      }
      return {}
    })

    await approveLeaveRequest(mockRequestId, mockManagerId)

    // Expected Logic:
    // Request: 100 mins
    // 1. bal-2 (Wettelijk, 50 mins) -> Deduct 50. Remaining needed: 50.
    // 2. bal-3 (Wettelijk, 60 mins) -> Deduct 50. Remaining needed: 0.
    // 3. bal-1 (Bovenwettelijk) -> Touched? No.

    // Verify updates
    // We expect 3 update calls: 2 for balances, 1 for request status
    expect(updateMock).toHaveBeenCalledTimes(3)

    // Check balance updates
    // bal-2 should be 0 (50 - 50)
    expect(updateMock).toHaveBeenCalledWith(expect.objectContaining({ balance_minutes: 0 }))
    // bal-3 should be 10 (60 - 50)
    expect(updateMock).toHaveBeenCalledWith(expect.objectContaining({ balance_minutes: 10 }))
    
    // Check status update
    expect(updateMock).toHaveBeenCalledWith(expect.objectContaining({ status: 'approved' }))
  })

  it('throws error if insufficient balance', async () => {
    const mockRequest = {
      id: mockRequestId,
      user_id: mockUserId,
      minutes_requested: 1000, // Requesting too much
      status: 'pending',
    }

    const mockBalances = [
        { id: 'bal-1', user_id: mockUserId, type: 'wettelijk', balance_minutes: 50, expiration_date: '2026-07-01' },
    ]

    mockSupabase.from.mockImplementation((table) => {
        if (table === 'leave_requests') {
          return {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            single: vi.fn().mockResolvedValue({ data: mockRequest, error: null }),
          }
        }
        if (table === 'leave_balances') {
            return {
              select: vi.fn().mockReturnThis(),
              eq: vi.fn().mockReturnThis(),
              gt: vi.fn().mockReturnThis(),
              gte: vi.fn().mockReturnThis(),
              order: vi.fn().mockResolvedValue({ data: mockBalances, error: null }),
            }
        }
        return {}
      })

    await expect(approveLeaveRequest(mockRequestId, mockManagerId)).rejects.toThrow('Insufficient leave balance')
  })
})

describe('submitLeaveRequest', () => {
    const mockUserId = 'user-123'
    
    beforeEach(() => {
        vi.clearAllMocks()
        mockSupabase.auth.getUser.mockResolvedValue({
            data: { user: { id: mockUserId } },
        })
    })

    it('creates a leave request correctly', async () => {
        const formData = new FormData()
        formData.append('start_date', '2026-01-01')
        formData.append('end_date', '2026-01-02') // 2 days
        formData.append('reason', 'Vacation')

        const insertMock = vi.fn().mockResolvedValue({ error: null })
        mockSupabase.from.mockReturnValue({
            insert: insertMock
        })

        await submitLeaveRequest(formData)

        expect(insertMock).toHaveBeenCalledWith(expect.objectContaining({
            user_id: mockUserId,
            start_date: '2026-01-01',
            end_date: '2026-01-02',
            minutes_requested: 960, // 2 days * 480 mins
            status: 'pending'
        }))
    })

    it('throws error if unauthorized', async () => {
        mockSupabase.auth.getUser.mockResolvedValue({ data: { user: null } })
        const formData = new FormData()
        await expect(submitLeaveRequest(formData)).rejects.toThrow('Unauthorized')
    })
})
