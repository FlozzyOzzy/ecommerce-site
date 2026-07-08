import { useState } from "react"
import { Link } from "react-router-dom"

import { formatMpesaPhone, isValidMpesaPhone } from "../utils/phoneUtils"

const CheckoutForm = ({ onSubmit, onBackToCart, loading, error, initialValues = {} }) => {
  const [shippingAddress, setShippingAddress] = useState(initialValues.shipping_address || "")
  const [phone, setPhone] = useState(initialValues.phone || "")
  const [validationError, setValidationError] = useState("")

  // Handle form submission with client-side validation
  const handleSubmit = (e) => {
    e.preventDefault()

    if (!shippingAddress.trim() || !phone.trim()) {
      setValidationError("Shipping address and phone are required.")
      return
    }

    if (!isValidMpesaPhone(phone)) {
      setValidationError("Enter a valid Kenyan phone number (e.g. 0712345678 or 254712345678).")
      return
    }

    setValidationError("")
    onSubmit({
      shipping_address: shippingAddress.trim(),
      phone: formatMpesaPhone(phone),
    })
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-gray-900">Shipping Information</h2>
      <p className="mt-1 text-sm text-gray-600">Enter your delivery details to continue.</p>

      {(error || validationError) && (
        <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {validationError || error}
        </p>
      )}

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label htmlFor="shipping_address" className="mb-1 block text-sm font-medium text-gray-800">
            Shipping Address
          </label>
          <textarea
            id="shipping_address"
            name="shipping_address"
            rows={4}
            value={shippingAddress}
            onChange={(e) => setShippingAddress(e.target.value)}
            placeholder="Street, city, postal code"
            className="block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-800 focus:outline-2 focus:outline-blue-600"
            disabled={loading}
          />
        </div>

        <div>
          <label htmlFor="phone" className="mb-1 block text-sm font-medium text-gray-800">
            Phone Number (delivery &amp; M-Pesa payment)
          </label>
          <input
            id="phone"
            name="phone"
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="e.g. 0712345678 or 254712345678"
            className="block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-800 focus:outline-2 focus:outline-blue-600"
            disabled={loading}
          />
        </div>

        <div className="flex flex-wrap gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Creating order..." : "Continue to Review"}
          </button>
          <button
            type="button"
            onClick={onBackToCart}
            disabled={loading}
            className="rounded-lg border border-gray-300 bg-white px-6 py-2.5 text-sm font-semibold text-gray-800 hover:bg-gray-50"
          >
            Back to Cart
          </button>
        </div>
      </form>

      <p className="mt-4 text-sm text-gray-600">
        Changed your mind?{" "}
        <Link to="/cart" className="font-medium text-blue-600 hover:text-blue-700">
          Return to cart
        </Link>
      </p>
    </div>
  )
}

export default CheckoutForm
