import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { UserList } from './admin/user-list'
import { ComplianceAlerts, Notification } from './admin/compliance-alerts'
import { Database } from '@/lib/supabase/database.types'
import { markNotificationAsRead } from '@/app/actions/admin'

type Profile = Database["public"]["Tables"]["profiles"]["Row"]

const mockRouter = {
  push: vi.fn(),
  replace: vi.fn(),
  refresh: vi.fn(),
}

vi.mock('next/navigation', () => ({
  useRouter: () => mockRouter,
}))

vi.mock('@/app/actions/admin', () => ({
  markNotificationAsRead: vi.fn(),
}))

describe('UserList', () => {
  const mockUsers: Profile[] = [
    {
      id: 'user-1',
      email: 'admin@example.com',
      full_name: 'Admin User',
      role: 'super_admin',
      is_owner: true,
      department_id: null,
      created_at: null,
      updated_at: null,
    },
    {
      id: 'user-2',
      email: 'emp@example.com',
      full_name: 'Employee User',
      role: 'employee',
      is_owner: false,
      department_id: null,
      created_at: null,
      updated_at: null,
    }
  ]

  it('renders users list', () => {
    render(<UserList users={mockUsers} />)
    expect(screen.getByText('Admin User')).toBeInTheDocument()
    expect(screen.getByText('Employee User')).toBeInTheDocument()
    expect(screen.getByText('super admin')).toBeInTheDocument()
  })

  it('renders empty state', () => {
    render(<UserList users={[]} />)
    expect(screen.getByText('No users found.')).toBeInTheDocument()
  })
})

describe('ComplianceAlerts', () => {
  const mockAlerts: Notification[] = [
    {
      id: 'log-1',
      title: 'Week 6: Probleemanalyse Deadline',
      message: 'Deadline for Sick User',
      type: 'warning',
      is_read: false,
      created_at: '2026-06-01',
      action_url: '/dashboard/details'
    }
  ]

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders alerts', () => {
    render(<ComplianceAlerts alerts={mockAlerts} />)
    expect(screen.getByText('Week 6: Probleemanalyse Deadline')).toBeInTheDocument()
    expect(screen.getByText(/Deadline for Sick User/)).toBeInTheDocument()
  })

  it('renders empty state', () => {
    render(<ComplianceAlerts alerts={[]} />)
    expect(screen.getByText('No new notifications.')).toBeInTheDocument()
  })

  it('handles mark as read interaction', async () => {
    render(<ComplianceAlerts alerts={mockAlerts} />)
    
    const markButton = screen.getByTitle('Mark as read')
    fireEvent.click(markButton)

    await waitFor(() => {
      expect(markNotificationAsRead).toHaveBeenCalledWith('log-1')
      expect(mockRouter.refresh).toHaveBeenCalled()
    })
  })

  it('handles action link navigation', () => {
    render(<ComplianceAlerts alerts={mockAlerts} />)
    
    const linkButton = screen.getByText('View Details →')
    fireEvent.click(linkButton)

    expect(mockRouter.push).toHaveBeenCalledWith('/dashboard/details')
  })
})
