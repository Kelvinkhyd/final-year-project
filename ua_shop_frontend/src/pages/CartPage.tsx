import { useState } from 'react'
import { placeOrder, type CartItem, type RegisteredUser, type OrderResponse } from '../api/api'

interface Props {
  cart: CartItem[]
  onUpdateQty: (productId: string, qty: number) => void
  onRemove: (productId: string) => void
  onClearCart: () => void
  currentUser: RegisteredUser | null
  onNavigate: (page: string) => void
}

export function CartPage({ cart, onUpdateQty, onRemove, onClearCart, currentUser, onNavigate }: Props) {
  const [isPlacing, setIsPlacing] = useState(false)
  const [orderResult, setOrderResult] = useState<OrderResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  const total = cart.reduce((s, i) => s + i.product.price * i.quantity, 0)

  const handlePlaceOrder = async () => {
    if (!currentUser) { onNavigate('register'); return }
    setIsPlacing(true); setError(null)
    try {
      const res = await placeOrder({
        userId: currentUser.id,
        items: cart.map(i => ({ productId: i.product.id, quantity: i.quantity }))
      })
      setOrderResult(res)
      if (res.success) onClearCart()
    } catch (err: unknown) {
      const e = err as { response?: { data?: { error?: string } } }
      setError(e?.response?.data?.error ?? 'Failed to place order. Please try again.')
    } finally { setIsPlacing(false) }
  }

  // ── Order Confirmed Screen ──────────────────────────────────────────────
  if (orderResult?.success && orderResult.order) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="card p-8 max-w-md w-full text-center animate-slide-up">
        <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-5 shadow-lg">
          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-extrabold text-gray-900 mb-1">Order Confirmed!</h2>
        <p className="text-gray-500 text-sm mb-6">
          A confirmation email has been sent to your registered address
        </p>

        <div className="bg-gray-50 rounded-2xl border border-gray-100 p-5 text-start mb-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Order ID</span>
            <span className="font-mono text-sm font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-lg">
              #{orderResult.order.id.slice(0, 8).toUpperCase()}
            </span>
          </div>

          <div className="space-y-2 mb-4">
            {orderResult.order.items.map((item, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span className="text-gray-600">
                  {item.productName}
                  <span className="text-gray-400 ms-1">× {item.quantity}</span>
                </span>
                <span className="font-semibold text-gray-800">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-200 pt-3 flex justify-between font-bold text-base">
            <span>Total Paid</span>
            <span className="text-blue-700">${orderResult.order.totalAmount.toFixed(2)}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button onClick={() => onNavigate('shop')} className="btn-primary text-sm py-2.5">
            Keep Shopping
          </button>
          <button onClick={() => onNavigate('orders')} className="btn-secondary text-sm py-2.5">
            My Orders
          </button>
        </div>
      </div>
    </div>
  )

  // ── Empty Cart ──────────────────────────────────────────────────────────
  if (cart.length === 0) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center animate-fade-in">
        <div className="w-24 h-24 bg-gray-100 rounded-3xl flex items-center justify-center mx-auto mb-5">
          <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-gray-700 mb-2">Your cart is empty</h2>
        <p className="text-gray-400 text-sm mb-6">Browse our products and add something you like</p>
        <button onClick={() => onNavigate('shop')} className="btn-primary">Browse Products →</button>
      </div>
    </div>
  )

  // ── Cart with items ─────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-6">Your Cart</h1>

        <div className="space-y-3 mb-6">
          {cart.map(item => (
            <div key={item.product.id} className="card p-4 flex gap-4 items-center animate-fade-in">
              <img src={item.product.imageUrl} alt={item.product.name}
                className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
                onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400' }} />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 text-sm truncate">{item.product.name}</p>
                <p className="text-blue-600 font-bold text-sm mt-0.5">${item.product.price.toFixed(2)}</p>
              </div>
              <div className="flex items-center gap-2 bg-gray-50 rounded-xl border border-gray-200 p-1">
                <button onClick={() => onUpdateQty(item.product.id, item.quantity - 1)}
                  className="w-7 h-7 rounded-lg bg-white border border-gray-200 text-gray-700 hover:bg-gray-100 flex items-center justify-center font-bold text-sm shadow-sm">−</button>
                <span className="w-6 text-center text-sm font-bold text-gray-900">{item.quantity}</span>
                <button onClick={() => onUpdateQty(item.product.id, item.quantity + 1)}
                  className="w-7 h-7 rounded-lg bg-white border border-gray-200 text-gray-700 hover:bg-gray-100 flex items-center justify-center font-bold text-sm shadow-sm">+</button>
              </div>
              <div className="text-end">
                <p className="font-bold text-gray-900">${(item.product.price * item.quantity).toFixed(2)}</p>
                <button onClick={() => onRemove(item.product.id)} className="text-xs text-red-400 hover:text-red-600 mt-1">Remove</button>
              </div>
            </div>
          ))}
        </div>

        <div className="card p-6">
          <div className="flex justify-between text-xl font-extrabold text-gray-900 mb-5">
            <span>Total</span>
            <span className="text-blue-700">${total.toFixed(2)}</span>
          </div>

          {!currentUser ? (
            <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4">
              <svg className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <p className="text-sm text-amber-700">
                You need to <button onClick={() => onNavigate('register')} className="font-bold underline">register</button> before placing an order
              </p>
            </div>
          ) : (
            <div className="flex items-start gap-3 bg-blue-50 border border-blue-100 rounded-xl p-4 mb-4">
              <svg className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
              <div>
                <p className="text-xs text-blue-500 font-medium">Ordering as</p>
                <p dir="auto" className="text-sm font-bold text-blue-800">{currentUser.usernameUnicode}</p>
                <p dir="auto" className="text-xs text-blue-600 font-mono mt-0.5">{currentUser.canonicalEmail}</p>
              </div>
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-4">
              <svg className="w-4 h-4 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <button onClick={handlePlaceOrder} disabled={isPlacing}
            className="btn-primary w-full py-3.5 flex items-center justify-center gap-2 text-base">
            {isPlacing ? (
              <><svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Placing Order...</>
            ) : currentUser ? 'Place Order →' : 'Register to Order'}
          </button>
        </div>
      </div>
    </div>
  )
}
