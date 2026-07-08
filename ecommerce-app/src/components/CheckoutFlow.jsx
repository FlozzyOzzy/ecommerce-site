import axios from "axios"
import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useCart } from "../hooks/useCart"
import CheckoutForm from "./CheckoutForm"
import OrderReview from "./OrderReview"
import PaymentModal from "./PaymentModal"
import OrderConfirmation from "./OrderConfirmation"
import { API_BASE } from "../config/api"
import { formatMpesaPhone, isValidMpesaPhone } from "../utils/phoneUtils"

const CheckoutFlow = () => {
  const navigate = useNavigate()
  const { items, totalPrice, refreshCart, getUserId } = useCart()
  const userId = getUserId()

  // Checkout step and data state
  const [step, setStep] = useState("form")
  const [checkoutData, setCheckoutData] = useState({ shipping_address: "", phone: "" })
  const [orderId, setOrderId] = useState(null)
  const [totalAmount, setTotalAmount] = useState(0)
  const [orderItems, setOrderItems] = useState([])
  const [confirmedOrder, setConfirmedOrder] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [cartLoading, setCartLoading] = useState(true)

  // Load cart on mount and validate checkout can proceed
  useEffect(() => {
    if (!userId) {
      setCartLoading(false)
      return
    }

    let cancelled = false

    refreshCart()
      .catch((err) => {
        if (!cancelled) {
          setError(err.response?.data?.message || err.message || "Failed to load cart.")
        }
      })
      .finally(() => {
        if (!cancelled) setCartLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [userId, refreshCart])

  // Clear cart in context after successful payment
  useEffect(() => {
    if (step === "confirmation") {
      refreshCart()
    }
  }, [step, refreshCart])

  // Create order from cart via checkout initiate API
  const handleFormSubmit = async (formData) => {
    if (!userId) {
      setError("Please sign in to checkout.")
      return
    }

    // If order already created, only update shipping display and return to review
    if (orderId) {
      setCheckoutData(formData)
      setStep("review")
      setError("")
      return
    }

    if (items.length === 0) {
      setError("Your cart is empty. Add products before checkout.")
      return
    }

    setLoading(true)
    setError("")

    try {
      const data = new FormData()
      data.append("user_id", String(userId))
      data.append("shipping_address", formData.shipping_address)
      data.append("phone", formatMpesaPhone(formData.phone))

      const response = await axios.post(`${API_BASE}/api/checkout/initiate`, data)

      setCheckoutData(formData)
      setOrderId(response.data.order_id)
      setTotalAmount(response.data.total_amount)
      setOrderItems(response.data.order?.items || [])
      setStep("review")
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to create order.")
    } finally {
      setLoading(false)
    }
  }

  // Open payment modal from review step
  const handleProceedToPayment = () => {
    setError("")
    setStep("payment")
  }

  // Process M-Pesa payment and fetch confirmed order
  const handlePayment = async () => {
    const mpesaPhone = formatMpesaPhone(checkoutData.phone)

    if (!isValidMpesaPhone(checkoutData.phone)) {
      setError("Enter a valid Kenyan phone number (e.g. 0712345678 or 254712345678).")
      return
    }

    setLoading(true)
    setError("")

    try {
      const data = new FormData()
      data.append("order_id", String(orderId))
      data.append("phone", mpesaPhone)
      data.append("amount", Number(totalAmount).toFixed(2))

      await axios.post(`${API_BASE}/api/checkout/payment`, data)

      const orderResponse = await axios.get(`${API_BASE}/api/orders/${orderId}`)
      setConfirmedOrder(orderResponse.data.order)
      setStep("confirmation")
    } catch (err) {
      const mpesaError = err.response?.data?.error || err.response?.data?.message
      setError(mpesaError || err.message || "Payment failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleBackToCart = () => {
    navigate("/cart")
  }

  const handleEditShipping = () => {
    setError("")
    setStep("form")
  }

  const handleCancelPayment = () => {
    setError("")
    setStep("review")
  }

  if (!userId) {
    return (
      <div className="mx-auto w-full max-w-2xl px-4 py-10">
        <p className="rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-800">
          Please{" "}
          <Link to="/signin" className="font-medium text-blue-600 hover:text-blue-700">
            sign in
          </Link>{" "}
          to checkout.
        </p>
      </div>
    )
  }

  if (cartLoading) {
    return (
      <div className="mx-auto w-full max-w-2xl px-4 py-10">
        <p className="rounded-lg bg-gray-100 px-4 py-3 text-sm text-gray-600">Loading checkout...</p>
      </div>
    )
  }

  if (step === "form" && items.length === 0) {
    return (
      <div className="mx-auto w-full max-w-2xl px-4 py-10">
        <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          Your cart is empty. Add products before checkout.
        </p>
        <Link
          to="/getproducts"
          className="mt-4 inline-block rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
        >
          Browse Products
        </Link>
      </div>
    )
  }

  return (
    <div className="relative flex flex-1 flex-col bg-gray-50">
      <section className="mx-auto w-full max-w-2xl flex-1 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8 text-left">
          <span className="inline-flex items-center rounded-full bg-amber-500 px-4 py-1.5 text-xs font-semibold text-white shadow-sm">
            Checkout
          </span>
          <h1 className="mt-4 text-3xl font-semibold text-gray-900">Complete Your Order</h1>
        </div>

        {/* Global error banner */}
        {error && step !== "form" && step !== "payment" && (
          <p className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        )}

        {step === "form" && (
          <CheckoutForm
            onSubmit={handleFormSubmit}
            onBackToCart={handleBackToCart}
            loading={loading}
            error={error}
            initialValues={checkoutData}
          />
        )}

        {step === "review" && (
          <OrderReview
            items={orderItems}
            checkoutData={checkoutData}
            totalAmount={totalAmount}
            onEditShipping={handleEditShipping}
            onProceedToPayment={handleProceedToPayment}
            loading={loading}
          />
        )}

        {step === "payment" && (
          <PaymentModal
            orderId={orderId}
            totalAmount={totalAmount}
            phone={checkoutData.phone}
            onSubmit={handlePayment}
            onCancel={handleCancelPayment}
            loading={loading}
            error={error}
          />
        )}

        {step === "confirmation" && <OrderConfirmation order={confirmedOrder} />}
      </section>
    </div>
  )
}

export default CheckoutFlow
