import { Link, useLocation } from "react-router-dom"
import { useEffect, useState } from "react"
import { getStoredUser, isAdmin } from "../utils/authUtils"
import { useCart } from "../hooks/useCart"

const Navbar = () => {
  const location = useLocation()
  const user = getStoredUser()
  const { cartItemCount, refreshCart } = useCart()
  const [menuOpen, setMenuOpen] = useState(false)
  const [prevPath, setPrevPath] = useState(location.pathname)

  if (prevPath !== location.pathname) {
    setPrevPath(location.pathname)
    setMenuOpen(false)
  }

  useEffect(() => {
    if (user?.id) {
      refreshCart()
    }
  }, [user?.id, location.pathname, refreshCart])

  const linkClass =
    "rounded-lg px-3 py-2 text-sm font-medium text-gray-300 transition hover:bg-gray-800 hover:text-white"

  return (
    <nav className="w-full bg-gray-900">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/getproducts" className="text-left">
          <p className="text-sm font-semibold text-white">Ecommerce Site</p>
          <p className="text-xs text-gray-400">Your everyday marketplace</p>
        </Link>

        {/* Desktop links */}
        <div className="hidden items-center gap-4 sm:flex">
          <Link to="/getproducts" className={linkClass}>Products</Link>
          <Link to="/cart" className={`relative ${linkClass}`}>
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
                <Link to="/addproducts" className={linkClass}>Add Product</Link>
              )}
              <Link to="/profile" className={linkClass}>Profile</Link>
            </>
          ) : (
            <>
              <Link to="/signin" className={linkClass}>Sign In</Link>
              <Link
                to="/signup"
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger button */}
        <button
          type="button"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="Toggle menu"
          className="relative flex flex-col items-center justify-center gap-1.5 rounded-lg p-2 text-gray-300 transition hover:bg-gray-800 hover:text-white sm:hidden"
        >
          <span className={`block h-0.5 w-5 rounded bg-current transition-all duration-300 ${menuOpen ? "translate-y-2 rotate-45" : ""}`} />
          <span className={`block h-0.5 w-5 rounded bg-current transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`} />
          <span className={`block h-0.5 w-5 rounded bg-current transition-all duration-300 ${menuOpen ? "-translate-y-2 -rotate-45" : ""}`} />
          {cartItemCount > 0 && !menuOpen && (
            <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-amber-500 px-0.5 text-[10px] font-bold text-white">
              {cartItemCount}
            </span>
          )}
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={`overflow-hidden transition-all duration-300 sm:hidden ${
          menuOpen ? "max-h-80 border-t border-gray-800" : "max-h-0"
        }`}
      >
        <div className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-3">
          <Link to="/getproducts" className={linkClass}>Products</Link>
          <Link to="/cart" className={`relative w-fit ${linkClass}`}>
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
                <Link to="/addproducts" className={linkClass}>Add Product</Link>
              )}
              <Link to="/profile" className={linkClass}>Profile</Link>
            </>
          ) : (
            <>
              <Link to="/signin" className={linkClass}>Sign In</Link>
              <Link
                to="/signup"
                className="mt-1 w-fit rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
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
