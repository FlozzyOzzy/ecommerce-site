import axios from "axios"
import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import AddToCartButton from "./AddToCartButton"

const IMG_URL = "http://127.0.0.1:5000/static/images/"
const API_BASE = "http://127.0.0.1:5000"

const ProductDetails = () => {
  const { productId } = useParams()
  const [product, setProduct] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  // Fetch single product from API
  useEffect(() => {
    let cancelled = false

    axios
      .get(`${API_BASE}/api/products/${productId}`)
      .then((response) => {
        if (!cancelled) setProduct(response.data.product)
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.response?.data?.message || err.message || "Failed to load product.")
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [productId])

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-4xl px-4 py-10">
        <p className="rounded-lg bg-gray-100 px-4 py-3 text-sm text-gray-600">Loading product...</p>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="mx-auto w-full max-w-4xl px-4 py-10">
        <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error || "Product not found."}
        </p>
        <Link to="/getproducts" className="mt-4 inline-block text-sm font-medium text-blue-600 hover:text-blue-700">
          Back to Products
        </Link>
      </div>
    )
  }

  return (
    <div className="relative flex flex-1 flex-col bg-gray-50">
      <section className="mx-auto w-full max-w-4xl flex-1 px-4 py-10 sm:px-6 lg:px-8">
        <Link to="/getproducts" className="text-sm font-medium text-blue-600 hover:text-blue-700">
          ← Back to Products
        </Link>

        <div className="mt-6 grid gap-8 lg:grid-cols-2">
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <img
              src={`${IMG_URL}${product.image}`}
              alt={product.title}
              className="aspect-square w-full object-cover"
            />
          </div>

          <div className="text-left">
            <span className="inline-flex items-center rounded-full bg-amber-500 px-4 py-1.5 text-xs font-semibold text-white shadow-sm">
              {product.category}
            </span>
            <h1 className="mt-4 text-3xl font-semibold text-gray-900">{product.title}</h1>
            <p className="mt-4 text-2xl font-bold text-gray-900">
              Ksh {Number(product.price).toFixed(2)}
            </p>

            <p className="mt-6 text-base leading-relaxed text-gray-800">{product.description}</p>

            <div className="mt-8 flex flex-wrap items-end gap-4">
              <div>
                <label htmlFor="quantity" className="mb-1 block text-sm font-medium text-gray-800">
                  Quantity
                </label>
                <input
                  id="quantity"
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, Number(e.target.value) || 1))}
                  className="w-24 rounded-lg border border-gray-300 px-4 py-2.5 text-gray-800 focus:outline-2 focus:outline-blue-600"
                />
              </div>
              <AddToCartButton product_id={product.product_id} quantity={quantity} />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default ProductDetails
