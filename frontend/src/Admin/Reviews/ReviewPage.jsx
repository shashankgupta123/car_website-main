import React, { useEffect, useState } from "react";
import axios from "axios";

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
    <div style={{ maxWidth: "600px", margin: "auto", textAlign: "center" }}>
      <h2>All Car Reviews</h2>
      {reviews.length === 0 ? (
        <p>No car reviews found.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {reviews.map((review) => (
            <li key={review._id} style={{ borderBottom: "1px solid #ccc", padding: "10px" }}>
              <h3>{review.carName}</h3>
              <p><strong>By:</strong> {review.username}</p>
              <p><strong>Rating:</strong> {review.rating} ⭐</p>
              <p>{review.reviewText}</p>
              <p><small>{new Date(review.createdAt).toLocaleString()}</small></p>
              <button
                onClick={() => deleteCarReview(review._id)}
                style={{
                  backgroundColor: "red",
                  color: "white",
                  border: "none",
                  padding: "5px 10px",
                  cursor: "pointer",
                  borderRadius: "5px"
                }}
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
