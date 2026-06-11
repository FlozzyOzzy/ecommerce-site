import axios from "axios"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

const IMG_URL = "http://127.0.0.1:5000/static/images/"

const ProductCard = ({ product }) => (
  <article className="group flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-gray-300 hover:shadow-lg">
    <div className="relative aspect-4/3 overflow-hidden bg-gray-100">
      <img
        src={`${IMG_URL}${product.image}`}
        alt={product.title}
        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
      />
      <span className="absolute left-3 top-3 rounded-full bg-amber-500 px-3 py-1 text-xs font-semibold text-white shadow-sm">
        {product.category}
      </span>
    </div>

    <div className="flex flex-1 flex-col p-5 text-left">
      <h3 className="text-lg font-semibold text-gray-900 transition group-hover:text-blue-600">
        {product.title}
      </h3>
      <p className="mt-2 line-clamp-2 flex-1 text-sm leading-relaxed text-gray-800">
        {product.description}
      </p>
      <div className="mt-4 flex items-center justify-between gap-3">
        <p className="text-xl font-bold text-gray-900">
          Ksh {Number(product.price).toFixed(2)}
        </p>
        <button
          type="button"
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          Add to Cart
        </button>
      </div>
    </div>
  </article>
)

const GetProducts = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState("Please wait, we are retrieving the products...")
  const [error, setError] = useState("")

  useEffect(() => {
    let cancelled = false

    axios
      .get("http://127.0.0.1:5000/api/get_product_details")
      .then((response) => {
        if (!cancelled) {
          setProducts(response.data)
          setLoading("")
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setLoading("")
          setError(err.response?.data?.error || err.message || "There was an error loading products.")
        }
      })

    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="relative flex min-h-svh flex-col bg-gray-50">
     

      <section className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-10 text-left">
          <span className="inline-flex items-center rounded-full bg-amber-500 px-4 py-1.5 text-xs font-semibold text-white shadow-sm">
            Shop the collection
          </span>
          <h1 className="mt-4 text-3xl font-semibold text-gray-900 sm:text-4xl">
            Our Products
          </h1>
          <p className="mt-2 max-w-2xl text-base text-gray-800">
            Browse our curated selection of quality items across electronics, fashion, and home essentials.
          </p>
        </div>

        {(loading || error) && (
          <div className="mb-6 space-y-2">
            {loading && (
              <p className="rounded-lg bg-gray-100 px-4 py-3 text-sm text-gray-600">{loading}</p>
            )}
            {error && (
              <p className="rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-800">
                {error}
              </p>
            )}
          </div>
        )}

        {!loading && !error && products.length === 0 && (
          <p className="rounded-lg bg-gray-100 px-4 py-3 text-sm text-gray-800">
            No products available yet.
          </p>
        )}

        {!loading && !error && products.length > 0 && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      <footer className="mt-auto bg-gray-900">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-4 px-4 py-6 sm:flex-row sm:px-6 lg:px-8">
          <p className="text-sm text-gray-400">© 2026 Ecommerce Site. All rights reserved.</p>
          <div className="flex gap-6">
            <Link to="/" className="text-sm text-gray-300 transition hover:text-white">
              Home
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
    </div>
  )
}


export default GetProducts
