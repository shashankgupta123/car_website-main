import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { Container, Row, Col } from "reactstrap";
import { Link, NavLink } from "react-router-dom";
import "./Header.css";

import PhoneImage from "../../assets/Header/phone.jpg";
import SearchImage from "../../assets/Header/search_image.jpg";

const navLinks = [
  {
    path: "/",
    display: "Home",
  },
  {
    path: "/about",
    display: "About",
  },
  {
    path: "/user-cars",
    display: "Cars",
  },
  {
    path: "/contact",
    display: "Contact",
  },
  {
    path: "/maps",
    display: "Maps",
  },
  {
    path: "/purchase-remain/${userEmail}",
    display: "Remaing Payment",
  },
];

const Header = () => {
  const navigate = useNavigate();
  const menuRef = useRef(null);
  const [searchTerm, setSearchTerm] =useState('');
  const [userEmail, setUserEmail]= useState(null);

  useEffect(()=>{
    const email=localStorage.getItem('email');
    console.log("User_email",email);
    setUserEmail(email);
  }, []);

  const toggleMenu = () => menuRef.current.classList.toggle("menu__active");

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!userEmail) {
      alert("You must be logged in to submit a search term.");
      return;
    }

    console.log("Search Term:", searchTerm);
    console.log("User Email:", userEmail);

    try {
      const response = await fetch('http://localhost:5000/api/users/store-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchTerm, email: userEmail }),
      });

      const data = await response.json();
      console.log("Response from Flask:", data);
      navigate('/search-results', { state: { response: data } });
    } catch (error) {
      console.error("Error:", error);
      alert("Error sending search term to the server.");
    }
  };

  return (
    <header className="header">
      {/* ============ header top ============ */}
      <div className="header__top">
        <Container>
          <Row>
            <Col lg="6" md="6" sm="6">
              <div className="header__top__left">
                <span>Need Help?</span>
                <span className="header__top__help">
                <img src={PhoneImage}  alt="Phone icon" style={{ width: '20px', height: '20px', marginRight: '10px' }} />
                  +1-202-555-0149
                </span>
              </div>
            </Col>

            <Col lg="6" md="6" sm="6">
              <div className="header__top__right d-flex align-items-center justify-content-end gap-3">
                <Link to="#" className=" d-flex align-items-center gap-1">
                  <i class="ri-login-circle-line"></i> Login
                </Link>

                <Link to="#" className=" d-flex align-items-center gap-1">
                  <i class="ri-user-line"></i> Register
                </Link>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      {/* =============== header middle =========== */}
      <div className="header__middle">
        <Container>
          <Row>
            <Col lg="4" md="3" sm="4">
              <div className="logo">
                <h1>
                  <Link to="/home" className=" d-flex align-items-center gap-2">
                    <i class="ri-car-line"></i>
                    <span>
                      Wheels On  <br /> Deals
                    </span>
                  </Link>
                </h1>
              </div>
            </Col>

            <Col lg="3" md="3" sm="4">
              <div className="header__location d-flex align-items-center gap-2">
                <span>
                  <i class="ri-earth-line"></i>
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
                  <i class="ri-time-line"></i>
                </span>
                <div className="header__location-content">
                  <h4>Monday to Friday</h4>
                  <h6>10am - 7pm</h6>
                </div>
              </div>
            </Col>

            <Col
              lg="2"
              md="3"
              sm="0"
              className=" d-flex align-items-center justify-content-end "
            >
              <button className="header__btn btn ">
                <Link to="/contact">
                  <i class="ri-phone-line"></i> Request a call
                </Link>
              </button>
            </Col>
          </Row>
        </Container>
      </div>

      {/* ========== main navigation =========== */}

      <div className="main__navbar">
        <Container>
          <div className="navigation__wrapper d-flex align-items-center justify-content-between">
            <span className="mobile__menu">
              <i class="ri-menu-line" onClick={toggleMenu}></i>
            </span>

            <div className="navigation" ref={menuRef} onClick={toggleMenu}>
              <div className="menu">
                {navLinks.map((item, index) => (
                  <NavLink
                    to={item.path}
                    className={(navClass) =>
                      navClass.isActive ? "nav__active nav__item" : "nav__item"
                    }
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
                  <input type="text" placeholder="Search" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}/>
                  <button type="submit" className="search-button">
                    <img src={SearchImage} alt="Search Icon" className="search-icon"/>
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
};

export default Header;
