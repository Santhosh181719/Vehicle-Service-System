import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Dashboard.css";

function Dashboard() {

    const navigate = useNavigate();

    const [vehicles, setVehicles] = useState([]);
    const [bookings, setBookings] = useState([]);

    const [loadingVehicles, setLoadingVehicles] = useState(true);
    const [loadingBookings, setLoadingBookings] = useState(true);

    const [vehicleError, setVehicleError] = useState("");
    const [bookingError, setBookingError] = useState("");


    // =========================
    // LOGOUT
    // =========================

    const handleLogout = () => {

        localStorage.removeItem("token");

        navigate("/");

    };


    // =========================
    // GET JWT TOKEN
    // =========================

    const getToken = () => {

        const token = localStorage.getItem("token");

        if (!token) {

            navigate("/");

            return null;
        }

        return token;
    };


    // =========================
    // FETCH MY VEHICLES
    // =========================

    const fetchVehicles = async () => {

        setLoadingVehicles(true);
        setVehicleError("");

        const token = getToken();

        if (!token) {

            setLoadingVehicles(false);

            return;
        }


        try {

            const response = await fetch(
                "http://localhost:8080/api/vehicles",
                {
                    method: "GET",

                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                }
            );


            // =========================
            // AUTH ERROR
            // =========================

            if (
                response.status === 401 ||
                response.status === 403
            ) {

                localStorage.removeItem("token");

                navigate("/");

                return;
            }


            // =========================
            // OTHER ERROR
            // =========================

            if (!response.ok) {

                throw new Error(
                    "Failed to fetch vehicles"
                );
            }


            // =========================
            // GET DATA
            // =========================

            const data = await response.json();


            console.log(
                "Dashboard vehicles:",
                data
            );


            setVehicles(
                Array.isArray(data)
                    ? data
                    : []
            );


        } catch (error) {

            console.error(
                "Vehicle fetch error:",
                error
            );

            setVehicleError(
                "Unable to load your vehicles."
            );

            setVehicles([]);

        } finally {

            setLoadingVehicles(false);

        }
    };


    // =========================
    // FETCH MY BOOKINGS
    // =========================

    const fetchBookings = async () => {

        setLoadingBookings(true);
        setBookingError("");

        const token = getToken();

        if (!token) {

            setLoadingBookings(false);

            return;
        }


        try {

            const response = await fetch(
                "http://localhost:8080/api/bookings/my",
                {
                    method: "GET",

                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                }
            );


            // =========================
            // AUTH ERROR
            // =========================

            if (
                response.status === 401 ||
                response.status === 403
            ) {

                localStorage.removeItem("token");

                navigate("/");

                return;
            }


            // =========================
            // OTHER ERROR
            // =========================

            if (!response.ok) {

                throw new Error(
                    "Failed to fetch bookings"
                );
            }


            // =========================
            // GET DATA
            // =========================

            const data = await response.json();


            console.log(
                "Dashboard bookings:",
                data
            );


            setBookings(
                Array.isArray(data)
                    ? data
                    : []
            );


        } catch (error) {

            console.error(
                "Booking fetch error:",
                error
            );

            setBookingError(
                "Unable to load your bookings."
            );

            setBookings([]);

        } finally {

            setLoadingBookings(false);

        }
    };


    // =========================
    // LOAD DASHBOARD DATA
    // =========================

    useEffect(() => {

        fetchVehicles();

        fetchBookings();

    }, []);


    // =========================
    // FORMAT SERVICE TYPE
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
    // FIRST VEHICLE
    // =========================

    const vehicle =
        vehicles.length > 0
            ? vehicles[0]
            : null;


    // =========================
    // NORMALIZE BOOKING STATUS
    // =========================

    const getBookingStatus = (booking) => {

        return (
            booking.status ||
            "PENDING"
        ).toUpperCase();

    };


    // =========================
    // ACTIVE SERVICES
    // =========================

    const activeServices = bookings.filter(
        (booking) => {

            const status =
                getBookingStatus(booking);

            return (
                status === "PENDING" ||
                status === "CONFIRMED" ||
                status === "APPROVED" ||
                status === "IN_PROGRESS"
            );

        }
    ).length;


    // =========================
    // COMPLETED SERVICES
    // =========================

    const completedServices = bookings.filter(
        (booking) => {

            const status =
                getBookingStatus(booking);

            return status === "COMPLETED";

        }
    ).length;


    // =========================
    // UPCOMING BOOKINGS
    // =========================

    const upcomingBookings = bookings.filter(
        (booking) => {

            const status =
                getBookingStatus(booking);

            return (
                status === "PENDING" ||
                status === "CONFIRMED" ||
                status === "APPROVED"
            );

        }
    ).length;


    // =========================
    // FIRST UPCOMING BOOKING
    // =========================

    const upcomingBooking = bookings.find(
        (booking) => {

            const status =
                getBookingStatus(booking);

            return (
                status === "PENDING" ||
                status === "CONFIRMED" ||
                status === "APPROVED"
            );

        }
    );


    return (

        <div className="dashboard">


            {/* =========================
                NAVBAR
            ========================= */}

            <nav className="dashboard-nav">

                <div className="brand-section">

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

                </div>


                <div className="nav-links">

                    <Link
                        className="active"
                        to="/dashboard"
                    >
                        Dashboard
                    </Link>

                    <Link to="/vehicles">
                        My Vehicles
                    </Link>

                    <Link to="/book-service">
                        Book Service
                    </Link>

                    <Link to="/bookings">
                        Bookings
                    </Link>

                </div>


                <div className="user-section">

                    <div className="user-avatar">
                        S
                    </div>

                    <div className="user-info">

                        <strong>
                            Santhosh
                        </strong>

                        <span>
                            Customer
                        </span>

                    </div>


                    {/* =========================
                        LOGOUT
                    ========================= */}

                    <button
                        className="logout-btn"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>

                </div>

            </nav>



            {/* =========================
                MAIN
            ========================= */}

            <main className="dashboard-content">


                {/* =========================
                    HERO
                ========================= */}

                <section className="welcome-section">

                    <div className="hero-content">

                        <p className="welcome-small">
                            VEHICLE CARE MADE SIMPLE
                        </p>

                        <h1>
                            Keep your vehicle
                            <span>
                                ready for the road.
                            </span>
                        </h1>

                        <p className="welcome-description">
                            Schedule maintenance, manage your vehicles,
                            and keep track of every service in one place.
                        </p>


                        <div className="hero-buttons">

                            <Link
                                to="/book-service"
                                className="primary-btn"
                            >
                                Book a Service
                            </Link>

                            <Link
                                to="/vehicles"
                                className="secondary-hero-btn"
                            >
                                View My Vehicles
                            </Link>

                        </div>

                    </div>



                    {/* =========================
                        VEHICLE STATUS
                    ========================= */}

                    <div className="vehicle-status-card">

                        <div className="status-header">

                            <span>
                                VEHICLE STATUS
                            </span>

                            <span className="status-good">
                                <i></i>
                                Good
                            </span>

                        </div>


                        {loadingVehicles ? (

                            <div className="status-vehicle">

                                <h2>
                                    Loading...
                                </h2>

                                <p>
                                    Loading your vehicle details.
                                </p>

                            </div>

                        ) : vehicleError ? (

                            <div className="status-vehicle">

                                <h2>
                                    Unable to load
                                </h2>

                                <p>
                                    Please refresh the dashboard.
                                </p>

                            </div>

                        ) : vehicle ? (

                            <>

                                <div className="status-vehicle">

                                    <h2>
                                        {vehicle.brand} {vehicle.model}
                                    </h2>

                                    <p>
                                        {vehicle.vehicleNumber}
                                    </p>

                                </div>


                                <div className="status-divider"></div>


                                <div className="health-title">
                                    Vehicle Health
                                </div>


                                <div className="health-bar">
                                    <div></div>
                                </div>


                                <div className="health-info">

                                    <span>
                                        Good condition
                                    </span>

                                    <strong>
                                        90%
                                    </strong>

                                </div>


                                <div className="vehicle-details">

                                    <div>

                                        <span>
                                            TYPE
                                        </span>

                                        <strong>
                                            {vehicle.vehicleType}
                                        </strong>

                                    </div>


                                    <div>

                                        <span>
                                            LAST SERVICE
                                        </span>

                                        <strong>
                                            {bookings.length > 0
                                                ? bookings
                                                    .filter(
                                                        (booking) =>
                                                            booking.status &&
                                                            booking.status.toUpperCase() ===
                                                            "COMPLETED"
                                                    )
                                                    .sort(
                                                        (a, b) =>
                                                            new Date(
                                                                b.bookingDate
                                                            ) -
                                                            new Date(
                                                                a.bookingDate
                                                            )
                                                    )[0]?.bookingDate ||
                                                  "Not available"
                                                : "Not available"}
                                        </strong>

                                    </div>

                                </div>

                            </>

                        ) : (

                            <div className="status-vehicle">

                                <h2>
                                    No vehicle found
                                </h2>

                                <p>
                                    Add a vehicle to get started.
                                </p>

                            </div>

                        )}

                    </div>

                </section>



                {/* =========================
                    STATS
                ========================= */}

                <section className="stats">


                    {/* VEHICLES */}

                    <div className="stat-card">

                        <div className="stat-icon vehicle-icon">
                            V
                        </div>

                        <div>

                            <h3>
                                {loadingVehicles
                                    ? "..."
                                    : vehicles.length}
                            </h3>

                            <p>
                                My Vehicles
                            </p>

                        </div>

                        <span className="stat-arrow">
                            →
                        </span>

                    </div>



                    {/* ACTIVE SERVICES */}

                    <div className="stat-card">

                        <div className="stat-icon service-icon">
                            S
                        </div>

                        <div>

                            <h3>
                                {loadingBookings
                                    ? "..."
                                    : activeServices}
                            </h3>

                            <p>
                                Active Services
                            </p>

                        </div>

                        <span className="stat-arrow">
                            →
                        </span>

                    </div>



                    {/* UPCOMING BOOKINGS */}

                    <div className="stat-card">

                        <div className="stat-icon booking-icon">
                            B
                        </div>

                        <div>

                            <h3>
                                {loadingBookings
                                    ? "..."
                                    : upcomingBookings}
                            </h3>

                            <p>
                                Upcoming Bookings
                            </p>

                        </div>

                        <span className="stat-arrow">
                            →
                        </span>

                    </div>



                    {/* COMPLETED */}

                    <div className="stat-card">

                        <div className="stat-icon completed-icon">
                            ✓
                        </div>

                        <div>

                            <h3>
                                {loadingBookings
                                    ? "..."
                                    : completedServices}
                            </h3>

                            <p>
                                Completed Services
                            </p>

                        </div>

                        <span className="stat-arrow">
                            →
                        </span>

                    </div>

                </section>



                {/* =========================
                    LOWER GRID
                ========================= */}

                <section className="dashboard-grid">


                    {/* =========================
                        MY VEHICLES
                    ========================= */}

                    <div className="dashboard-card">

                        <div className="card-header">

                            <div>

                                <h2>
                                    My Vehicles
                                </h2>

                                <p>
                                    Your registered vehicles
                                </p>

                            </div>

                            <Link to="/vehicles">
                                View All →
                            </Link>

                        </div>


                        {loadingVehicles ? (

                            <div className="empty-booking">
                                Loading vehicles...
                            </div>

                        ) : vehicleError ? (

                            <div className="empty-booking">

                                <h3>
                                    Unable to load vehicles
                                </h3>

                                <p>
                                    Please refresh the dashboard.
                                </p>

                                <button
                                    className="secondary-btn"
                                    onClick={fetchVehicles}
                                >
                                    Try Again
                                </button>

                            </div>

                        ) : vehicle ? (

                            <div className="vehicle-item">

                                <div className="vehicle-image">
                                    🚙
                                </div>


                                <div className="vehicle-info">

                                    <h3>
                                        {vehicle.brand} {vehicle.model}
                                    </h3>

                                    <p>
                                        {vehicle.vehicleNumber}
                                    </p>

                                    <span>
                                        {vehicle.vehicleType}
                                    </span>

                                </div>

                            </div>

                        ) : (

                            <div className="empty-booking">

                                <div className="empty-icon">
                                    🚗
                                </div>

                                <h3>
                                    No vehicles added
                                </h3>

                                <p>
                                    Add your vehicle to get started.
                                </p>

                                <Link
                                    to="/vehicles"
                                    className="secondary-btn"
                                >
                                    Add Vehicle
                                </Link>

                            </div>

                        )}

                    </div>



                    {/* =========================
                        UPCOMING BOOKING
                    ========================= */}

                    <div className="dashboard-card">

                        <div className="card-header">

                            <div>

                                <h2>
                                    Upcoming Booking
                                </h2>

                                <p>
                                    Your scheduled services
                                </p>

                            </div>

                            <Link to="/bookings">
                                View All →
                            </Link>

                        </div>


                        {loadingBookings ? (

                            <div className="empty-booking">

                                <div className="empty-icon">
                                    📅
                                </div>

                                <h3>
                                    Loading bookings...
                                </h3>

                            </div>

                        ) : bookingError ? (

                            <div className="empty-booking">

                                <div className="empty-icon">
                                    ⚠
                                </div>

                                <h3>
                                    Unable to load bookings
                                </h3>

                                <p>
                                    Please refresh the dashboard.
                                </p>

                                <button
                                    className="secondary-btn"
                                    onClick={fetchBookings}
                                >
                                    Try Again
                                </button>

                            </div>

                        ) : upcomingBooking ? (

                            <div className="booking-preview">

                                <div className="booking-date">
                                    📅
                                </div>

                                <div className="booking-preview-info">

                                    <h3>
                                        {formatServiceType(
                                            upcomingBooking.serviceType
                                        )}
                                    </h3>

                                    <p>
                                        {upcomingBooking.bookingDate}
                                    </p>

                                    <span className="booking-status">
                                        {getBookingStatus(
                                            upcomingBooking
                                        )}
                                    </span>

                                </div>

                            </div>

                        ) : (

                            <div className="empty-booking">

                                <div className="empty-icon">
                                    📅
                                </div>

                                <h3>
                                    No upcoming bookings
                                </h3>

                                <p>
                                    Your scheduled services will
                                    appear here.
                                </p>

                                <Link
                                    to="/book-service"
                                    className="secondary-btn"
                                >
                                    Book Now
                                </Link>

                            </div>

                        )}

                    </div>

                </section>


            </main>

        </div>
    );
}

export default Dashboard;