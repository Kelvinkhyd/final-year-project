interface HomePageProps { onNavigate: (page: string) => void }

export function HomePage({ onNavigate }: HomePageProps) {
  return (
    <div className="min-h-screen">

      {/* Hero */}
      <div className="relative bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-300 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white text-xs font-semibold px-4 py-2 rounded-full mb-6 border border-white/30">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse-soft" />
              ICANN Universal Acceptance Compliant
            </div>
            <h1 className="text-5xl sm:text-6xl font-extrabold text-white leading-tight mb-6">
              Shop in Your<br />
              <span className="text-blue-200">Own Language</span>
            </h1>
            <p className="text-xl text-blue-100 mb-4 max-w-xl leading-relaxed">
              The first e-commerce platform built for the global internet. Register and shop with your email address in <strong className="text-white">any script, any language</strong>.
            </p>
            <p className="text-blue-200 text-sm mb-8">
              Arabic · Chinese · Greek · Cyrillic · Devanagari · and 100+ more
            </p>
            <div className="flex flex-wrap gap-4">
              <button onClick={() => onNavigate('shop')}
                className="bg-white text-blue-700 font-bold px-8 py-3.5 rounded-xl hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0">
                Browse Products →
              </button>
              <button onClick={() => onNavigate('register')}
                className="border-2 border-white/60 text-white font-semibold px-8 py-3.5 rounded-xl hover:bg-white/10 transition-all backdrop-blur-sm">
                Create Account / Sign In →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            {[
              { value: '5B+',   label: 'Global Users Supported' },
              { value: '100+',  label: 'Languages & Scripts' },
              { value: '5',     label: 'UA Compliance Pillars' },
              { value: 'RFC 6531', label: 'EAI Standard Compliant' },
            ].map(stat => (
              <div key={stat.label}>
                <p className="text-2xl font-extrabold text-blue-600">{stat.value}</p>
                <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* UA Pillars */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-3">Built on the 5 UA Pillars</h2>
          <p className="text-gray-500 max-w-2xl mx-auto">Every feature maps directly to the ICANN Universal Acceptance Standard</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            { pillar:'Accept',   icon:'✅', color:'green',  title:'No ASCII Restrictions',      desc:'HTML inputs and REST API accept any Unicode character — Arabic, Hanzi, Cyrillic, emoji.' },
            { pillar:'Validate', icon:'🔍', color:'blue',   title:'IDNA2008 Validation',         desc:'Custom UAVE pipeline: NFC normalisation, Punycode conversion, EAI format check, and homograph scanning.' },
            { pillar:'Process',  icon:'⚙️',  color:'purple', title:'Unicode-Safe Processing',     desc:'NFC canonical composition, Punycode ACE conversion, and atomic Prisma database transactions.' },
            { pillar:'Store',    icon:'🗄️',  color:'orange', title:'ICU-Collated PostgreSQL',     desc:'UTF-8 encoding with custom ICU collation prevents the Encoding vs Collation Trap.' },
            { pillar:'Display',  icon:'🌐', color:'teal',   title:'RTL/LTR Auto-Switching',      desc:'dir=auto on all inputs and displays. Tailwind logical properties throughout. Zero mojibake.' },
            { pillar:'Security', icon:'🛡️', color:'red',    title:'Homograph Attack Detection',  desc:'Script consistency checker blocks mixed Latin+Cyrillic spoofing before it reaches the database.' },
          ].map(f => {
            const colorMap: Record<string,string> = {
              green:'bg-green-50 border-green-200 text-green-600',
              blue:'bg-blue-50 border-blue-200 text-blue-600',
              purple:'bg-purple-50 border-purple-200 text-purple-600',
              orange:'bg-orange-50 border-orange-200 text-orange-600',
              teal:'bg-teal-50 border-teal-200 text-teal-600',
              red:'bg-red-50 border-red-200 text-red-600',
            }
            const badgeMap: Record<string,string> = {
              green:'bg-green-100 text-green-700',blue:'bg-blue-100 text-blue-700',
              purple:'bg-purple-100 text-purple-700',orange:'bg-orange-100 text-orange-700',
              teal:'bg-teal-100 text-teal-700',red:'bg-red-100 text-red-700',
            }
            return (
              <div key={f.pillar} className={`rounded-2xl border p-6 ${colorMap[f.color]} transition-all hover:-translate-y-1 hover:shadow-md duration-200`}>
                <div className="text-3xl mb-3">{f.icon}</div>
                <span className={`badge mb-3 ${badgeMap[f.color]}`}>UA: {f.pillar}</span>
                <h3 className="font-bold text-gray-900 text-base mb-2">{f.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{f.desc}</p>
              </div>
            )
          })}
        </div>
      </div>

      {/* Demo identities */}
      <div className="bg-gradient-to-br from-gray-900 to-blue-900 py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-white mb-2">All of these are valid on UA-Shop</h2>
            <p className="text-blue-300 text-sm">Try registering with any of these email addresses</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { script:'Chinese (Hanzi)',  email:'用户@例子.公司',          note:'Punycode domain conversion',   flag:'🇨🇳' },
              { script:'Arabic (RTL)',     email:'أحمد@موقع.مصر',         note:'Right-to-left rendering',      flag:'🇪🇬' },
              { script:'Greek',           email:'δοκιμή@παράδειγμα.ελ',  note:'IDN domain support',           flag:'🇬🇷' },
              { script:'New gTLD',        email:'user@global.accountant', note:'Long TLD acceptance',          flag:'🌍' },
            ].map(d => (
              <div key={d.script} className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 px-5 py-4 hover:bg-white/15 transition-all">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">{d.flag}</span>
                  <span className="text-xs font-semibold text-blue-300 uppercase tracking-wider">{d.script}</span>
                </div>
                <p dir="auto" className="font-mono text-white font-semibold text-base mb-1">{d.email}</p>
                <p className="text-xs text-blue-400">{d.note}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <button onClick={() => onNavigate('register')}
              className="bg-blue-500 hover:bg-blue-400 text-white font-bold px-10 py-3.5 rounded-xl transition-all shadow-premium hover:shadow-lg hover:-translate-y-0.5">
              Register Your Identity Free →
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
