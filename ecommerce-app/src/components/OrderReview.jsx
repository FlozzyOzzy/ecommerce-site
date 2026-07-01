const OrderReview = ({
  items,
  checkoutData,
  totalAmount,
  onEditShipping,
  onProceedToPayment,
  loading,
}) => {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-gray-900">Order Review</h2>
      <p className="mt-1 text-sm text-gray-600">Confirm your order before payment.</p>

      {/* Shipping details */}
      <div className="mt-6 rounded-lg border border-gray-200 bg-gray-50 p-4">
        <h3 className="text-sm font-semibold text-gray-900">Delivery Details</h3>
        <p className="mt-2 text-sm text-gray-800">
          <span className="font-medium">Address:</span> {checkoutData.shipping_address}
        </p>
        <p className="mt-1 text-sm text-gray-800">
          <span className="font-medium">Phone:</span> {checkoutData.phone}
        </p>
      </div>

      {/* Order items list */}
      <div className="mt-6">
        <h3 className="text-sm font-semibold text-gray-900">Order Items</h3>
        <ul className="mt-3 divide-y divide-gray-200 border border-gray-200 rounded-lg">
          {items.map((item) => {
            const price = Number(item.price)
            const quantity = Number(item.quantity)
            const subtotal = price * quantity
            const key = item.id || item.product_id

            return (
              <li key={key} className="flex items-center justify-between px-4 py-3 text-sm">
                <div>
                  <p className="font-medium text-gray-900">{item.title}</p>
                  <p className="text-gray-600">
                    Ksh {price.toFixed(2)} × {quantity}
                  </p>
                </div>
                <p className="font-semibold text-gray-900">Ksh {subtotal.toFixed(2)}</p>
              </li>
            )
          })}
        </ul>
      </div>

      {/* Order total */}
      <div className="mt-6 flex items-center justify-between border-t border-gray-200 pt-4">
        <p className="text-lg font-semibold text-gray-900">Total</p>
        <p className="text-2xl font-bold text-gray-900">Ksh {Number(totalAmount).toFixed(2)}</p>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={onProceedToPayment}
          disabled={loading}
          className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Proceed to Payment
        </button>
        <button
          type="button"
          onClick={onEditShipping}
          disabled={loading}
          className="rounded-lg border border-gray-300 bg-white px-6 py-2.5 text-sm font-semibold text-gray-800 hover:bg-gray-50"
        >
          Edit Shipping
        </button>
      </div>
    </div>
  )
}

export default OrderReview
