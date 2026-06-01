import { type ApiResponse } from '../api/api'
import { UnicodeDisplay } from './UnicodeDisplay'

export function ResultCard({ result }: { result: ApiResponse }) {
  return (
    <div className={`mt-5 rounded-2xl border p-5 animate-slide-up ${
      result.isValid
        ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200'
        : 'bg-gradient-to-br from-red-50 to-rose-50 border-red-200'
    }`}>
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
          result.isValid ? 'bg-green-100' : 'bg-red-100'
        }`}>
          {result.isValid
            ? <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
            : <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
          }
        </div>
        <div>
          <p className={`font-semibold text-sm ${result.isValid ? 'text-green-800' : 'text-red-800'}`}>
            {result.isValid ? 'Identity Verified Successfully' : 'Validation Failed'}
          </p>
          <p className="text-xs text-gray-500 mt-0.5">{result.message ?? result.error}</p>
        </div>
      </div>

      {result.user && (
        <div className="bg-white rounded-xl border border-gray-100 p-4 space-y-2.5 mb-3">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Identity Details</p>
          <UnicodeDisplay label="Username"       value={result.user.usernameUnicode} />
          <UnicodeDisplay label="Email Unicode"  value={result.user.emailUnicode} />
          <UnicodeDisplay label="Canonical"      value={result.user.canonicalEmail} />
          <UnicodeDisplay label="ACE Domain"     value={result.user.aceDomain} />
        </div>
      )}

      {result.uaveMetrics && (
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">UAVE Metrics</p>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-blue-50 rounded-lg p-3 text-center">
              <p className="text-lg font-bold text-blue-700">{result.uaveMetrics.latencyMs}ms</p>
              <p className="text-xs text-blue-500">Processing Time</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-3 text-center">
              <p className="text-lg font-bold text-purple-700">{result.uaveMetrics.scriptAnalysis.primaryScript}</p>
              <p className="text-xs text-purple-500">Primary Script</p>
            </div>
          </div>
          {result.uaveMetrics.scriptAnalysis.possibleHomographAttack && (
            <div className="mt-3 flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              <svg className="w-4 h-4 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              <p className="text-xs font-semibold text-red-700">Security Alert: Homograph Attack Detected & Blocked</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
