import { formatMpesaPhone } from "../utils/phoneUtils"

const PaymentModal = ({ orderId, totalAmount, phone, onSubmit, onCancel, loading, error }) => {
  // Trigger M-Pesa payment using phone from shipping step
  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-xl">
        <h2 className="text-xl font-semibold text-gray-900">M-Pesa Payment</h2>
        <p className="mt-1 text-sm text-gray-600">
          Order #{orderId} — Ksh {Number(totalAmount).toFixed(2)}
        </p>

        {error && (
          <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        )}

        {loading && (
          <p className="mt-4 rounded-lg bg-blue-50 px-4 py-3 text-sm text-blue-800">
            Processing payment... Please check your phone to complete the M-Pesa prompt.
          </p>
        )}

        <div className="mt-6 rounded-lg border border-gray-200 bg-gray-50 p-4">
          <p className="text-sm text-gray-800">
            An M-Pesa payment request will be sent to:
          </p>
          <p className="mt-1 text-base font-semibold text-gray-900">{formatMpesaPhone(phone)}</p>
          <p className="mt-2 text-xs text-gray-500">Use the M-Pesa number registered on your Safaricom line.</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-6">
          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-green-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Processing..." : "Pay with M-Pesa"}
            </button>
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className="rounded-lg border border-gray-300 bg-white px-6 py-2.5 text-sm font-semibold text-gray-800 hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default PaymentModal
