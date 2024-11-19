import React, { Children } from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom';

function AdminPublicRoutes({children}) {
  const isAuthenticated = useSelector(state => state.auth.isAdminAuthenticated);

  if(isAuthenticated)
   return <Navigate to="/admin"/>

  return children
}

export default AdminPublicRoutes