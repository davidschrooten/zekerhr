'use client'

import React, { useState } from 'react'
import { Link, useRouter } from '@/i18n/routing'
import { useTranslations } from 'next-intl'
import { createClient } from '@/lib/supabase/client'
import { AuthLayout } from '@/components/auth-layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'

export default function LoginPage() {
  const t = useTranslations('Auth')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error
      // Redirect to the main dashboard which handles role-based routing
      // (e.g. shows role selection for admins, redirects employees directly)
      router.push('/dashboard')
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError(t('error_login'))
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthLayout>
      <Card className="border-none shadow-organic rounded-organic bg-white overflow-hidden">
        <CardHeader className="space-y-2 text-center pt-10 px-8">
          <CardTitle className="text-3xl font-medium tracking-tight text-espresso">{t('login')}</CardTitle>
          <CardDescription className="text-taupe font-normal">
            {t('login_description')}
          </CardDescription>
        </CardHeader>
        <CardContent className="px-8 pb-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <Alert className="border-none bg-red-50 text-red-700 rounded-2xl shadow-sm">
                <AlertDescription className="font-medium">{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs uppercase tracking-wider text-taupe font-semibold pl-1">
                {t('email')}
              </Label>
              <Input
                id="email"
                type="email"
                placeholder={t('email_placeholder')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="rounded-2xl border-none bg-cream px-4 py-6 focus-visible:ring-cedar/20 text-espresso placeholder:text-pebble transition-all"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between pl-1">
                <Label htmlFor="password" className="text-xs uppercase tracking-wider text-taupe font-semibold">
                  {t('password')}
                </Label>
                <Link
                  href="/auth/forgot-password"
                  className="text-xs font-medium text-cedar hover:text-espresso transition-colors"
                >
                  {t('forgot_password')}
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder={t('password_placeholder')}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="rounded-2xl border-none bg-cream px-4 py-6 focus-visible:ring-cedar/20 text-espresso placeholder:text-pebble transition-all"
              />
            </div>

            <Button
              type="submit"
              className="w-full rounded-full py-6 bg-cedar hover:bg-cedar/90 text-white shadow-lg hover:shadow-xl transition-all font-medium text-base"
              disabled={isLoading}
            >
              {isLoading ? t('logging_in') : t('login')}
            </Button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-taupe font-normal">
              {t('invitation_received') + ' '}
              <Link
                href="/auth/sign-up"
                className="font-medium text-cedar hover:text-espresso transition-colors"
              >
                {t('signup_link')}
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>

      <p className="mt-8 text-center text-xs text-pebble font-medium tracking-wide">
        {t('terms_agreement')}
      </p>
    </AuthLayout>
  )
}