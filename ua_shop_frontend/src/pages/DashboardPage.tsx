import { useState, useEffect, useCallback } from 'react'
import { registerUser, getRegisteredUsers, type ApiResponse, type RegisteredUser } from '../api/api'
import { UnicodeDisplay } from '../components/UnicodeDisplay'

export function DashboardPage() {
  const [testEmail,    setTestEmail]    = useState('')
  const [testResult,   setTestResult]   = useState<ApiResponse | null>(null)
  const [isLoading,    setIsLoading]    = useState(false)
  const [bidiSample,   setBidiSample]   = useState('')
  const [users,        setUsers]        = useState<RegisteredUser[]>([])
  const [usersLoading, setUsersLoading] = useState(true)
  const [refreshing,   setRefreshing]   = useState(false)

  const fetchUsers = useCallback(async () => {
    try {
      const data = await getRegisteredUsers()
      setUsers(data)
    } catch (e) {
      console.error('Failed to fetch users:', e)
    }
  }, [])

  useEffect(() => {
    fetchUsers().finally(() => setUsersLoading(false))
  }, [fetchUsers])

  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchUsers()
    setTimeout(() => setRefreshing(false), 600)
  }

  const runTest = async () => {
    if (!testEmail.trim()) return
    setIsLoading(true); setTestResult(null)
    try {
      const res = await registerUser({ usernameUnicode: 'dashboard-test', rawEmail: testEmail })
      setTestResult(res)
      await fetchUsers()
    } catch (err: unknown) {
      const e = err as { response?: { data?: { error?: string } } }
      setTestResult({ isValid: false, error: e?.response?.data?.error ?? 'Network error' })
    } finally { setIsLoading(false) }
  }

  const quickTests = [
    { label:'Chinese',           value:'用户@例子.公司' },
    { label:'Arabic (RTL)',      value:'أحمد@موقع.مصر' },
    { label:'Greek',             value:'δοκιμή@παράδειγμα.ελ' },
    { label:'Long gTLD',         value:'user@company.africa' },
    { label:'Homograph ⚠',      value:'p\u0430ypal@example.com' },
  ]

  const scriptColor: Record<string,string> = {
    Latin:'bg-blue-100 text-blue-700', Hanzi:'bg-red-100 text-red-700',
    Arabic:'bg-green-100 text-green-700', Greek:'bg-purple-100 text-purple-700',
    Cyrillic:'bg-orange-100 text-orange-700', Common:'bg-gray-100 text-gray-600',
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-md">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-500 text-sm mt-0.5">UA Compliance Testing Panel — Lecturer Demonstration</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            {[
              { label:'Registered Users',  value: usersLoading ? '...' : String(users.length), color:'blue' },
              { label:'UA Pillars Active',  value:'5 / 5',   color:'green' },
              { label:'Security Layer',     value:'Active',  color:'purple' },
            ].map(stat => (
              <div key={stat.label} className={`rounded-xl border p-4 text-center ${
                stat.color==='blue'   ? 'bg-blue-50 border-blue-100' :
                stat.color==='green'  ? 'bg-green-50 border-green-100' :
                'bg-purple-50 border-purple-100'
              }`}>
                <p className={`text-2xl font-extrabold ${
                  stat.color==='blue' ? 'text-blue-700' : stat.color==='green' ? 'text-green-700' : 'text-purple-700'
                }`}>{stat.value}</p>
                <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

        {/* Panel 1: UAVE Tester */}
        <div className="card p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Live UAVE Tester</h2>
              <p className="text-xs text-gray-500">Test any email through the full UA Validation Engine pipeline</p>
            </div>
          </div>

          <div className="flex gap-2 mb-4">
            <input dir="auto" type="text" value={testEmail}
              onChange={e => setTestEmail(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && runTest()}
              placeholder="Type any email — 用户@例子.公司 or user@company.africa"
              className="input-field flex-1" />
            <button onClick={runTest} disabled={isLoading} className="btn-primary px-6 flex items-center gap-2 flex-shrink-0">
              {isLoading
                ? <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                : <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              }
              {isLoading ? 'Testing...' : 'Test'}
            </button>
          </div>

          <div className="flex gap-2 flex-wrap mb-4">
            {quickTests.map(qt => (
              <button key={qt.label} onClick={() => setTestEmail(qt.value)}
                className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 bg-gray-50 text-gray-600 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 font-mono transition-all">
                {qt.label}
              </button>
            ))}
          </div>

          {testResult && (
            <div className={`rounded-2xl border p-5 animate-slide-up ${testResult.isValid ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
              <div className="flex items-center gap-2 mb-3">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center ${testResult.isValid ? 'bg-green-200' : 'bg-red-200'}`}>
                  {testResult.isValid
                    ? <svg className="w-4 h-4 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                    : <svg className="w-4 h-4 text-red-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                  }
                </div>
                <p className={`font-bold text-sm ${testResult.isValid ? 'text-green-800' : 'text-red-800'}`}>
                  {testResult.isValid ? 'Valid — ' : 'Invalid — '}{testResult.message ?? testResult.error}
                </p>
              </div>

              {testResult.user && (
                <div className="bg-white rounded-xl p-4 space-y-2 mb-3 border border-gray-100">
                  <UnicodeDisplay label="Email Unicode"   value={testResult.user.emailUnicode} />
                  <UnicodeDisplay label="Canonical Email" value={testResult.user.canonicalEmail} />
                  <UnicodeDisplay label="ACE Domain"      value={testResult.user.aceDomain} />
                </div>
              )}

              {testResult.uaveMetrics && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="bg-white rounded-xl p-3 border border-gray-100 text-center">
                    <p className="text-lg font-extrabold text-blue-700">{testResult.uaveMetrics.latencyMs}ms</p>
                    <p className="text-xs text-gray-400">Latency</p>
                  </div>
                  <div className="bg-white rounded-xl p-3 border border-gray-100 text-center">
                    <p className={`text-sm font-bold ${scriptColor[testResult.uaveMetrics.scriptAnalysis.primaryScript] ?? 'text-gray-700'}`}>
                      {testResult.uaveMetrics.scriptAnalysis.primaryScript}
                    </p>
                    <p className="text-xs text-gray-400">Primary Script</p>
                  </div>
                  <div className="bg-white rounded-xl p-3 border border-gray-100 text-center">
                    <p className="text-lg font-extrabold text-gray-800">{testResult.uaveMetrics.scriptAnalysis.detectedScripts.length}</p>
                    <p className="text-xs text-gray-400">Scripts Found</p>
                  </div>
                  <div className="bg-white rounded-xl p-3 border border-gray-100 text-center">
                    <p className={`text-sm font-bold ${testResult.uaveMetrics.scriptAnalysis.isConsistent ? 'text-green-600' : 'text-red-600'}`}>
                      {testResult.uaveMetrics.scriptAnalysis.isConsistent ? 'Clean' : 'Mixed'}
                    </p>
                    <p className="text-xs text-gray-400">Script Check</p>
                  </div>
                </div>
              )}

              {testResult.uaveMetrics?.scriptAnalysis.possibleHomographAttack && (
                <div className="mt-3 flex items-center gap-3 bg-red-100 border border-red-300 rounded-xl px-4 py-3">
                  <svg className="w-5 h-5 text-red-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <p className="text-red-800 text-sm font-bold">Security Alert: Homograph Attack Pattern Detected & Blocked</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Panel 2: BiDi Test */}
        <div className="card p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">BiDi Layout Test</h2>
              <p className="text-xs text-gray-500">Type Arabic or Hebrew text to see automatic RTL layout switching</p>
            </div>
          </div>
          <input dir="auto" type="text" value={bidiSample}
            onChange={e => setBidiSample(e.target.value)}
            placeholder="Type Arabic or Hebrew — e.g. مرحباً بالعالم"
            className="input-field mb-4" />
          {bidiSample && (
            <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl border border-blue-100 p-5 animate-fade-in">
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-3">Live Output — dir=auto</p>
              <span dir="auto" className="text-2xl font-semibold text-gray-900 block leading-relaxed">{bidiSample}</span>
            </div>
          )}
        </div>

        {/* Panel 3: Registered Users */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">Registered Identities</h2>
                <p className="text-xs text-gray-500">{users.length} UA-verified users in the database</p>
              </div>
            </div>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="btn-ghost text-sm flex items-center gap-1.5 disabled:opacity-50"
            >
              <svg className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>

          {usersLoading ? (
            <div className="flex items-center justify-center py-8">
              <svg className="animate-spin w-6 h-6 text-blue-500" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
              <p className="text-gray-400 text-sm">No users yet — use the UAVE tester above to register one</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-gray-100">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    {['Username','Email (Unicode)','ACE Domain','Registered'].map(h => (
                      <th key={h} className="text-start text-xs text-gray-400 font-semibold uppercase tracking-wider px-4 py-3">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {users.map(u => (
                    <tr key={u.id} className="hover:bg-blue-50/30 transition-colors">
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center flex-shrink-0">
                            <span className="text-white text-xs font-bold">{u.usernameUnicode.charAt(0).toUpperCase()}</span>
                          </div>
                          <span dir="auto" className="font-semibold text-gray-900">{u.usernameUnicode}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <span dir="auto" className="font-mono text-xs text-blue-700 bg-blue-50 px-2 py-1 rounded-lg">{u.emailUnicode}</span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="font-mono text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-lg">{u.aceDomain}</span>
                      </td>
                      <td className="px-4 py-3.5 text-xs text-gray-400">
                        {new Date(u.createdAt).toLocaleDateString('en-GB', { day:'numeric', month:'short', year:'numeric' })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
