import { describe, it, expect, vi, beforeEach } from 'vitest'
import { generatePayrollData } from './payroll'

// Mock Supabase
const mockSupabase = {
  auth: {
    getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'admin-1' } } })
  },
  from: vi.fn(),
}

// Mock createClient
vi.mock('@/lib/supabase/server', () => ({
  createClient: () => Promise.resolve(mockSupabase),
}))

describe('generatePayrollData', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockSupabase.from.mockReset()
  })

  it('fetches payroll data correctly', async () => {
    // Setup mocks
    // 0. Audit Log
    const auditLogQuery = {
      insert: vi.fn().mockResolvedValue({ error: null })
    }

    // 1. New Hires
    const newHiresQuery = {
      select: vi.fn().mockReturnThis(),
      gte: vi.fn().mockReturnThis(),
      lte: vi.fn().mockResolvedValue({ data: [{ id: 'new-hire-1' }], error: null })
    }
    
    // 2. Terminations
    const terminationsQuery = {
      select: vi.fn().mockReturnThis(),
      gte: vi.fn().mockReturnThis(),
      lte: vi.fn().mockResolvedValue({ data: [{ id: 'term-1' }], error: null })
    }

    // 3. Sickness Reports
    const sicknessReportsQuery = {
      select: vi.fn().mockReturnThis(),
      gte: vi.fn().mockReturnThis(),
      lte: vi.fn().mockResolvedValue({ data: [{ id: 'sick-1' }], error: null })
    }

    // 4. Sickness Recoveries
    const sicknessRecoveriesQuery = {
      select: vi.fn().mockReturnThis(),
      gte: vi.fn().mockReturnThis(),
      lte: vi.fn().mockResolvedValue({ data: [{ id: 'recovered-1' }], error: null })
    }

    mockSupabase.from
      .mockReturnValueOnce(auditLogQuery)
      .mockReturnValueOnce(newHiresQuery)
      .mockReturnValueOnce(terminationsQuery)
      .mockReturnValueOnce(sicknessReportsQuery)
      .mockReturnValueOnce(sicknessRecoveriesQuery)

    const result = await generatePayrollData(2026, 5) // May 2026

    expect(result.period).toBe('2026-05')
    expect(result.newHires).toHaveLength(1)
    expect(result.terminations).toHaveLength(1)
    expect(result.sickness).toHaveLength(2) // 1 report + 1 recovery
  })
})
