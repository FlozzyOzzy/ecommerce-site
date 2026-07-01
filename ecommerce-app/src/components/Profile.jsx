import axios from "axios"
import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { API_BASE, getStoredUser, logoutUser } from "../utils/authUtils"

const Profile = () => {
  const navigate = useNavigate()
  const storedUser = getStoredUser()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [logoutLoading, setLogoutLoading] = useState(false)

  // Fetch user profile from API
  useEffect(() => {
    if (!storedUser?.id) {
      setLoading(false)
      return
    }

    let cancelled = false

    axios
      .get(`${API_BASE}/api/profile`, { params: { user_id: storedUser.id } })
      .then((response) => {
        if (!cancelled) setProfile(response.data.user)
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.response?.data?.message || err.message || "Failed to load profile.")
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [storedUser?.id])

  const handleLogout = async () => {
    setLogoutLoading(true)
    setError("")

    try {
      await logoutUser()
      navigate("/signin")
    } catch {
      setError("Logout failed. Please try again.")
      setLogoutLoading(false)
    }
  }

  if (!storedUser) {
    return (
      <div className="mx-auto w-full max-w-md px-4 py-10">
        <p className="rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-800">
          Please{" "}
          <Link to="/signin" className="font-medium text-blue-600 hover:text-blue-700">
            sign in
          </Link>{" "}
          to view your profile.
        </p>
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-md px-4 py-10">
      <div className="rounded-2xl border border-gray-200 bg-white px-8 py-10 shadow-lg">
        <h1 className="text-3xl font-semibold text-gray-900">My Profile</h1>
        <p className="mt-2 text-sm text-gray-600">Your account details</p>

        {loading && (
          <p className="mt-6 rounded-lg bg-gray-100 px-4 py-3 text-sm text-gray-600">Loading profile...</p>
        )}

        {error && (
          <p className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
        )}

        {!loading && profile && (
          <div className="mt-6 space-y-4 text-left">
            <div>
              <p className="text-sm font-medium text-gray-500">Name</p>
              <p className="text-base text-gray-900">
                {profile.firstname} {profile.lastname}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Email</p>
              <p className="text-base text-gray-900">{profile.email}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Phone</p>
              <p className="text-base text-gray-900">{profile.phone}</p>
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={handleLogout}
          disabled={logoutLoading}
          className="mt-8 w-full rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-gray-800 disabled:opacity-60"
        >
          {logoutLoading ? "Logging out..." : "Logout"}
        </button>
      </div>
    </div>
  )
}

export default Profile
