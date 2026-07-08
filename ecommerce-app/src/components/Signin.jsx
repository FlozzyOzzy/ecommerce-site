import axios from "axios"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { API_BASE } from "../config/api"

const inputClassName =
  "block w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-base text-gray-800 shadow-sm transition placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 sm:text-sm"

const Signin = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    setLoading("Please wait as we log you in...")
    setError('')

    try {
      const data = new FormData()
      data.append("email", email)
      data.append("password", password)

      const response = await axios.post(`${API_BASE}/api/signin`, data)
      setLoading("")
      if (response.data.user) {
        localStorage.setItem("user", JSON.stringify(response.data.user))
        navigate("/getproducts")
      } else {
        setError(response.data.message || "Login Failed")
      }
    } catch (err) {
      setLoading("")
      setError(err.response?.data?.message || "There was a server error. Make sure the backend is running.")
    }
  }

  return (
    <div className="flex flex-col items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-gray-200 bg-white px-8 py-10 shadow-lg">
          <div className="mb-8 text-center">
            <h2 className="font-sans text-4xl font-semibold text-gray-900">Sign In</h2>
            <p className="mt-2 text-sm text-gray-800">Welcome back — sign in to your account</p>
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

          <form className="space-y-5" onSubmit={submit}>
            <div>
              <label htmlFor="email" className="mb-1.5 block text-left text-sm font-medium text-gray-900">
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="john@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClassName}
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-1.5 block text-left text-sm font-medium text-gray-900">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputClassName}
              />
            </div>

            <button
              type="submit"
              className="mt-2 w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              Sign In
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-800">
            Don&apos;t have an account?{" "}
            <Link to="/signup" className="font-medium text-blue-600 hover:text-blue-700">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Signin
