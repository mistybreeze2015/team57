
// Movie initializer
function Movie(film) {
  this.movie_id = film._id;
  this.img = film.img_path;
  this.title = film.name;
  this.duration = film.runtime;

  let sum = 0;
  film.score.forEach(function(score) {
    sum += score;
  });

  this.rating = (sum/film.score.length).toFixed(2);

  let genres = "";
  film.genre.forEach(function(genre) {
    genres += genre + " ";
  });

  this.genre = genres;
  this.description = film.description;
  this.release_date = film.date;
  this.comment = film.comment;
}


function create_movie_banner(movie) {
  const movie_banner = document.createElement('div');
  movie_banner.setAttribute('class', 'movie_banner')

  const movie_banner_img = document.createElement('img');
  movie_banner_img.setAttribute('src', movie.img);
  movie_banner.appendChild(movie_banner_img);

  const p1 = document.createElement('p');
  const text1 = document.createTextNode('Title: ' + movie.title);
  p1.appendChild(text1);
  movie_banner.appendChild(p1);

  const p2 = document.createElement('p');
  const text2 = document.createTextNode('Duration: ' + movie.duration);
  p2.appendChild(text2);
  movie_banner.appendChild(p2);

  const p3 = document.createElement('p');
  const text3 = document.createTextNode('Rating: ' + movie.rating);
  p3.appendChild(text3);
  movie_banner.appendChild(p3);

  const p4 = document.createElement('p');
  const text4 = document.createTextNode('Genre: ' + movie.genre);
  p4.appendChild(text4);
  movie_banner.appendChild(p4);

  const p5 = document.createElement('p');
  const text5 = document.createTextNode('Description: ' + movie.description);
  p5.appendChild(text5);
  movie_banner.appendChild(p5);

  // Open corresponding movie info page when clicked
  movie_banner.addEventListener('click', function(){ open_movie_info(movie.movie_id); });

  return movie_banner;
}

// Load a page with information about the movie
function open_movie_info(movie_id) {
  // In the future, the movie.js script will display the corresponding movie's info.
  // For now, we just display the same movie info for all movies.
  //window.open('movie.html?id=' + movie_id, '_top');
  window.open('movie/' + movie_id, '_top'); //Changed for Individual Movie Page, allying with app.get()
}

// This is where we will fetch data about movies and create movie objects accordingly
// var movie1 = new movie('movie1.jpg', 'Blade Runner 2049', '149 minutes', '3.2/5.0', 'Action, Sci-Fi', 'Something something weird stuff old dude something something.');
// var movie2 = new movie('movie2.jpg', 'Aquaman', '127 minutes', '3.7/5.0', 'Action, Fantasy', 'Just another movie about a really buff guy and his quest for love.')
// var movie3 = new movie('movie3.jpg', 'Baywatch', '113 minutes', '4.1/5.0', 'Action, Comedy, Drama', 'Bigger pecs, bigger beaches.');

//database query
function do_database_query(callback) {
  var movies = [];

  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      films = JSON.parse(this.responseText);

      films.forEach((film) => {
        let movie = new Movie(film);
        movies.push(movie);
      });

      console.log(movies);

      // Do whatever you need with the movies once they have all been fetched
      callback(movies);
    }
  };
  xhttp.open("GET", "/film", true);
  xhttp.setRequestHeader("Content-Type", "application/json");
  xhttp.send();
}
