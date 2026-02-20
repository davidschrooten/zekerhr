import { ReactNode } from 'react'

interface AuthLayoutProps {
  children: ReactNode
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-cream p-6">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-10">
          <ZekerHRLogo />
        </div>
        {children}
      </div>
    </div>
  )
}

function ZekerHRLogo() {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cedar text-white shadow-organic">
        <span className="font-mono text-base font-bold">Z</span>
      </div>
      <span className="text-3xl font-medium tracking-tight text-espresso">
        ZekerHR
      </span>
    </div>
  )
}
