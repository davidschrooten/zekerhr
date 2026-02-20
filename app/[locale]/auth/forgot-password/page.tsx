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

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess(false)

    if (!email) {
      setError('Vul een geldig e-mailadres in')
      return
    }

    setIsLoading(true)

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/update-password`,
      })
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
            Wachtwoord vergeten
          </CardTitle>
          <CardDescription className="text-taupe font-normal">
            Voer uw e-mailadres in om een herstellink te ontvangen
          </CardDescription>
        </CardHeader>
        <CardContent className="px-8 pb-10">
          {success ? (
            <div className="space-y-6">
              <Alert className="border-none bg-emerald-50 text-emerald-700 rounded-2xl shadow-sm">
                <AlertDescription className="font-medium text-center">
                  {'We hebben een herstellink naar uw e-mailadres gestuurd. Controleer uw inbox en volg de instructies om uw wachtwoord te resetten.'}
                </AlertDescription>
              </Alert>

              <Button variant="outline" className="w-full rounded-full py-6 border-none bg-cream hover:bg-wheat text-espresso transition-all font-medium" asChild>
                <Link href="/auth/login">
                  Terug naar inloggen
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
                <Label htmlFor="email" className="text-xs uppercase tracking-wider text-taupe font-semibold pl-1">
                  E-mailadres
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="naam@bedrijf.nl"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="rounded-2xl border-none bg-cream px-4 py-6 focus-visible:ring-cedar/20 text-espresso placeholder:text-pebble transition-all"
                />
              </div>

              <div className="space-y-3">
                <Button
                  type="submit"
                  className="w-full rounded-full py-6 bg-cedar hover:bg-cedar/90 text-white shadow-lg hover:shadow-xl transition-all font-medium text-base"
                  disabled={isLoading}
                >
                  {isLoading ? 'Versturen...' : 'Herstellink versturen'}
                </Button>

                <Button variant="ghost" className="w-full rounded-full py-6 text-taupe hover:text-espresso hover:bg-cream transition-all font-medium" asChild>
                  <Link href="/auth/login">
                    Terug naar inloggen
                  </Link>
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>

      <p className="mt-8 text-center text-xs text-pebble font-medium tracking-wide">
        Hulp nodig? Neem contact op met uw beheerder
      </p>
    </AuthLayout>
  )
}