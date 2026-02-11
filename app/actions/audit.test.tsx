import { describe, it, expect, vi, beforeEach } from 'vitest'
import { logAction } from './audit'

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

describe('logAction', () => {
  const mockUserId = 'user-123'

  beforeEach(() => {
    vi.clearAllMocks()
    mockSupabase.from.mockReset()
    mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: { id: mockUserId } }
    })
  })

  it('logs action successfully', async () => {
    const insertMock = vi.fn().mockResolvedValue({ error: null })
    mockSupabase.from.mockReturnValue({ insert: insertMock })

    await logAction('LOGIN', 'target-1', { ip: '127.0.0.1' })

    expect(insertMock).toHaveBeenCalledWith({
        actor_id: mockUserId,
        action: 'LOGIN',
        target_id: 'target-1',
        metadata: { ip: '127.0.0.1' }
    })
  })

  it('logs action without target or metadata', async () => {
    const insertMock = vi.fn().mockResolvedValue({ error: null })
    mockSupabase.from.mockReturnValue({ insert: insertMock })

    await logAction('LOGOUT')

    expect(insertMock).toHaveBeenCalledWith({
        actor_id: mockUserId,
        action: 'LOGOUT',
        target_id: undefined,
        metadata: {}
    })
  })

  it('handles error gracefully', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const insertMock = vi.fn().mockResolvedValue({ error: { message: 'DB Error' } })
    mockSupabase.from.mockReturnValue({ insert: insertMock })

    await logAction('LOGIN')

    expect(consoleSpy).toHaveBeenCalledWith('Failed to insert audit log', { message: 'DB Error' })
    consoleSpy.mockRestore()
  })

  it('aborts if no user', async () => {
    mockSupabase.auth.getUser.mockResolvedValue({ data: { user: null } })
    const insertMock = vi.fn()
    mockSupabase.from.mockReturnValue({ insert: insertMock })

    await logAction('LOGIN')

    expect(insertMock).not.toHaveBeenCalled()
  })
})
