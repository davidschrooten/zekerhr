import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { UserList } from './admin/user-list'
import { ComplianceAlerts } from './admin/compliance-alerts'
import { Database } from '@/lib/supabase/database.types'

type Profile = Database["public"]["Tables"]["profiles"]["Row"]

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
    // Check role rendering (super admin -> super admin)
    expect(screen.getByText('super admin')).toBeInTheDocument()
  })

  it('renders empty state', () => {
    render(<UserList users={[]} />)
    expect(screen.getByText('No users found.')).toBeInTheDocument()
  })
})

describe('ComplianceAlerts', () => {
  const mockAlerts = [
    {
      id: 'log-1',
      type: 'Week 6: Probleemanalyse Deadline',
      user: 'Sick User',
      dueDate: '2026-06-01'
    }
  ]

  it('renders alerts', () => {
    render(<ComplianceAlerts alerts={mockAlerts} />)
    expect(screen.getByText('Week 6: Probleemanalyse Deadline')).toBeInTheDocument()
    expect(screen.getByText(/Sick User/)).toBeInTheDocument()
  })

  it('renders empty state', () => {
    render(<ComplianceAlerts alerts={[]} />)
    expect(screen.getByText('No pending compliance alerts.')).toBeInTheDocument()
  })
})
