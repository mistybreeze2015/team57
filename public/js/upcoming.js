
const movies_div = document.querySelector('#movies');

do_database_query(populate_banners);


function populate_banners(movies) {

  // Sort all movies by date of release
  let upcoming_movies = [];

  movies.forEach(function(movie) {
    movie_date = new Date(movie.release_date);
    now = new Date();
    if(movie_date > now) {
      upcoming_movies.push(movie);
    }
  });

  upcoming_movies.sort(function(a, b){
    let date_a = new Date(a.release_date);
    let date_b = new Date(b.release_date);
    return date_a - date_b;
  });

  upcoming_movies.forEach(function(movie) {
    movies_div.appendChild(create_movie_banner(movie));
  });
}
