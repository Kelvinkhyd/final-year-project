import { useState } from 'react'
import { Navbar } from './components/Navbar'
import { HomePage } from './pages/HomePage'
import { ShopPage } from './pages/ShopPage'
import { RegisterPage } from './pages/RegisterPage'
import { CartPage } from './pages/CartPage'
import { OrdersPage } from './pages/OrdersPage'
import { DashboardPage } from './pages/DashboardPage'
import { type CartItem, type Product, type RegisteredUser } from './api/api'

type Page = 'home' | 'shop' | 'register' | 'cart' | 'orders' | 'dashboard'

function App() {
  const [page, setPage]               = useState<Page>('home')
  const [cart, setCart]               = useState<CartItem[]>([])
  const [currentUser, setCurrentUser] = useState<RegisteredUser | null>(null)

  const navigate = (p: string) => { setPage(p as Page); window.scrollTo(0, 0) }

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(i => i.product.id === product.id)
      if (existing) return prev.map(i =>
        i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
      )
      return [...prev, { product, quantity: 1 }]
    })
  }

  const updateQty = (productId: string, qty: number) => {
    if (qty <= 0) setCart(prev => prev.filter(i => i.product.id !== productId))
    else setCart(prev => prev.map(i =>
      i.product.id === productId ? { ...i, quantity: qty } : i
    ))
  }

  const handleRegistered = (user: RegisteredUser) => {
    setCurrentUser(user)
    setTimeout(() => navigate('shop'), 1500)
  }

  const handleLogout = () => {
    setCurrentUser(null)
    setCart([])
    navigate('home')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar
        currentPage={page}
        onNavigate={navigate}
        cart={cart}
        currentUser={currentUser}
        onLogout={handleLogout}
      />
      <main>
        {page === 'home'      && <HomePage onNavigate={navigate} />}
        {page === 'shop'      && <ShopPage cart={cart} onAddToCart={addToCart} currentUser={currentUser} onNavigate={navigate} />}
        {page === 'register'  && <RegisterPage currentUser={currentUser} onRegistered={handleRegistered} onLogout={handleLogout} onNavigate={navigate} />}
        {page === 'cart'      && <CartPage cart={cart} onUpdateQty={updateQty} onRemove={(id) => setCart(p => p.filter(i => i.product.id !== id))} onClearCart={() => setCart([])} currentUser={currentUser} onNavigate={navigate} />}
        {page === 'orders'    && <OrdersPage currentUser={currentUser} onNavigate={navigate} />}
        {page === 'dashboard' && <DashboardPage />}
      </main>
    </div>
  )
}

export default App
