import { useState } from "react"
import { useCart } from "../hooks/useCart"

const AddToCartButton = ({ product_id, quantity = 1 }) => {
  const { addToCart } = useCart()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")

  const handleAddToCart = async () => {
    setLoading(true)
    setSuccess("")
    setError("")

    try {
      const response = await addToCart(product_id, quantity)
      setSuccess(response.message || "Product added to cart")
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to add product to cart.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleAddToCart}
        disabled={loading}
        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Adding..." : "Add to Cart"}
      </button>

      {success && <p className="mt-2 text-xs text-gray-800">{success}</p>}
      {error && <p className="mt-2 text-xs text-gray-800">{error}</p>}
    </div>
  )
}

export default AddToCartButton
