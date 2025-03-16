import React, { useRef, useState, useEffect, forwardRef } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col } from "reactstrap";
import { Link, NavLink } from "react-router-dom";
import "./Header.css";

import PhoneImage from "../../assets/Header/phone.jpg";
import SearchImage from "../../assets/Header/search_image.jpg";

const navLinks = [
  { path: "/", display: "Home" },
  { path: "/about", display: "About" },
  { path: "/user-cars", display: "Cars" },
  { path: "/contact", display: "Contact" },
  { path: "/maps", display: "Maps" },
  { path: "/purchase-remain/${userEmail}", display: "Remaining Payment" },
];

const Header = forwardRef((props, ref) => {
  const navigate = useNavigate();
  const menuRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [userEmail, setUserEmail] = useState(null);

  useEffect(() => {
    const email = localStorage.getItem("email");
    console.log("Retrieved User_email", email);
    setUserEmail(email);
  }, []);

  const toggleMenu = () => menuRef.current.classList.toggle("menu__active");

  const handleSearch = async (e, term = searchTerm) => {
    if (e) e.preventDefault();

    const query = term.trim(); // Trim whitespace
    if (!query) {
      alert("Search query cannot be empty.");
      return;
    }

    if (!userEmail) {
      alert("You must be logged in to search.");
      return;
    }

    console.log("Search Term:", query);
    console.log("User Email:", userEmail);

    try {
      const response = await fetch("http://localhost:5000/api/users/store-search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, email: userEmail }),
      });

      const data = await response.json();
      console.log("Response from Flask:", data);

      if (response.ok) {
        navigate("/search-results", { state: { response: data } });
      } else {
        alert(data.message || "Search failed.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error sending search term to the server.");
    }
  };

  useEffect(() => {
    const handleVoiceSearch = (event) => {
      const carQuery = event.detail.trim();
      console.log("Voice Triggered Search for:", carQuery);

      if (carQuery) {
        setSearchTerm(carQuery);
        setTimeout(() => handleSearch(null, carQuery), 500);
      } else {
        console.warn("Voice search result is empty.");
      }
    };

    window.addEventListener("searchCarEvent", handleVoiceSearch);
    return () => window.removeEventListener("searchCarEvent", handleVoiceSearch);
  }, [userEmail]);

  return (
    <header className="header">
      <div className="header__top">
        <Container>
          <Row>
            <Col lg="6" md="6" sm="6">
              <div className="header__top__left">
                <span>Need Help?</span>
                <span className="header__top__help">
                  <img src={PhoneImage} alt="Phone icon" style={{ width: "20px", height: "20px", marginRight: "10px" }} />
                  +1-202-555-0149
                </span>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      <div className="header__middle">
        <Container>
          <Row>
            <Col lg="4" md="3" sm="4">
              <div className="logo">
                <h1>
                  <Link to="/home" className="d-flex align-items-center gap-2">
                    <i className="ri-car-line"></i>
                    <span>
                      Wheels On <br /> Deals
                    </span>
                  </Link>
                </h1>
              </div>
            </Col>

            <Col lg="3" md="3" sm="4">
              <div className="header__location d-flex align-items-center gap-2">
                <span>
                  <i className="ri-earth-line"></i>
                </span>
                <div className="header__location-content">
                  <h4>India</h4>
                  <h6>Mumbai City, India</h6>
                </div>
              </div>
            </Col>

            <Col lg="3" md="3" sm="4">
              <div className="header__location d-flex align-items-center gap-2">
                <span>
                  <i className="ri-time-line"></i>
                </span>
                <div className="header__location-content">
                  <h4>Monday to Friday</h4>
                  <h6>10am - 7pm</h6>
                </div>
              </div>
            </Col>

            <Col lg="2" md="3" sm="0" className="d-flex align-items-center justify-content-end">
              <button className="header__btn btn">
                <Link to="/contact">
                  <i className="ri-phone-line"></i> Request a call
                </Link>
              </button>
            </Col>
          </Row>
        </Container>
      </div>

      <div className="main__navbar">
        <Container>
          <div className="navigation__wrapper d-flex align-items-center justify-content-between">
            <span className="mobile__menu">
              <i className="ri-menu-line" onClick={toggleMenu}></i>
            </span>

            <div className="navigation" ref={menuRef} onClick={toggleMenu}>
              <div className="menu">
                {navLinks.map((item, index) => (
                  <NavLink
                    to={item.path}
                    className={(navClass) => (navClass.isActive ? "nav__active nav__item" : "nav__item")}
                    key={index}
                  >
                    {item.display}
                  </NavLink>
                ))}
              </div>
            </div>

            <div className="nav__right">
              <div className="search__box">
                <form onSubmit={handleSearch}>
                  <div className="search-container">
                    <input
                      type="text"
                      placeholder="Search"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button type="submit" className="search-button">
                      <img src={SearchImage} alt="Search Icon" className="search-icon" />
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </Container>
      </div>
    </header>
  );
});

export default Header;
