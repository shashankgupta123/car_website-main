import React, { useEffect, useState } from "react";
import axios from "axios";
import './ReviewPage.css';

const ReviewsPage = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch all car reviews
  const fetchCarReviews = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5000/api/reviews/admin/all");
      setReviews(response.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch car reviews.");
      setLoading(false);
    }
  };

  // Delete a car review
  const deleteCarReview = async (reviewId) => {
    try {
      await axios.delete(`http://localhost:5000/api/reviews/admin/${reviewId}`);
      setReviews(reviews.filter((review) => review._id !== reviewId)); // Update state after deletion
    } catch (err) {
      alert("Failed to delete car review");
    }
  };

  useEffect(() => {
    fetchCarReviews();
  }, []);

  if (loading) return <p>Loading car reviews...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="reviews-page-container">
      <h2 className="reviews-page-title">All Reviews</h2>
      {reviews.length === 0 ? (
        <p className="reviews-page-no-reviews">No reviews found.</p>
      ) : (
        <ul className="reviews-page-list">
          {reviews.map((review) => (
            <li key={review._id} className="reviews-page-item">
              <h3 className="reviews-page-book-title">{review.bookTitle}</h3>
              <p className="reviews-page-author"><strong>By:</strong> {review.username}</p>
              <p className="reviews-page-rating"><strong>Rating:</strong> {review.rating} ⭐</p>
              <p className="reviews-page-text">{review.reviewText}</p>
              <p className="reviews-page-date"><small>{new Date(review.createdAt).toLocaleString()}</small></p>
              <button 
                onClick={() => deleteCarReview(review._id)} 
                className="reviews-page-delete-btn"
              >
                Delete Review
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ReviewsPage;
