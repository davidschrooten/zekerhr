import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import Home from './page'
import { redirect } from 'next/navigation'

// Mock the redirect function
vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}))

describe('Home Page', () => {
  it('redirects to login', () => {
    render(<Home />)
    expect(redirect).toHaveBeenCalledWith('/auth/login')
  })
})
