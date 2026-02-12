import { vi, describe, it, expect, beforeEach, Mock } from 'vitest'
import { submitExpense, getExpenses } from './expenses'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

// Mock Supabase
vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(),
}))

// Mock revalidatePath and redirect
vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}))

vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}))

describe('expenses actions', () => {
  let mockSupabase: any

  beforeEach(() => {
    vi.clearAllMocks()
    mockSupabase = {
      auth: {
        getUser: vi.fn(),
      },
      from: vi.fn(() => ({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            gte: vi.fn(() => ({
              lte: vi.fn(() => ({
                order: vi.fn(),
              })),
            })),
          })),
        })),
        insert: vi.fn(),
      })),
    }
    
    ;(createClient as unknown as Mock).mockResolvedValue(mockSupabase)
  })

  describe('submitExpense', () => {
    it('successfully submits an expense', async () => {
      // Setup
      mockSupabase.auth.getUser.mockResolvedValue({ data: { user: { id: 'user-1' } } })
      const insertMock = vi.fn().mockResolvedValue({ error: null })
      mockSupabase.from.mockReturnValue({ insert: insertMock })

      const formData = new FormData()
      formData.append('description', 'Lunch')
      formData.append('amount', '12.50')
      formData.append('date', '2026-02-12')
      formData.append('category', 'meals')

      // Execute
      await submitExpense(formData)

      // Verify
      expect(mockSupabase.from).toHaveBeenCalledWith('expense_claims')
      expect(insertMock).toHaveBeenCalledWith({
        user_id: 'user-1',
        description: 'Lunch',
        amount_cents: 1250,
        date: '2026-02-12',
        category: 'meals',
        status: 'pending',
      })
      expect(redirect).toHaveBeenCalledWith('/dashboard/employee/expenses')
    })

    it('throws error if user not authenticated', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({ data: { user: null } })
      const formData = new FormData()
      
      await expect(submitExpense(formData)).rejects.toThrow('Unauthorized')
    })
  })

  describe('getExpenses', () => {
    it('fetches expenses for the user for a specific month', async () => {
      // Setup
      mockSupabase.auth.getUser.mockResolvedValue({ data: { user: { id: 'user-1' } } })
      const mockExpenses = [{ id: '1', description: 'Test' }]
      
      const orderMock = vi.fn().mockResolvedValue({ data: mockExpenses, error: null })
      const lteMock = vi.fn(() => ({ order: orderMock }))
      const gteMock = vi.fn(() => ({ lte: lteMock }))
      const eqMock = vi.fn(() => ({ gte: gteMock }))
      const selectMock = vi.fn(() => ({ eq: eqMock }))
      
      mockSupabase.from.mockReturnValue({ select: selectMock })

      // Execute
      const result = await getExpenses(2, 2026) // Feb 2026

      // Verify
      expect(result).toEqual(mockExpenses)
      expect(mockSupabase.from).toHaveBeenCalledWith('expense_claims')
      expect(selectMock).toHaveBeenCalledWith('*')
      expect(eqMock).toHaveBeenCalledWith('user_id', 'user-1')
      expect(gteMock).toHaveBeenCalledWith('date', '2026-02-01')
      expect(lteMock).toHaveBeenCalledWith('date', '2026-02-28')
    })
  })
})
