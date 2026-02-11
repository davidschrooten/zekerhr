import { ReactNode } from 'react'

interface AuthLayoutProps {
  children: ReactNode
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <ZekerHRLogo />
        </div>
        {children}
      </div>
    </div>
  )
}

function ZekerHRLogo() {
  return (
    <div className="flex items-center gap-2">
      <div className="flex h-8 w-8 items-center justify-center rounded bg-foreground text-background">
        <span className="font-mono text-sm font-bold">Z</span>
      </div>
      <span className="text-2xl font-semibold tracking-tight text-foreground">
        ZekerHR
      </span>
    </div>
  )
}
