import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../services/api";
import "./Login.css";

function Login() {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);


    // =========================
    // LOGIN
    // =========================

    const handleLogin = async (e) => {

        e.preventDefault();

        setError("");
        setLoading(true);

        try {

            const data = await loginUser({
                email,
                password
            });

            console.log("Login response:", data);


            // =========================
            // CHECK JWT
            // =========================

            if (!data || !data.token) {

                throw new Error(
                    "Login failed. No authentication token received."
                );
            }


            // =========================
            // SAVE JWT
            // =========================

            localStorage.setItem(
                "token",
                data.token
            );


            console.log(
                "JWT token saved successfully."
            );


            // =========================
            // GO TO DASHBOARD
            // =========================

            navigate("/dashboard");


        } catch (err) {

            console.error(
                "Login error:",
                err
            );

            setError(
                err.message ||
                "Invalid email or password."
            );

        } finally {

            setLoading(false);

        }
    };


    return (

        <div className="login-page">

            <div className="login-container">


                {/* =========================
                    LEFT SIDE
                ========================= */}

                <div className="login-left">

                    <div className="brand">
                        🚗 AutoCare
                    </div>


                    <h1>

                        Keep your vehicle

                        <span>
                            running perfectly.
                        </span>

                    </h1>


                    <p>
                        Book vehicle services, manage
                        your vehicles, and track your
                        service bookings in one place.
                    </p>

                </div>



                {/* =========================
                    LOGIN CARD
                ========================= */}

                <div className="login-card">

                    <h2>
                        Welcome Back
                    </h2>


                    <p className="login-subtitle">
                        Login to your account
                    </p>



                    {/* ERROR */}

                    {error && (

                        <div className="error-message">
                            {error}
                        </div>

                    )}



                    {/* FORM */}

                    <form onSubmit={handleLogin}>


                        {/* EMAIL */}

                        <div className="input-group">

                            <label>
                                Email
                            </label>

                            <input
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) =>
                                    setEmail(e.target.value)
                                }
                                required
                            />

                        </div>



                        {/* PASSWORD */}

                        <div className="input-group">

                            <label>
                                Password
                            </label>

                            <input
                                type="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) =>
                                    setPassword(e.target.value)
                                }
                                required
                            />

                        </div>



                        {/* LOGIN BUTTON */}

                        <button
                            type="submit"
                            disabled={loading}
                        >

                            {loading
                                ? "Logging in..."
                                : "Login"}

                        </button>

                    </form>



                    {/* REGISTER */}

                    <p className="register-text">

                        Don't have an account?

                        <Link to="/register">
                            {" "}Create Account
                        </Link>

                    </p>

                </div>

            </div>

        </div>
    );
}

export default Login;