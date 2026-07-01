import { Navigate } from "react-router-dom"
import { getStoredUser, isAdmin } from "../utils/authUtils"

const AdminRoute = ({ children }) => {
  const user = getStoredUser()

  if (!user) {
    return <Navigate to="/signin" replace />
  }

  if (!isAdmin(user)) {
    return <Navigate to="/getproducts" replace />
  }

  return children
}

export default AdminRoute
