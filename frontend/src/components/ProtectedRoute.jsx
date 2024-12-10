import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ user, children, requiredRole,fetchUser }) => {
   
    console.log("user")
    if (!user) {
        // If the user is not logged in, redirect to login
        return <Navigate to="/" replace />;
    }

    if ( user.isAdmin != requiredRole) {
        // If the user does not have the required role, redirect to a "not authorized" page or home
        return <Navigate to="/" replace />;
    }
    
    // If all checks pass, render the child component
    return children;
};

export default ProtectedRoute;
