// Get logged-in user id from localStorage
export const getUserId = () => {
  const stored = localStorage.getItem("user")
  if (!stored) return null
  try {
    const user = JSON.parse(stored)
    return user?.id ?? null
  } catch {
    return null
  }
}
