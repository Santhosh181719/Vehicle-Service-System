import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./AdminVehicles.css";

function AdminVehicles() {

    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    const fetchVehicles = async () => {

        setLoading(true);
        setError("");

        try {

            const response = await fetch(
                "http://localhost:8080/api/admin/vehicles"
            );

            if (!response.ok) {
                throw new Error("Failed to fetch vehicles");
            }

            const data = await response.json();

            setVehicles(data);

        } catch (error) {

            console.error("Vehicles fetch error:", error);

            setError("Unable to load vehicles.");

        } finally {

            setLoading(false);

        }
    };


    useEffect(() => {
        fetchVehicles();
    }, []);


    return (

        <div className="admin-vehicles-page">


            {/* =========================
                NAVBAR
            ========================= */}

            <nav className="admin-vehicles-nav">

                <Link
                    to="/admin"
                    className="admin-vehicles-brand"
                >

                    <div className="admin-vehicles-logo">
                        A
                    </div>

                    <div>

                        <div className="admin-vehicles-brand-name">
                            AutoCare
                        </div>

                        <div className="admin-vehicles-brand-subtitle">
                            Administration
                        </div>

                    </div>

                </Link>


                <div className="admin-vehicles-nav-links">

                    <Link to="/admin">
                        Dashboard
                    </Link>

                    <Link to="/admin/bookings">
                        Bookings
                    </Link>

                    <Link to="/admin/customers">
                        Customers
                    </Link>

                    <Link
                        to="/admin/vehicles"
                        className="active"
                    >
                        Vehicles
                    </Link>

                </div>


               
            </nav>



            {/* =========================
                MAIN CONTENT
            ========================= */}

            <main className="admin-vehicles-content">


                {/* HEADER */}

                <div className="admin-vehicles-header">

                    <div>

                        <p className="admin-vehicles-label">
                            VEHICLE MANAGEMENT
                        </p>

                        <h1>
                            Vehicles
                        </h1>

                        <p>
                            View all vehicles registered in the system.
                        </p>

                    </div>


                    <button
                        className="admin-vehicles-refresh"
                        onClick={fetchVehicles}
                    >
                        ↻ Refresh
                    </button>

                </div>



                {/* SUMMARY */}

                {!loading && !error && (

                    <div className="admin-vehicles-summary">

                        <div className="summary-box">

                            <span>
                                TOTAL VEHICLES
                            </span>

                            <strong>
                                {vehicles.length}
                            </strong>

                        </div>


                        <div className="summary-box">

                            <span>
                                REGISTERED
                            </span>

                            <strong>
                                {vehicles.length}
                            </strong>

                        </div>

                    </div>

                )}



                {/* ERROR */}

                {error && (

                    <div className="admin-vehicles-error">
                        {error}
                    </div>

                )}



                {/* VEHICLE CARD */}

                <section className="admin-vehicles-card">


                    {loading ? (

                        <div className="admin-vehicles-empty">

                            <div className="admin-vehicles-empty-icon">
                                ...
                            </div>

                            <h2>
                                Loading vehicles
                            </h2>

                            <p>
                                Fetching registered vehicles...
                            </p>

                        </div>

                    ) : error ? (

                        <div className="admin-vehicles-empty">

                            <div className="admin-vehicles-empty-icon">
                                !
                            </div>

                            <h2>
                                Unable to load vehicles
                            </h2>

                            <p>
                                Check that the backend is running
                                and try again.
                            </p>

                            <button
                                className="admin-vehicles-retry"
                                onClick={fetchVehicles}
                            >
                                Try Again
                            </button>

                        </div>

                    ) : vehicles.length === 0 ? (

                        <div className="admin-vehicles-empty">

                            <div className="admin-vehicles-empty-icon">
                                V
                            </div>

                            <h2>
                                No vehicles found
                            </h2>

                            <p>
                                Registered vehicles will appear here.
                            </p>

                        </div>

                    ) : (

                        <div className="admin-vehicle-list">

                            {/* TABLE HEADER */}

                            <div className="admin-vehicle-row admin-vehicle-heading">

                                <div>
                                    VEHICLE
                                </div>

                                <div>
                                    NUMBER
                                </div>

                                <div>
                                    TYPE
                                </div>

                                <div>
                                    CUSTOMER
                                </div>

                            </div>


                            {/* VEHICLES */}

                            {vehicles.map((vehicle) => (

                                <div
                                    className="admin-vehicle-row"
                                    key={vehicle.id}
                                >


                                    {/* VEHICLE */}

                                    <div className="admin-vehicle-main">

                                        <div className="admin-vehicle-icon">
                                            🚗
                                        </div>

                                        <div>

                                            <h3>
                                                {vehicle.brand}{" "}
                                                {vehicle.model}
                                            </h3>

                                            <span>
                                                Vehicle #{vehicle.id}
                                            </span>

                                        </div>

                                    </div>



                                    {/* NUMBER */}

                                    <div className="admin-vehicle-detail">

                                        <span className="mobile-label">
                                            NUMBER
                                        </span>

                                        <strong>
                                            {vehicle.vehicleNumber}
                                        </strong>

                                    </div>



                                    {/* TYPE */}

                                    <div className="admin-vehicle-detail">

                                        <span className="mobile-label">
                                            TYPE
                                        </span>

                                        <strong className="vehicle-type">
                                            {vehicle.vehicleType}
                                        </strong>

                                    </div>



                                    {/* CUSTOMER */}

                                    <div className="admin-vehicle-detail">

                                        <span className="mobile-label">
                                            CUSTOMER
                                        </span>

                                        <strong>
                                            {vehicle.user
                                                ? vehicle.user.name
                                                : "Not assigned"}
                                        </strong>

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

export default AdminVehicles;