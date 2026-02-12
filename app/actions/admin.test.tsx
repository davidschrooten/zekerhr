import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getAllUsers, getAdminNotifications, markNotificationAsRead } from './admin'

// Define mock structure
const queryMock = {
  select: vi.fn(),
  order: vi.fn(),
  eq: vi.fn(),
  update: vi.fn(),
  single: vi.fn(),
} as any

const mockSupabase = {
  auth: {
    getUser: vi.fn(),
  },
  from: vi.fn(() => queryMock),
  _queryMock: queryMock
}

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(() => Promise.resolve(mockSupabase)),
}))

describe('admin actions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Setup default chaining
    queryMock.select.mockReturnValue(queryMock)
    queryMock.order.mockReturnValue(queryMock)
    queryMock.eq.mockReturnValue(queryMock)
    queryMock.update.mockReturnValue(queryMock)
  })

  describe('getAllUsers', () => {
    it('returns empty array if no user', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({ data: { user: null } })
      const users = await getAllUsers()
      expect(users).toEqual([])
    })

    it('returns users if authorized', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({ data: { user: { id: 'admin-1' } } })
      const mockUsers = [{ id: 'user-1' }]
      
      // chain: select -> order (return promise)
      queryMock.order.mockResolvedValue({ data: mockUsers })

      const users = await getAllUsers()
      expect(users).toEqual(mockUsers)
    })
  })

  describe('getAdminNotifications', () => {
    it('returns empty array if no user', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({ data: { user: null } })
      const notifications = await getAdminNotifications()
      expect(notifications).toEqual([])
    })

    it('returns notifications if authorized', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({ data: { user: { id: 'admin-1' } } })
      const mockNotifications = [{ id: 'notif-1' }]
      
      // chain: select -> eq -> eq -> order (return promise)
      queryMock.order.mockResolvedValue({ data: mockNotifications, error: null })

      const notifications = await getAdminNotifications()
      expect(notifications).toEqual(mockNotifications)
    })

    it('handles errors gracefully', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({ data: { user: { id: 'admin-1' } } })
      
      queryMock.order.mockResolvedValue({ data: null, error: { message: 'Error' } })

      const notifications = await getAdminNotifications()
      expect(notifications).toEqual([])
    })
  })

  describe('markNotificationAsRead', () => {
    it('throws if unauthorized', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({ data: { user: null } })
      await expect(markNotificationAsRead('123')).rejects.toThrow('Unauthorized')
    })

    it('updates notification if authorized', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({ data: { user: { id: 'admin-1' } } })
      
      // chain: update -> eq -> eq (return promise)
      // We need eq to behave differently on 2nd call
      queryMock.eq
        .mockReturnValueOnce(queryMock) // 1st eq returns mock
        .mockResolvedValueOnce({ error: null }) // 2nd eq returns promise

      await markNotificationAsRead('123')
      expect(queryMock.update).toHaveBeenCalledWith({ is_read: true })
    })

    it('throws if update fails', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({ data: { user: { id: 'admin-1' } } })
      
      queryMock.eq
        .mockReturnValueOnce(queryMock)
        .mockResolvedValueOnce({ error: { message: 'Update failed' } })

      await expect(markNotificationAsRead('123')).rejects.toThrow('Update failed')
    })
  })
})
