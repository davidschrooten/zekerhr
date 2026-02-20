'use client'

import React, { useState } from 'react'
import { Link } from '@/i18n/routing'
import { AuthLayout } from '@/components/auth-layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { createClient } from '@/lib/supabase/client'

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Wachtwoorden komen niet overeen')
      return
    }

    if (password.length < 8) {
      setError('Wachtwoord moet minimaal 8 tekens bevatten')
      return
    }

    setIsLoading(true)

    try {
      const { error } = await supabase.auth.updateUser({ password })
      if (error) throw error
      setSuccess(true)
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('Er is een fout opgetreden.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthLayout>
      <Card className="border-none shadow-organic rounded-organic bg-white overflow-hidden">
        <CardHeader className="space-y-2 text-center pt-10 px-8">
          <CardTitle className="text-3xl font-medium tracking-tight text-espresso">
            {success ? 'Wachtwoord gewijzigd' : 'Nieuw wachtwoord instellen'}
          </CardTitle>
          <CardDescription className="text-taupe font-normal">
            {success 
              ? 'Uw wachtwoord is succesvol gewijzigd' 
              : 'Kies een sterk wachtwoord voor uw account'}
          </CardDescription>
        </CardHeader>
        <CardContent className="px-8 pb-10">
          {success ? (
            <div className="space-y-6">
              <Alert className="border-none bg-emerald-50 text-emerald-700 rounded-2xl shadow-sm">
                <AlertDescription className="font-medium text-center">
                  {'U kunt nu inloggen met uw nieuwe wachtwoord'}
                </AlertDescription>
              </Alert>

              <Button className="w-full rounded-full py-6 bg-cedar hover:bg-cedar/90 text-white shadow-lg hover:shadow-xl transition-all font-medium text-base" asChild>
                <Link href="/auth/login">
                  Naar inloggen
                </Link>
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <Alert className="border-none bg-red-50 text-red-700 rounded-2xl shadow-sm">
                  <AlertDescription className="font-medium">{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="password" className="text-xs uppercase tracking-wider text-taupe font-semibold pl-1">Nieuw wachtwoord</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Minimaal 8 tekens"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="rounded-2xl border-none bg-cream px-4 py-6 focus-visible:ring-cedar/20 text-espresso placeholder:text-pebble transition-all"
                />
                <p className="text-[10px] uppercase tracking-wider text-pebble font-semibold pl-1">
                  Gebruik minimaal 8 tekens
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-xs uppercase tracking-wider text-taupe font-semibold pl-1">Bevestig nieuw wachtwoord</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Herhaal uw wachtwoord"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="rounded-2xl border-none bg-cream px-4 py-6 focus-visible:ring-cedar/20 text-espresso placeholder:text-pebble transition-all"
                />
              </div>

              <Button
                type="submit"
                className="w-full rounded-full py-6 bg-cedar hover:bg-cedar/90 text-white shadow-lg hover:shadow-xl transition-all font-medium text-base"
                disabled={isLoading}
              >
                {isLoading ? 'Wachtwoord wijzigen...' : 'Wachtwoord wijzigen'}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>

      <p className="mt-8 text-center text-xs text-pebble font-medium tracking-wide">
        Veilig beschermd door ZekerHR
      </p>
    </AuthLayout>
  )
}