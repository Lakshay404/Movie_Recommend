import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import MovieCard from './MovieCard';
import './Search.css';

const API_KEY = 'e6a8a833176f610ddab69b3aec7b47c7';

const Search = () => {
  const location = useLocation();
  const query = location.state?.query || '';
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState({});

  useEffect(() => {
    fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}&language=en-US`)
      .then((response) => response.json())
      .then((data) => {
        const genreMap = data.genres.reduce((acc, genre) => {
          acc[genre.id] = genre.name;
          return acc;
        }, {});
        setGenres(genreMap); 
      })
      .catch((error) => console.error('Error fetching genres:', error));
  }, []);

  useEffect(() => {
    if (query) {
      fetch(
        `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&language=en-US&query=${query}&include_adult=false`
      )
        .then((response) => response.json())
        .then((data) => {
          const filteredMovies = data.results.filter(
            (movie) => !movie.adult && movie.poster_path
          );
          setMovies(filteredMovies);
        })
        .catch((error) => console.error('Error fetching search data:', error));
    }
  }, [query]);

  return (
    <div className="search-page">
      <h2>Showing Results for: {query}</h2>
      <div className="movie-grid">
        {movies.length > 0 ? (
          movies.map((movie) => {
            const movieGenres = movie.genre_ids.map((id) => genres[id] || 'Unknown');
            return (
              <MovieCard
                key={movie.id}
                title={movie.title}
                imageUrl={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                rating={movie.vote_average}
                genres={movieGenres}
              />
            );
          })
        ) : (
          <p>No results found.</p>
        )}
      </div>
    </div>
  );
};

export default Search;