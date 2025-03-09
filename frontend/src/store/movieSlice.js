import { createSlice } from '@reduxjs/toolkit';

const movieSlice = createSlice({
  name: 'movie',
  initialState: {
    movies: [],
    filteredMovies: [],
  },
  reducers: {
    setMovies: (state, action) => {
      state.movies = action.payload;
    },
    setFilteredMovies: (state, action) => {
      state.filteredMovies = action.payload;
    },
  },
});

export const { setMovies, setFilteredMovies } = movieSlice.actions;
export default movieSlice.reducer;