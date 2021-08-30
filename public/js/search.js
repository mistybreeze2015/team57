//init release year slider
$("#release_year").slider({});

//update release year text
$("#release_year").on("slide", function(slideEvt) {
	$("#release_year_text").text(slideEvt.value);
});

//bind search button
const search = document.querySelector("#search_button");
search.addEventListener("click", process_search);

//process search parameters
function process_search(e){
	const search_query = document.querySelector("#search_bar").value;

	let genres = [];
	const get_action = document.querySelector("#action_check").checked;
	if(get_action){
		genres.push("Action");
	}

	const get_adventure = document.querySelector("#adventure_check").checked;
	if(get_adventure){
		genres.push("Adventure");
	}

	const get_comedy = document.querySelector("#comedy_check").checked;
	if(get_comedy){
		genres.push("Comedy");
	}

	const get_crime = document.querySelector("#crime_check").checked;
	if(get_crime){
		genres.push("Crime");
	}

	const get_drama = document.querySelector("#drama_check").checked;
	if(get_drama){
		genres.push("Drama");
	}

	const release_year_range = document.querySelector("#release_year_text").innerText;

	let types = [];
	const get_film = document.querySelector("#film_check").checked;
	if(get_film){
		types.push("Film");
	}

	const get_television = document.querySelector("#television_check").checked;
	if(get_television){
		types.push("Television");
	}

	let params = {}
	params.query = search_query;
	params.genres = genres;
	params.date_range = [];
	params.date_range.push("Jan 1, " + release_year_range.split(",")[0]);
	params.date_range.push("Dec 31, " + release_year_range.split(",")[1]);
	params.types = types;
	if(is_sort_rating){
		params.sort = "Rating";
	}else{
		sort = "Users";
	}

	console.log(params);

	//database query
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			films = JSON.parse(this.responseText);

			//update search results
			const movies_div = document.querySelector('#movies');

			// remove all previous search results
			while(movies_div.firstChild) {
				movies_div.removeChild(movies_div.firstChild);
			}

			films.forEach((film) => {
				console.log(films);
				movie = new Movie(film);
				movies_div.appendChild(create_movie_banner(movie));
			});
		}
	};
	xhttp.open("POST", "/film_query", true);
	xhttp.setRequestHeader("Content-Type", "application/json");
	xhttp.send(JSON.stringify(params));
}

//bind sorts
const sort_rating = document.querySelector("#sort_rating");
sort_rating.addEventListener("click", process_sort_rating);

const sort_popularity = document.querySelector("#sort_popularity");
sort_popularity.addEventListener("click", process_sort_popularity);

//toggle sort
let is_sort_rating = true;

function process_sort_popularity(e){
	is_sort_rating = false;

	if(sort_rating.classList.contains("sort_active")){
		sort_rating.classList.remove("sort_active");
	}
	sort_popularity.classList.add("sort_active");
}

function process_sort_rating(e){
	is_sort_rating = true;

	if(sort_popularity.classList.contains("sort_active")){
		sort_popularity.classList.remove("sort_active");
	}
	sort_rating.classList.add("sort_active");
}
