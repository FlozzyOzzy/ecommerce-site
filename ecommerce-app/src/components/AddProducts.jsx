import axios from "axios"
import { useState } from "react"
import { getStoredUser } from "../utils/authUtils"

const categories = ["Electronics", "Fashion", "Home & Living"]

const inputClassName =
  "block w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-base text-gray-800 shadow-sm transition placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 sm:text-sm"

const AddProducts = () => {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [category, setCategory] = useState("")
  const [image, setImage] = useState(null)
  const [quantity, setQuantity] = useState("")
  const [loading, setLoading] = useState("")
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")

  const handleImageChange = (e) => {
    setImage(e.target.files[0] ?? null)
  }

  const handleSubmit = async (e) => {
    // preventing default behavior of forms relaoding
    e.preventDefault()
    setLoading("Please wait as we add your product...")
    setSuccess("")
    setError("")

    const user = getStoredUser()
    const data = new FormData()
    data.append("user_id", user.id)
    data.append("title", title)
    data.append("description", description)
    data.append("category", category)
    data.append("price", price)
    data.append("image", image)
    data.append("stock_quantity", quantity)

    try {
      const response = await axios.post("http://127.0.0.1:5000/api/add_product", data)
      setLoading("")
      setSuccess(response.data.Message)

      setTitle("")
      setDescription("")
      setPrice("")
      setCategory("")
      setImage(null)
    } catch (error) {
      setLoading("")
      setError(error.response?.data?.message || error.message)
    }
  }

  return (
    <div className="relative flex min-h-svh flex-col bg-gray-50">
      <div className="flex flex-1 flex-col items-center px-4 py-10 sm:px-6 lg:px-8">
        <div className="w-full max-w-lg">
          <div className="rounded-2xl border border-gray-200 bg-white px-8 py-10 shadow-lg">
            <div className="mb-8 text-center">
              <span className="inline-flex items-center rounded-full bg-amber-500 px-4 py-1.5 text-xs font-semibold text-white shadow-sm">
                Admin
              </span>
              <h2 className="mt-4 font-sans text-4xl text-gray-900">Add Product</h2>
              <p className="mt-2 text-sm text-gray-800">
                Fill in the details below to add a new product to the store.
              </p>
            </div>

            {(loading || success || error) && (
              <div className="mb-6 space-y-2">
                {loading && (
                  <p className="rounded-lg bg-gray-100 px-4 py-3 text-sm text-gray-600">{loading}</p>
                )}
                {success && (
                  <p className="rounded-lg bg-gray-100 px-4 py-3 text-sm text-gray-800">{success}</p>
                )}
                {error && (
                  <p className="rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-800">
                    {error}
                  </p>
                )}
              </div>
            )}

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="title" className="mb-1.5 block text-left text-sm font-medium text-gray-900">
                  Title
                </label>
                <input
                  id="title"
                  type="text"
                  placeholder="Wireless Headphones"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className={inputClassName}
                  required
                />
              </div>

              <div>
                <label htmlFor="description" className="mb-1.5 block text-left text-sm font-medium text-gray-900">
                  Description
                </label>
                <textarea
                  id="description"
                  rows={4}
                  placeholder="Describe the product features and benefits..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className={`${inputClassName} resize-none`}
                  required
                />
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="price" className="mb-1.5 block text-left text-sm font-medium text-gray-900">
                    Price (Ksh)
                  </label>
                  <input
                    id="price"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="1000"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className={inputClassName}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="category" className="mb-1.5 block text-left text-sm font-medium text-gray-900">
                    Category
                  </label>
                  <select
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className={inputClassName}
                    required
                  >
                    <option value="" disabled>
                      Select a category
                    </option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

                <div>
                  <label htmlFor="Quantity" className="mb-1.5 block text-left text-sm font-medium text-gray-900">
                    Quantity
                  </label>
                  <input
                    id="quantity"
                    type="number"
                    min="0"
                    step="1"
                    placeholder="10"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className={inputClassName}
                    required
                  />
                </div>

              <div>
                <label htmlFor="image" className="mb-1.5 block text-left text-sm font-medium text-gray-900">
                  Product Image
                </label>
                <input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-800 file:mr-4 file:rounded-md file:border-0 file:bg-blue-600 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-blue-700"
                  required
                />
              </div>

              <button
                type="submit"
                className="mt-2 w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              >
                Add Product
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddProducts
