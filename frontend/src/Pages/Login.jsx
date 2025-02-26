import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { Helmet } from "react-helmet";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { loginUser } from "../service/authService";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (location.state?.toastMessage) {
      toast.success(location.state.toastMessage);
    }
  }, [location.state]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await loginUser(formData); 
      console.log("Login Response:", response);
      localStorage.setItem("authToken", response.token);
      localStorage.setItem("username", response.username);
      localStorage.setItem("admin", response.admin);
      localStorage.setItem("email", response.email);
      localStorage.setItem("userId",response.userId);
      localStorage.setItem("phone",response.phone);
      localStorage.setItem("loginTime", new Date().toISOString());

      console.log("authToken:", localStorage.getItem("authToken"));
      console.log("admin:", localStorage.getItem("admin"));
      setFormData({ email: "", password: "" });

      const toastMessage = "Login successful!"
      if (response.admin) {
        navigate("/admin-dashboard", {state:{ toastMessage }}); 
      } else {
        navigate("/", {state:{ toastMessage }}); 
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed.");
    }
  };

  return (
    <>
      <Helmet>
        <title>Login | Wheels and Deals</title>
      </Helmet>
      <section className="loginbg">
        <div className="innerContainer">
          <div className="row glassBox">
            <h1 className="text-center">Login</h1>
            <form onSubmit={handleSubmit}>
              <div className="col-12 my-2">
                <label htmlFor="email" className="form-label" style={{ fontWeight: 'bold', fontSize: '16px' }}>
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="form-control"
                  id="email"
                  required
                />
              </div>

              <div className="col-12 my-2">
                <label htmlFor="password" className="form-label" style={{ fontWeight: 'bold', fontSize: '16px' }}>
                  Password
                </label>
                <div className="d-flex">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="form-control"
                    style={{ borderRadius: "0.5rem 0rem 0rem 0.5rem"}}
                    id="password"
                    required
                  />
                  <button
                    type="button"
                    className="passbtn"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <div className="col-12 my-2">
                <p className="text-center" style={{ fontWeight: 'bold', fontSize: '16px' }}>
                  Don't Have an Account?{" "}
                  <Link to="/register" className="fw-bold text-info">
                    Click Here
                  </Link>
                </p>
              </div>
              <div className="col-12 my-2">
                <p className="text-center" style={{ fontWeight: 'bold', fontSize: '16px' }}>
                  Forgot Password?{" "}
                  <Link to="/forgot password" className="fw-bold text-info">
                    Click Here
                  </Link>
                </p>
              </div>

              <div className="col-12 my-2 d-flex justify-content-center submit-btn">
                <button type="submit">Login Now</button>
              </div>
            </form>
          </div>
        </div>
      </section>
      <ToastContainer />
    </>
  );
};

export default Login;
