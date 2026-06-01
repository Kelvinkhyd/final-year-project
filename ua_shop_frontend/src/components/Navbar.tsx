import { useState } from 'react'
import { type CartItem, type RegisteredUser } from '../api/api'

interface NavbarProps {
  currentPage: string
  onNavigate: (page: string) => void
  cart: CartItem[]
  currentUser: RegisteredUser | null
  onLogout: () => void
}

export function Navbar({ currentPage, onNavigate, cart, currentUser, onLogout }: NavbarProps) {
  const [showDropdown, setShowDropdown] = useState(false)
  const totalItems = cart.reduce((s, i) => s + i.quantity, 0)

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <button onClick={() => onNavigate('home')} className="flex items-center gap-3 group">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center shadow-sm group-hover:shadow-md transition-all">
              <span className="text-white font-bold text-sm">U</span>
            </div>
            <div className="hidden sm:block">
              <span className="font-bold text-gray-900 text-lg leading-none">UA-Shop</span>
              <p className="text-xs text-gray-400 leading-none mt-0.5">Global Commerce</p>
            </div>
          </button>

          {/* Nav links */}
          <div className="flex items-center gap-1">
            {[
              { id: 'home',      label: 'Home' },
              { id: 'shop',      label: 'Shop' },
              { id: 'dashboard', label: 'Admin' },
            ].map(item => (
              <button key={item.id} onClick={() => onNavigate(item.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                  currentPage === item.id
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}>
                {item.label}
              </button>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* Cart */}
            <button onClick={() => onNavigate('cart')}
              className={`relative flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                currentPage === 'cart' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'
              }`}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <span className="hidden sm:block">Cart</span>
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold animate-fade-in">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Account — with dropdown for logged-in users */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-2 bg-green-50 text-green-700 border border-green-200 px-3 py-2 rounded-lg text-sm font-medium hover:bg-green-100 transition-all"
                >
                  <div className="w-6 h-6 rounded-full bg-green-200 flex items-center justify-center">
                    <span className="text-green-800 text-xs font-bold">
                      {currentUser.usernameUnicode.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="hidden sm:block max-w-24 truncate" dir="auto">
                    {currentUser.usernameUnicode}
                  </span>
                  <svg className={`w-3 h-3 transition-transform ${showDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown menu */}
                {showDropdown && (
                  <div className="absolute end-0 mt-2 w-52 bg-white rounded-xl border border-gray-100 shadow-lg py-1 z-50 animate-fade-in">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-xs text-gray-400 font-medium">Signed in as</p>
                      <p dir="auto" className="text-sm font-semibold text-gray-900 truncate mt-0.5">
                        {currentUser.usernameUnicode}
                      </p>
                      <p dir="auto" className="text-xs text-gray-500 font-mono truncate">
                        {currentUser.canonicalEmail}
                      </p>
                    </div>
                    <button
                      onClick={() => { setShowDropdown(false); onNavigate('register') }}
                      className="w-full text-start px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                    >
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      My Account
                    </button>
                    <button
                      onClick={() => { setShowDropdown(false); onNavigate('orders') }}
                      className="w-full text-start px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                    >
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      My Orders
                    </button>
                    <div className="border-t border-gray-100 mt-1">
                      <button
                        onClick={() => { setShowDropdown(false); onLogout() }}
                        className="w-full text-start px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button onClick={() => onNavigate('register')}
                className="flex items-center gap-2 bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-all">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span>Register</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Close dropdown when clicking outside */}
      {showDropdown && (
        <div className="fixed inset-0 z-40" onClick={() => setShowDropdown(false)} />
      )}
    </nav>
  )
}
