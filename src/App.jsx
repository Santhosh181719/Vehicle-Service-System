import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";

import Dashboard from "./pages/Dashboard";
import Vehicles from "./pages/Vehicles";
import BookService from "./pages/BookService";
import Bookings from "./pages/Bookings";

import AdminDashboard from "./pages/AdminDashboard";
import AdminBookings from "./pages/AdminBookings";
import Customers from "./pages/Customers";
import AdminVehicles from "./pages/AdminVehicles";


function App() {
    return (
        <BrowserRouter>

            <Routes>

                {/* ========================= */}
                {/* CUSTOMER ROUTES */}
                {/* ========================= */}

                <Route
                    path="/"
                    element={<Login />}
                />

                <Route
                    path="/register"
                    element={<Register />}
                />

                <Route
                    path="/dashboard"
                    element={<Dashboard />}
                />

                <Route
                    path="/vehicles"
                    element={<Vehicles />}
                />

                <Route
                    path="/book-service"
                    element={<BookService />}
                />

                <Route
                    path="/bookings"
                    element={<Bookings />}
                />


                {/* ========================= */}
                {/* ADMIN ROUTES */}
                {/* ========================= */}

                <Route
                    path="/admin"
                    element={<AdminDashboard />}
                />

                <Route
                    path="/admin/bookings"
                    element={<AdminBookings />}
                />

                <Route
                    path="/admin/customers"
                    element={<Customers />}
                />

                {/* Optional alias */}
                <Route
                    path="/admin/users"
                    element={<Customers />}
                />
                <Route
                    path="/admin/vehicles"
                    element={<AdminVehicles />}
                />

            </Routes>

        </BrowserRouter>
    );
}

export default App;