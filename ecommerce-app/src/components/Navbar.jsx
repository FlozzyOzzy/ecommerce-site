import { Link } from "react-router-dom"

const Navbar = () => {
  return (
    <nav className="w-full bg-gray-900">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2">
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
            to="/"
            className="rounded-lg px-3 py-2 text-sm font-medium text-gray-300 transition hover:bg-gray-800 hover:text-white"
          >
            Home
          </Link>
          <Link
            to="/getproducts"
            className="rounded-lg px-3 py-2 text-sm font-medium text-gray-300 transition hover:bg-gray-800 hover:text-white"
          >
            Products
          </Link>
          <Link
            to="/cart"
            className="rounded-lg px-3 py-2 text-sm font-medium text-gray-300 transition hover:bg-gray-800 hover:text-white"
          >
            Cart
          </Link>
          <Link
            to="/signin"
            className="rounded-lg px-3 py-2 text-sm font-medium text-gray-300 transition hover:bg-gray-800 hover:text-white"
          >
            Sign In
          </Link>
          <Link
            to="/signup"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
