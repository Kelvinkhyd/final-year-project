import axios from 'axios'

const API_BASE = 'http://localhost:5000/api'

export interface RegistrationPayload {
  usernameUnicode: string
  rawEmail: string
}

export interface ScriptAnalysis {
  primaryScript: string
  detectedScripts: string[]
  isConsistent: boolean
  hasMixedScripts: boolean
  possibleHomographAttack: boolean
}

export interface RegisteredUser {
  id: string
  usernameUnicode: string
  emailUnicode: string
  canonicalEmail: string
  aceDomain: string
  createdAt: string
}

export interface ApiResponse {
  isValid: boolean
  message?: string
  error?: string
  user?: RegisteredUser
  uaveMetrics?: {
    latencyMs: number
    scriptAnalysis: ScriptAnalysis
  }
}

export interface Product {
  id: string
  name: string
  description: string
  price: number
  category: string
  imageUrl: string
  stock: number
}

export interface CartItem {
  product: Product
  quantity: number
}

export interface OrderPayload {
  userId: string
  items: { productId: string; quantity: number }[]
}

export interface OrderResponse {
  success: boolean
  message?: string
  error?: string
  order?: {
    id: string
    status: string
    totalAmount: number
    createdAt: string
    items: { productName: string; quantity: number; price: number }[]
  }
}

export interface UserOrder {
  id: string
  status: string
  totalAmount: number
  createdAt: string
  items: { product: Product; quantity: number; price: number }[]
}

export async function registerUser(payload: RegistrationPayload): Promise<ApiResponse> {
  const res = await axios.post<ApiResponse>(`${API_BASE}/email/validate`, payload)
  return res.data
}

export async function getRegisteredUsers(): Promise<RegisteredUser[]> {
  const res = await axios.get<RegisteredUser[]>(`${API_BASE}/email/users`)
  return res.data
}

export async function getProducts(): Promise<Product[]> {
  const res = await axios.get<Product[]>(`${API_BASE}/products`)
  return res.data
}

export async function placeOrder(payload: OrderPayload): Promise<OrderResponse> {
  const res = await axios.post<OrderResponse>(`${API_BASE}/orders`, payload)
  return res.data
}

export async function getUserOrders(userId: string): Promise<UserOrder[]> {
  const res = await axios.get<UserOrder[]>(`${API_BASE}/orders/user/${userId}`)
  return res.data
}
