import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { validateEmail, readRegisteredUsers } from "./validation";
import { useAuth } from "../../context/AuthContext";
import "./Login.css";

function Login() {

  const navigate = useNavigate();
  const { setSession } = useAuth();

  const [role, setRole] = useState("inspector");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});

  const validateField = (field, value) => {
    const message = field === "email" ? validateEmail(value) : value
      ? ""
      : "Password is required.";
    setErrors((current) => ({ ...current, [field]: message }));
    return message;
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const emailError = validateField("email", formData.email);
    const passwordError = validateField("password", formData.password);

    if (emailError || passwordError) {
      return;
    }

    const email = formData.email.trim().toLowerCase();
    const account = readRegisteredUsers().find(
      (user) => user.email === email && user.password === formData.password && user.role === role
    );

    if (!account) {
      setErrors({ form: "Invalid email, password, or selected role." });
      return;
    }

    const user = {
      id: account.id,
      name: account.name,
      email: account.email,
      role: account.role,
    };
    localStorage.setItem("complianceUser", JSON.stringify(user));
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("role", role);
    setSession(user);
    setErrors({});

    if (role === "authority") {
      navigate("/authority/dashboard");
    } else {
      navigate("/inspector/dashboard");
    }
  };


  return (
    <div className="login-page">

      <div className="login-left">

        <div className="brand-section">

          <div className="brand-icon">
            ✓
          </div>

          <h1>LM-Vision</h1>

          <p>
            Smart Compliance System for
            Packaged Commodities
          </p>

        </div>

      </div>


      <div className="login-right">

        <div className="login-box">

          <div className="login-title">

            <h2>Welcome Back</h2>

            <p>
              Login to your LM-Vision account
            </p>

          </div>


          <form onSubmit={handleLogin} noValidate>

            <div className="input-group">

              <label>Email Address</label>

              <input
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => {
                  setFormData({ ...formData, email: e.target.value });
                  setErrors((current) => ({ ...current, email: "", form: "" }));
                }}
                onBlur={(e) => validateField("email", e.target.value)}
              />

              {errors.email && <p className="field-error" role="alert">{errors.email}</p>}

            </div>


            <div className="input-group">

              <label>Password</label>

              <input
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) => {
                  setFormData({ ...formData, password: e.target.value });
                  setErrors((current) => ({ ...current, password: "", form: "" }));
                }}
                onBlur={(e) => validateField("password", e.target.value)}
                maxLength={128}
              />

              {errors.password && <p className="field-error" role="alert">{errors.password}</p>}

            </div>


            <div className="input-group">

              <label>Login As</label>

              <select
                value={role}
                onChange={(e) =>
                  setRole(e.target.value)
                }
              >

                <option value="inspector">
                  Inspector
                </option>

                <option value="authority">
                  Authority
                </option>

              </select>

            </div>

            {errors.form && <p className="auth-error" role="alert">{errors.form}</p>}


            <button
              type="submit"
              className="login-button"
            >
              Login
            </button>

          </form>


        </div>

      </div>

    </div>
  );
}

export default Login;