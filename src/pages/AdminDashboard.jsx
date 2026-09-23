import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./AdminDashboard.css";

function AdminDashboard() {

    const navigate = useNavigate();

    const [customers, setCustomers] = useState(0);
    const [vehicles, setVehicles] = useState(0);
    const [bookings, setBookings] = useState(0);
    const [pendingBookings, setPendingBookings] = useState(0);
    const [confirmedBookings, setConfirmedBookings] = useState(0);
    const [completedBookings, setCompletedBookings] = useState(0);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    // =========================
    // LOGOUT
    // =========================

    const handleLogout = () => {

        localStorage.removeItem("token");

        navigate("/");

    };


    // =========================
    // FETCH DASHBOARD DATA
    // =========================

    const fetchDashboardData = async () => {

        setLoading(true);
        setError("");

        try {

            const [
                usersResponse,
                vehiclesResponse,
                bookingsResponse
            ] = await Promise.all([

                fetch("http://localhost:8080/api/admin/users"),

                fetch("http://localhost:8080/api/admin/vehicles"),

                fetch("http://localhost:8080/api/admin/bookings")

            ]);


            if (
                !usersResponse.ok ||
                !vehiclesResponse.ok ||
                !bookingsResponse.ok
            ) {
                throw new Error(
                    "Failed to fetch dashboard data"
                );
            }


            const users =
                await usersResponse.json();

            const vehicleData =
                await vehiclesResponse.json();

            const bookingData =
                await bookingsResponse.json();


            // =========================
            // CUSTOMERS
            // =========================

            const customerData = users.filter(
                (user) =>
                    user.role &&
                    user.role.toUpperCase() === "CUSTOMER"
            );


            // =========================
            // BOOKING STATUS
            // =========================

            const pendingData = bookingData.filter(
                (booking) =>
                    booking.status &&
                    booking.status.toUpperCase() === "PENDING"
            );


            const confirmedData = bookingData.filter(
                (booking) =>
                    booking.status &&
                    (
                        booking.status.toUpperCase() === "CONFIRMED" ||
                        booking.status.toUpperCase() === "APPROVED"
                    )
            );


            const completedData = bookingData.filter(
                (booking) =>
                    booking.status &&
                    booking.status.toUpperCase() === "COMPLETED"
            );


            // =========================
            // SET COUNTS
            // =========================

            setCustomers(customerData.length);

            setVehicles(vehicleData.length);

            setBookings(bookingData.length);

            setPendingBookings(pendingData.length);

            setConfirmedBookings(confirmedData.length);

            setCompletedBookings(completedData.length);


        } catch (error) {

            console.error(
                "Admin dashboard error:",
                error
            );

            setError(
                "Unable to load dashboard data."
            );

        } finally {

            setLoading(false);

        }
    };


    // =========================
    // LOAD DATA
    // =========================

    useEffect(() => {

        fetchDashboardData();

    }, []);


    return (

        <div className="admin-page">


            {/* =========================
                NAVBAR
            ========================= */}

            <nav className="admin-nav">


                {/* BRAND */}

                <Link
                    to="/admin"
                    className="admin-brand"
                >

                    <div className="admin-logo">
                        A
                    </div>

                    <div>

                        <div className="admin-brand-name">
                            AutoCare
                        </div>

                        <div className="admin-brand-subtitle">
                            Administration
                        </div>

                    </div>

                </Link>



                {/* NAV LINKS */}

                <div className="admin-nav-links">

                    <Link
                        to="/admin"
                        className="active"
                    >
                        Dashboard
                    </Link>

                    <Link to="/admin/bookings">
                        Bookings
                    </Link>

                    <Link to="/admin/customers">
                        Customers
                    </Link>

                    <Link to="/admin/vehicles">
                        Vehicles
                    </Link>

                </div>



                {/* LOGOUT */}

                <button
                    className="admin-logout"
                    onClick={handleLogout}
                >
                    Logout
                </button>

            </nav>



            {/* =========================
                MAIN
            ========================= */}

            <main className="admin-content">


                {/* HEADER */}

                <div className="admin-header">

                    <div>

                        <p className="admin-page-label">
                            ADMINISTRATION
                        </p>

                        <h1>
                            Dashboard
                        </h1>

                        <p>
                            Overview of your vehicle service platform.
                        </p>

                    </div>


                    <button
                        className="admin-refresh"
                        onClick={fetchDashboardData}
                    >
                        ↻ Refresh
                    </button>

                </div>



                {/* ERROR */}

                {error && (

                    <div className="admin-error">
                        {error}
                    </div>

                )}



                {/* =========================
                    STAT CARDS
                ========================= */}

                <div className="admin-stats">


                    {/* CUSTOMERS */}

                    <Link
                        to="/admin/customers"
                        className="admin-stat-card"
                    >

                        <div className="stat-icon">
                            U
                        </div>

                        <div className="stat-content">

                            <span>
                                TOTAL CUSTOMERS
                            </span>

                            <strong>
                                {loading
                                    ? "—"
                                    : customers}
                            </strong>

                        </div>

                        <div className="stat-arrow">
                            →
                        </div>

                    </Link>



                    {/* VEHICLES */}

                    <Link
                        to="/admin/vehicles"
                        className="admin-stat-card"
                    >

                        <div className="stat-icon">
                            V
                        </div>

                        <div className="stat-content">

                            <span>
                                TOTAL VEHICLES
                            </span>

                            <strong>
                                {loading
                                    ? "—"
                                    : vehicles}
                            </strong>

                        </div>

                        <div className="stat-arrow">
                            →
                        </div>

                    </Link>



                    {/* BOOKINGS */}

                    <Link
                        to="/admin/bookings"
                        className="admin-stat-card"
                    >

                        <div className="stat-icon">
                            B
                        </div>

                        <div className="stat-content">

                            <span>
                                TOTAL BOOKINGS
                            </span>

                            <strong>
                                {loading
                                    ? "—"
                                    : bookings}
                            </strong>

                        </div>

                        <div className="stat-arrow">
                            →
                        </div>

                    </Link>



                    {/* PENDING */}

                    <Link
                        to="/admin/bookings"
                        className="admin-stat-card"
                    >

                        <div className="stat-icon pending-icon">
                            P
                        </div>

                        <div className="stat-content">

                            <span>
                                PENDING BOOKINGS
                            </span>

                            <strong>
                                {loading
                                    ? "—"
                                    : pendingBookings}
                            </strong>

                        </div>

                        <div className="stat-arrow">
                            →
                        </div>

                    </Link>

                </div>



                {/* =========================
                    BOOKING OVERVIEW
                ========================= */}

                <section className="booking-overview">


                    <div className="overview-header">

                        <div>

                            <h2>
                                Booking Overview
                            </h2>

                            <p>
                                Current booking statistics
                            </p>

                        </div>


                        <Link to="/admin/bookings">
                            View All →
                        </Link>

                    </div>



                    <div className="booking-stats">


                        {/* PENDING */}

                        <div className="booking-stat">

                            <span>
                                Pending
                            </span>

                            <strong>
                                {loading
                                    ? "—"
                                    : pendingBookings}
                            </strong>

                        </div>



                        {/* CONFIRMED */}

                        <div className="booking-stat">

                            <span>
                                Confirmed
                            </span>

                            <strong>
                                {loading
                                    ? "—"
                                    : confirmedBookings}
                            </strong>

                        </div>



                        {/* COMPLETED */}

                        <div className="booking-stat">

                            <span>
                                Completed
                            </span>

                            <strong>
                                {loading
                                    ? "—"
                                    : completedBookings}
                            </strong>

                        </div>



                        {/* TOTAL */}

                        <div className="booking-stat">

                            <span>
                                Total
                            </span>

                            <strong>
                                {loading
                                    ? "—"
                                    : bookings}
                            </strong>

                        </div>

                    </div>

                </section>


            </main>

        </div>
    );
}

export default AdminDashboard;