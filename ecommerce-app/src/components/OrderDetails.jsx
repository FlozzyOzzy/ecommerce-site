import axios from "axios"
import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"

const API_BASE = "http://127.0.0.1:5000"

const OrderDetails = () => {
  const { orderId } = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  // Fetch order details from API
  useEffect(() => {
    let cancelled = false

    axios
      .get(`${API_BASE}/api/orders/${orderId}`)
      .then((response) => {
        if (!cancelled) setOrder(response.data.order)
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.response?.data?.message || err.message || "Order not found.")
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [orderId])

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-2xl px-4 py-10">
        <p className="rounded-lg bg-gray-100 px-4 py-3 text-sm text-gray-600">Loading order...</p>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="mx-auto w-full max-w-2xl px-4 py-10">
        <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error || "Order not found."}
        </p>
        <Link to="/getproducts" className="mt-4 inline-block text-sm font-medium text-blue-600">
          Continue Shopping
        </Link>
      </div>
    )
  }

  return (
    <div className="relative flex flex-1 flex-col bg-gray-50">
      <section className="mx-auto w-full max-w-2xl flex-1 px-4 py-10">
        <h1 className="text-3xl font-semibold text-gray-900">Order #{order.id}</h1>
        <p className="mt-2 text-sm text-gray-600">Status: {order.status}</p>

        <ul className="mt-6 divide-y divide-gray-200 rounded-lg border border-gray-200 bg-white">
          {order.items.map((item) => (
            <li key={item.id} className="flex justify-between px-4 py-3 text-sm">
              <div>
                <p className="font-medium text-gray-900">{item.title}</p>
                <p className="text-gray-600">Qty: {item.quantity}</p>
              </div>
              <p className="font-semibold text-gray-900">Ksh {Number(item.total || item.price).toFixed(2)}</p>
            </li>
          ))}
        </ul>

        <div className="mt-6 rounded-lg border border-gray-200 bg-white p-4 text-sm text-gray-800">
          <p><span className="font-medium">Total:</span> Ksh {Number(order.total_amount).toFixed(2)}</p>
          <p className="mt-2"><span className="font-medium">Address:</span> {order.shipping_address}</p>
          <p className="mt-1"><span className="font-medium">Phone:</span> {order.phone}</p>
        </div>
      </section>
    </div>
  )
}

export default OrderDetails
