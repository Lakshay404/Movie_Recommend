// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./genre.css";

const Genre = () => {
  const api_url =
    "https://api.themoviedb.org/3/genre/movie/list?api_key=e6a8a833176f610ddab69b3aec7b47c7";
  const [genres, setGenres] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState(() => {
    const savedGenres = localStorage.getItem("selectedGenres");
    return savedGenres ? JSON.parse(savedGenres) : [];
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetch(api_url)
      .then((response) => response.json())
      .then((json) => setGenres(json.genres));
  }, []);

  const handleGenreChange = (genre) => {
    if (selectedGenres.includes(genre.id)) {
      const updatedGenres = selectedGenres.filter((g) => g !== genre.id);
      setSelectedGenres(updatedGenres);
      localStorage.setItem("selectedGenres", JSON.stringify(updatedGenres));
    } else {
      const updatedGenres = [...selectedGenres, genre.id];
      setSelectedGenres(updatedGenres);
      localStorage.setItem("selectedGenres", JSON.stringify(updatedGenres));
    }
  };

  const handleSubmit = () => {
    if (selectedGenres.length === 1) {
      alert("Please select at least 2 genres.");
      return;
    } else {
      navigate("/", { state: { selectedGenres } });
    }
  };

  const handleReset = () => {
    setSelectedGenres([]);
    localStorage.removeItem("selectedGenres");
  };

  return (
    <div className="genre">
      <h2>Select your favorite Genres</h2>
      <div className="containerr text-center">
        <div className="row row-cols-2 row-cols-lg-5 g-2 g-lg-3">
          {genres.map((genre) => (
            <div className="col" key={genre.id}>
              <div className="p-3">
                <div
                  className={`button ${
                    selectedGenres.includes(genre.id) ? "selected" : ""
                  }`}
                  onClick={() => handleGenreChange(genre)}
                >
                  {genre.name}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="d-grid gap-2 col-6 mx-auto p-5">
        <button
          className="btn btn-primary"
          type="button"
          onClick={handleSubmit}
        >
          Filter
        </button>
        <button
          className="btn btn-secondary"
          type="button"
          onClick={handleReset}
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default Genre;