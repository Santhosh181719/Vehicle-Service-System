import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Vehicles.css";

function Vehicles() {

    const navigate = useNavigate();

    const [vehicles, setVehicles] = useState([]);

    const [loading, setLoading] = useState(true);

    const [showForm, setShowForm] = useState(false);

    const [editingVehicle, setEditingVehicle] = useState(null);

    const [formData, setFormData] = useState({
        brand: "",
        model: "",
        vehicleNumber: "",
        vehicleType: ""
    });

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

        setLoading(true);
        setError("");

        const token = getToken();

        if (!token) {
            setLoading(false);
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
            // TOKEN / AUTH ERROR
            // =========================

            if (response.status === 401 ||
                response.status === 403) {

                localStorage.removeItem("token");

                navigate("/");

                return;
            }


            if (!response.ok) {

                throw new Error(
                    "Failed to fetch vehicles"
                );
            }


            const data = await response.json();

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

            setLoading(false);

        }
    };


    // =========================
    // LOAD VEHICLES
    // =========================

    useEffect(() => {

        fetchVehicles();

    }, []);


    // =========================
    // INPUT CHANGE
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
    // OPEN ADD FORM
    // =========================

    const handleAddVehicle = () => {

        setEditingVehicle(null);

        setFormData({
            brand: "",
            model: "",
            vehicleNumber: "",
            vehicleType: ""
        });

        setMessage("");
        setError("");

        setShowForm(true);
    };


    // =========================
    // OPEN EDIT FORM
    // =========================

    const handleEditVehicle = (vehicle) => {

        setEditingVehicle(vehicle);

        setFormData({
            brand: vehicle.brand || "",
            model: vehicle.model || "",
            vehicleNumber: vehicle.vehicleNumber || "",
            vehicleType: vehicle.vehicleType || ""
        });

        setMessage("");
        setError("");

        setShowForm(true);
    };


    // =========================
    // SUBMIT FORM
    // =========================

    const handleSubmit = async (event) => {

        event.preventDefault();

        setMessage("");
        setError("");


        // =========================
        // GET TOKEN
        // =========================

        const token = getToken();

        if (!token) {
            return;
        }


        try {


            // =========================
            // URL
            // =========================

            const url = editingVehicle
                ? `http://localhost:8080/api/vehicles/${editingVehicle.id}`
                : "http://localhost:8080/api/vehicles";


            // =========================
            // METHOD
            // =========================

            const method = editingVehicle
                ? "PUT"
                : "POST";


            // =========================
            // SEND REQUEST
            // =========================

            const response = await fetch(
                url,
                {
                    method: method,

                    headers: {
                        "Content-Type": "application/json",

                        "Authorization": `Bearer ${token}`
                    },

                    body: JSON.stringify(formData)
                }
            );


            // =========================
            // AUTH ERROR
            // =========================

            if (response.status === 401 ||
                response.status === 403) {

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
                    "Vehicle operation failed"
                );
            }


            // =========================
            // SUCCESS MESSAGE
            // =========================

            if (editingVehicle) {

                setMessage(
                    "Vehicle updated successfully."
                );

            } else {

                setMessage(
                    "Vehicle added successfully."
                );
            }


            // =========================
            // CLOSE FORM
            // =========================

            setShowForm(false);

            setEditingVehicle(null);

            setFormData({
                brand: "",
                model: "",
                vehicleNumber: "",
                vehicleType: ""
            });


            // =========================
            // REFRESH VEHICLES
            // =========================

            await fetchVehicles();


        } catch (error) {

            console.error(
                "Vehicle operation error:",
                error
            );


            setError(
                editingVehicle
                    ? "Failed to update vehicle."
                    : "Failed to add vehicle."
            );
        }
    };


    // =========================
    // DELETE VEHICLE
    // =========================

    const handleDeleteVehicle = async (id) => {

        const confirmed = window.confirm(
            "Are you sure you want to delete this vehicle?"
        );


        if (!confirmed) {
            return;
        }


        const token = getToken();

        if (!token) {
            return;
        }


        try {

            const response = await fetch(
                `http://localhost:8080/api/vehicles/${id}`,
                {
                    method: "DELETE",

                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                }
            );


            // =========================
            // AUTH ERROR
            // =========================

            if (response.status === 401 ||
                response.status === 403) {

                localStorage.removeItem("token");

                navigate("/");

                return;
            }


            if (!response.ok) {

                throw new Error(
                    "Failed to delete vehicle"
                );
            }


            setMessage(
                "Vehicle deleted successfully."
            );


            // =========================
            // REFRESH VEHICLES
            // =========================

            fetchVehicles();


        } catch (error) {

            console.error(
                "Delete vehicle error:",
                error
            );

            setError(
                "Failed to delete vehicle."
            );
        }
    };


    // =========================
    // CLOSE FORM
    // =========================

    const closeForm = () => {

        setShowForm(false);

        setEditingVehicle(null);

        setFormData({
            brand: "",
            model: "",
            vehicleNumber: "",
            vehicleType: ""
        });

        setMessage("");
        setError("");
    };


    return (

        <div className="vehicles-page">


            {/* =========================
                NAVBAR
            ========================= */}

            <nav className="vehicles-nav">

                <Link
                    to="/dashboard"
                    className="vehicles-brand"
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


                <div className="vehicles-nav-links">

                    <Link to="/dashboard">
                        Dashboard
                    </Link>

                    <Link
                        to="/vehicles"
                        className="active"
                    >
                        My Vehicles
                    </Link>

                    <Link to="/book-service">
                        Book Service
                    </Link>

                    <Link to="/bookings">
                        Bookings
                    </Link>

                </div>


                {/* Logout intentionally removed */}

            </nav>



            {/* =========================
                MAIN
            ========================= */}

            <main className="vehicles-content">


                {/* HEADER */}

                <section className="vehicles-header">

                    <div>

                        <p className="page-label">
                            VEHICLE MANAGEMENT
                        </p>

                        <h1>
                            My Vehicles
                        </h1>

                        <p>
                            Manage your registered vehicles
                            and keep their details up to date.
                        </p>

                    </div>


                    <button
                        className="add-vehicle-btn"
                        onClick={handleAddVehicle}
                    >
                        + Add Vehicle
                    </button>

                </section>



                {/* MESSAGES */}

                {message && (

                    <div className="success-message">
                        {message}
                    </div>

                )}


                {error && (

                    <div className="error-message">
                        {error}
                    </div>

                )}



                {/* =========================
                    LOADING
                ========================= */}

                {loading ? (

                    <div className="vehicles-loading">
                        Loading vehicles...
                    </div>

                ) : vehicles.length === 0 ? (


                    /* =========================
                        EMPTY STATE
                    ========================= */

                    <div className="vehicles-empty">

                        <div className="empty-car-icon">
                            🚗
                        </div>

                        <h2>
                            No vehicles yet
                        </h2>

                        <p>
                            Add your first vehicle to start
                            booking services.
                        </p>

                        <button
                            className="add-vehicle-btn"
                            onClick={handleAddVehicle}
                        >
                            + Add Your Vehicle
                        </button>

                    </div>


                ) : (


                    /* =========================
                        VEHICLE LIST
                    ========================= */

                    <section className="vehicle-list">

                        {vehicles.map((vehicle) => (

                            <div
                                className="vehicle-card"
                                key={vehicle.id}
                            >

                                <div className="vehicle-card-left">

                                    <div className="vehicle-icon-box">
                                        🚙
                                    </div>


                                    <div className="vehicle-card-info">

                                        <div className="vehicle-title-row">

                                            <h2>
                                                {vehicle.brand} {vehicle.model}
                                            </h2>

                                            <span>
                                                {vehicle.vehicleType}
                                            </span>

                                        </div>

                                        <p className="vehicle-number">
                                            {vehicle.vehicleNumber}
                                        </p>

                                        <p className="vehicle-owner">
                                            Registered vehicle
                                        </p>

                                    </div>

                                </div>


                                <div className="vehicle-actions">

                                    <Link
                                        to="/book-service"
                                        className="service-btn"
                                    >
                                        Book Service
                                    </Link>

                                    <button
                                        className="edit-btn"
                                        onClick={() =>
                                            handleEditVehicle(vehicle)
                                        }
                                    >
                                        Edit
                                    </button>

                                    <button
                                        className="delete-btn"
                                        onClick={() =>
                                            handleDeleteVehicle(
                                                vehicle.id
                                            )
                                        }
                                    >
                                        Delete
                                    </button>

                                </div>

                            </div>

                        ))}

                    </section>

                )}


            </main>



            {/* =========================
                ADD / EDIT MODAL
            ========================= */}

            {showForm && (

                <div className="modal-overlay">

                    <div className="vehicle-modal">

                        <div className="modal-header">

                            <div>

                                <p>
                                    VEHICLE DETAILS
                                </p>

                                <h2>
                                    {editingVehicle
                                        ? "Edit Vehicle"
                                        : "Add Vehicle"}
                                </h2>

                            </div>

                            <button
                                className="close-modal"
                                onClick={closeForm}
                            >
                                ×
                            </button>

                        </div>


                        <form onSubmit={handleSubmit}>


                            {/* BRAND */}

                            <div className="form-group">

                                <label>
                                    Brand
                                </label>

                                <input
                                    type="text"
                                    name="brand"
                                    value={formData.brand}
                                    onChange={handleChange}
                                    placeholder="e.g. Hyundai"
                                    required
                                />

                            </div>



                            {/* MODEL */}

                            <div className="form-group">

                                <label>
                                    Model
                                </label>

                                <input
                                    type="text"
                                    name="model"
                                    value={formData.model}
                                    onChange={handleChange}
                                    placeholder="e.g. Creta"
                                    required
                                />

                            </div>



                            {/* VEHICLE NUMBER */}

                            <div className="form-group">

                                <label>
                                    Vehicle Number
                                </label>

                                <input
                                    type="text"
                                    name="vehicleNumber"
                                    value={formData.vehicleNumber}
                                    onChange={handleChange}
                                    placeholder="e.g. TN58AB1234"
                                    required
                                />

                            </div>



                            {/* VEHICLE TYPE */}

                            <div className="form-group">

                                <label>
                                    Vehicle Type
                                </label>

                                <select
                                    name="vehicleType"
                                    value={formData.vehicleType}
                                    onChange={handleChange}
                                    required
                                >

                                    <option value="">
                                        Select vehicle type
                                    </option>

                                    <option value="HATCHBACK">
                                        Hatchback
                                    </option>

                                    <option value="SEDAN">
                                        Sedan
                                    </option>

                                    <option value="SUV">
                                        SUV
                                    </option>

                                    <option value="MUV">
                                        MUV
                                    </option>

                                    <option value="COUPE">
                                        Coupe
                                    </option>

                                    <option value="CONVERTIBLE">
                                        Convertible
                                    </option>

                                    <option value="PICKUP">
                                        Pickup
                                    </option>

                                    <option value="OTHER">
                                        Other
                                    </option>

                                </select>

                            </div>



                            {/* BUTTONS */}

                            <div className="modal-actions">

                                <button
                                    type="button"
                                    className="cancel-btn"
                                    onClick={closeForm}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="save-btn"
                                >
                                    {editingVehicle
                                        ? "Update Vehicle"
                                        : "Save Vehicle"}
                                </button>

                            </div>


                        </form>

                    </div>

                </div>

            )}


        </div>
    );
}

export default Vehicles;