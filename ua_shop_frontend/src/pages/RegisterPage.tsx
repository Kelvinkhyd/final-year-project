import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { registerUser, getRegisteredUsers, type ApiResponse, type RegisteredUser } from '../api/api'
import { ResultCard } from '../components/ResultCard'
import { UnicodeDisplay } from '../components/UnicodeDisplay'

const registerSchema = z.object({
  usernameUnicode: z.string().min(1, 'Username is required'),
  rawEmail: z.string().min(1, 'Email address is required'),
})
const loginSchema = z.object({
  rawEmail: z.string().min(1, 'Email address is required'),
})

type RegisterData = z.infer<typeof registerSchema>
type LoginData    = z.infer<typeof loginSchema>

interface Props {
  currentUser: RegisteredUser | null
  onRegistered: (user: RegisteredUser) => void
  onLogout: () => void
  onNavigate: (page: string) => void
}

export function RegisterPage({ currentUser, onRegistered, onLogout, onNavigate }: Props) {
  const [mode, setMode]               = useState<'register' | 'login'>('register')
  const [isLoading, setIsLoading]     = useState(false)
  const [result, setResult]           = useState<ApiResponse | null>(null)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [loginError, setLoginError]   = useState<string | null>(null)

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterData>({
    resolver: zodResolver(registerSchema)
  })
  const { register: loginReg, handleSubmit: handleLoginSubmit, formState: { errors: loginErrors } } = useForm<LoginData>({
    resolver: zodResolver(loginSchema)
  })

  // Register handler
  const onSubmitRegister = async (data: RegisterData) => {
    setIsLoading(true); setSubmitError(null)
    try {
      const res = await registerUser(data)
      setResult(res)
      if (res.isValid && res.user) onRegistered(res.user)
    } catch (err: unknown) {
      const e = err as { response?: { data?: { error?: string } } }
      setSubmitError(e?.response?.data?.error ?? 'Could not connect to the backend. Is it running?')
    } finally { setIsLoading(false) }
  }

  // Login handler — finds existing user by canonical email
  const onSubmitLogin = async (data: LoginData) => {
    setIsLoading(true); setLoginError(null)
    try {
      const users = await getRegisteredUsers()
      // Normalise the input for comparison
      const inputEmail = data.rawEmail.trim().toLowerCase()
      const found = users.find(u =>
        u.emailUnicode.toLowerCase() === inputEmail ||
        u.canonicalEmail.toLowerCase() === inputEmail
      )
      if (found) {
        onRegistered(found)
      } else {
        setLoginError('No account found with that email address. Please register first.')
      }
    } catch {
      setLoginError('Could not connect to the backend. Is it running?')
    } finally { setIsLoading(false) }
  }

  // ── Already logged in ──────────────────────────────────────────────────
  if (currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-xl mx-auto">
          <div className="card p-8 animate-fade-in">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-lg">
                  <span className="text-white text-2xl font-bold">
                    {currentUser.usernameUnicode.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">My Account</h1>
                  <p className="text-sm text-green-600 font-medium flex items-center gap-1 mt-0.5">
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    UA Identity Verified
                  </p>
                </div>
              </div>
              {/* Log Out button */}
              <button
                onClick={onLogout}
                className="flex items-center gap-2 text-sm text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-2 rounded-lg transition-all font-medium"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Sign Out
              </button>
            </div>

            <div className="bg-gray-50 rounded-xl border border-gray-100 p-5 space-y-3 mb-6">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Identity Details</p>
              <UnicodeDisplay label="Username"      value={currentUser.usernameUnicode} size="md" />
              <UnicodeDisplay label="Email Unicode" value={currentUser.emailUnicode} size="md" />
              <UnicodeDisplay label="Canonical"     value={currentUser.canonicalEmail} />
              <UnicodeDisplay label="ACE Domain"    value={currentUser.aceDomain} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => onNavigate('shop')} className="btn-primary text-center text-sm">
                Browse Shop
              </button>
              <button onClick={() => onNavigate('orders')} className="btn-secondary text-center text-sm">
                My Orders
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ── Register / Login forms ─────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-lg mx-auto">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl shadow-lg mb-4">
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900">
            {mode === 'register' ? 'Create Your Account' : 'Sign In'}
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {mode === 'register'
              ? 'Register using any name and email — any language, any script'
              : 'Sign in with your registered email address'
            }
          </p>
        </div>

        {/* Mode toggle */}
        <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
          <button
            onClick={() => { setMode('register'); setResult(null); setSubmitError(null); setLoginError(null) }}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
              mode === 'register' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Create Account
          </button>
          <button
            onClick={() => { setMode('login'); setResult(null); setSubmitError(null); setLoginError(null) }}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
              mode === 'login' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Sign In
          </button>
        </div>

        <div className="card p-8">

          {/* REGISTER FORM */}
          {mode === 'register' && (
            <>
              <div className="flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 mb-6">
                <svg className="w-4 h-4 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <p className="text-xs text-blue-700 font-medium">UA-compliant · IDNA2008 · RFC 6531 · Homograph Protection</p>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Username <span className="text-gray-400 font-normal">(any script)</span>
                  </label>
                  <input
                    {...register('usernameUnicode')}
                    dir="auto" type="text"
                    placeholder="Enter your name in any language"
                    className="input-field"
                  />
                  {errors.usernameUnicode && (
                    <p className="text-red-500 text-xs mt-1.5">{errors.usernameUnicode.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address <span className="text-gray-400 font-normal">(EAI supported)</span>
                  </label>
                  <input
                    {...register('rawEmail')}
                    dir="auto" type="text"
                    placeholder="e.g. user@example.com or 用户@例子.公司"
                    className="input-field"
                  />
                  <p className="text-xs text-gray-400 mt-1.5">Internationalised email addresses fully supported</p>
                  {errors.rawEmail && (
                    <p className="text-red-500 text-xs mt-1.5">{errors.rawEmail.message}</p>
                  )}
                </div>

                {submitError && (
                  <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                    <svg className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <p className="text-red-700 text-sm">{submitError}</p>
                  </div>
                )}

                <button
                  onClick={handleSubmit(onSubmitRegister)}
                  disabled={isLoading}
                  className="btn-primary w-full flex items-center justify-center gap-2 py-3.5"
                >
                  {isLoading ? (
                    <><svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Validating Identity...</>
                  ) : 'Create Account →'}
                </button>
              </div>

              {result && <ResultCard result={result} />}
            </>
          )}

          {/* LOGIN FORM */}
          {mode === 'login' && (
            <div className="space-y-5">
              <div className="flex items-center gap-2 bg-amber-50 border border-amber-100 rounded-xl px-4 py-3">
                <svg className="w-4 h-4 text-amber-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-xs text-amber-700 font-medium">Enter the exact email you registered with</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Registered Email Address
                </label>
                <input
                  {...loginReg('rawEmail')}
                  dir="auto" type="text"
                  placeholder="e.g. jane@company.africa or 用户@例子.公司"
                  className="input-field"
                />
                {loginErrors.rawEmail && (
                  <p className="text-red-500 text-xs mt-1.5">{loginErrors.rawEmail.message}</p>
                )}
              </div>

              {loginError && (
                <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                  <svg className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  <p className="text-red-700 text-sm">{loginError}</p>
                </div>
              )}

              <button
                onClick={handleLoginSubmit(onSubmitLogin)}
                disabled={isLoading}
                className="btn-primary w-full flex items-center justify-center gap-2 py-3.5"
              >
                {isLoading ? (
                  <><svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Signing In...</>
                ) : 'Sign In →'}
              </button>
            </div>
          )}
        </div>

        {/* Sample identities */}
        <div className="mt-6 card p-5">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Try These Sample Inputs</p>
          <div className="space-y-2">
            {[
              { label:'Chinese',  email:'用户@例子.公司' },
              { label:'Arabic',   email:'أحمد@موقع.مصر' },
              { label:'Long TLD', email:'user@company.africa' },
            ].map(s => (
              <div key={s.label} className="flex items-center gap-3">
                <span className="text-xs text-gray-400 w-14 flex-shrink-0">{s.label}</span>
                <span dir="auto" className="font-mono text-xs text-blue-700 bg-blue-50 px-2 py-1 rounded-lg border border-blue-100">{s.email}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
