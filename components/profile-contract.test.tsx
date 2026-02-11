import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { ProfileCard } from './profile-card'
import { ContractCard } from './contract-card'
import { Database } from '@/lib/supabase/database.types'

type Profile = Database["public"]["Tables"]["profiles"]["Row"]
type Contract = Database["public"]["Tables"]["contracts"]["Row"]

const mockProfile: Profile = {
  id: 'user-1',
  email: 'test@example.com',
  full_name: 'John Doe',
  role: 'employee',
  is_owner: false,
  department_id: null,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
}

const mockContract: Contract = {
  id: 'contract-1',
  user_id: 'user-1',
  start_date: '2026-01-01',
  end_date: null,
  fte: 1.0,
  salary_gross_cents: 500000,
  vacation_hours_statutory: 160,
  vacation_hours_non_statutory: 40,
  created_at: new Date().toISOString(),
}

describe('ProfileCard', () => {
  it('renders profile information correctly', () => {
    render(<ProfileCard profile={mockProfile} />)
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('test@example.com')).toBeInTheDocument()
    expect(screen.getByText(/employee/i)).toBeInTheDocument()
  })
})

describe('ContractCard', () => {
  it('renders contract details correctly', () => {
    render(<ContractCard contract={mockContract} />)
    expect(screen.getByText('01 januari 2026')).toBeInTheDocument()
    expect(screen.getByText('Indefinite')).toBeInTheDocument()
    expect(screen.getByText('100%')).toBeInTheDocument()
    // Depending on locale formatting in test env, this might vary slightly, 
    // but should contain 5.000
    expect(screen.getByText(/5\.000,00/)).toBeInTheDocument()
    expect(screen.getByText('160 hours')).toBeInTheDocument()
    expect(screen.getByText('40 hours')).toBeInTheDocument()
  })
})
