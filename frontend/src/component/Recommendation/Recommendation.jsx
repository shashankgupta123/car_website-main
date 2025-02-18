import React, { useEffect, useState } from "react";
import axios from "axios";

const Recommendations = () => {
  const [recommendations, setRecommendations] = useState(null);
  const [error, setError] = useState("");
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    // Get the email from localStorage
    const emailFromStorage = localStorage.getItem("email");
    setUserEmail(emailFromStorage);

    if (!emailFromStorage) {
      setError("No user email found in localStorage");
      return;
    }

    const fetchRecommendations = async () => {
      try {
        const response = await axios.get("http://localhost:5001/api/recommendations", {
          params: { email: emailFromStorage },
        });
        setRecommendations(response.data.recommendations);
        setError("");
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || "Error fetching recommendations");
      }
    };

    fetchRecommendations();
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!recommendations) {
    return <div>Loading...</div>;
  }

  const renderRecommendationList = (title, data) => (
    <div>
      <h3>{title}</h3>
      <ul>
        {data.map((item) => (
          <li key={item.id}>
            <h4>{item.name}</h4>
            <p>{item.description}</p>
            {item.price && <p>Price: ₹{item.price}</p>}
            {item.variant && <p>Variant: {item.variant}</p>}
            {item.similarityScore && <p>Similarity Score: {item.similarityScore}%</p>}
            {item.visitCount && <p>Visit Count: {item.visitCount}</p>}
            {item.color && <p>Available Colors: {item.color}</p>}
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <div>
      <h2>Recommendations for {userEmail}</h2>
      {renderRecommendationList("Favourite Cars", recommendations.favourite_cars)}
      {renderRecommendationList("Last Two Searches", recommendations.last_two_searches)}
      {renderRecommendationList("Most Visited Cars", recommendations.most_visited)}
      {renderRecommendationList("New Trends", recommendations.new_trends)}
      {renderRecommendationList("Similar Cars", recommendations.similar_cars)}
    </div>
  );
};

export default Recommendations;
