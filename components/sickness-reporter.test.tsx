import { render, screen, fireEvent, act } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { SicknessReporter } from './sickness-reporter'
import * as actions from '@/app/actions/sickness'

// Mock the server actions
vi.mock('@/app/actions/sickness', () => ({
  reportSickness: vi.fn(),
  reportRecovery: vi.fn(),
}))

describe('SicknessReporter', () => {
  const mockUserId = 'user-123'

  it('renders "I am Sick" button when not sick', () => {
    render(<SicknessReporter userId={mockUserId} activeSickness={false} />)
    
    expect(screen.getByText('Report Absence')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /I am Sick/i })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /I am Recovered/i })).not.toBeInTheDocument()
  })

  it('renders "I am Recovered" button when sick', () => {
    render(<SicknessReporter userId={mockUserId} activeSickness={true} />)
    
    expect(screen.getByText('Active Sickness Report')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /I am Recovered/i })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /I am Sick/i })).not.toBeInTheDocument()
  })

  it('calls reportSickness when "I am Sick" is clicked', async () => {
    render(<SicknessReporter userId={mockUserId} activeSickness={false} />)
    
    const button = screen.getByRole('button', { name: /I am Sick/i })
    await act(async () => {
      fireEvent.click(button)
    })
    
    expect(actions.reportSickness).toHaveBeenCalledWith(mockUserId)
  })

  it('calls reportRecovery when "I am Recovered" is clicked', async () => {
    render(<SicknessReporter userId={mockUserId} activeSickness={true} />)
    
    const button = screen.getByRole('button', { name: /I am Recovered/i })
    await act(async () => {
      fireEvent.click(button)
    })
    
    expect(actions.reportRecovery).toHaveBeenCalledWith(mockUserId)
  })
})
