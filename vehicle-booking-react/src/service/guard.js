import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import ApiService from "./ApiService";

//protect routes
export const ProtectedRoutes = ({element: Component}) => {
    const location = useLocation();

    return ApiService.isAuthenticated() ? (
        Component
    ):(
        //if user is not authenticated, user must log in
        <Navigate to="/login" replace state={{from: location}}/>
    );
};


//protect admin routes
export const AdminRoute = ({element: Component}) => {
    const location = useLocation();

    return ApiService.isAdmin() ? (
        Component
    ):(

        <Navigate to="/login" replace state={{from: location}}/>
    );
};