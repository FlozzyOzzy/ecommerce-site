import axios from "axios"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"

const inputClassName =
  "block w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-base text-gray-800 shadow-sm transition placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 sm:text-sm"

const Signup = () => {
  const [firstname, setFirstname] = useState('')
  const [lastname, setLastname] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    setLoading("Please wait as we upload your data!")
    setError('')
    setSuccess('')

    const data = new FormData()
    data.append("firstname", firstname)
    data.append("lastname", lastname)
    data.append("email", email)
    data.append("phone", phone)
    data.append("password", password)

    try {
      const response = await axios.post("http://127.0.0.1:5000/api/signup", data)
      setLoading("")
      setSuccess(response.data.success)
      navigate("/signin")

      setFirstname("")
      setLastname("")
      setEmail("")
      setPhone("")
      setPassword("")
    } catch (error) {
      setLoading("")
      setError(error.message)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-gray-200 bg-white px-8 py-10 shadow-lg">
          <div className="mb-8 text-center">
            <h2 className="font-sans text-4xl text-gray-900">Signup</h2>
            <p className="mt-2 text-sm text-gray-800">Create your account to get started</p>
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

          <form className="space-y-5" onSubmit={submit}>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="firstname" className="mb-1.5 block text-left text-sm font-medium text-gray-900">
                  First name
                </label>
                <input
                  id="firstname"
                  type="text"
                  placeholder="John"
                  value={firstname}
                  onChange={(e) => setFirstname(e.target.value)}
                  className={inputClassName}
                />
              </div>
              <div>
                <label htmlFor="lastname" className="mb-1.5 block text-left text-sm font-medium text-gray-900">
                  Last name
                </label>
                <input
                  id="lastname"
                  type="text"
                  placeholder="Doe"
                  value={lastname}
                  onChange={(e) => setLastname(e.target.value)}
                  className={inputClassName}
                />
              </div>
            </div>

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
              <label htmlFor="phone" className="mb-1.5 block text-left text-sm font-medium text-gray-900">
                Phone
              </label>
              <input
                id="phone"
                type="tel"
                placeholder="07XXXX"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
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
              Signup
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-800">
            Already have an account?{" "}
            <Link to="/signin" className="font-medium text-blue-600 hover:text-blue-700">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Signup
