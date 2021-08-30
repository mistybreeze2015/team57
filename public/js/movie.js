//movie page codes starts here

var curr_username = '';

var xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function() {
	if (this.readyState == 4 && this.status == 200) {
		curr_username = this.responseText;
		load_profile();
	}
};

xhttp.open("GET", "/current_username", true);
xhttp.setRequestHeader("Content-Type", "application/json");
xhttp.send();


function load_profile() {
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

  //Fetch data from Film schema
  var curr_movie = new Movie(film);

  curr_movie.comment.forEach((comment) =>
  {
    addPost(comment[0],comment[1],comment[2],comment[3], curr_username);
  })
  //	DOM elements creation
  const title = document.createElement("h1");
  const titleText = document.createTextNode(curr_movie.title);
  title.appendChild(titleText)

  const reviewPanel= document.getElementById("reviewPanel");
  reviewPanel.appendChild(title)

  const rate = document.createElement("h2");
  const rateText = document.createTextNode("Average Rating:  " + curr_movie.rating)
  rate.appendChild(rateText)

  const misc = document.createElement("ul");
  misc.id="misc";

  function buildLi(ulFrame, name, content)
  	{
  	const liFrame = document.createElement("li")
  	const liText = document.createTextNode(name+" : "+content)
  	liFrame.appendChild(liText)
  	ulFrame.appendChild(liFrame)
  	}

  buildLi(misc,"Title",curr_movie.title)
  buildLi(misc,"Duration",curr_movie.duration)
  buildLi(misc,"Rating",curr_movie.rating)
  buildLi(misc,"Genre",curr_movie.genre)

  const pictureDiv = document.createElement("div")
  pictureDiv.id = "picture"

  const pictureImg = document.createElement("img")
  pictureImg.id = "pictureImg"
  pictureImg.src = curr_movie.img
  pictureDiv.appendChild(pictureImg)

  const introPanel = document.createElement("div")
  introPanel.id = "introPanel"
  const intro = document.createElement("div")
  intro.id = "intro"
  const introContent = document.createTextNode(curr_movie.description)

  intro.appendChild(introContent)
  introPanel.appendChild(intro)

  reviewPanel.appendChild(rate)
  reviewPanel.appendChild(misc)
  reviewPanel.appendChild(pictureDiv)
  reviewPanel.appendChild(introPanel)

  //	button event
  const submitBtn = document.getElementById("submitBtn")
  //submitBtn.addEventListener("click",addPost)

  const resetBtn = document.getElementById("resetBtn")
  resetBtn.addEventListener("click",resetTxt)
  function resetTxt() {
  	const myTxt = document.getElementById("textArea")
  	myTxt.value = myTxt.defaultValue
  }

  function addPost(myTxt,username,cId,rate, current_username){
  	const commentText = document.getElementById("textArea")
  	commentText.value = document.getElementById("textArea").innerText

  	const myComment = document.getElementById("commentPanel")

  	//	post component
  	const postPanel = document.createElement("div")
  	postPanel.className="postPanel"

  	const postDiv= document.createElement("div")
  	postDiv.className ="post"

  	// const myTxt = document.getElementById("textArea")

  	const post= document.createElement("div")
  	const postContent = document.createTextNode(myTxt)
  	const postBr = document.createElement("br")
  	const myRate = document.createTextNode("Rating: " + rate + " / 10")
  	post.appendChild(postContent)
  	post.appendChild(postBr)
  	post.appendChild(myRate)
  	postDiv.appendChild(post)

  	const user = document.createTextNode(username)
  	const userBld =document.createElement("span")
  	userBld.appendChild(user)
  	userBld.className="boldFont"

  	const postSrc = document.createElement("div")
  	postSrc.appendChild(document.createTextNode("posted by "))
  	postSrc.appendChild(userBld)
  	postSrc.className="postSrc"

  	//	delete post button creation
  	const btnDiv = document.createElement("div")
  	btnDiv.className ="btnDiv"

  	const theForm = document.createElement("form")
  	theForm.action="/deleteComment"
  	theForm.method="post"
  	theForm.enctyep="application/x-www-form-urlencoded"

  	const hiddenId = document.createElement("input")
  	hiddenId.name = "cId"
  	hiddenId.value = cId
  	hiddenId.type = "hidden"

    // Only this user can delete their comment
  	 if(current_username == username) {
      const deleteBtn = document.createElement("button")
     	const btnValue = document.createTextNode("DELETE")

     	theForm.appendChild(deleteBtn)

     	deleteBtn.appendChild(btnValue)
     	deleteBtn.className="deleteBtn"
     	deleteBtn.type="submit"
     }

  	theForm.appendChild(hiddenId)

  	btnDiv.appendChild(theForm)
  	postPanel.appendChild(postDiv)
  	postPanel.appendChild(postSrc)
  	postPanel.appendChild(btnDiv)

      myComment.appendChild(postPanel)



      //	edit post functionality
  	// const thePostDiv = thePanel.childNodes[0]
  	// const thePost = thePostDiv.childNodes[0]
  	// thePost.addEventListener("dblclick",editThis)
  	// function editThis(){
  		// const editArea = document.createElement("textarea")
  		// const postContent = thePostDiv.childNodes[0]
  		// editArea.className = "editArea"
  		// editArea.value = postContent.textContent
  		// editArea.addEventListener("dblclick",editDone)

  		// thePostDiv.removeChild(thePostDiv.childNodes[0]);
  		// thePostDiv.removeEventListener('dblclick',editThis,false)
  		// thePostDiv.appendChild(editArea)

  		// function editDone(){
  			// const editedPost = document.createElement("div")
  			// const postContent = document.createTextNode(editArea.value)

  			// editedPost.appendChild(postContent)
  			// thePostDiv.removeChild(thePostDiv.childNodes[0]);

  			// editedPost.addEventListener("dblclick",editThis)
  			// thePostDiv.appendChild(editedPost)
  		// }
  	// }
  	//resetTxt()
  }
}
