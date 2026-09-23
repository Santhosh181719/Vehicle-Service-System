import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./BookService.css";

function BookService() {

    const navigate = useNavigate();

    const [vehicles, setVehicles] = useState([]);
    const [loadingVehicles, setLoadingVehicles] = useState(true);

    const [formData, setFormData] = useState({
        vehicleId: "",
        serviceType: "",
        bookingDate: ""
    });

    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");


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
    // GET MY VEHICLES
    // =========================

    const fetchVehicles = async () => {

        setLoadingVehicles(true);
        setError("");

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

                const errorText =
                    await response.text();

                console.error(
                    "Vehicle backend error:",
                    errorText
                );

                throw new Error(
                    "Failed to fetch vehicles"
                );
            }


            // =========================
            // GET DATA
            // =========================

            const data =
                await response.json();


            console.log(
                "My vehicles:",
                data
            );


            setVehicles(data);


        } catch (error) {

            console.error(
                "Vehicle fetch error:",
                error
            );

            setError(
                "Unable to load your vehicles."
            );

        } finally {

            setLoadingVehicles(false);

        }
    };


    // =========================
    // LOAD VEHICLES
    // =========================

    useEffect(() => {

        fetchVehicles();

    }, []);


    // =========================
    // HANDLE INPUT
    // =========================

    const handleChange = (event) => {

        const { name, value } = event.target;

        setFormData({
            ...formData,
            [name]: value
        });

        setError("");
        setMessage("");
    };


    // =========================
    // SUBMIT BOOKING
    // =========================

    const handleSubmit = async (event) => {

        event.preventDefault();

        setError("");
        setMessage("");


        // =========================
        // VALIDATION
        // =========================

        if (!formData.vehicleId) {

            setError(
                "Please select a vehicle."
            );

            return;
        }


        if (!formData.serviceType) {

            setError(
                "Please select a service."
            );

            return;
        }


        if (!formData.bookingDate) {

            setError(
                "Please select a booking date."
            );

            return;
        }


        // =========================
        // GET JWT TOKEN
        // =========================

        const token = getToken();

        if (!token) {

            return;
        }


        setSubmitting(true);


        try {


            // =========================
            // FIND SELECTED VEHICLE
            // =========================

            const selectedVehicle =
                vehicles.find(
                    (vehicle) =>
                        vehicle.id ===
                        Number(formData.vehicleId)
                );


            if (!selectedVehicle) {

                throw new Error(
                    "Selected vehicle not found"
                );
            }


            // =========================
            // BOOKING DATA
            // =========================

            const bookingData = {

                serviceType:
                    formData.serviceType,

                bookingDate:
                    formData.bookingDate,

                status:
                    "PENDING",

                vehicle: {
                    id: selectedVehicle.id
                }
            };


            console.log(
                "Sending booking:",
                bookingData
            );


            // =========================
            // CREATE BOOKING
            // =========================

            const response = await fetch(
                "http://localhost:8080/api/bookings",
                {
                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json",

                        "Authorization":
                            `Bearer ${token}`
                    },

                    body:
                        JSON.stringify(
                            bookingData
                        )
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

                const errorText =
                    await response.text();

                console.error(
                    "Booking backend error:",
                    errorText
                );

                throw new Error(
                    "Failed to create booking"
                );
            }


            // =========================
            // GET SAVED BOOKING
            // =========================

            const savedBooking =
                await response.json();


            console.log(
                "Booking created successfully:",
                savedBooking
            );


            // =========================
            // SUCCESS MESSAGE
            // =========================

            setMessage(
                "Service booked successfully!"
            );


            // =========================
            // CLEAR FORM
            // =========================

            setFormData({
                vehicleId: "",
                serviceType: "",
                bookingDate: ""
            });


            // =========================
            // GO TO BOOKINGS
            // =========================

            setTimeout(() => {

                navigate("/bookings");

            }, 1200);


        } catch (error) {

            console.error(
                "Booking error:",
                error
            );

            setError(
                "Failed to book service. Please try again."
            );

        } finally {

            setSubmitting(false);

        }
    };


    // =========================
    // TODAY
    // =========================

    const today =
        new Date()
            .toISOString()
            .split("T")[0];


    return (

        <div className="book-service-page">


            {/* =========================
                NAVBAR
            ========================= */}

            <nav className="booking-nav">

                <Link
                    to="/dashboard"
                    className="booking-brand"
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


                <div className="booking-nav-links">

                    <Link to="/dashboard">
                        Dashboard
                    </Link>

                    <Link to="/vehicles">
                        My Vehicles
                    </Link>

                    <Link
                        to="/book-service"
                        className="active"
                    >
                        Book Service
                    </Link>

                    <Link to="/bookings">
                        Bookings
                    </Link>

                </div>

            </nav>



            {/* =========================
                MAIN
            ========================= */}

            <main className="book-service-content">


                {/* =========================
                    HEADER
                ========================= */}

                <div className="book-page-header">

                    <p className="page-label">
                        VEHICLE SERVICE
                    </p>

                    <h1>
                        Book a Service
                    </h1>

                    <p>
                        Schedule a service for your vehicle
                        and keep it running smoothly.
                    </p>

                </div>



                {/* =========================
                    BOOKING LAYOUT
                ========================= */}

                <div className="booking-layout">


                    {/* =========================
                        LEFT CARD
                    ========================= */}

                    <div className="service-info-card">

                        <div className="service-info-top">

                            <div className="service-icon-large">
                                🔧
                            </div>

                            <h2>
                                Vehicle Service
                            </h2>

                            <p>
                                Choose your vehicle, select the
                                service you need, and pick a
                                convenient date.
                            </p>

                        </div>


                        <div className="service-benefits">

                            <div>

                                <span className="benefit-number">
                                    01
                                </span>

                                <div>

                                    <strong>
                                        Select your vehicle
                                    </strong>

                                    <p>
                                        Choose from your registered
                                        vehicles.
                                    </p>

                                </div>

                            </div>


                            <div>

                                <span className="benefit-number">
                                    02
                                </span>

                                <div>

                                    <strong>
                                        Choose a service
                                    </strong>

                                    <p>
                                        Select the maintenance
                                        your vehicle needs.
                                    </p>

                                </div>

                            </div>


                            <div>

                                <span className="benefit-number">
                                    03
                                </span>

                                <div>

                                    <strong>
                                        Pick a date
                                    </strong>

                                    <p>
                                        Select a suitable service date.
                                    </p>

                                </div>

                            </div>

                        </div>

                    </div>



                    {/* =========================
                        FORM CARD
                    ========================= */}

                    <div className="booking-form-card">

                        <div className="form-card-header">

                            <h2>
                                Service Details
                            </h2>

                            <p>
                                Enter the details for your booking.
                            </p>

                        </div>


                        {/* =========================
                            ERROR
                        ========================= */}

                        {error && (

                            <div className="booking-error">
                                {error}
                            </div>

                        )}


                        {/* =========================
                            SUCCESS
                        ========================= */}

                        {message && (

                            <div className="booking-success">
                                {message}
                            </div>

                        )}


                        <form onSubmit={handleSubmit}>


                            {/* =========================
                                VEHICLE
                            ========================= */}

                            <div className="booking-form-group">

                                <label>
                                    Select Vehicle
                                </label>


                                {loadingVehicles ? (

                                    <div className="loading-select">
                                        Loading vehicles...
                                    </div>

                                ) : vehicles.length === 0 ? (

                                    <div className="no-vehicle-box">

                                        <p>
                                            You don't have any
                                            registered vehicles.
                                        </p>

                                        <Link to="/vehicles">
                                            Add a Vehicle
                                        </Link>

                                    </div>

                                ) : (

                                    <select
                                        name="vehicleId"
                                        value={formData.vehicleId}
                                        onChange={handleChange}
                                        required
                                    >

                                        <option value="">
                                            Select your vehicle
                                        </option>


                                        {vehicles.map(
                                            (vehicle) => (

                                                <option
                                                    key={vehicle.id}
                                                    value={vehicle.id}
                                                >

                                                    {vehicle.brand}{" "}
                                                    {vehicle.model}
                                                    {" — "}
                                                    {vehicle.vehicleNumber}

                                                </option>

                                            )
                                        )}

                                    </select>

                                )}

                            </div>



                            {/* =========================
                                SERVICE
                            ========================= */}

                            <div className="booking-form-group">

                                <label>
                                    Service Type
                                </label>

                                <select
                                    name="serviceType"
                                    value={formData.serviceType}
                                    onChange={handleChange}
                                    required
                                >

                                    <option value="">
                                        Select a service
                                    </option>

                                    <option value="GENERAL_SERVICE">
                                        General Service
                                    </option>

                                    <option value="OIL_CHANGE">
                                        Oil Change
                                    </option>

                                    <option value="BRAKE_SERVICE">
                                        Brake Service
                                    </option>

                                    <option value="TYRE_SERVICE">
                                        Tyre Service
                                    </option>

                                    <option value="BATTERY_SERVICE">
                                        Battery Service
                                    </option>

                                    <option value="AC_SERVICE">
                                        AC Service
                                    </option>

                                    <option value="ENGINE_SERVICE">
                                        Engine Service
                                    </option>

                                    <option value="FULL_SERVICE">
                                        Full Service
                                    </option>

                                </select>

                            </div>



                            {/* =========================
                                DATE
                            ========================= */}

                            <div className="booking-form-group">

                                <label>
                                    Preferred Service Date
                                </label>

                                <input
                                    type="date"
                                    name="bookingDate"
                                    min={today}
                                    value={
                                        formData.bookingDate
                                    }
                                    onChange={handleChange}
                                    required
                                />

                            </div>



                            {/* =========================
                                SUMMARY
                            ========================= */}

                            <div className="booking-summary">

                                <div>

                                    <span>
                                        STATUS
                                    </span>

                                    <strong>
                                        PENDING
                                    </strong>

                                </div>


                                <div>

                                    <span>
                                        BOOKING TYPE
                                    </span>

                                    <strong>
                                        SERVICE
                                    </strong>

                                </div>

                            </div>



                            {/* =========================
                                SUBMIT
                            ========================= */}

                            <button
                                type="submit"
                                className="confirm-booking-btn"
                                disabled={
                                    submitting ||
                                    loadingVehicles ||
                                    vehicles.length === 0
                                }
                            >

                                {submitting
                                    ? "Booking..."
                                    : "Confirm Service Booking →"}

                            </button>

                        </form>

                    </div>

                </div>

            </main>

        </div>
    );
}

export default BookService;