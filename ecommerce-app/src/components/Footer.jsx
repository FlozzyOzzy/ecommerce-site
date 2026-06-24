import { Link } from "react-router-dom"

const Footer = () => {
  return (
    <footer className="mt-auto w-full bg-gray-900">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-4 px-4 py-6 sm:flex-row sm:px-6 lg:px-8">
        <p className="text-sm text-gray-400">© 2026 Ecommerce Site. All rights reserved.</p>
        <div className="flex flex-wrap justify-center gap-6">
          <Link to="/" className="text-sm text-gray-300 transition hover:text-white">
            Home
          </Link>
          <Link to="/getproducts" className="text-sm text-gray-300 transition hover:text-white">
            Products
          </Link>
          <Link to="/cart" className="text-sm text-gray-300 transition hover:text-white">
            Cart
          </Link>
          <Link to="/signin" className="text-sm text-gray-300 transition hover:text-white">
            Sign In
          </Link>
          <Link to="/signup" className="text-sm font-medium text-amber-500 transition hover:text-amber-400">
            Sign Up
          </Link>
        </div>
      </div>
    </footer>
  )
}

export default Footer
