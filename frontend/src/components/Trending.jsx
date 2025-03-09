/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MovieCard from "./MovieCard";
import "./Trending.css";

const API_KEY = "e6a8a833176f610ddab69b3aec7b47c7";
const BASE_TRENDING_API_URL = `https://api.themoviedb.org/3/trending/movie`;
const GENRES_API_URL = `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}&language=en-US`;

const Trending = () => {
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [genres, setGenres] = useState({});
  const [timeRange, setTimeRange] = useState("day");
  const navigate = useNavigate();



  useEffect(() => {
    const fetchTrendingMovies = async () => {
      const url = `${BASE_TRENDING_API_URL}/${timeRange}?api_key=${API_KEY}&include_adult=false`;
      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          const sortedMovies = data.results.sort(
            (a, b) => b.popularity - a.popularity
          );
          setTrendingMovies(sortedMovies);
        })
        .catch((error) =>
          console.error("Error fetching trending movies:", error)
        );
    };

    fetchTrendingMovies();
  }, [timeRange]);



  return (
    <div id="trending">
      <h1>Trending Movies</h1>
      <div className="trend-btn">


        <div className="time-range-buttons">
          <button
            className={timeRange === "day" ? "active" : ""}
            onClick={() => setTimeRange("day")}
          >
            Today
          </button>
          <button
            className={timeRange === "week" ? "active" : ""}
            onClick={() => setTimeRange("week")}
          >
            This Week
          </button>
        </div>
      </div>
      <div className="movie-grid">
        {trendingMovies
          .filter((movie) => !movie.adult)
          .map((movie) => (
            <MovieCard
              key={movie.id}
              title={movie.title}
              imageUrl={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              rating={movie.vote_average}
              genres={movie.genre_ids.map((id) => genres[id])}
            />
          ))}
      </div>
    </div>
  );
};

export default Trending;