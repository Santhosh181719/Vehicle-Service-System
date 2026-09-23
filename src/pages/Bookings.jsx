import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Bookings.css";

function Bookings() {

    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    // =========================
    // FETCH MY BOOKINGS
    // =========================

    const fetchBookings = async () => {

        setLoading(true);
        setError("");

        try {

            const token = localStorage.getItem("token");

            if (!token) {
                throw new Error("User is not logged in");
            }


            const response = await fetch(
                "http://localhost:8080/api/bookings/my",
                {
                    method: "GET",

                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                }
            );


            if (!response.ok) {

                throw new Error(
                    "Failed to fetch your bookings"
                );

            }


            const data = await response.json();

            setBookings(data);

        } catch (error) {

            console.error(
                "Bookings error:",
                error
            );

            setError(
                "Unable to load your bookings."
            );

        } finally {

            setLoading(false);

        }
    };


    useEffect(() => {

        fetchBookings();

    }, []);


    // =========================
    // FORMAT SERVICE
    // =========================

    const formatServiceType = (serviceType) => {

        if (!serviceType) {
            return "Service";
        }

        return serviceType
            .replaceAll("_", " ")
            .toLowerCase()
            .replace(/\b\w/g, (letter) =>
                letter.toUpperCase()
            );
    };


    // =========================
    // STATUS CLASS
    // =========================

    const getStatusClass = (status) => {

        return `booking-status status-${(
            status || "PENDING"
        ).toLowerCase()}`;

    };


    // =========================
    // COUNTS
    // =========================

    const pendingCount = bookings.filter(
        (booking) =>
            booking.status === "PENDING"
    ).length;


    const approvedCount = bookings.filter(
        (booking) =>
            booking.status === "APPROVED"
    ).length;


    const completedCount = bookings.filter(
        (booking) =>
            booking.status === "COMPLETED"
    ).length;


    return (

        <div className="bookings-page">


            {/* =========================
                NAVBAR
            ========================= */}

            <nav className="bookings-nav">

                <Link
                    to="/dashboard"
                    className="bookings-brand"
                >

                    <div className="brand-logo">
                        A
                    </div>

                    <div>

                        <div className="brand-name">
                            AutoCare
                        </div>

                        <div className="brand-subtitle">
                            Vehicle Service
                        </div>

                    </div>

                </Link>


                <div className="bookings-nav-links">

                    <Link to="/dashboard">
                        Dashboard
                    </Link>

                    <Link to="/vehicles">
                        My Vehicles
                    </Link>

                    <Link to="/book-service">
                        Book Service
                    </Link>

                    <Link
                        to="/bookings"
                        className="active"
                    >
                        Bookings
                    </Link>

                </div>


                

            </nav>



            {/* =========================
                MAIN
            ========================= */}

            <main className="bookings-content">


                {/* =========================
                    HEADER
                ========================= */}

                <div className="bookings-header">

                    <div>

                        <p className="page-label">
                            SERVICE HISTORY
                        </p>

                        <h1>
                            My Bookings
                        </h1>

                        <p>
                            View and track all your vehicle
                            service bookings.
                        </p>

                    </div>


                    <button
                        className="refresh-btn"
                        onClick={fetchBookings}
                    >
                        ↻ Refresh
                    </button>

                </div>



                {/* =========================
                    ERROR
                ========================= */}

                {error && (

                    <div className="bookings-error">
                        {error}
                    </div>

                )}



                {/* =========================
                    SUMMARY
                ========================= */}

                {!loading && (

                    <div className="booking-summary">

                        <div className="summary-card">

                            <span>
                                TOTAL BOOKINGS
                            </span>

                            <strong>
                                {bookings.length}
                            </strong>

                        </div>


                        <div className="summary-card">

                            <span>
                                PENDING
                            </span>

                            <strong>
                                {pendingCount}
                            </strong>

                        </div>


                        <div className="summary-card">

                            <span>
                                APPROVED
                            </span>

                            <strong>
                                {approvedCount}
                            </strong>

                        </div>


                        <div className="summary-card">

                            <span>
                                COMPLETED
                            </span>

                            <strong>
                                {completedCount}
                            </strong>

                        </div>

                    </div>

                )}



                {/* =========================
                    BOOKINGS
                ========================= */}

                <section className="bookings-card">


                    {loading ? (

                        <div className="bookings-empty">

                            <div className="empty-icon">
                                📅
                            </div>

                            <h2>
                                Loading bookings...
                            </h2>

                            <p>
                                Please wait while we load
                                your service bookings.
                            </p>

                        </div>

                    ) : bookings.length === 0 ? (

                        <div className="bookings-empty">

                            <div className="empty-icon">
                                📅
                            </div>

                            <h2>
                                No bookings yet
                            </h2>

                            <p>
                                You haven't booked any vehicle
                                services yet.
                            </p>

                            <Link
                                to="/book-service"
                                className="book-now-btn"
                            >
                                Book a Service
                            </Link>

                        </div>

                    ) : (

                        <div className="booking-list">

                            {bookings.map((booking) => (

                                <div
                                    className="booking-item"
                                    key={booking.id}
                                >


                                    {/* TOP */}

                                    <div className="booking-top">

                                        <div className="booking-title">

                                            <div className="booking-icon">
                                                🔧
                                            </div>

                                            <div>

                                                <h2>
                                                    {formatServiceType(
                                                        booking.serviceType
                                                    )}
                                                </h2>

                                                <span>
                                                    Booking #{booking.id}
                                                </span>

                                            </div>

                                        </div>


                                        <span
                                            className={getStatusClass(
                                                booking.status
                                            )}
                                        >
                                            {booking.status ||
                                                "PENDING"}
                                        </span>

                                    </div>



                                    {/* DETAILS */}

                                    <div className="booking-details">


                                        {/* VEHICLE */}

                                        <div className="booking-detail">

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

                                        <div className="booking-detail">

                                            <span>
                                                SERVICE DATE
                                            </span>

                                            <strong>
                                                {booking.bookingDate}
                                            </strong>

                                        </div>



                                        {/* VEHICLE TYPE */}

                                        <div className="booking-detail">

                                            <span>
                                                VEHICLE TYPE
                                            </span>

                                            <strong>
                                                {booking.vehicle
                                                    ? booking.vehicle.vehicleType
                                                    : "—"}
                                            </strong>

                                        </div>



                                        {/* STATUS */}

                                        <div className="booking-detail">

                                            <span>
                                                STATUS
                                            </span>

                                            <strong
                                                className={getStatusClass(
                                                    booking.status
                                                )}
                                            >
                                                {booking.status ||
                                                    "PENDING"}
                                            </strong>

                                        </div>

                                    </div>



                                    {/* BOTTOM */}

                                    <div className="booking-bottom">

                                        <div>

                                            <span>
                                                BOOKING STATUS
                                            </span>

                                            <strong
                                                className={getStatusClass(
                                                    booking.status
                                                )}
                                            >
                                                {booking.status ||
                                                    "PENDING"}
                                            </strong>

                                        </div>


                                        <Link
                                            to="/book-service"
                                            className="book-again-btn"
                                        >
                                            Book Another Service →
                                        </Link>

                                    </div>

                                </div>

                            ))}

                        </div>

                    )}

                </section>

            </main>

        </div>
    );
}

export default Bookings;