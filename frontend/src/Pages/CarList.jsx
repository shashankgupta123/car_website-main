import React, { useEffect, useState } from 'react';
import { getCars} from '../service/carServices'; 
import '../CSS/CarList.css';
import { FaCar, FaEdit, FaTrashAlt, FaCheckCircle, FaMapMarkerAlt } from 'react-icons/fa'; 
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import VideoSrc from "../assets/Video/bg_video.mp4";
import Recommendations from '../component/Recommendation/Recommendation';
import TrendingCar from '../component/Recommendation/TrendingCar';
import SimilarCar from '../component/Recommendation/SimilarCar';
import MostVisitedCar from '../component/Recommendation/MostVisited';
import LastSearch from '../component/Recommendation/LastSearch';
import FavoriteCars from '../component/Recommendation/Favoutite';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faCar } from '@fortawesome/free-solid-svg-icons'; // Correct import for faCar
// import { faTag } from '@fortawesome/free-regular-svg-icons'; // faTag is correct in regular


import logo1 from '../assets/ImageLogo/tata.jpg';
import logo2 from '../assets/ImageLogo/Mercedes.jpg';
import logo3 from '../assets/ImageLogo/Maruti.jpg';
import logo4 from '../assets/ImageLogo/Mahindra.jpg';
import logo5 from '../assets/ImageLogo/Hyundai.jpg';
import logo6 from '../assets/ImageLogo/BMV.jpg';
import logo7 from '../assets/ImageLogo/Telsa.jpg';
import logo8 from '../assets/ImageLogo/Toyota.jpg';
import { useNavigate } from 'react-router-dom';

const CarList = () => {
    const [cars, setCars] = useState([]); 
    const navigate = useNavigate();
    const brandedLogos = [logo1, logo2, logo3, logo4, logo5, logo6,logo7,logo8];

    useEffect(() => {
        const fetchCars = async () => {
            try {
                const carData = await getCars(); 
                console.log("Fetched Car Data:", carData); 
                setCars(carData || []); 
            } catch (error) {
                console.error("Error fetching cars:", error);
            }
        };
        fetchCars();
    }, []);

    // const handleDelete = async (name) => {
    //     try {
    //         const result = await deleteCar(name); // Delete car by name
    //         if (result.success) {
    //             // Filter out the deleted car from the state
    //             setCars(cars.filter((car) => car.name !== name)); // Use `name` for filtering
    //             alert("Car deleted successfully");
    //         } else {
    //             alert("Failed to delete the car");
    //         }
    //     } catch (error) {
    //         console.error("Error deleting car:", error);
    //         alert("Error deleting the car");
    //     }
    // };

    
    const sliderSettings = {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 4,
      slidesToScroll: 1,
      arrows: true,
      responsive: [
          {
              breakpoint: 768,
              settings: {
                  slidesToShow: 2,
                  arrows: true,
              },
          },
          {
              breakpoint: 480,
              settings: {
                  slidesToShow: 1,
                  arrows: true,
              },
          },
      ],
  };

  const handleCardClick = async (carId, carName, variant, description, offers, model_no, colors, locations) => {
    try {
        const userId = localStorage.getItem("userId"); 
        console.log("Raw locations data type:", typeof locations);
        console.log("Raw locations data:", locations);
    
        if (typeof locations === "string") {
            try {
                locations = JSON.parse(locations); // Try to convert string to an array
            } catch (error) {
                console.error("Error parsing locations:", error);
                locations = []; // Default to an empty array if parsing fails
            }
        }
    
        const formattedLocation = Array.isArray(locations) && locations.length > 0 
            ? locations.map(loc => loc.placeName).join(', ') 
            : "Not Available";
    
        console.log("Formatted location:", formattedLocation); // Debugging
    
        const response = await fetch("http://localhost:5000/api/users/record-visit", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                userId, 
                carId, 
                carName, 
                variant, 
                description, 
                offers, 
                model_no, 
                colors,
                locations: formattedLocation, // Send location as a string
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
        }

        const data = await response.json();
        console.log("Click data saved successfully:", data);
        navigate(`/cars/details/${carName}`); 
    } catch (error) {
        console.error("Error saving click data:", error.message);
    }
};

  return (
    <div className="car-list-container">
                    <h1 className="typing-animation">Launcing SOON!!!</h1>
        <div className="background-image">
        <video
                className="background-video"
                src={VideoSrc} 
                autoPlay
                loop
                muted
            />
        </div>
        <div>
            <div>
                <h1>For More Info <a href="https://example.com">click here</a></h1>
            </div>
        </div>
        <div className="car-images-top">
    {cars.slice(0, 3).map((car) => (
        car.colors.length > 0 && car.colors[0].images.length > 0 ? (
            <img
                key={car._id}
                src={car.colors[0].images[0]} 
                alt={car.name}
                className="car-top-image"
            />
        ) : (
            <div key={car._id} className="no-image">No Image Available</div>
        )
    ))}
</div>

        <h2>Car Logos</h2>
        <Slider {...sliderSettings} className="logo-slider">
            {brandedLogos.map((logo, index) => (
                <div key={index} className="logo-slide">
                    <img src={logo} alt={`Logo ${index + 1}`} className="brand-logo" />
                </div>
            ))}
        </Slider>

        <TrendingCar/>

        <SimilarCar/>

        <MostVisitedCar/>

        <LastSearch/>

        <FavoriteCars/>
        
        <br></br>
        <h1>Available Cars</h1>
<div className="car-grid">
    {cars.length > 0 ? (
        cars.map((car, i) => (
            <div
                key={i}
                className="car-card"
                onClick={() => handleCardClick(car._id, car.name, car.variant, car.description, car.offers, car.model_no, car.colors, car.locations )} // Redirect on click
            >
                <div className="car-header">
                    <h2>{car.name}</h2>
                    <p><strong>Model:</strong> {car.model_no}</p>
                    <p><strong>Offers:</strong> {car.offers}</p>
                    {car.colors.length > 0 && (
                        <p className="car-price"><strong>Price:</strong> ₹{car.colors[0].price.toLocaleString()}</p>
                    )}
                    {/* Extracting and displaying placeName from locations */}
                    {car.locations && car.locations.length > 0 ? (
                        <p><FaMapMarkerAlt /> <strong>Location:</strong> {car.locations.map(loc => loc.placeName).join(', ')}</p>
                    ) : (
                        <p><FaMapMarkerAlt /> <strong>Location:</strong> Not Available</p>
                    )}
                </div>
                <div className="car-images">
                    {car.colors.length > 0 && (
                        <img src={car.colors[0].images[0]} alt={car.colors[0].color} className="car-color-image" />
                    )}
                </div>
            </div>
        ))
    ) : (
        <p>No cars available.</p>
    )}
</div>


        {/* <Recommendations/> */}
    </div>
);
};

export default CarList;
{/* <div className="car-actions">
                <Link to={`/cars/update/${car._id}`} className="edit-button"><FaEdit /> Edit</Link>
                <button onClick={() => handleDelete(car._id)} className="delete-button"><FaTrashAlt /> Delete</button>
              </div> */}