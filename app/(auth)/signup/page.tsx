import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { MapPin } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { SignupForm } from '@/components/auth/SignupForm'

export const metadata: Metadata = {
  title: 'Sign Up',
  description: 'Create a FarmersMarkets.io account to save your favorite markets, write reviews, and claim your market listing.',
}

export default async function SignupPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <MapPin className="w-12 h-12 text-green-600" />
        </div>
        <h1 className="mt-6 text-center text-3xl font-bold text-gray-900">
          Create your account
        </h1>
        <p className="mt-2 text-center text-sm text-gray-600">
          Join thousands of farmers market enthusiasts
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-sm border border-gray-200 sm:rounded-xl sm:px-10">
          <SignupForm />
        </div>
      </div>
    </div>
  )
}
