import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./AdminBookings.css";

function AdminBookings() {

    const navigate = useNavigate();

    const [bookings, setBookings] = useState([]);
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
    // FETCH BOOKINGS
    // =========================

    const fetchBookings = async () => {

        setLoading(true);
        setError("");

        try {

            const response = await fetch(
                "http://localhost:8080/api/admin/bookings"
            );


            if (!response.ok) {

                throw new Error(
                    "Failed to fetch bookings"
                );

            }


            const data =
                await response.json();


            setBookings(data);


        } catch (error) {

            console.error(
                "Admin bookings error:",
                error
            );

            setError(
                "Unable to load bookings."
            );

        } finally {

            setLoading(false);

        }
    };


    // =========================
    // LOAD BOOKINGS
    // =========================

    useEffect(() => {

        fetchBookings();

    }, []);


    // =========================
    // UPDATE STATUS
    // =========================

    const updateStatus = async (
        id,
        status
    ) => {

        try {

            const response = await fetch(

                `http://localhost:8080/api/admin/bookings/${id}/status?status=${status}`,

                {
                    method: "PUT"
                }

            );


            if (!response.ok) {

                throw new Error(
                    "Failed to update status"
                );

            }


            const updatedBooking =
                await response.json();


            setBookings(
                (currentBookings) =>

                    currentBookings.map(
                        (booking) =>

                            booking.id === id
                                ? updatedBooking
                                : booking
                    )

            );


        } catch (error) {

            console.error(
                "Status update error:",
                error
            );

            alert(
                "Failed to update booking status."
            );

        }
    };


    // =========================
    // DELETE BOOKING
    // =========================

    const deleteBooking = async (id) => {

        const confirmed =
            window.confirm(
                "Are you sure you want to delete this booking?"
            );


        if (!confirmed) {

            return;

        }


        try {

            const response = await fetch(

                `http://localhost:8080/api/admin/bookings/${id}`,

                {
                    method: "DELETE"
                }

            );


            if (!response.ok) {

                throw new Error(
                    "Failed to delete booking"
                );

            }


            // Remove deleted booking
            // from the screen immediately

            setBookings(
                (currentBookings) =>

                    currentBookings.filter(
                        (booking) =>
                            booking.id !== id
                    )

            );


        } catch (error) {

            console.error(
                "Delete error:",
                error
            );

            alert(
                "Failed to delete booking."
            );

        }
    };


    // =========================
    // FORMAT SERVICE TYPE
    // =========================

    const formatServiceType = (
        serviceType
    ) => {

        if (!serviceType) {

            return "Service";

        }


        return serviceType

            .replaceAll("_", " ")

            .toLowerCase()

            .replace(
                /\b\w/g,
                (letter) =>
                    letter.toUpperCase()
            );
    };


    // =========================
    // STATUS CLASS
    // =========================

    const getStatusClass = (
        status
    ) => {

        return `admin-booking-status status-${(
            status || "PENDING"
        ).toLowerCase()}`;

    };


    return (

        <div className="admin-bookings-page">


            {/* =========================
                NAVBAR
            ========================= */}

            <nav className="admin-bookings-nav">


                {/* BRAND */}

                <Link
                    to="/admin"
                    className="admin-bookings-brand"
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

                <div className="admin-bookings-links">

                    <Link to="/admin">
                        Dashboard
                    </Link>

                    <Link
                        to="/admin/bookings"
                        className="active"
                    >
                        Bookings
                    </Link>

                    <Link to="/admin/customers">
                        Customers
                    </Link>

                    <Link to="/admin/vehicles">
                        Vehicles
                    </Link>

                </div>

            </nav>



            {/* =========================
                MAIN
            ========================= */}

            <main className="admin-bookings-content">


                {/* HEADER */}

                <div className="admin-bookings-header">

                    <div>

                        <p className="admin-page-label">
                            SERVICE MANAGEMENT
                        </p>

                        <h1>
                            All Bookings
                        </h1>

                        <p>
                            Manage and track customer service
                            bookings.
                        </p>

                    </div>


                    <button
                        className="admin-refresh-btn"
                        onClick={fetchBookings}
                    >
                        ↻ Refresh
                    </button>

                </div>



                {/* ERROR */}

                {error && (

                    <div className="admin-bookings-error">
                        {error}
                    </div>

                )}



                {/* SUMMARY */}

                {!loading && (

                    <div className="booking-summary">


                        {/* TOTAL */}

                        <div>

                            <span>
                                TOTAL
                            </span>

                            <strong>
                                {bookings.length}
                            </strong>

                        </div>



                        {/* PENDING */}

                        <div>

                            <span>
                                PENDING
                            </span>

                            <strong>

                                {
                                    bookings.filter(
                                        (booking) =>
                                            booking.status &&
                                            booking.status.toUpperCase() ===
                                            "PENDING"
                                    ).length
                                }

                            </strong>

                        </div>



                        {/* APPROVED */}

                        <div>

                            <span>
                                APPROVED
                            </span>

                            <strong>

                                {
                                    bookings.filter(
                                        (booking) =>
                                            booking.status &&
                                            (
                                                booking.status.toUpperCase() ===
                                                "APPROVED" ||

                                                booking.status.toUpperCase() ===
                                                "CONFIRMED"
                                            )
                                    ).length
                                }

                            </strong>

                        </div>



                        {/* COMPLETED */}

                        <div>

                            <span>
                                COMPLETED
                            </span>

                            <strong>

                                {
                                    bookings.filter(
                                        (booking) =>
                                            booking.status &&
                                            booking.status.toUpperCase() ===
                                            "COMPLETED"
                                    ).length
                                }

                            </strong>

                        </div>


                    </div>

                )}



                {/* =========================
                    BOOKINGS CARD
                ========================= */}

                <section className="admin-bookings-card">


                    {/* LOADING */}

                    {loading ? (

                        <div className="admin-bookings-empty">

                            Loading bookings...

                        </div>


                    ) : bookings.length === 0 ? (


                        /* EMPTY */

                        <div className="admin-bookings-empty">

                            <div className="empty-booking-icon">
                                📅
                            </div>

                            <h2>
                                No bookings found
                            </h2>

                            <p>
                                There are currently no service
                                bookings.
                            </p>

                        </div>


                    ) : (


                        /* BOOKING LIST */

                        <div className="admin-booking-list">


                            {bookings.map(
                                (booking) => (

                                    <div
                                        className="admin-booking-item"
                                        key={booking.id}
                                    >


                                        {/* =========================
                                            TOP
                                        ========================= */}

                                        <div className="admin-booking-top">


                                            <div className="admin-booking-title">


                                                <div className="admin-service-icon">
                                                    🔧
                                                </div>


                                                <div>

                                                    <h2>

                                                        {formatServiceType(
                                                            booking.serviceType
                                                        )}

                                                    </h2>


                                                    <span>

                                                        Booking #
                                                        {booking.id}

                                                    </span>

                                                </div>

                                            </div>



                                            {/* STATUS */}

                                            <span
                                                className={
                                                    getStatusClass(
                                                        booking.status
                                                    )
                                                }
                                            >

                                                {booking.status ||
                                                    "PENDING"}

                                            </span>

                                        </div>



                                        {/* =========================
                                            DETAILS
                                        ========================= */}

                                        <div className="admin-booking-details">


                                            {/* CUSTOMER */}

                                            <div>

                                                <span>
                                                    CUSTOMER
                                                </span>

                                                <strong>

                                                    {booking.user
                                                        ? booking.user.name
                                                        : "Customer"}

                                                </strong>

                                                <small>

                                                    {booking.user
                                                        ? booking.user.email
                                                        : "—"}

                                                </small>

                                            </div>



                                            {/* VEHICLE */}

                                            <div>

                                                <span>
                                                    VEHICLE
                                                </span>

                                                <strong>

                                                    {booking.vehicle
                                                        ? `${booking.vehicle.brand} ${booking.vehicle.model}`
                                                        : "Vehicle"}

                                                </strong>

                                                <small>

                                                    {booking.vehicle
                                                        ? booking.vehicle.vehicleNumber
                                                        : "—"}

                                                </small>

                                            </div>



                                            {/* SERVICE DATE */}

                                            <div>

                                                <span>
                                                    SERVICE DATE
                                                </span>

                                                <strong>
                                                    {booking.bookingDate}
                                                </strong>

                                            </div>



                                            {/* VEHICLE TYPE */}

                                            <div>

                                                <span>
                                                    VEHICLE TYPE
                                                </span>

                                                <strong>

                                                    {booking.vehicle
                                                        ? booking.vehicle.vehicleType
                                                        : "—"}

                                                </strong>

                                            </div>

                                        </div>



                                        {/* =========================
                                            ACTIONS
                                        ========================= */}

                                        <div className="admin-booking-actions">


                                            {/* UPDATE STATUS */}

                                            <div>

                                                <label>
                                                    UPDATE STATUS
                                                </label>


                                                <select
                                                    value={
                                                        booking.status ||
                                                        "PENDING"
                                                    }
                                                    onChange={(event) =>
                                                        updateStatus(
                                                            booking.id,
                                                            event.target.value
                                                        )
                                                    }
                                                >

                                                    <option value="PENDING">
                                                        Pending
                                                    </option>

                                                    <option value="APPROVED">
                                                        Approved
                                                    </option>

                                                    <option value="COMPLETED">
                                                        Completed
                                                    </option>

                                                    <option value="CANCELLED">
                                                        Cancelled
                                                    </option>

                                                </select>

                                            </div>



                                            {/* DELETE */}

                                            <button
                                                className="admin-delete-btn"
                                                onClick={() =>
                                                    deleteBooking(
                                                        booking.id
                                                    )
                                                }
                                            >
                                                Delete Booking
                                            </button>

                                        </div>


                                    </div>

                                )
                            )}

                        </div>

                    )}

                </section>


            </main>

        </div>
    );
}

export default AdminBookings;