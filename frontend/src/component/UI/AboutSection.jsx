import React from "react";
import { Container, Row, Col } from "reactstrap";
import "../../CSS/about-section.css";
import aboutImg from "../../assets/Home/bmw-offer.png"; 

const AboutSection = ({ aboutClass }) => {
  return (
    <section
      className="about__section"
      style={
        aboutClass === "aboutPage" ? { marginTop: "0px" } : { marginTop: "280px" }
      }
    >
      <Container>
        <Row>
          <Col lg="6" md="6">
            <div className="about__section-content">
              <h4 className="section__subtitle">About Us</h4>
              <h2 className="section__title">Welcome to Our Car Rental Service</h2>
              <p className="section__description">
                At [Your Company Name], we are dedicated to providing the best car rental experience for our customers. Our mission is to offer a wide variety of vehicles that cater to every need, whether you're planning a road trip, a business trip, or simply need a car for daily use. We pride ourselves on our customer-centric approach, ensuring that each rental experience is smooth, convenient, and affordable. 
              </p>

              <p className="section__description">
                We understand that your time is valuable, which is why we offer a hassle-free online booking system that allows you to book your car in just a few clicks. Our team is available 24/7 to answer your questions and ensure that everything goes smoothly from the moment you book your car until you return it. Whether you're a first-time renter or a frequent traveler, we strive to make every part of your experience as seamless as possible.
              </p>

              <div className="about__section-item d-flex align-items-center">
                <p className="section__description d-flex align-items-center gap-2">
                  <i className="ri-checkbox-circle-line"></i> Affordable and competitive pricing with no hidden fees.
                </p>

                <p className="section__description d-flex align-items-center gap-2">
                  <i className="ri-checkbox-circle-line"></i> A diverse fleet of well-maintained cars to meet every need.
                </p>
              </div>

              <div className="about__section-item d-flex align-items-center">
                <p className="section__description d-flex align-items-center gap-2">
                  <i className="ri-checkbox-circle-line"></i> Convenient online booking system for easy reservations.
                </p>

                <p className="section__description d-flex align-items-center gap-2">
                  <i className="ri-checkbox-circle-line"></i> 24/7 customer support to assist with any inquiries or issues.
                </p>
              </div>
            </div>
          </Col>

          <Col lg="6" md="6">
            <div className="about__img">
              <img src={aboutImg} alt="Car Fleet" className="w-100" />
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default AboutSection;
