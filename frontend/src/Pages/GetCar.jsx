import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { getCarByName } from '../service/carServices';
import RentalForm from '../component/Form/RentalForm';
import '../CSS/CarDetails.css';
import axios from 'axios'

const CarDetails = () => {
    const { name } = useParams();
    const [car, setCar] = useState(null);
    const [selectedColor, setSelectedColor] = useState(null);
    const [error, setError] = useState('');
    const [userId, setUserId] = useState(null);
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [phone, setPhone] = useState('');
    const carTitleRef = useRef(null);
    const [showRentalForm, setShowRentalForm] = useState(false);
    const [reviews, setReviews] = useState([]);
    const [rating, setRating] = useState(0);
    const [reviewText, setReviewText] = useState('');
    const reviewListRef= useRef(null);

    useEffect(() => {
        const storedUserId = localStorage.getItem('userId');
        const storedEmail = localStorage.getItem('email');
        const storedUsername = localStorage.getItem('username');
        const storedPhone = localStorage.getItem('phone');
        if (storedUserId) {
            setUserId(storedUserId);
        } else {
            setError('User is not logged in.');
        }
        if (storedEmail) setEmail(storedEmail);
        if (storedUsername) setUsername(storedUsername);
        if (storedPhone) setPhone(storedPhone);
    }, []);

    useEffect(() => {
        const fetchCarDetails = async () => {
            if (!name) {
                setError('Car name is undefined.');
                return;
            }
            try {
                const response = await getCarByName(name);
                if (response) {
                    setCar(response);
                    setSelectedColor(response.colors[0]);  // Set the first color as selected by default
                } else {
                    setError('Car details not found.');
                }
            } catch (err) {
                setError(`Error fetching car details: ${err.message}`);
            }
        };

        async function fetchReviews() {
            try {
                if (!name) {
                    setError("Car name is undefined.");
                    return;
                }
                const response = await axios.get(`http://localhost:5000/api/reviews/${name}`); // FIXED: Using `name` instead of `carName`
                if (response.status === 200) {
                    setReviews(response.data);
                }
            } catch (err) {
                console.log('Error fetching reviews:', err);
                setError('Error fetching reviews');
            }
        }

        fetchCarDetails();
        fetchReviews();
    }, [name]);

    useEffect(() => {
        if (reviews.length > 4) {
            const interval = setInterval(() => {
                if (reviewListRef.current) {
                    reviewListRef.current.scrollBy({
                        left: 260, // Move by one review width
                        behavior: "smooth"
                    });

                    // Loop back to the start when reaching the end
                    if (
                        reviewListRef.current.scrollLeft + reviewListRef.current.clientWidth >= 
                        reviewListRef.current.scrollWidth
                    ) {
                        reviewListRef.current.scrollTo({ left: 0, behavior: "smooth" });
                    }
                }
            }, 3000); // Scroll every 3 seconds

            return () => clearInterval(interval);
        }
    }, [reviews]);

    const handleAddReview = async () => {
        if (!userId) {
            setError("You need to be logged in to add a review.");
            return;
        }
    
        console.log("Car Object:", car);  // Debugging log
    
        if (!car || !car._id) {
            setError("Car details not found.");
            return;
        }
    
        const reviewData = {
            carId: car._id,  // ✅ Ensure we are sending carId
            userId,
            username,
            rating,
            reviewText,
        };
    
        try {
            const response = await axios.post('http://localhost:5000/api/reviews/add-review', reviewData);
            console.log('Review added:', response.data);
    
            if (response.status === 201) {
                alert('Review added successfully!');
                setReviewText('');
                setRating(0);
                setReviews([...reviews, response.data.review]);
            }
        } catch (err) {
            console.log("Error:", err.response?.data || err);
            setError("Error adding review. Please try again.");
        }
    };
    

    const handleColorChange = (color) => {
        const selected = car.colors.find(c => c.color === color);
        setSelectedColor(selected);
    };

    const addToFavorites = async () => {
        if (!userId) {
            setError('You need to be logged in to add a car to your favorites.');
            return;
        }
        const selectedColorDetails = car.colors.find(color => color.color === selectedColor?.color);
        const carDetails = {
            userId,
            carDetails: {
                name: car.name,
                model_no: car.model_no,
                variant: car.variant,
                mileage: car.mileage,
                description: car.description,
                offers: car.offers,
                locations: car.locations,
                colors: [{
                    color: selectedColorDetails?.color,
                    price: selectedColorDetails?.price,
                    images: selectedColorDetails?.images,
                }],
            },
        };

        try {
            const response = await fetch('http://localhost:5000/api/users/add-favourite', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(carDetails),
            });

            const result = await response.json();
            if (response.status === 200) {
                alert('Car added to your favorites!');
            } else {
                setError(result.message);
            }
        } catch (err) {
            setError(`Error adding to favorites: ${err.message}`);
        }
    };

    const buyNow = async () => {
        if (!userId) {
            setError('You need to be logged in to proceed with the purchase.');
            return;
        }

        const selectedColorDetails = car.colors.find(color => color.color === selectedColor?.color);
        const userDetails = {
            userId,
            username,
            email,
            phone,
            carName: car.name,
            modelNo: car.model_no,
            variant: car.variant,
            mileage: car.mileage,
            description: car.description,
            selectedColor: {
                color: selectedColorDetails?.color,
                price: selectedColorDetails?.price,
                images: selectedColorDetails?.images,
            },
            offers: car.offers,
        };

        try {
            const response = await fetch('http://localhost:5000/api/checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    amount: selectedColorDetails.price,
                    userDetails,
                }),
            });

            const data = await response.json();
            if (data.url) {
                window.location.href = data.url; // Redirect to payment gateway
            } else {
                setError('Error redirecting to payment gateway.');
            }
        } catch (err) {
            setError(`Error during payment process: ${err.message}`);
        }
    };

    const handleRentNow = () => {
        // Log car details before passing to rental form
        console.log('Car Details:', car);  // Highlighted: Log car details before rental form
        setShowRentalForm(true); // Set state to show rental form
    };


    if (error) {
        return <p className="error-message">{error}</p>;
    }
    if (!car) {
        return <p>Loading car details...</p>;
    }
    

    return (
        <>
        <div className="car-details-container">
            <div className="car-image-container">
                <img
                    src={selectedColor?.images?.[0]}
                    alt={car.name}
                    className="car-detail-image"
                />
            </div>
            <div className="car-details">
                <h1 ref={carTitleRef}>{car.name}</h1>
                <p><strong>Model:</strong> {car.model_no}</p>
                <p><strong>Variant:</strong> {car.variant}</p>
                <p><strong>Mileage:</strong> {car.mileage} km/l</p>
                <p><strong>Description:</strong> {car.description}</p>
                <p><strong>Colors:</strong></p>
                <div className="color-selection-container">
                    {car.colors.map((color, index) => (
                        <button
                            key={index}
                            className="color-circle"
                            style={{
                                backgroundColor: color.color,
                                border: selectedColor?.color === color.color ? '2px solid black' : 'none',
                            }}
                            onClick={() => handleColorChange(color.color)}
                        />
                    ))}
                </div>
                <p><strong>Price:</strong> ₹{selectedColor?.price?.toLocaleString() || 'N/A'}</p>
                <p><strong>Offers:</strong> {car.offers || 'No offers available'}</p>
                <p><strong>Available Locations:</strong></p>
                    <ul>
                        {car.locations && car.locations.length > 0 ? (
                            car.locations.map((location, index) => (
                                <li key={index}>{location.placeName}</li> // Only display the placeName
                            ))
                        ) : (
                            <p>No locations available</p>
                        )}
                    </ul>

                    <div className="button-container">
                        <button onClick={addToFavorites} className="add-favorite-button">
                            Add to Favorites
                        </button>
                        <button onClick={handleRentNow} className="rent-now-button">
                            Rent Now
                        </button>
                    </div>

            </div>
            {showRentalForm && (
                <RentalForm 
                    car={car} 
                    selectedColor={selectedColor}  // Pass selected color and price to the rental form
                    onClose={() => setShowRentalForm(false)} 
                    onSubmit={(data) => console.log('Rental form data:', data)} 
                />
            )}

        {/* Add Review Form */}
       {/* Reviews Section */}
       <div className="car-reviews-section">
            <h3>Customer Reviews</h3>
            {reviews.length === 0 ? (
                <p className="no-reviews">No reviews yet. Be the first to review this car!</p>
            ) : (
                <div className="car-reviews-list" ref={reviewListRef}>
                    {reviews.map((review, index) => (
                        <div key={index} className="car-review-item">
                            <p><strong>{review.username}</strong> - <span className="car-review-rating">{"⭐".repeat(review.rating)}</span></p>
                            <p className="car-review-text">{review.reviewText}</p>
                        </div>
                    ))}
                </div>
    )}

    {/* Add Review Form */}
    <div className="car-add-review-container">
        <h4>Write a Review</h4>
        <div className="car-rating-container">
            <label htmlFor="rating-select">Rating:</label>
            <select
                id="rating-select"
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
            >
                <option value={0} disabled>Select Rating</option>
                {[1, 2, 3, 4, 5].map((star) => (
                    <option key={star} value={star}>{"⭐".repeat(star)}</option>
                ))}
            </select>
        </div>
        <textarea
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder="Write your review here..."
            className="car-review-textarea"
            rows="4"
        ></textarea>
        <button 
            onClick={handleAddReview} 
            className="car-submit-review-button"
            disabled={rating === 0 || reviewText.trim() === ''}
        >
            Submit Review
        </button>
    </div>
</div>
</div>

    </>
    );
};

export default CarDetails;
