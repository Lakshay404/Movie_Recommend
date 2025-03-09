import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './MovieList.css';
import MovieCard from './MovieCard';

const API_KEY = 'e6a8a833176f610ddab69b3aec7b47c7';
const MOVIE_API_URL = (genreIds, page) => 
  `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=${genreIds}&page=${page}`;

const MovieList = ({ genreIds, onSubmitSelection, genres }) => { // Accept genres as a prop
  const [movies, setMovies] = useState([]);
  const [selectedMovies, setSelectedMovies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (genreIds.length) {
      fetchMovies(currentPage);
    }
  }, [genreIds, currentPage]);

  const fetchMovies = async (page) => {
    try {
      const genreQuery = genreIds.join(',');
      const response = await axios.get(MOVIE_API_URL(genreQuery, page));
      setMovies(response.data.results);
      setTotalPages(response.data.total_pages); // Set total pages from API response
    } catch (error) {
      console.error('Error fetching movies:', error);
    }
  };

  const handleMovieSelection = (movieId) => {
    setSelectedMovies((prevSelectedMovies) => {
      if (prevSelectedMovies.includes(movieId)) {
        return prevSelectedMovies.filter((id) => id !== movieId);
      } else {
        return [...prevSelectedMovies, movieId];
      }
    });
  };



  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page); // Update current page state
    }
  };

  return (
    <div>
      {movies.length ? (
        <div>
          <div className="movie-list">
            {movies.map((movie) => {
              // Map genre IDs to their names
              const movieGenres = movie.genre_ids.map(id => genres[id] || 'Unknown');
              return (
                <MovieCard
                  key={movie.id}
                  title={movie.title}
                  imageUrl={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                  rating={movie.vote_average}
                  genres={movieGenres} // Pass the mapped genre names
                  onSelect={() => handleMovieSelection(movie.id)} // Add selection handler
                />
              );
            })}
          </div>
          <div className="pagination">
            <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
              Previous
            </button>
            {[...Array(6)].map((_, index) => (
              <button
                key={index}
                onClick={() => handlePageChange(index + 1)}
                className={currentPage === index + 1 ? 'active' : ''}
              >
                {index + 1}
              </button>
            ))}
            <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
              Next
            </button>
          </div>
        </div>
      ) : (
        <p>No movies found for the selected genres</p>
      )}
    </div>
  );
};

export default MovieList;