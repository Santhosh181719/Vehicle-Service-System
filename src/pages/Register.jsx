import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../services/api";
import "./Register.css";

function Register() {

    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const handleRegister = async (e) => {

        e.preventDefault();

        setError("");
        setSuccess("");
        setLoading(true);

        try {

            await registerUser({
                name,
                email,
                password
            });

            setSuccess("Account created successfully!");

            setName("");
            setEmail("");
            setPassword("");

            setTimeout(() => {
                navigate("/");
            }, 1500);

        } catch (err) {

            setError(err.message);

        } finally {

            setLoading(false);

        }
    };

    return (
        <div className="register-page">

            <div className="register-container">

                <div className="register-left">

                    <div className="brand">
                        🚗 AutoCare
                    </div>

                    <h1>
                        Your vehicle.
                        <span>Our care.</span>
                    </h1>

                    <p>
                        Create your account and make vehicle
                        maintenance simpler, faster, and easier.
                    </p>

                </div>

                <div className="register-card">

                    <h2>Create Account</h2>

                    <p className="register-subtitle">
                        Register to manage your vehicle services
                    </p>

                    {error && (
                        <div className="error-message">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="success-message">
                            {success}
                        </div>
                    )}

                    <form onSubmit={handleRegister}>

                        <div className="input-group">

                            <label>Full Name</label>

                            <input
                                type="text"
                                placeholder="Enter your name"
                                value={name}
                                onChange={(e) =>
                                    setName(e.target.value)
                                }
                                required
                            />

                        </div>

                        <div className="input-group">

                            <label>Email</label>

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

                        <div className="input-group">

                            <label>Password</label>

                            <input
                                type="password"
                                placeholder="Create a password"
                                value={password}
                                onChange={(e) =>
                                    setPassword(e.target.value)
                                }
                                required
                            />

                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                        >
                            {loading
                                ? "Creating Account..."
                                : "Create Account"}
                        </button>

                    </form>

                    <p className="login-text">
                        Already have an account?

                        <Link to="/">
                            {" "}Login
                        </Link>
                    </p>

                </div>

            </div>

        </div>
    );
}

export default Register;