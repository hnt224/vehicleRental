
import './App.css';
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './component/common/Navbar';
import FooterComponent from './component/common/Footer';
import HomePage from './component/home/HomePage';
import AllVehiclesPage from './component/booking_vehicles/AllVehiclesPage';
import FindBookingPage from './component/booking_vehicles/FindBookingPage';
import VehicleDetailsPage from './component/booking_vehicles/VehicleDetailsPage';
import LoginPage from './component/auth/LoginPage';
import RegisterPage from './component/auth/RegisterPage';
import ProfilePage from './component/profile/ProfilePage';
import EditProfilePage from './component/profile/EditProfilePage';
import { ProtectedRoutes, AdminRoute } from './service/guard';
import AdminPage from './component/admin/AdminPage';
import ManageVehiclePage from './component/admin/ManageVehiclePage';
import EditVehiclePage from './component/admin/EditVehiclePage';
import AddVehiclePage from './component/admin/AddVehiclePage';
import ManageBookingsPage from './component/admin/ManageBookingsPage';
import EditBookingPage from './component/admin/EditBookingPage';

function App() {
  return (
    <BrowserRouter>
    <div className="App">
      <Navbar/>

      <div className="content">
        <Routes>

        {/* Public routes */}
        <Route exact path='/home' element={<HomePage/>} />
        <Route exact path='/login' element={<LoginPage/>} />
        <Route path='/vehicles' element={< AllVehiclesPage/>} />
        <Route path='/find-booking' element={<FindBookingPage/>} />
        <Route path='/register' element={<RegisterPage/>} />


        {/* Authenticated Users Routes */}
        <Route path='/vehicle-details-book/:vehicleId' element={<ProtectedRoutes element={<VehicleDetailsPage/>}/>} />
        <Route path='/profile' element={ <ProtectedRoutes element={<ProfilePage/>} />} />
        <Route path='/edit-profile' element={<ProtectedRoutes element={<EditProfilePage/>}/>} />


        {/* Admin Auth Routes */}
         <Route path="/admin"
              element={<AdminRoute element={<AdminPage />} />}
            />
            <Route path="/admin/manage-vehicles"
              element={<AdminRoute element={<ManageVehiclePage />} />}
            />
            <Route path="/admin/edit-vehicle/:vehicleId"
              element={<AdminRoute element={<EditVehiclePage />} />}
            />
            <Route path="/admin/add-vehicle"
              element={<AdminRoute element={<AddVehiclePage />} />}
            />
            <Route path="/admin/manage-bookings"
              element={<AdminRoute element={<ManageBookingsPage />} />}
            />
            <Route path="/admin/edit-booking/:bookingCode"
              element={<AdminRoute element={<EditBookingPage />} />}
            />

        <Route path='*' element={<Navigate to="/home"/>} />

        </Routes>
      </div>

      <FooterComponent/>
    </div>
    </BrowserRouter>
  );
}

export default App;
