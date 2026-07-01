const API_BASE = "http://127.0.0.1:5000"

// Get logged-in user from localStorage
export const getStoredUser = () => {
  const stored = localStorage.getItem("user")
  if (!stored) return null
  try {
    return JSON.parse(stored)
  } catch {
    return null
  }
}

// Check if logged-in user is admin
export const isAdmin = (user = getStoredUser()) => {
  return user?.role === "admin"
}

// Log out user on server and clear local storage
export const logoutUser = async () => {
  const user = getStoredUser()
  if (user?.id) {
    const data = new FormData()
    data.append("user_id", user.id)
    await fetch(`${API_BASE}/api/logout`, { method: "POST", body: data })
  }
  localStorage.removeItem("user")
}

export { API_BASE }
