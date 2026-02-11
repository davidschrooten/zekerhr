import { render, screen, fireEvent, act } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { LeaveApprovalList } from './manager/leave-approval-list'
import { SicknessOverview } from './manager/sickness-overview'
import * as leaveActions from '@/app/actions/leave'

// Mock actions
vi.mock('@/app/actions/leave', () => ({
  approveLeaveRequest: vi.fn(),
}))

describe('LeaveApprovalList', () => {
  const mockRequests = [
    {
      id: 'req-1',
      user_id: 'user-1',
      start_date: '2026-05-01',
      end_date: '2026-05-05',
      minutes_requested: 2400,
      status: 'pending' as const,
      reason: 'Holiday',
      created_at: null,
      updated_at: null,
      profiles: { full_name: 'John Doe', email: 'john@example.com' }
    }
  ]

  it('renders pending requests', () => {
    render(<LeaveApprovalList requests={mockRequests} managerId="mgr-1" />)
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText(/Holiday/)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Approve/i })).toBeInTheDocument()
  })

  it('calls approve action on click', async () => {
    render(<LeaveApprovalList requests={mockRequests} managerId="mgr-1" />)
    const approveBtn = screen.getByRole('button', { name: /Approve/i })
    await act(async () => {
      fireEvent.click(approveBtn)
    })
    expect(leaveActions.approveLeaveRequest).toHaveBeenCalledWith('req-1', 'mgr-1')
  })

  it('handles approval failure', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {})
    
    // Mock failure
    vi.mocked(leaveActions.approveLeaveRequest).mockRejectedValueOnce(new Error('Failed'))
    
    render(<LeaveApprovalList requests={mockRequests} managerId="mgr-1" />)
    const approveBtn = screen.getByRole('button', { name: /Approve/i })
    
    await act(async () => {
      fireEvent.click(approveBtn)
    })
    
    expect(consoleSpy).toHaveBeenCalled()
    expect(alertSpy).toHaveBeenCalledWith('Failed to approve: Failed')
    
    consoleSpy.mockRestore()
    alertSpy.mockRestore()
  })

  it('renders empty state', () => {
    render(<LeaveApprovalList requests={[]} managerId="mgr-1" />)
    expect(screen.getByText('No pending requests.')).toBeInTheDocument()
  })
})

describe('SicknessOverview', () => {
  const mockLogs = [
    {
      id: 'log-1',
      user_id: 'user-2',
      report_date: '2026-04-01',
      recovery_date: null,
      status: 'reported' as const,
      uwv_notification_sent: false,
      created_at: null,
      updated_at: null,
      profiles: { full_name: 'Jane Sick', email: 'jane@example.com' }
    }
  ]

  it('renders active sickness', () => {
    render(<SicknessOverview logs={mockLogs} />)
    expect(screen.getByText('Jane Sick')).toBeInTheDocument()
    // Select specific span or check length
    expect(screen.getAllByText(/Active/i).length).toBeGreaterThan(0)
  })

  it('renders empty state', () => {
    render(<SicknessOverview logs={[]} />)
    expect(screen.getByText('No active sickness reports.')).toBeInTheDocument()
  })
})
