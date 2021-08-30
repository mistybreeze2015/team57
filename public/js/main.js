
const movies_div = document.querySelector('#movies');

do_database_query(populate_banners);


function populate_banners(movies) {

  // Sort all movies by "Hotness"
  movies.sort((a, b) => {return b.score - a.score});

  movies.forEach(function(movie) {
    movies_div.appendChild(create_movie_banner(movie));
  });
}
