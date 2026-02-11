import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getWKRStatus, addWKRExpense } from './wkr'

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

describe('getWKRStatus', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockSupabase.from.mockReset()
  })

  it('calculates budget correctly (Tier 1)', async () => {
    // Wage bill: 300,000 (below 400k) -> 2% = 6,000
    const mockContracts = [
        { salary_gross_cents: 30000000 / 12.96 } // roughly 231k per month * 12.96 approx 300k
    ]
    
    const monthlySalaryCents = 2314814
    
    mockSupabase.from.mockReturnValue({
        select: vi.fn().mockReturnValue({
            is: vi.fn().mockResolvedValue({ data: [{ salary_gross_cents: monthlySalaryCents }] })
        })
    })

    // Expenses: 0
    mockSupabase.from.mockReturnValueOnce({
        select: vi.fn().mockReturnValue({
            is: vi.fn().mockResolvedValue({ data: [{ salary_gross_cents: monthlySalaryCents }] })
        })
    }).mockReturnValueOnce({
        select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
                gte: vi.fn().mockResolvedValue({ data: [] })
            })
        })
    })

    const status = await getWKRStatus()
    
    // Wage bill approx 300,000
    expect(status.wageBill).toBeCloseTo(299999.89, 0)
    // Budget 2% of 300k = 6,000
    expect(status.budget).toBeCloseTo(6000, 0)
  })

  it('calculates budget correctly (Tier 2)', async () => {
    // Wage bill: 500,000 (above 400k)
    // 400k * 2% = 8,000
    // 100k * 1.18% = 1,180
    // Total = 9,180

    const monthlySalaryCents = 3858024 // 500,000 * 100 / 12.96
    
    mockSupabase.from.mockReturnValueOnce({
        select: vi.fn().mockReturnValue({
            is: vi.fn().mockResolvedValue({ data: [{ salary_gross_cents: monthlySalaryCents }] })
        })
    }).mockReturnValueOnce({
        select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
                gte: vi.fn().mockResolvedValue({ data: [] })
            })
        })
    })

    const status = await getWKRStatus()
    
    expect(status.wageBill).toBeCloseTo(500000, 0)
    expect(status.budget).toBeCloseTo(9180, 0)
  })
})

describe('addWKRExpense', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mockSupabase.from.mockReset()
    })

    it('adds expense correctly', async () => {
        const formData = new FormData()
        formData.append('description', 'Test Expense')
        formData.append('amount', '100.50')
        formData.append('category', 'taxable')
        formData.append('date', '2026-05-01')

        const insertMock = vi.fn().mockResolvedValue({ error: null })
        mockSupabase.from.mockReturnValue({
            insert: insertMock
        })

        await addWKRExpense(formData)

        expect(insertMock).toHaveBeenCalledWith({
            description: 'Test Expense',
            amount_cents: 10050,
            category: 'taxable',
            date: '2026-05-01'
        })
    })

    it('throws error on missing fields', async () => {
        const formData = new FormData()
        await expect(addWKRExpense(formData)).rejects.toThrow('Missing required fields')
    })
})