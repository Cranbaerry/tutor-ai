import { type NextRequest } from 'next/server'
import { updateSession } from '@/utils/supabase/middleware'

export async function middleware(request: NextRequest) {
    return await updateSession(request)
}

// Only demo page required to login, can add more later
export const config = {
    matcher: ['/kuisioner', '/demo', '/evaluasi'],
}