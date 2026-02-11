import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getUploadUrl, saveDocumentRef } from './documents'

const mockSupabase = {
  auth: {
    getUser: vi.fn(),
  },
  from: vi.fn(),
}

const mockAdminSupabase = {
  storage: {
    getBucket: vi.fn(),
    createBucket: vi.fn(),
    from: vi.fn().mockReturnValue({
      createSignedUploadUrl: vi.fn()
    })
  },
  from: vi.fn(),
}

vi.mock('@/lib/supabase/server', () => ({
  createClient: () => Promise.resolve(mockSupabase),
}))

vi.mock('@/lib/supabase/admin', () => ({
  createAdminClient: () => mockAdminSupabase,
}))

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}))

describe('documents actions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockSupabase.from.mockReset()
    mockAdminSupabase.from.mockReset()
  })

  it('getUploadUrl returns signed url', async () => {
    // 1. Auth
    mockSupabase.auth.getUser.mockResolvedValue({ data: { user: { id: 'hr-1' } } })
    
    // 2. Profile Check & Log Fetch (Regular Client)
    mockSupabase.from
      .mockReturnValueOnce({ // Profile check
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: { role: 'hr_admin' } })
          })
        })
      })
      .mockReturnValueOnce({ // Log fetch
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: { user_id: 'sick-user-1' } })
          })
        })
      })

    // 3. Bucket check
    mockAdminSupabase.storage.getBucket.mockResolvedValue({ error: null })
    
    // 4. Signed URL
    const createSignedUrlMock = vi.fn().mockResolvedValue({ 
      data: { signedUrl: 'https://upload', token: 'token' }, 
      error: null 
    })
    mockAdminSupabase.storage.from.mockReturnValue({ createSignedUploadUrl: createSignedUrlMock })

    const result = await getUploadUrl('log-1', 'doc.pdf', 'application/pdf')

    expect(result.signedUrl).toBe('https://upload')
    expect(createSignedUrlMock).toHaveBeenCalledWith('sick-user-1/log-1/doc.pdf')
  })

  it('saveDocumentRef updates log', async () => {
    // 1. Select
    const selectMock = {
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({ data: { documents: [] } })
        })
      })
    }

    // 2. Update
    const updateFn = vi.fn().mockReturnValue({
      eq: vi.fn().mockResolvedValue({ error: null })
    })
    const updateMock = { update: updateFn }

    mockAdminSupabase.from
      .mockReturnValueOnce(selectMock)
      .mockReturnValueOnce(updateMock)

    await saveDocumentRef('log-1', 'doc.pdf', 'path/to/doc', 'application/pdf')

    expect(updateFn).toHaveBeenCalledWith(expect.objectContaining({ 
        documents: expect.arrayContaining([expect.objectContaining({ name: 'doc.pdf' })])
    }))
  })
})