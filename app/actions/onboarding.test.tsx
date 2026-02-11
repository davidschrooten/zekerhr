import { describe, it, expect, vi, beforeEach } from 'vitest'
import { inviteUser } from './onboarding'

// Mock Supabase Client and Admin Client
const mockSupabase = {
  auth: {
    getUser: vi.fn(),
  },
  from: vi.fn(),
  rpc: vi.fn(),
}

const mockAdminSupabase = {
  auth: {
    admin: {
      inviteUserByEmail: vi.fn(),
    }
  },
  from: vi.fn(),
}

vi.mock('@/lib/supabase/server', () => ({
  createClient: () => Promise.resolve(mockSupabase),
}))

vi.mock('@/lib/supabase/admin', () => ({
  createAdminClient: () => mockAdminSupabase,
}))

vi.mock('@/app/actions/audit', () => ({
  logAction: vi.fn(),
}))

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}))

describe('inviteUser', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockSupabase.from.mockReset()
    mockAdminSupabase.from.mockReset()
  })

  it('invites user and creates records', async () => {
    // 1. Auth Check
    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: { id: 'admin-1' } }
    })
    mockSupabase.from.mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({ data: { role: 'super_admin' } })
        })
      })
    })

    // 2. Invite User
    mockAdminSupabase.auth.admin.inviteUserByEmail.mockResolvedValue({
      data: { user: { id: 'new-user-1' } },
      error: null
    })

    // 3. Insert Profile (Admin Client)
    const profileInsert = vi.fn().mockResolvedValue({ error: null })
    mockAdminSupabase.from.mockReturnValueOnce({ insert: profileInsert })

    // 4. Insert Contract (Admin Client)
    const contractInsert = vi.fn().mockResolvedValue({ error: null })
    mockAdminSupabase.from.mockReturnValueOnce({ insert: contractInsert })

    // 5. Store Sensitive (Regular Client via RPC)
    mockSupabase.rpc.mockResolvedValue({ error: null })

    const formData = new FormData()
    formData.append('email', 'new@example.com')
    formData.append('full_name', 'New Employee')
    formData.append('role', 'employee')
    formData.append('bsn', '123')
    formData.append('iban', 'NL99')
    formData.append('salary', '5000')
    formData.append('fte', '1.0')
    formData.append('start_date', '2026-06-01')

    await inviteUser(formData)

    expect(mockAdminSupabase.auth.admin.inviteUserByEmail).toHaveBeenCalledWith('new@example.com')
    expect(profileInsert).toHaveBeenCalled()
    expect(contractInsert).toHaveBeenCalled()
    expect(mockSupabase.rpc).toHaveBeenCalledWith('store_sensitive_data', expect.objectContaining({
      plain_bsn: '123',
      plain_iban: 'NL99'
    }))
  })
})
