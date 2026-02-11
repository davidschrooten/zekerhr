import { render, screen } from '@testing-library/react'
import Home from './page'
import { describe, it, expect } from 'vitest'

describe('Home Page', () => {
  it('renders the title', () => {
    render(<Home />)
    const title = screen.getByText(/ZekerHR/i)
    expect(title).toBeInTheDocument()
  })

  it('renders login link', () => {
    render(<Home />)
    const loginLink = screen.getByRole('link', { name: /Login/i })
    expect(loginLink).toHaveAttribute('href', '/auth/login')
  })
})
