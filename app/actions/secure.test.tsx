import { describe, it, expect, vi, beforeEach } from 'vitest'
import { revealSensitiveData, storeSensitiveData } from './secure'
import { logAction } from './audit'

// Mock Supabase
const mockSupabase = {
  rpc: vi.fn(),
}

// Mock createClient
vi.mock('@/lib/supabase/server', () => ({
  createClient: () => Promise.resolve(mockSupabase),
}))

// Mock audit log
vi.mock('./audit', () => ({
  logAction: vi.fn(),
}))

describe('secure actions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('storeSensitiveData calls rpc', async () => {
    mockSupabase.rpc.mockResolvedValue({ error: null })
    
    await storeSensitiveData('user-1', '123', 'NL99')
    
    expect(mockSupabase.rpc).toHaveBeenCalledWith('store_sensitive_data', {
      target_user_id: 'user-1',
      plain_bsn: '123',
      plain_iban: 'NL99'
    })
  })

  it('revealSensitiveData calls rpc and logs action', async () => {
    mockSupabase.rpc.mockResolvedValue({ data: [{ bsn: '123', iban: 'NL99' }], error: null })
    
    const result = await revealSensitiveData('user-1')
    
    expect(mockSupabase.rpc).toHaveBeenCalledWith('reveal_sensitive_data', {
      target_user_id: 'user-1'
    })
    
    expect(logAction).toHaveBeenCalledWith('VIEW_BSN', 'user-1')
    expect(result).toEqual({ bsn: '123', iban: 'NL99' })
  })
})
