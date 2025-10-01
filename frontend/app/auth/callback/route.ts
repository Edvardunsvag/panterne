import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  // Check if Supabase is configured
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
    console.warn('Supabase not configured')
    return NextResponse.redirect(new URL('/auth/auth-code-error', request.url))
  }

  // Dynamic import to avoid build-time execution
  const { supabase } = await import('@/lib/supabase')
  
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  return NextResponse.redirect(`${origin}/auth/auth-code-error`)
} 