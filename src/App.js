import React, { useState, useEffect, useCallback } from 'react';

import MoviesList from './components/MoviesList';
import AddMovie from './components/AddMovie';
import './App.css';

function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);



  const fetchMoviesHandler = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
        const response = await fetch('https://react-http-23f7d-default-rtdb.firebaseio.com/movies.json');

        if (!response.ok) {
            throw new Error('Something went wrong!');
        }

        const data = await response.json();
        console.log(data);
        const loadedMovies = [];
        for (const key in data) {
            loadedMovies.push({
                id: key,
                title: data[key].title,
                openingText: data[key].openingText,
                releaseDate: data[key].releaseDate
            });
        }
        setMovies(loadedMovies);
    } catch (error) {
        setError(error.message);
    }
    setIsLoading(false);
}, []);


  useEffect(() => {
    fetchMoviesHandler();
  }, [fetchMoviesHandler]);

  // function addMovieHandler(movie) {
  //   console.log(movie);
  // }

  // function addMovieHandler(movie){
  //   fetch('https://react-http-23f7d-default-rtdb.firebaseio.com/movies.json',{
  //     method: 'POST',
  //     body: JSON.stringify(movie),
  //     headers: {
  //       'Content-Type': 'application/json'
  //     }
  //   })
  // }
  async function addMovieHandler(movie){
    try{
        const response = await fetch('https://react-http-23f7d-default-rtdb.firebaseio.com/movies.json',{
          method: 'POST',
          body: JSON.stringify(movie),
          headers: {
            'Content-Type': 'application/json'
          }
        })
        const data = await response.json();
        console.log(data);
    } catch (error) {
      console.log('Error:', error);
    }
  }

  let content = <p>Found no movies.</p>;

  if (movies.length > 0) {
    content = <MoviesList movies={movies} />;
  }

  if (error) {
    content = <p>{error}</p>;
  }

  if (isLoading) {
    content = <p>Loading...</p>;
  }

  return (
    <React.Fragment>
      <section>
        <AddMovie onAddMovie={addMovieHandler} />
      </section>
      <section>
        <button onClick={fetchMoviesHandler}>Fetch Movies</button>
      </section>
      <section>{content}</section>
    </React.Fragment>
  );
}

export default App;
