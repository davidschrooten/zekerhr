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
      <Card className="border-border shadow-sm">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-semibold tracking-tight">{t('signup_title')}</CardTitle>
          <CardDescription className="text-muted-foreground">
            {t('signup_description')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive" className="border-destructive/50 bg-destructive/10">
                <AlertDescription className="text-destructive">{error}</AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">{t('first_name')}</Label>
                <Input
                  id="firstName"
                  type="text"
                  placeholder="Jan"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">{t('last_name')}</Label>
                <Input
                  id="lastName"
                  type="text"
                  placeholder="de Vries"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">{t('password')}</Label>
              <Input
                id="password"
                type="password"
                placeholder={t('password_min_chars')}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">{t('confirm_password')}</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder={t('repeat_password')}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? t('creating_account') : t('create_account')}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              {t('already_account') + ' '}
              <Link
                href="/auth/login"
                className="font-medium text-foreground hover:underline"
              >
                {t('login_link')}
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>

      <p className="mt-6 text-center text-xs text-muted-foreground">
        {t('terms_signup')}
      </p>
    </AuthLayout>
  )
}