import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Customers.css";

function Customers() {

    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    // =========================
    // FETCH CUSTOMERS
    // =========================

    const fetchCustomers = async () => {

        setLoading(true);
        setError("");

        try {

            const response = await fetch(
                "http://localhost:8080/api/admin/users"
            );

            if (!response.ok) {
                throw new Error("Failed to fetch customers");
            }

            const data = await response.json();

            const customerUsers = data.filter(
                (user) =>
                    user.role &&
                    user.role.toUpperCase() === "CUSTOMER"
            );

            setCustomers(customerUsers);

        } catch (error) {

            console.error(
                "Customers fetch error:",
                error
            );

            setError(
                "Unable to load customers."
            );

        } finally {

            setLoading(false);

        }
    };


    // =========================
    // DELETE CUSTOMER
    // =========================

    const deleteCustomer = async (id) => {

        const confirmed = window.confirm(
            "Are you sure you want to delete this customer?"
        );

        if (!confirmed) {
            return;
        }

        try {

            const response = await fetch(
                `http://localhost:8080/api/admin/users/${id}`,
                {
                    method: "DELETE"
                }
            );

            if (!response.ok) {
                throw new Error("Failed to delete customer");
            }

            setCustomers((currentCustomers) =>
                currentCustomers.filter(
                    (customer) =>
                        customer.id !== id
                )
            );

        } catch (error) {

            console.error(
                "Delete customer error:",
                error
            );

            alert(
                "Failed to delete customer."
            );

        }
    };


    // =========================
    // INITIAL LOAD
    // =========================

    useEffect(() => {
        fetchCustomers();
    }, []);


    return (

        <div className="customers-page">


            {/* =========================
                NAVBAR
            ========================= */}

            <nav className="customers-nav">

                <Link
                    to="/admin"
                    className="customers-brand"
                >

                    <div className="customers-logo">
                        A
                    </div>

                    <div>

                        <div className="customers-brand-name">
                            AutoCare
                        </div>

                        <div className="customers-brand-subtitle">
                            Administration
                        </div>

                    </div>

                </Link>


                <div className="customers-nav-links">

                    <Link to="/admin">
                        Dashboard
                    </Link>

                    <Link to="/admin/bookings">
                        Bookings
                    </Link>

                    <Link
                        to="/admin/customers"
                        className="active"
                    >
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

            <main className="customers-content">


                {/* HEADER */}

                <div className="customers-header">

                    <div>

                        <p className="customers-page-label">
                            CUSTOMER MANAGEMENT
                        </p>

                        <h1>
                            Customers
                        </h1>

                        <p>
                            View and manage registered customers.
                        </p>

                    </div>


                    <button
                        className="customers-refresh-btn"
                        onClick={fetchCustomers}
                    >
                        ↻ Refresh
                    </button>

                </div>



                {/* ERROR */}

                {error && (

                    <div className="customers-error">
                        {error}
                    </div>

                )}



                {/* SUMMARY */}

                {!loading && !error && (

                    <div className="customer-summary">

                        <div>

                            <span>
                                TOTAL CUSTOMERS
                            </span>

                            <strong>
                                {customers.length}
                            </strong>

                        </div>


                        <div>

                            <span>
                                ACTIVE
                            </span>

                            <strong>
                                {customers.length}
                            </strong>

                        </div>

                    </div>

                )}



                {/* CUSTOMER CARD */}

                <section className="customers-card">


                    {loading ? (

                        <div className="customers-empty">
                            Loading customers...
                        </div>

                    ) : error ? (

                        <div className="customers-empty">

                            <div className="customers-empty-icon">
                                !
                            </div>

                            <h2>
                                Unable to load customers
                            </h2>

                            <p>
                                Check that the backend is running
                                and try again.
                            </p>

                            <button
                                className="customers-retry-btn"
                                onClick={fetchCustomers}
                            >
                                Try Again
                            </button>

                        </div>

                    ) : customers.length === 0 ? (

                        <div className="customers-empty">

                            <div className="customers-empty-icon">
                                U
                            </div>

                            <h2>
                                No customers found
                            </h2>

                            <p>
                                Registered customers will appear here.
                            </p>

                        </div>

                    ) : (

                        <div className="customer-list">

                            {customers.map((customer) => (

                                <div
                                    className="customer-item"
                                    key={customer.id}
                                >


                                    {/* CUSTOMER INFO */}

                                    <div className="customer-main">

                                        <div className="customer-avatar">

                                            {customer.name
                                                ? customer.name
                                                    .charAt(0)
                                                    .toUpperCase()
                                                : "U"}

                                        </div>


                                        <div className="customer-name">

                                            <h2>
                                                {customer.name}
                                            </h2>

                                            <span>
                                                Customer #{customer.id}
                                            </span>

                                        </div>

                                    </div>



                                    {/* EMAIL */}

                                    <div className="customer-detail">

                                        <span>
                                            EMAIL
                                        </span>

                                        <strong>
                                            {customer.email}
                                        </strong>

                                    </div>



                                    {/* ROLE */}

                                    <div className="customer-detail">

                                        <span>
                                            ROLE
                                        </span>

                                        <strong className="customer-role">
                                            {customer.role}
                                        </strong>

                                    </div>



                                    {/* DELETE */}

                                    <button
                                        className="customer-delete-btn"
                                        onClick={() =>
                                            deleteCustomer(
                                                customer.id
                                            )
                                        }
                                    >
                                        Delete
                                    </button>

                                </div>

                            ))}

                        </div>

                    )}

                </section>

            </main>

        </div>
    );
}

export default Customers;