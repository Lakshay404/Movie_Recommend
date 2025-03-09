/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setMovies, setFilteredMovies } from '../store/movieSlice';
import Papa from 'papaparse';
import './Recommendation.css';
import { useNavigate } from 'react-router-dom';




const Recommendation = () => {
  // const dispatch = useDispatch();
  // const { movies, filteredMovies } = useSelector((state) => state.movie);
  // const [keyword, setKeyword] = useState('');

  // const navigate=useNavigate();
  // useEffect(() => {
  //   if (movies.length === 0) {
  //     const loadCSV = async (fileName) => {
  //       return new Promise((resolve, reject) => {
  //         Papa.parse(`/${fileName}`, {
  //           download: true,
  //           header: true,
  //           complete: (result) => resolve(result.data),
  //           error: (error) => reject(error),
  //         });
  //       });
  //     };

  //     const loadAllMovies = async () => {
  //       try {
  //         const movieData = await loadCSV('movies_with_image_links.csv');
  //         const reviewData = await loadCSV('generated_movie_reviews.csv');
  //         const movielink = await loadCSV('movies.csv');

  //         const movieMap = new Map();
  //         movieData.forEach((movie) => {
  //           movieMap.set(movie.movieId, { ...movie });
  //         });

  //         reviewData.forEach((review) => {
  //           const movieId = review.movieId;
  //           if (movieMap.has(movieId)) {
  //             movieMap.set(movieId, { ...movieMap.get(movieId), ...review });
  //           }
  //         });

  //         movielink.forEach((link) => {
  //           const movieId = link.movieId;
  //           if (movieMap.has(movieId)) {
  //             movieMap.set(movieId, { ...movieMap.get(movieId), ...link });
  //           }
  //         });

  //         dispatch(setMovies([...movieMap.values()]));
  //       } catch (error) {
  //         console.error('Error loading CSV files:', error);
  //       }
  //     };

  //     loadAllMovies();
  //   }
  // }, [dispatch, movies.length]);

  // const handleRecommend = (newkeyword=keyword) => {
  //   if (keyword.trim() === '') {
  //     dispatch(setFilteredMovies([]));
  //   } else {
  //     const lowerKeyword = newkeyword.toLowerCase();
  //     const results = movies.filter((movie) =>
  //       Object.values(movie).some((value) =>
  //         String(value).toLowerCase().includes(lowerKeyword)
  //       )
  //     );
  //     dispatch(setFilteredMovies(results));
  //     navigate(`/recommendation?keyword=${newkeyword}`)
  //   }
      const navigate=useNavigate();
      const [movies, setMovies] = useState([]);
      const [similarity, setSimilarity] = useState([]);
      const [keyword, setKeyword] = useState('');
      
      useEffect(() => {
        // Load movie list
        fetch("/movie_list.json")
          .then(response => response.json())
          .then(data => setMovies(data))
          .catch(error => console.error("Error loading movies:", error));
      
        // Load similarity matrix
        fetch("/similarity.json")
          .then(response => response.json())
          .then(data => setSimilarity(data))
          .catch(error => console.error("Error loading similarity matrix:", error));
      }, []);


      const recommendMovies = async(movieTitle) => {
        if (!movies.length || !similarity.length) {
          console.error("Movies or similarity data not loaded yet!");
          return [];
        }
      
        const movieIndex = movies.findIndex(movie => movie.title.toLowerCase() === movieTitle.toLowerCase());
      
        if (movieIndex === -1) {
          console.error("Movie not found:", movieTitle);
          return [];
        }
      
        const distances = similarity[movieIndex]
          .map((score, index) => ({ index, score }))
          .sort((a, b) => b.score - a.score) 
          .slice(1, 15); 
          

          const recommendedMovies = await Promise.all(
            distances.map(async (d) => {
              const poster = await fetchMoviePoster(movies[d.index].title);
              return { title: movies[d.index].title, poster };
            })
          );
      
          return recommendedMovies;
      };
      
      
      const [filteredMovies, setFilteredMovies] = useState([]);

      const handleRecommend = async () => {
        if (!keyword.trim()) {
          setFilteredMovies([]);
          return;
        }
      
        // Get recommendations
        const recommendations = await recommendMovies(keyword);
      
        // Find the searched movie in the list
        const searchedMovie = movies.find(movie => movie.title.toLowerCase() === keyword.toLowerCase());
      
        if (searchedMovie) {
          // Fetch poster for searched movie
          const searchedMoviePoster = await fetchMoviePoster(searchedMovie.title);
          
          // Add the searched movie to the beginning of the results
          setFilteredMovies([{ title: searchedMovie.title, poster: searchedMoviePoster }, ...recommendations]);
        } else {
          setFilteredMovies(recommendations);
        }
      
        navigate(`/recommendation?keyword=${keyword}`);
      };
      
      
      
      const fetchMoviePoster = async (movieTitle) => {
        const apiKey = "b35fce1cee2855a635a6c3371b0e6cba"; // Replace with your API key
        const response = await fetch(
          `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(movieTitle)}`
        );
        const data = await response.json();
        return data.results.length > 0 ? `https://image.tmdb.org/t/p/w500${data.results[0].poster_path}` : null;
      };
    
    
    // };
    return (
      // <div id="recommendation">
      //   <div>
      //     <h2 style={{textAlign:"center", marginTop:"20px"}}>Find Your Perfect Movie</h2>
      //   </div>
      //   <div>
      //     <input
      //     type="text"
      //     placeholder="Type a movie keyword..."
      //     value={keyword}
      //     onChange={(e) => setKeyword(e.target.value)}
      //     className="recommend-input"
      //     />
      //     <button onClick={()=>handleRecommend(keyword)} style={{marginBottom:"30px"}} className="search-button">Recommend</button>
      //   </div>
      
      //   <div>
      //     {filteredMovies.length > 0 ? (
      //       filteredMovies.map((movie) => (
      //         <div key={movie.movieId} className='last-work' >
      //           <div className="recom-img">
      //             <img onClick={()=>{navigate(`/recommendation/${encodeURIComponent(movie.movieTitle)}`)}} src={movie.imageLink} alt={movie.movieTitle} />
      //           </div>
      //           <div className="recom-details">
      //           <a style={{textDecoration:"none", cursor:"pointer"}} onClick={()=>{navigate(`/recommendation/${encodeURIComponent(movie.movieTitle)}`)}}><h3 style={{color:"black" }}><strong>{movie.movieTitle}</strong> </h3></a>
      //             <p style={{color:"black"}}> {movie.genres || 'N/A'}</p>
      //             <p className="recom-overview" style={{color:"black",marginTop:"20px",fontSize:"1rem"}}> {movie.overview || 'N/A'}</p>
      //           </div>
      //         </div>
      //       ))
      //     ) : (
      //       <div className="no-recom" style={{minHeight:"510px"}}>
      //         <p>No recommendations found</p>
      //       </div>
            
      //     )}
      //   </div>
    // </div>

<div className="page-containerrr">
  {/* Navigation Bar (Assuming You Have One) */}


  {/* Search Bar & Button - Centered */}
  <div className="search-containerrr">
    <input
      type="text"
      placeholder="Type a movie name..."
      value={keyword}
      onChange={(e) => setKeyword(e.target.value)}
      className="recommend-inputtt"
    />
    <button onClick={handleRecommend} className="search-buttonnn">
      Recommend
    </button>
  </div>

  {/* Recommended Movies List */}
  <div className="movie-containerrr">
    {filteredMovies.map((movie, index) => (
      <div key={index} className="movie-carddd">
        <img src={movie.poster} alt={movie.title} className="movie-posterrr" />
        <p>{movie.title}</p>
      </div>
    ))}
  </div>
</div>




  );
};

export default Recommendation;