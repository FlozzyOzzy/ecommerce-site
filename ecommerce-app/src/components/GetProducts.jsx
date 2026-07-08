import axios from "axios"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import AddToCartButton from "./AddToCartButton"
import { API_BASE, IMG_URL } from "../config/api"
const PER_PAGE = 8

const ProductCard = ({ product }) => (
  <article className="group flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-gray-300 hover:shadow-lg">
    <Link to={`/products/${product.product_id}`} className="flex flex-1 flex-col">
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
      </div>
    </Link>

    <div className="flex items-center justify-between gap-3 px-5 pb-5">
      <p className="text-xl font-bold text-gray-900">
        Ksh {Number(product.price).toFixed(2)}
      </p>
      <div onClick={(e) => e.stopPropagation()}>
        <AddToCartButton product_id={product.product_id} />
      </div>
    </div>
  </article>
)

const GetProducts = () => {
  const [products, setProducts] = useState([])
  const [search, setSearch] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState({ page: 1, per_page: PER_PAGE, total: 0, total_pages: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  // Debounce search input and reset to page 1
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search)
      setPage(1)
    }, 400)

    return () => clearTimeout(timer)
  }, [search])

  // Fetch products when search or page changes
  useEffect(() => {
    let cancelled = false

    axios
      .get(`${API_BASE}/api/get_product_details`, {
        params: {
          search: debouncedSearch,
          page,
          per_page: PER_PAGE,
        },
      })
      .then((response) => {
        if (!cancelled) {
          setProducts(response.data.products || [])
          setPagination(response.data.pagination || { page: 1, per_page: PER_PAGE, total: 0, total_pages: 0 })
          setError("")
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.response?.data?.message || err.message || "There was an error loading products.")
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [debouncedSearch, page])

  const goToPage = (nextPage) => {
    setLoading(true)
    setPage(nextPage)
  }

  return (
    <div className="relative flex flex-1 flex-col bg-gray-50">
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

        <div className="mb-8">
          <label htmlFor="search" className="mb-1.5 block text-sm font-medium text-gray-900">
            Search products
          </label>
          <input
            id="search"
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setLoading(true)
            }}
            placeholder="Search by name, description, or category..."
            className="block w-full max-w-md rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-800 shadow-sm focus:outline-2 focus:outline-blue-600"
          />
        </div>

        {loading && (
          <p className="mb-6 rounded-lg bg-gray-100 px-4 py-3 text-sm text-gray-600">
            Loading products...
          </p>
        )}

        {error && (
          <p className="mb-6 rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-800">
            {error}
          </p>
        )}

        {!loading && !error && products.length === 0 && (
          <p className="rounded-lg bg-gray-100 px-4 py-3 text-sm text-gray-800">
            {debouncedSearch ? "No products match your search." : "No products available yet."}
          </p>
        )}

        {!loading && !error && products.length > 0 && (
          <>
            <p className="mb-4 text-sm text-gray-600">
              Showing {products.length} of {pagination.total} products
            </p>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => (
                <ProductCard key={product.product_id} product={product} />
              ))}
            </div>

            {pagination.total_pages > 1 && (
              <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => goToPage(page - 1)}
                  disabled={page <= 1 || loading}
                  className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="text-sm text-gray-800">
                  Page {pagination.page} of {pagination.total_pages}
                </span>
                <button
                  type="button"
                  onClick={() => goToPage(page + 1)}
                  disabled={page >= pagination.total_pages || loading}
                  className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  )
}

export default GetProducts
