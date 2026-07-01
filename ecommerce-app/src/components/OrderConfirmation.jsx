import { Link } from "react-router-dom"

const OrderConfirmation = ({ order }) => {
  if (!order) return null

  return (
    <div className="rounded-2xl border border-green-200 bg-green-50 p-8 text-center shadow-sm">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-600 text-2xl text-white">
        ✓
      </div>

      <h2 className="text-2xl font-bold text-gray-900">Order Confirmed</h2>
      <p className="mt-2 text-lg font-semibold text-green-700">Order #{order.id}</p>
      <p className="mt-2 text-gray-800">Thank you for your purchase!</p>

      {/* Order items */}
      <div className="mt-8 rounded-lg border border-green-200 bg-white p-4 text-left">
        <h3 className="text-sm font-semibold text-gray-900">Items Ordered</h3>
        <ul className="mt-3 divide-y divide-gray-200">
          {order.items?.map((item) => (
            <li key={item.id} className="flex items-center justify-between py-2 text-sm">
              <div>
                <p className="font-medium text-gray-900">{item.title}</p>
                <p className="text-gray-600">Qty: {item.quantity}</p>
              </div>
              <p className="font-semibold text-gray-900">Ksh {Number(item.price).toFixed(2)}</p>
            </li>
          ))}
        </ul>

        <div className="mt-4 border-t border-gray-200 pt-4">
          <p className="text-sm text-gray-800">
            <span className="font-medium">Total:</span> Ksh {Number(order.total_amount).toFixed(2)}
          </p>
          <p className="mt-2 text-sm text-gray-800">
            <span className="font-medium">Delivery to:</span> {order.shipping_address}
          </p>
          <p className="mt-1 text-sm text-gray-800">
            <span className="font-medium">Phone:</span> {order.phone}
          </p>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          to={`/orders/${order.id}`}
          className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
        >
          View Order Details
        </Link>
        <Link
          to="/getproducts"
          className="rounded-lg border border-gray-300 bg-white px-6 py-2.5 text-sm font-semibold text-gray-800 hover:bg-gray-50"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  )
}

export default OrderConfirmation
