//bind search
const search = document.querySelector("#search_button");
search.addEventListener("click", process_search);

function process_search(e){
    const search_query = document.querySelector("#search_bar").value;
    console.log("search query: " + search_query);

    //do database query here
    //TODO: handle img
    db_response = {
        "name": "Kit",
        "alias": "Kat",
        "profile_page": "https://www.cat.com/en_US.html",
        "last_online_time": "Just now!",
        "last_online_ip": "Localhost"
    };

    //update user info
    //callback
    (function(response){
        const name = document.querySelectorAll("#user_info p span")[0];
        const alias = document.querySelectorAll("#user_info p span")[1];

        const profile_page = document.querySelector("#user_info p span a");

        const last_online_time = document.querySelectorAll("#user_info p span")[3];
        const last_online_ip = document.querySelectorAll("#user_info p span")[4];

        name.innerText = response.name;
        alias.innerText = response.alias;

        profile_page.innerHTML = response.profile_page;
        profile_page.href = response.profile_page;

        last_online_time.innerText = response.last_online_time;
        last_online_ip.innerText = response.last_online_ip;
    })(db_response);
}

//bind ban
const ban = document.querySelector("#ban");
ban.addEventListener("click", process_ban);

function process_ban(e){
    const alias = document.querySelectorAll("#user_info p span")[1];

    //ban user here in database
    console.log("banning... " + alias.innerText);
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
    var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			console.log(this.responseText);
		}
	};
	xhttp.open("POST", "/film", true);
	xhttp.setRequestHeader("Content-Type", "application/json");
	xhttp.send(JSON.stringify(show));
}
