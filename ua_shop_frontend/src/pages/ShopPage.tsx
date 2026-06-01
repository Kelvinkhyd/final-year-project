import { useEffect, useState } from 'react'
import { getProducts, type Product, type CartItem, type RegisteredUser } from '../api/api'

interface Props {
  cart: CartItem[]
  onAddToCart: (product: Product) => void
  currentUser: RegisteredUser | null
  onNavigate: (page: string) => void
}

export function ShopPage({ cart, onAddToCart, currentUser, onNavigate }: Props) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState<string | null>(null)
  const [category, setCategory] = useState('All')
  const [addedId, setAddedId]   = useState<string | null>(null)

  useEffect(() => {
    getProducts()
      .then(setProducts)
      .catch(() => setError('Could not load products. Is the backend running on port 5000?'))
      .finally(() => setLoading(false))
  }, [])

  const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))]
  const filtered   = category === 'All' ? products : products.filter(p => p.category === category)
  const getCartQty = (id: string) => cart.find(i => i.product.id === id)?.quantity ?? 0

  const handleAdd = (product: Product) => {
    onAddToCart(product)
    setAddedId(product.id)
    setTimeout(() => setAddedId(null), 1000)
  }

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <svg className="animate-spin w-8 h-8 text-blue-600 mx-auto mb-3" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
        </svg>
        <p className="text-gray-500 text-sm">Loading products...</p>
      </div>
    </div>
  )

  if (error) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="card p-8 max-w-md text-center">
        <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <svg className="w-7 h-7 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        </div>
        <h3 className="font-bold text-gray-900 mb-2">Connection Error</h3>
        <p className="text-gray-500 text-sm">{error}</p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-end justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900">Our Products</h1>
              <p className="text-gray-500 mt-1">{filtered.length} products available globally</p>
            </div>
            {!currentUser && (
              <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
                <svg className="w-4 h-4 text-amber-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <p className="text-sm text-amber-700">
                  <button onClick={() => onNavigate('register')} className="font-semibold underline">Register</button>
                  {' '}to place an order
                </p>
              </div>
            )}
          </div>

          {/* Category filter */}
          <div className="flex gap-2 mt-5 flex-wrap">
            {categories.map(cat => (
              <button key={cat} onClick={() => setCategory(cat)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-150 ${
                  category === cat
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}>
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Product grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(product => {
            const qty     = getCartQty(product.id)
            const added   = addedId === product.id
            return (
              <div key={product.id} className="card-hover overflow-hidden flex flex-col group">
                <div className="relative overflow-hidden h-52">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400' }}
                  />
                  <div className="absolute top-3 start-3">
                    <span className="badge bg-white/90 backdrop-blur-sm text-gray-700 border border-gray-200 shadow-sm">
                      {product.category}
                    </span>
                  </div>
                  {product.stock < 10 && (
                    <div className="absolute top-3 end-3">
                      <span className="badge bg-red-100 text-red-700">Only {product.stock} left</span>
                    </div>
                  )}
                </div>

                <div className="p-5 flex flex-col flex-1">
                  <h3 className="font-bold text-gray-900 text-base mb-1 leading-snug">{product.name}</h3>
                  <p className="text-sm text-gray-500 flex-1 mb-4 leading-relaxed">{product.description}</p>

                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-extrabold text-gray-900">${product.price.toFixed(2)}</span>
                    <span className="text-xs text-gray-400 bg-gray-50 border border-gray-100 rounded-lg px-2 py-1">
                      {product.stock} in stock
                    </span>
                  </div>

                  <button onClick={() => handleAdd(product)}
                    className={`w-full py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 ${
                      added
                        ? 'bg-green-500 text-white scale-95'
                        : qty > 0
                          ? 'bg-green-50 text-green-700 border-2 border-green-500 hover:bg-green-500 hover:text-white'
                          : 'bg-blue-600 text-white hover:bg-blue-700 hover:-translate-y-0.5 hover:shadow-md'
                    }`}>
                    {added ? '✓ Added!' : qty > 0 ? `In Cart (${qty}) · Add More` : 'Add to Cart'}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
