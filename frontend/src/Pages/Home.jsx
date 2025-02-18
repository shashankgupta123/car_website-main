import React, { useEffect, useState } from "react";
import { toast , ToastContainer } from "react-toastify";
import VoiceAssistant from "../component/Voice/VoiceAssistant";
import { useNavigate, useLocation } from 'react-router-dom';
import { Container, Row, Col } from "reactstrap";
import HeroSlider from "../component/UI/HeroSlider";
import AboutSection from "../component/UI/AboutSection";
import ServicesList from "../component/UI/ServiceList";
import CarItem from "../component/UI/CarItem";
import carData from "../assets/data/carData";
import "react-toastify/dist/ReactToastify.css";

const Home = () => {
  const [userName, setUserName] = useState("");
  const navigate = useNavigate(); // Hook to navigate after logout
  const location = useLocation(); // Hook to get current location


  useEffect(() => {
    console.log(location.state);
    const storedUserName = localStorage.getItem("username");
    if (storedUserName) {
      setUserName(storedUserName);
    }

    if (location.state?.toastMessage) {
      toast.success(location.state.toastMessage);
    }
  }, [location.state]);

  const handleLogout = async () => {
    try {
      const startTime = localStorage.getItem("loginTime");
      const userId = localStorage.getItem("userId");
  
      if (!startTime || !userId) {
        console.error("Missing login details in local storage");
        return;
      }
  
      const endTime = new Date();
      const timeSpent = Math.floor((endTime - new Date(startTime)) / 1000); // Time spent in seconds
  
      const response = await fetch("http://localhost:5000/api/users/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          day: endTime.toLocaleString("en-US", { weekday: "long" }),
          timeSpent, // Time in seconds
        }),
      });
  
      if (response.ok) {
        localStorage.clear();
        alert("Logout successful. Your session has been updated.");
        navigate("/login");
      } else {
        const data = await response.json();
        console.error("Logout failed:", data.message);
        alert(`Logout failed: ${data.message}`);
      }
    } catch (error) {
      console.error("Logout error:", error.message);
      alert("An error occurred during logout. Please try again.");
    }
  };
  

  return (
    <>
    < ToastContainer />
    <section className="p-0 hero__slider-section">
        <HeroSlider />

        <div className="hero__form">
          <Container>
            <Row className="form__row">
              
            </Row>
          </Container>
        </div>
      </section>
      {/* =========== about section ================ */}
      <AboutSection />
       {/* ========== services section ============ */}
       <section>
        <Container>
          <Row>
            <Col lg="12" className="mb-5 text-center">
              <h6 className="section__subtitle">See our</h6>
              <h2 className="section__title">Popular Services</h2>
            </Col>

            <ServicesList />
          </Row>
        </Container>
      </section>
      {/* =========== car offer section ============= */}
      <section>
        <Container>
          <Row>
            <Col lg="12" className="text-center mb-5">
              <h6 className="section__subtitle">Come with</h6>
              <h2 className="section__title">Hot Offers</h2>
            </Col>

            {carData.slice(0, 6).map((item) => (
              <CarItem item={item} key={item.id} />
            ))}
          </Row>
        </Container>
      </section>
      {/* =========== become a driver section ============ */}
      {/* <BecomeDriverSection /> */}
      <button onClick={handleLogout}>Logout</button>
    <div>
      {/* <h1>Welcome to Wheels and Deals!</h1> */}
      {/* {userName && <h2>Hello, {userName}!</h2>} */}
      <VoiceAssistant />
      {/* <CarGet /> */}
    </div>
    </>
  );
};

export default Home;
