import { useState } from "react"
import { useCart } from "../hooks/useCart"

const IMG_URL = "http://127.0.0.1:5000/static/images/"

const CartItem = ({ item_id, product_id, title, description, price, quantity, image }) => {
  const { updateQuantity, removeItem } = useCart()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const subtotal = Number(price) * Number(quantity)

  // Increase or decrease quantity via API
  const handleQuantityChange = async (newQuantity) => {
    if (newQuantity < 1) return

    setLoading(true)
    setError("")

    try {
      await updateQuantity(item_id, newQuantity)
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to update quantity.")
    } finally {
      setLoading(false)
    }
  }

  // Remove item from cart
  const handleDelete = async () => {
    setLoading(true)
    setError("")

    try {
      await removeItem(item_id)
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to remove item.")
      setLoading(false)
    }
  }

  return (
    <tr className="border-b border-gray-200">
      <td className="px-4 py-4">
        <div className="flex items-center gap-4">
          {image ? (
            <img
              src={`${IMG_URL}${image}`}
              alt={title}
              className="h-16 w-16 rounded-lg border border-gray-200 object-cover"
            />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-lg border border-gray-200 bg-gray-100 text-xs text-gray-500">
              No image
            </div>
          )}
          <div>
            <p className="font-semibold text-gray-900">{title}</p>
            {description && (
              <p className="mt-1 line-clamp-2 text-sm text-gray-600">{description}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">Product ID: {product_id}</p>
          </div>
        </div>
      </td>
      <td className="px-4 py-4 text-gray-800">Ksh {Number(price).toFixed(2)}</td>
      <td className="px-4 py-4">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleQuantityChange(quantity - 1)}
            disabled={loading || quantity <= 1}
            className="rounded-lg border border-gray-300 bg-white px-3 py-1 text-sm font-semibold text-gray-800 hover:bg-gray-50 disabled:opacity-50"
          >
            -
          </button>
          <span className="min-w-8 text-center text-gray-900">{quantity}</span>
          <button
            type="button"
            onClick={() => handleQuantityChange(quantity + 1)}
            disabled={loading}
            className="rounded-lg border border-gray-300 bg-white px-3 py-1 text-sm font-semibold text-gray-800 hover:bg-gray-50 disabled:opacity-50"
          >
            +
          </button>
        </div>
      </td>
      <td className="px-4 py-4 font-semibold text-gray-900">Ksh {subtotal.toFixed(2)}</td>
      <td className="px-4 py-4">
        <button
          type="button"
          onClick={handleDelete}
          disabled={loading}
          className="rounded-lg bg-amber-500 px-3 py-2 text-sm font-semibold text-white hover:bg-amber-600 disabled:opacity-50"
        >
          Delete
        </button>
        {error && <p className="mt-2 text-xs text-gray-800">{error}</p>}
      </td>
    </tr>
  )
}

export default CartItem
