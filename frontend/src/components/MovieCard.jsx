/* eslint-disable no-unused-vars */
import React from "react";
import "./MovieCard.css"; 

const MovieCard = ({ title, imageUrl, rating, genres }) => {
  return (
    <div className="movie-card">
      <div className="image-content">
        <img src={imageUrl} alt={title} className="movie-card-image" />
      </div>
      <div className="movie-card-content">
        <h3 className="movie-card-title">{title}</h3>
        <p className="movie-card-rating"><strong>Rating: </strong> {rating}</p>
        <p className="movie-card-genres">
          <strong>Genres</strong>
          <br />
          {genres.map((genre, index) => (
            <span key={index}>{genre}</span>
          ))}
        </p>
      </div>
    </div>
  );
};

export default MovieCard;

