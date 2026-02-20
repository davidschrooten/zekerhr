'use client'

import React, { useState } from 'react'
import { Link, useRouter } from '@/i18n/routing'
import { AuthLayout } from '@/components/auth-layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { createClient } from '@/lib/supabase/client'
import { useTranslations } from 'next-intl'

export default function SignupPage() {
  const router = useRouter()
  const t = useTranslations('Auth')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError(t('passwords_do_not_match'))
      return
    }

    if (password.length < 8) {
      setError(t('password_too_short'))
      return
    }

    setIsLoading(true)

    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      
      if (userError || !user) {
         // If no session, we can't update password. The invite link should have logged them in via callback.
         // Or they are trying to sign up publicly which is disabled.
         throw new Error(t('no_valid_session'))
      }

      // Update password
      const { error: passwordError } = await supabase.auth.updateUser({
        password: password
      })
      if (passwordError) throw passwordError

      // Update profile
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ full_name: `${firstName} ${lastName}`.trim() })
        .eq('id', user.id)

      if (profileError) throw profileError

      router.push('/dashboard/employee')

    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError(t('error_generic'))
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthLayout>
      <Card className="border-none shadow-organic rounded-organic bg-white overflow-hidden">
        <CardHeader className="space-y-2 text-center pt-10 px-8">
          <CardTitle className="text-3xl font-medium tracking-tight text-espresso">{t('signup_title')}</CardTitle>
          <CardDescription className="text-taupe font-normal">
            {t('signup_description')}
          </CardDescription>
        </CardHeader>
        <CardContent className="px-8 pb-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <Alert className="border-none bg-red-50 text-red-700 rounded-2xl shadow-sm">
                <AlertDescription className="font-medium">{error}</AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-xs uppercase tracking-wider text-taupe font-semibold pl-1">
                  {t('first_name')}
                </Label>
                <Input
                  id="firstName"
                  type="text"
                  placeholder="Jan"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  className="rounded-2xl border-none bg-cream px-4 py-6 focus-visible:ring-cedar/20 text-espresso placeholder:text-pebble transition-all"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-xs uppercase tracking-wider text-taupe font-semibold pl-1">
                  {t('last_name')}
                </Label>
                <Input
                  id="lastName"
                  type="text"
                  placeholder="de Vries"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                  className="rounded-2xl border-none bg-cream px-4 py-6 focus-visible:ring-cedar/20 text-espresso placeholder:text-pebble transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-xs uppercase tracking-wider text-taupe font-semibold pl-1">
                {t('password')}
              </Label>
              <Input
                id="password"
                type="password"
                placeholder={t('password_min_chars')}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="rounded-2xl border-none bg-cream px-4 py-6 focus-visible:ring-cedar/20 text-espresso placeholder:text-pebble transition-all"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-xs uppercase tracking-wider text-taupe font-semibold pl-1">
                {t('confirm_password')}
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder={t('repeat_password')}
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
              {isLoading ? t('creating_account') : t('create_account')}
            </Button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-taupe font-normal">
              {t('already_account') + ' '}
              <Link
                href="/auth/login"
                className="font-medium text-cedar hover:text-espresso transition-colors"
              >
                {t('login_link')}
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>

      <p className="mt-8 text-center text-xs text-pebble font-medium tracking-wide">
        {t('terms_signup')}
      </p>
    </AuthLayout>
  )
}