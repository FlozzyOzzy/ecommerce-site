import { Link, useLocation } from "react-router-dom"
import { useEffect } from "react"
import { getStoredUser, isAdmin } from "../utils/authUtils"
import { useCart } from "../hooks/useCart"

const Navbar = () => {
  const location = useLocation()
  const user = getStoredUser()
  const { cartItemCount, refreshCart } = useCart()

  // Load cart count when user logs in or navigates
  useEffect(() => {
    if (user?.id) {
      refreshCart()
    }
  }, [user?.id, location.pathname, refreshCart])

  return (
    <nav className="w-full bg-gray-900">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/getproducts" className="flex items-center gap-2">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-lg font-bold text-white shadow-md">
            E
          </span>
          <div className="text-left">
            <p className="text-sm font-semibold text-white">Ecommerce Site</p>
            <p className="text-xs text-gray-400">Your everyday marketplace</p>
          </div>
        </Link>

        <div className="flex flex-wrap items-center justify-end gap-3 sm:gap-4">
          <Link
            to="/getproducts"
            className="rounded-lg px-3 py-2 text-sm font-medium text-gray-300 transition hover:bg-gray-800 hover:text-white"
          >
            Products
          </Link>
          <Link
            to="/cart"
            className="relative rounded-lg px-3 py-2 text-sm font-medium text-gray-300 transition hover:bg-gray-800 hover:text-white"
          >
            Cart
            {cartItemCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-amber-500 px-1 text-xs font-bold text-white">
                {cartItemCount}
              </span>
            )}
          </Link>

          {user ? (
            <>
              {isAdmin(user) && (
                <Link
                  to="/addproducts"
                  className="rounded-lg px-3 py-2 text-sm font-medium text-gray-300 transition hover:bg-gray-800 hover:text-white"
                >
                  Add Product
                </Link>
              )}
              <Link
                to="/profile"
                className="rounded-lg px-3 py-2 text-sm font-medium text-gray-300 transition hover:bg-gray-800 hover:text-white"
              >
                Profile
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/signin"
                className="rounded-lg px-3 py-2 text-sm font-medium text-gray-300 transition hover:bg-gray-800 hover:text-white"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
