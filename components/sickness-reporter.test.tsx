import { render, screen, fireEvent } from '@testing-library/react'
import { SicknessReporter } from './sickness-reporter'
import { reportSickness, reportRecovery } from '@/app/actions/sickness'
import { act } from 'react'
import { describe, it, expect, vi, beforeEach, Mock } from 'vitest'

// Mock the server actions
vi.mock('@/app/actions/sickness', () => ({
  reportSickness: vi.fn(),
  reportRecovery: vi.fn(),
}))

describe('SicknessReporter', () => {
  const mockUserId = 'user-123'

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders "Ik ben ziek" button when not sick', () => {
    render(<SicknessReporter userId={mockUserId} activeSickness={false} />)
    
    expect(screen.getByText('Ziek Melden')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Ik ben ziek/i })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /Ik ben weer beter/i })).not.toBeInTheDocument()
  })

  it('renders "Ik ben weer beter" button when sick', () => {
    render(<SicknessReporter userId={mockUserId} activeSickness={true} />)
    
    expect(screen.getByText('Ziek Gemeld')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Ik ben weer beter/i })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /Ik ben ziek/i })).not.toBeInTheDocument()
  })

  it('calls reportSickness when "Ik ben ziek" is clicked', async () => {
    render(<SicknessReporter userId={mockUserId} activeSickness={false} />)
    
    const button = screen.getByRole('button', { name: /Ik ben ziek/i })
    await act(async () => {
      fireEvent.click(button)
    })
    
    expect(reportSickness).toHaveBeenCalledWith(mockUserId)
  })

  it('calls reportRecovery when "Ik ben weer beter" is clicked', async () => {
    render(<SicknessReporter userId={mockUserId} activeSickness={true} />)
    
    const button = screen.getByRole('button', { name: /Ik ben weer beter/i })
    await act(async () => {
      fireEvent.click(button)
    })
    
    expect(reportRecovery).toHaveBeenCalledWith(mockUserId)
  })

  it('handles reportSickness failure', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    ;(reportSickness as unknown as Mock).mockRejectedValue(new Error('Failed'))
    
    render(<SicknessReporter userId={mockUserId} activeSickness={false} />)
    
    const button = screen.getByRole('button', { name: /Ik ben ziek/i })
    await act(async () => {
      fireEvent.click(button)
    })
    
    expect(reportSickness).toHaveBeenCalled()
    expect(consoleSpy).toHaveBeenCalledWith('Failed to report sickness', expect.any(Error))
    consoleSpy.mockRestore()
  })

  it('handles reportRecovery failure', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    ;(reportRecovery as unknown as Mock).mockRejectedValue(new Error('Failed'))
    
    render(<SicknessReporter userId={mockUserId} activeSickness={true} />)
    
    const button = screen.getByRole('button', { name: /Ik ben weer beter/i })
    await act(async () => {
      fireEvent.click(button)
    })
    
    expect(reportRecovery).toHaveBeenCalled()
    expect(consoleSpy).toHaveBeenCalledWith('Failed to report recovery', expect.any(Error))
    consoleSpy.mockRestore()
  })
})
