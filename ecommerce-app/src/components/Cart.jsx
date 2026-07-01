import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { useCart } from "../hooks/useCart"
import CartItem from "./CartItem"

const Cart = () => {
  const { items, totalPrice, loading, error, setError, refreshCart, getUserId } = useCart()
  const userId = getUserId()
  const [pageLoading, setPageLoading] = useState(userId ? "Loading your cart..." : "")

  // Fetch cart when page loads
  useEffect(() => {
    if (!userId) return

    let cancelled = false

    refreshCart()
      .catch((err) => {
        if (!cancelled) {
          setError(err.response?.data?.message || err.message || "Failed to load cart.")
        }
      })
      .finally(() => {
        if (!cancelled) setPageLoading("")
      })

    return () => {
      cancelled = true
    }
  }, [userId, refreshCart, setError])

  const isLoading = pageLoading || loading

  return (
    <div className="relative flex min-h-svh flex-col bg-gray-50">
      <section className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8 text-left">
          <span className="inline-flex items-center rounded-full bg-amber-500 px-4 py-1.5 text-xs font-semibold text-white shadow-sm">
            Your cart
          </span>
          <h1 className="mt-4 text-3xl font-semibold text-gray-900 sm:text-4xl">Shopping Cart</h1>
          <p className="mt-2 text-base text-gray-800">Review your items before checkout.</p>
        </div>

        {!userId && (
          <p className="mb-6 rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-800">
            Please{" "}
            <Link to="/signin" className="font-medium text-blue-600 hover:text-blue-700">
              sign in
            </Link>{" "}
            to view your cart.
          </p>
        )}

        {isLoading && (
          <p className="mb-6 rounded-lg bg-gray-100 px-4 py-3 text-sm text-gray-600">
            {pageLoading || "Updating cart..."}
          </p>
        )}

        {error && (
          <p className="mb-6 rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-800">
            {error}
          </p>
        )}

        {!isLoading && userId && items.length === 0 && (
          <div className="rounded-2xl border border-gray-200 bg-white px-8 py-10 text-center shadow-sm">
            <p className="text-lg font-semibold text-gray-900">Cart is empty</p>
            <p className="mt-2 text-sm text-gray-800">Add products from the store to get started.</p>
            <Link
              to="/getproducts"
              className="mt-6 inline-block rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Browse Products
            </Link>
          </div>
        )}

        {!isLoading && items.length > 0 && (
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-900 text-white">
                <tr>
                  <th className="px-4 py-3 font-semibold">Product</th>
                  <th className="px-4 py-3 font-semibold">Price</th>
                  <th className="px-4 py-3 font-semibold">Quantity</th>
                  <th className="px-4 py-3 font-semibold">Subtotal</th>
                  <th className="px-4 py-3 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <CartItem
                    key={item.id}
                    item_id={item.id}
                    title={item.title}
                    description={item.description}
                    price={item.price}
                    quantity={item.quantity}
                    image={item.image}
                  />
                ))}
              </tbody>
            </table>

            <div className="flex items-center justify-between border-t border-gray-200 px-6 py-4">
              <p className="text-lg font-semibold text-gray-900">Total</p>
              <p className="text-2xl font-bold text-gray-900">Ksh {totalPrice.toFixed(2)}</p>
            </div>

            <div className="border-t border-gray-200 px-6 py-4 text-right">
              <Link
                to="/checkout"
                className="inline-block rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
              >
                Proceed to Checkout
              </Link>
            </div>
          </div>
        )}
      </section>
    </div>
  )
}

export default Cart
