import axios from "axios"
import { useCallback, useMemo, useState } from "react"
import { CartContext } from "./cartContext"
import { getUserId } from "../utils/cartUtils"
import { API_BASE } from "../config/api"

const CartProvider = ({ children }) => {
  const [items, setItems] = useState([])
  const [cartId, setCartId] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // Calculate total price from cart items
  const totalPrice = useMemo(() => {
    return items.reduce((sum, item) => sum + Number(item.price) * Number(item.quantity), 0)
  }, [items])

  // Total number of items in cart (sum of quantities)
  const cartItemCount = useMemo(() => {
    return items.reduce((sum, item) => sum + Number(item.quantity), 0)
  }, [items])

  // Fetch cart data without triggering loading state (for useEffect)
  const refreshCart = useCallback(() => {
    const userId = getUserId()
    if (!userId) {
      setItems([])
      setCartId(null)
      return Promise.resolve()
    }

    return axios
      .get(`${API_BASE}/api/cart`, { params: { user_id: userId } })
      .then((response) => {
        setItems(response.data.cart?.items || [])
        setCartId(response.data.cart?.id ?? null)
      })
  }, [])

  // Fetch cart from API with loading state
  const fetchCart = useCallback(async () => {
    setLoading(true)
    setError("")

    try {
      await refreshCart()
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to load cart.")
    } finally {
      setLoading(false)
    }
  }, [refreshCart])

  // Add product to cart
  const addToCart = async (productId, quantity = 1) => {
    const userId = getUserId()
    if (!userId) {
      throw new Error("Please sign in to add items to your cart.")
    }

    const data = new FormData()
    data.append("user_id", String(userId))
    data.append("product_id", String(productId))
    data.append("quantity", String(quantity))

    const response = await axios.post(`${API_BASE}/api/cart/add`, data)
    await refreshCart()
    return response.data
  }

  // Update cart item quantity
  const updateQuantity = async (itemId, quantity) => {
    const data = new FormData()
    data.append("quantity", quantity)

    const response = await axios.put(`${API_BASE}/api/cart/items/${itemId}`, data)
    await refreshCart()
    return response.data
  }

  // Remove item from cart
  const removeItem = async (itemId) => {
    const response = await axios.delete(`${API_BASE}/api/cart/items/${itemId}`)
    await refreshCart()
    return response.data
  }

  const value = {
    items,
    cartId,
    totalPrice,
    cartItemCount,
    loading,
    error,
    setError,
    fetchCart,
    refreshCart,
    addToCart,
    updateQuantity,
    removeItem,
    getUserId,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export default CartProvider
