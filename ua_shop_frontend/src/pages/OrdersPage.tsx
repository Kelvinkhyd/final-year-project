import { useEffect, useState } from 'react'
import { getUserOrders, type UserOrder, type RegisteredUser } from '../api/api'

interface Props { currentUser: RegisteredUser | null; onNavigate: (page: string) => void }

export function OrdersPage({ currentUser, onNavigate }: Props) {
  const [orders, setOrders]   = useState<UserOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState<string | null>(null)

  useEffect(() => {
    if (!currentUser) { setLoading(false); return }
    getUserOrders(currentUser.id)
      .then(data => {
        console.log('Orders fetched:', data)
        setOrders(data)
      })
      .catch((err) => {
        console.error('Orders error:', err)
        setError('Failed to load orders.')
      })
      .finally(() => setLoading(false))
  }, [currentUser])

  if (!currentUser) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="card p-10 text-center max-w-sm">
        <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>
        </div>
        <h2 className="font-bold text-gray-900 text-lg mb-2">Sign in to view orders</h2>
        <button onClick={() => onNavigate('register')} className="btn-primary w-full mt-3">Register / Sign In</button>
      </div>
    </div>
  )

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <svg className="animate-spin w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
      </svg>
    </div>
  )

  if (error) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="card p-8 text-center max-w-sm">
        <p className="text-red-500 font-semibold mb-2">Error loading orders</p>
        <p className="text-gray-400 text-sm">{error}</p>
      </div>
    </div>
  )

  if (orders.length === 0) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center">
        <div className="w-20 h-20 bg-gray-100 rounded-3xl flex items-center justify-center mx-auto mb-4">
          <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>
        </div>
        <h2 className="font-bold text-gray-700 text-xl mb-2">No orders yet</h2>
        <p className="text-gray-400 text-sm mb-6">Place your first order from the shop</p>
        <button onClick={() => onNavigate('shop')} className="btn-primary">Go to Shop →</button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-extrabold text-gray-900">My Orders</h1>
          <p className="text-gray-500 text-sm mt-1">
            {orders.length} order{orders.length !== 1 ? 's' : ''} for{' '}
            <span dir="auto" className="font-semibold text-gray-700">{currentUser.usernameUnicode}</span>
          </p>
        </div>

        <div className="space-y-4">
          {orders.map(order => (
            <div key={order.id} className="card p-5 animate-fade-in">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1">Order</p>
                  <p className="font-mono text-sm font-bold text-blue-700">
                    #{order.id.slice(0, 8).toUpperCase()}
                  </p>
                </div>
                <div className="text-end">
                  <span className={`badge ${order.status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(order.createdAt).toLocaleDateString('en-GB', { day:'numeric', month:'short', year:'numeric' })}
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 space-y-2 mb-4">
                {order.items.map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    {item.product?.imageUrl && (
                      <img src={item.product.imageUrl} alt={item.product.name}
                        className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                        onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400' }} />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">
                        {item.product?.name ?? 'Product'}
                      </p>
                      <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-bold text-gray-900">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                <span className="text-sm font-semibold text-gray-600">Order Total</span>
                <span className="text-lg font-extrabold text-blue-700">
                  ${order.totalAmount.toFixed(2)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
