import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { DocumentUpload } from './document-upload'
import { getUploadUrl, saveDocumentRef } from '@/app/actions/documents'

// Mock server actions
vi.mock('@/app/actions/documents', () => ({
  getUploadUrl: vi.fn(),
  saveDocumentRef: vi.fn(),
}))

describe('DocumentUpload', () => {
  const mockSicknessLogId = 'log-123'
  const mockOnUploadComplete = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    global.fetch = vi.fn()
    global.alert = vi.fn()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renders upload form', () => {
    render(<DocumentUpload sicknessLogId={mockSicknessLogId} />)
    expect(screen.getByText('Upload Document')).toBeInTheDocument()
    expect(screen.getByLabelText('File')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Upload/i })).toBeDisabled()
  })

  it('enables upload button when file selected', () => {
    render(<DocumentUpload sicknessLogId={mockSicknessLogId} />)
    
    const file = new File(['dummy content'], 'test.pdf', { type: 'application/pdf' })
    const input = screen.getByLabelText('File')
    
    fireEvent.change(input, { target: { files: [file] } })
    
    expect(screen.getByRole('button', { name: /Upload/i })).not.toBeDisabled()
  })

  it('handles successful upload', async () => {
    render(<DocumentUpload sicknessLogId={mockSicknessLogId} onUploadComplete={mockOnUploadComplete} />)
    
    const file = new File(['dummy content'], 'test.pdf', { type: 'application/pdf' })
    const input = screen.getByLabelText('File')
    fireEvent.change(input, { target: { files: [file] } })
    
    // Mock successful actions
    ;(getUploadUrl as any).mockResolvedValue({ signedUrl: 'http://upload-url', path: 'path/to/file' })
    ;(global.fetch as any).mockResolvedValue({ ok: true })
    ;(saveDocumentRef as any).mockResolvedValue({})

    const uploadButton = screen.getByRole('button', { name: /Upload/i })
    fireEvent.click(uploadButton)

    await waitFor(() => {
      expect(getUploadUrl).toHaveBeenCalledWith(mockSicknessLogId, 'test.pdf', 'application/pdf')
      expect(global.fetch).toHaveBeenCalledWith('http://upload-url', expect.objectContaining({
        method: 'PUT',
        body: file,
      }))
      expect(saveDocumentRef).toHaveBeenCalledWith(mockSicknessLogId, 'test.pdf', 'path/to/file', 'application/pdf')
      expect(mockOnUploadComplete).toHaveBeenCalled()
      expect(global.alert).toHaveBeenCalledWith('Document uploaded successfully')
    })
  })

  it('handles upload failure', async () => {
    render(<DocumentUpload sicknessLogId={mockSicknessLogId} />)
    
    const file = new File(['dummy content'], 'test.pdf', { type: 'application/pdf' })
    const input = screen.getByLabelText('File')
    fireEvent.change(input, { target: { files: [file] } })
    
    // Mock failure at getUploadUrl
    ;(getUploadUrl as any).mockRejectedValue(new Error('Failed to get URL'))

    const uploadButton = screen.getByRole('button', { name: /Upload/i })
    fireEvent.click(uploadButton)

    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith('Failed to upload document')
    })
  })
})
