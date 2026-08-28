import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  UserRound,
  ClipboardCheck,
  Building2,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  ArrowRight,
  UserPlus,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import {
  validateName,
  validateEmail,
  validatePassword,
  validateConfirmPassword,
  readRegisteredUsers,
} from "./validation";
import "./Signin.css";

function Signin() {
  const navigate = useNavigate();
  const { setSession } = useAuth();

  const [role, setRole] = useState("inspector");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const passwordLength = formData.password.length;
  const passwordRequirements = [
    [passwordLength >= 8, "8+ characters"],
    [/[A-Z]/.test(formData.password), "uppercase letter"],
    [/[a-z]/.test(formData.password), "lowercase letter"],
    [/\d/.test(formData.password), "number"],
    [/[^A-Za-z0-9]/.test(formData.password), "special character"],
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setErrors((current) => ({ ...current, [e.target.name]: "", form: "" }));
  };

  const validateField = (field, value) => {
    const validators = {
      name: () => validateName(value),
      email: () => validateEmail(value),
      password: () => validatePassword(value),
      confirmPassword: () => validateConfirmPassword(formData.password, value),
    };
    setErrors((current) => ({ ...current, [field]: validators[field]() }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const nextErrors = {
      name: validateName(formData.name),
      email: validateEmail(formData.email),
      password: validatePassword(formData.password),
      confirmPassword: validateConfirmPassword(
        formData.password,
        formData.confirmPassword
      ),
    };
    const hasErrors = Object.values(nextErrors).some(Boolean);

    if (hasErrors) {
      setErrors(nextErrors);
      return;
    }

    const name = formData.name.trim();
    const email = formData.email.trim().toLowerCase();
    const registeredUsers = readRegisteredUsers();

    if (registeredUsers.some((user) => user.email === email)) {
      setErrors({ form: "An account with this email already exists." });
      return;
    }

    const user = {
      id: Date.now(),
      name,
      email,
      role,
      password: formData.password,
    };
    localStorage.setItem(
      "registeredUsers",
      JSON.stringify([...registeredUsers, user])
    );
    localStorage.setItem("complianceUser", JSON.stringify(user));
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("role", role);
    setSession(user);

    /*
      After account creation, send user to Login.
    */
    navigate("/login");
  };

  return (
    <div className="signin-page">

      {/* =================================================
          LEFT PANEL
      ================================================= */}

      <div className="signin-left">

        <div className="signin-brand">
          <div className="signin-brand-icon">
            <ShieldCheck size={23} />
          </div>

          <div>
            <strong>ComplianceCheck</strong>
            <span>Product Verification Platform</span>
          </div>
        </div>

        <div className="signin-left-content">

          <span className="signin-eyebrow">
            CREATE YOUR ACCOUNT
          </span>

          <h1>
            Join the
            <br />
            <span>ComplianceCheck</span>
            <br />
            platform.
          </h1>

          <p>
            Create an account to verify products, track
            compliance results and report product concerns.
          </p>

          <div className="signin-features">

            <div>
              <ShieldCheck size={17} />
              <span>Verify product compliance</span>
            </div>

            <div>
              <ClipboardCheck size={17} />
              <span>Track inspection results</span>
            </div>

            <div>
              <Building2 size={17} />
              <span>Role-based access</span>
            </div>

          </div>

        </div>

        <div className="signin-footer">
          © 2026 ComplianceCheck
        </div>

      </div>


      {/* =================================================
          RIGHT PANEL
      ================================================= */}

      <div className="signin-right">

        <div className="signin-card">

          <div className="signin-card-header">

            <div className="signin-mobile-icon">
              <UserPlus size={20} />
            </div>

            <h2>Create an account</h2>

            <p>
              Enter your details to create your account.
            </p>

          </div>


          {/* =================================================
              ROLE SELECTOR
          ================================================= */}

          <div className="role-section">

            <label>
              Select your role
            </label>

            <div className="role-options">

              {/* INSPECTOR */}

              <button
                type="button"
                className={`role-option ${
                  role === "inspector" ? "active" : ""
                }`}
                onClick={() => setRole("inspector")}
              >

                <div className="role-icon">
                  <ClipboardCheck size={18} />
                </div>

                <div className="role-text">
                  <strong>Inspector</strong>
                  <span>Field Inspector</span>
                </div>

                <div className="role-radio">
                  {role === "inspector" && <div />}
                </div>

              </button>


              {/* AUTHORITY */}

              <button
                type="button"
                className={`role-option ${
                  role === "authority" ? "active" : ""
                }`}
                onClick={() => setRole("authority")}
              >

                <div className="role-icon">
                  <Building2 size={18} />
                </div>

                <div className="role-text">
                  <strong>Authority</strong>
                  <span>Regulatory Authority</span>
                </div>

                <div className="role-radio">
                  {role === "authority" && <div />}
                </div>

              </button>

            </div>

          </div>


          {/* =================================================
              FORM
          ================================================= */}

          <form onSubmit={handleSubmit} noValidate>

            {/* NAME */}

            <div className="signin-field">

              <label>Full Name</label>

              <div className="signin-input">

                <UserRound size={15} />

                <input
                  type="text"
                  name="name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                  onBlur={(e) => validateField("name", e.target.value)}
                  minLength={2}
                  maxLength={80}
                  pattern="[A-Za-z]+(?:[ '-][A-Za-z]+)*"
                />

              </div>

              {errors.name && <p className="field-error" role="alert">{errors.name}</p>}

            </div>


            {/* EMAIL */}

            <div className="signin-field">

              <label>Email Address</label>

              <div className="signin-input">

                <Mail size={15} />

                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={(e) => validateField("email", e.target.value)}
                  maxLength={254}
                />

              </div>

              {errors.email && <p className="field-error" role="alert">{errors.email}</p>}

            </div>


            {/* PASSWORD */}

            <div className="signin-field">

              <label>Password</label>

              <div className="signin-input">

                <Lock size={15} />

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  name="password"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={(e) => validateField("password", e.target.value)}
                  minLength={8}
                  maxLength={128}
                  pattern={"(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^A-Za-z0-9]).{8,}"}
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                >
                  {showPassword ? (
                    <EyeOff size={15} />
                  ) : (
                    <Eye size={15} />
                  )}
                </button>

              </div>

              <div className="password-check" aria-live="polite">
                <span className={passwordLength >= 8 ? "valid" : ""}>
                  {passwordLength}/8 characters minimum
                </span>
                <span>
                  {passwordRequirements.slice(1).map(([valid, label]) => (
                    <span className={valid ? "valid" : ""} key={label}>
                      {valid ? "✓" : "○"} {label}
                    </span>
                  ))}
                </span>
              </div>

              {errors.password && <p className="field-error" role="alert">{errors.password}</p>}

            </div>


            {/* CONFIRM PASSWORD */}

            <div className="signin-field">

              <label>Confirm Password</label>

              <div className="signin-input">

                <Lock size={15} />

                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  onBlur={(e) => validateField("confirmPassword", e.target.value)}
                />

              </div>

              {errors.confirmPassword && <p className="field-error" role="alert">{errors.confirmPassword}</p>}

            </div>

            {errors.form && <p className="auth-error" role="alert">{errors.form}</p>}


            {/* SUBMIT */}

            <button
              type="submit"
              className="create-account-btn"
            >
              Create Account
              <ArrowRight size={15} />
            </button>

          </form>


          {/* LOGIN */}

          <div className="signin-login">

            <span>
              Already have an account?
            </span>

            <button
              type="button"
              onClick={() => navigate("/login")}
            >
              Sign In
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Signin;