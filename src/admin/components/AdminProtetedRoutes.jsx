import { useSelector } from "react-redux"
import { Navigate } from "react-router-dom";


function AdminProtetedRoutes({children}) {
  const isAuthenticated = useSelector(state => state.auth.isAdminAuthenticated);
  if(isAuthenticated)
   return children
  return <Navigate to="/admin/login"/>
}

export default AdminProtetedRoutes