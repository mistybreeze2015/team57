//bind search
const search = document.querySelector("#search_button");
search.addEventListener("click", process_search);

function process_search(e){
    const search_query = document.querySelector("#search_bar").value;
    console.log("search query: " + search_query);

    //do database query here
    //TODO: handle img
    var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			//update user info
            (function(response){
                const username = document.querySelectorAll("#user_info p span")[0];
                const join_date = document.querySelectorAll("#user_info p span")[1];
                const banned = document.querySelectorAll("#user_info p span")[2];

                username.innerText = response.username;
                let date = new Date(response.joinDate);
                join_date.innerText = date.toDateString();
                banned.innerText = response.banned;
            })(JSON.parse(this.responseText));
		}
	};
    xhttp.open("GET", "/user_by_username/" + search_query, true);
    xhttp.send();
}

//bind ban
const ban = document.querySelector("#ban");
ban.addEventListener("click", process_ban);

function process_ban(e){
    const search_query = document.querySelector("#search_bar").value;

    //ban user here in database
    console.log("banning... " + search_query);

    var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			//update user info
            (function(response){
                const username = document.querySelectorAll("#user_info p span")[0];
                const join_date = document.querySelectorAll("#user_info p span")[1];
                const banned = document.querySelectorAll("#user_info p span")[2];

                username.innerText = response.username;
                let date = new Date(response.joinDate);
                join_date.innerText = date.toDateString();
                banned.innerText = response.banned;
            })(JSON.parse(this.responseText));
		}
	};
    xhttp.open("PATCH", "/ban_user/" + search_query, true);
    xhttp.send();
}

//bind add
const add = document.querySelector("#add");
add.addEventListener("click", process_add);

function process_add(e){
    let show = {};
    show.name = document.querySelector("#name").value;
    show.description = document.querySelector("#description").value;
    show.genre = JSON.parse(document.querySelector("#genre").value);
    show.director = JSON.parse(document.querySelector("#director").value);
    show.writer = JSON.parse(document.querySelector("#writer").value);
    show.date = document.querySelector("#release_date").value;
    show.runtime = document.querySelector("#runtime").value;
    show.studio = document.querySelector("#studio").value;
    if(document.querySelector("#film").checked){
        show.type = "Film";
    }else{
        show.type = "Television";
    }

    //database insert
    var formData = new FormData();
    formData.append("file", document.getElementById("file").files[0]);

    var xhttp2 = new XMLHttpRequest();
	xhttp2.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    console.log(this.responseText);
                }
            };
            xhttp.open("POST", "/upload/" + JSON.parse(this.responseText)._id, true);
            xhttp.send(formData);
		}
	};
    xhttp2.open("POST", "/film", true);
	xhttp2.setRequestHeader("Content-Type", "application/json");
    xhttp2.send(JSON.stringify(show));
}
