
var user_id = '';

var xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function() {
	if (this.readyState == 4 && this.status == 200) {
		user_id = this.responseText;
		load_profile();
	}
};

xhttp.open("GET", "/current_user_id", true);
xhttp.setRequestHeader("Content-Type", "application/json");
xhttp.send();


// deletes the selected review
function deleteReview(e, review){
	e.preventDefault();

	if (e.target.classList.contains('deleteReviewButton')) {
		const reviewToRemove = e.target.parentElement
		document.querySelector('.profile_reviews_list').removeChild(reviewToRemove)
	}

	// Database query to delete this review
	var xhttp = new XMLHttpRequest();
	xhttp.open("DELETE", "/users/" + user_id + "/" + review._id, true);
	xhttp.setRequestHeader("Content-Type", "application/json");
	xhttp.send();
}

function create_profile_info(user) {
	const profile_info = document.createElement('div');
	profile_info.setAttribute('class', 'profile_information');

	const username = document.createElement('h2');
	const username_text = document.createTextNode(user.username);
	username.appendChild(username_text);
	profile_info.appendChild(username);

	const break_elem = document.createElement('br');
	profile_info.appendChild(break_elem);

	const date_joined = document.createElement('p');
	date = new Date(user.joinDate);
	const date_joined_text = document.createTextNode("Member since " + date.toDateString());
	date_joined.appendChild(date_joined_text);
	profile_info.appendChild(date_joined);

	return profile_info;
}

function create_recently_rated(review) {
	const movie_link = document.createElement('a');
	movie_link.setAttribute('href', 'movie.html?id=' + review.movieID);

	const movie_img = document.createElement('img');
	movie_img.setAttribute('src', review.img_path);
	movie_link.appendChild(movie_img);

	return movie_link;
}

function create_review(review) {
	const review_div = document.createElement('div');
	review_div.setAttribute('class', 'movie_review');

	const movie_link = document.createElement('a');
	movie_link.setAttribute('href', 'movie.html?id=' + review.movieID);

	const movie_img = document.createElement('img');
	movie_img.setAttribute('src', review.img_path);

	movie_link.appendChild(movie_img);
	review_div.appendChild(movie_link);

	const break_elem = document.createElement('br');
	review_div.appendChild(break_elem);

	const strong = document.createElement('strong');
	const rating = document.createTextNode(review.rating);
	strong.appendChild(rating);
	review_div.appendChild(strong);

	const descr_paragraph = document.createElement('p');
	const description = document.createTextNode(review.description);
	descr_paragraph.appendChild(description);
	review_div.appendChild(descr_paragraph);

	const delete_button = document.createElement('button');
	delete_button.setAttribute('class', 'deleteReviewButton');
	const button_text = document.createTextNode('Delete Review');
	delete_button.appendChild(button_text);

	delete_button.addEventListener('click', function() {
		deleteReview(e, review);
	});

	review_div.appendChild(delete_button);

	return review_div;
}

function load_profile() {
	const profile_info = document.querySelector('#profile_banner');

	const recently_rated_div = document.querySelector("#recently_rated");
	const recent_reviews_div = document.querySelector("#recent_reviews");

	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			user = JSON.parse(this.responseText);

			profile_info.appendChild(create_profile_info(user));

			user.reviews.forEach((review) => {
				recently_rated_div.appendChild(create_recently_rated(review));
				recent_reviews_div.appendChild(create_review(review));
			});
		}
	};

	xhttp.open("GET", "/user/" + user_id, true);
	xhttp.setRequestHeader("Content-Type", "application/json");
	xhttp.send();
}
