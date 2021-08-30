'use strict';
const log = console.log;

const express = require('express');
const bodyParser = require('body-parser');
const { ObjectID } = require('mongodb');

// Mongoose
const { mongoose } = require('./db/mongoose');
const { Film } = require('./models/film');

// Express
const port = process.env.PORT || 3000;
const app = express();
app.use(bodyParser.json());

app.use(express.static(__dirname + '/public'))

const path = require("path");
const multer = require("multer");
const fs = require("fs");
const uuidv1 = require('uuid/v1');

const handleError = (err, res) => {
  res
    .status(500)
    .contentType("text/plain")
    .end("Oops! Something went wrong!");
};

const upload = multer({
  dest: "/app/temp"
});

// Routes

// Image upload route
app.post(
  "/upload/:id",
  upload.single("file"),
  (req, res) => {
		const id = req.params.id;
		const img_path = "/uploads/" + uuidv1() + ".png";

    const tempPath = req.file.path;
		const targetPath = path.join(__dirname, "./public" + img_path);

		console.log(img_path);
		Film.findOneAndUpdate({"_id": id}, {$set: {img_path: img_path}}, {new: true}, (err, doc) => {
			if (err) {
					console.log("");
			}
	});

    if (path.extname(req.file.originalname).toLowerCase() === ".png") {
      fs.rename(tempPath, targetPath, err => {
        if (err) return handleError(err, res);

        res
          .status(200)
          .contentType("text/plain")
          .end("File uploaded!");
      });
    } else {
      fs.unlink(tempPath, err => {
        if (err) return handleError(err, res);

        res
          .status(403)
          .contentType("text/plain")
          .end("Only .png files are allowed!");
      });
    }
  }
);

// Add a film
/* Request body:
{
	name: String,
    description: String,
    genre: [String],
    director: [String],
    writer: [String],
    date: Date,
    runtime: Number,
    studio: String,
    type: String,
}
*/
app.post('/film', (req, res) => {
	const film = new Film({
		name: req.body.name,
		description: req.body.description,
		genre: req.body.genre,
		director: req.body.director,
		writer: req.body.writer,
		date: new Date(req.body.date),
		runtime: req.body.runtime,
		studio: req.body.studio,
		type: req.body.type,
		img_path: "",
		comment: []  //Note: Added comment for individual movie page - Gj
	});

	film.save().then((film) => {
		res.send(film);
	}, (error) => {
		res.status(400).send(error);
	});
})

// Get all films
app.get('/film', (req, res) => {
	Film.find().then((films) => {
		res.send(films);
	}, (error) => {
		res.status(400).send(error);
	})
})

// Get a film by id
app.get('/film/:id', (req, res) => {
	let id = req.params.id;

	Film.findById(id).then((film) => {
		res.send(film);
	}, (error) => {
		res.status(400).send(error);
	})
})

// Note: using post instead of get because many libraries do not allow body with get
// Query films
/* Request body:
{
	query: String,
	genres: [String],
	date_range: [Date],
	types: [String],
	sort: String
}
*/
app.post('/film_query', (req, res) => {
	const avg = (arr) => {
		let sum, avg = 0;
		sum = arr.reduce(function(a, b) { return a + b; });
		avg = sum / arr.length;
		return avg;
	}

	Film.find({description: {$regex: req.body.query},
		genre: {$all: req.body.genres},
		date: {$gte: new Date(req.body.date_range[0]), $lte: new Date(req.body.date_range[1])},
		type: {$in: req.body.types}
	}).then((films) => {
		if(req.body.sort == "Rating"){
			films.sort((a, b) => {
				return avg(b.score) - avg(a.score);
			});
		}else if(req.body.sort == "Users"){
			films.sort((a, b) => {
				return b.users - a.users;
			});
		}
		res.send(films);
	}).catch((error) => {
		res.status(500).send();
	})
})

//Login starts here
const session = require('express-session')
//const hbs = require('hbs')
// parse incoming parameters to req.body
// Import the models
const { User } = require('./models/user')
app.use(bodyParser.urlencoded({ extended:true }))

// set the view library
app.set('view engine', 'hbs')

// static js directory
app.use("/js", express.static(__dirname + '/public/js'))

// Add express sesssion middleware
app.use(session({
	secret: 'oursecret',
	resave: false,
	saveUninitialized: false,
	cookie: {
		expires: 600000,
		httpOnly: true
	}
}))
//Alternative Way for session
//const sessionChecker = (req, res, next) => {
//	if (req.session.user) {
//		if (req.session.user=="admin"){res.redirect('admin')}
//		else {res.redirect('profile')}
//	} else {
//		next();
//	}
//}
// route for root; redirect to login
//app.get('/', sessionChecker, (req, res) => {
//	res.redirect('login')
//})
// route for login
//app.route('/login')
//	.get(sessionChecker, (req, res) => {
//		res.sendFile(__dirname + '/public/login.html')
//	})
app.get('/login',(req,res)=>{
	if (req.session.user){
		if (req.session.username == "admin"){
		res.send("<body bgColor = 'cornsilk'><center><h1><br>Client Notice</h1><br><br><br><h2>Welcome back, Dear Administrator:</h2><h1>"+req.session.username+"<h2>You have already logged in.<br><br><a href='/admin'>Head to your Admin page?</a></h2></center></body>")
	   }else{
		res.send("<body bgColor = 'cornsilk'><center><h1><br>Client Notice</h1><br><br><br><h2>Welcome back, Dear User:</h2><h1>"+req.session.username+"<h2>You have already logged in.<br><br><a href='/profile'>Head to your Profile page?</a></h2></center></body>")
	}}
	else{res.sendFile(__dirname + '/public/login.html')}
	})


app.get('/profile', (req, res) => {
// check if we have active session cookie
	if (req.session.user) {
		res.sendFile(__dirname + '/public/profile.html')
	} else {
		res.redirect('/login')
	}
})

// User login and logout routes

app.post('/login', (req, res) => {
	const username = req.body.username
	const password = req.body.password
	User.findByUsernamePassword(username, password).then((user) => {
		if(!user || user.banned == true) {
			//res.redirect('/login')
			res.send("<body bgColor = 'cornsilk'><center><h1><br>Client Notice</h1><br><br><br><h2>Login Failed. Please try again.<br><br><a href='/login'>Head back to Login?</a><</h2><h2><a href='/register'>Need an account? Click here to Register.</a></h2></center></body>")
		} else {
			// Add the user to the session cookie that we will
			// send to the client
			req.session.user = user._id;
			req.session.username = user.username
			if (user.username == "admin")
			{
			res.redirect('/admin')}
			else
			{
			res.redirect('/profile')}
		}
	}).catch((error) => {
		//res.status(400).redirect('/login')
		res.status(400).send("<body bgColor = 'cornsilk'><center><h1><br>Login Error</h1><br><br><h3>Error Message: "+error+"</h3><br><h2>Login Failed. Please try again.<br><br><a href='/login'>Head back to Login?</a></h2><h2><a href='/register'>Need an account? Click here to Register.</a></center></body>");
	})
})

app.get('/logout', (req, res) => {
	req.session.destroy((error) => {
		if (error) {
			res.status(500).send(error)
		} else {
			res.redirect('/')
		}
	})
})

// Middleware for authentication for resources
const authenticate = (req, res, next) => {
	if (req.session.user) {
		User.findById(req.session.user).then((user) => {
			if (!user) {
				return Promise.reject()
			} else {
				req.user = user
				next()
			}
		}).catch((error) => {
			res.redirect('/login')
		})
	} else {
		res.redirect('/login')
	}
}

// Authenticate admin
const authenticate_admin = (req, res, next) => {
	if (req.session.user) {
		User.findById(req.session.user).then((user) => {
			if (!user || user.username != "admin") {
				return Promise.reject()
			} else {
				req.user = user
				next()
			}
		}).catch((error) => {
			res.redirect('/login')
		})
	} else {
		res.redirect('/login')
	}
}

//Register
 app.get('/register', (req, res) => {
 res.sendFile(__dirname + '/public/register.html')})
 app.post('/register', (req, res) => {
	 var now = new Date();
	 const user = new User({
		 username: req.body.username,
		 password: req.body.password,
		 joinDate: now,
		 banned: false
	 });
	 user.save().then((user) => {
		 res.send("<body bgColor = 'cornsilk'><center><h1><br>Client Notice</h1><br><br><h2>Congrats,</h2><br><h2>User:</h2><h3>"+user+"</h3><br><h2>registered successfully!<br><br><a href='/login'>Head to Login?</a></h2></center></body>");
	 }, (error) => {
		 res.status(400).send("<body bgColor = 'cornsilk'><center><h1><br>Registration Error</h1><br><br><h3>Error Message: "+error+"</h3><br><h2>Fail to register.<br><br><a href='/register'>Head back to Register?</a></h2></center></body>");
	 });
 })
//Login end here
//Movie page starts here
app.use(bodyParser.urlencoded({extended: true}))
app.set('view engine', 'ejs');
app.get('/movie/:id', (req, res) => {
	const id = req.params.id
	//console.log(id)
	req.session.movieId = id
	//console.log(req.session.movieId)
	if (!ObjectID.isValid(id)) {
		return res.status(404).send()
	}
	Film.findById(id).then((movie) => {
		if (!movie) {
			res.status(404).send()
		} else {
		res.render('movie',{film:movie},(error,moviePage)=>{res.send(moviePage);})
			}
		})
})
app.post('/postComment', (req,res) =>{

	if (ObjectID.isValid(req.session.movieId)){

    let user_id = req.session.user;

    User.findById(user_id).then((user) => {
      // If we found the user, update its reviews
     if(user) {
       user.reviews.forEach(review => {
         if(review.movieID == id.toString()) {
           // If the user has already reviewed this movie, don't do anything
           res.redirect('/movie/'+id.toString());
         }
       })

       let new_review = {
         userID: user_id,
         movieID: movie._id,
         reviewDate: new Date(),
         reviewText: req.body.commentText,
         rating: req.body.rate,
         img_path: movie.img_path
       }

       user.reviews.push(new_review);

       User.updateOne({"_id", user_id}, {$set : {"reviews" : user.reviews}});
     }
   }).catch((error) => {
     res.status(500).send()
   })

	let id = req.session.movieId
	let username = "anonymous";
	if (req.session.username)
	{
	username = req.session.username
	}
	Film.findById(id).then((movie) => {
		if (!movie) {
			res.status(404).send()
		} else {
			let newComment = movie.comment
			//console.log(movie.comment)
			let cId = 0;
			if (movie.comment.length > 0){
			cId = movie.comment[movie.comment.length-1][2] + 1}

			newComment.push([req.body.commentText,username,cId,req.body.rate])

			let newScore = []
			if (movie.score){
			newScore= movie.score}
			newScore.push(parseInt(req.body.rate))

			let newUsers = 0
			if (movie.users){
				newUsers = movie.users}
			newUsers += 1

			Film.findByIdAndUpdate(id,{"comment":newComment},{new: true}).then((movie) => {
			if (!movie) {
				res.status(404).send()}

			Film.findByIdAndUpdate(id,{"score":newScore},{new: true}).then((score) => {
			if (!score) {
				res.status(404).send()}

			Film.findByIdAndUpdate(id,{"users":newUsers},{new: true}).then((users) => {
			if (!users) {
				res.status(404).send()}
	     })

	    })

	   })

		}})
	res.redirect('/movie/'+id.toString());
	}else
	{
		res.redirect('back');
	}
})
app.post('/deleteComment', (req,res) =>{
	if (ObjectID.isValid(req.session.movieId)){
	let id = req.session.movieId
	const username = req.session.username
	Film.findById(id).then((movie) => {
		if (!movie) {
			res.status(404).send()
		} else {
			let toDelete = 0;
			for (let i = 0; i< movie.comment.length; i++){
				if (movie.comment[i][2] == req.body.cId){
				toDelete = i;}
			}
			let newComment = movie.comment
			newComment.splice(toDelete,1);

			Film.findByIdAndUpdate(id,{"comment":newComment},{new: true}).then((movie) => {
			if (!movie) {
			res.status(404).send()}}) }
	})
			res.redirect('/movie/'+id.toString());
	}else
	{
		res.redirect('back');
	}

})
// app.post('/addMovie', (req, res) => {
	 // const movie = new Movie({
		// title: req.body.title,
		// duration: req.body.duration,
		// rating: req.body.rating,
		// genre: req.body.genre,
		// description: req.body.description,
		// img: req.body.img,
		// comment: []
	 // });

	 // movie.save().then((movie) => {
		 // res.send(movie);
	 // }, (error) => {
		 // res.status(400).send(error);
	 // });
 // })
//Movie page ends here

////////////////////////////////////////////////////////////////////////////////
// routes for profile calls

// Get all users
app.get('/user', (req, res) => {
	User.find().then((users) => {
		res.send(users);
	}, (error) => {
		res.status(400).send(error);
	})
})

// Get current user's id
app.get('/current_user_id', (req, res) => {
	if (req.session.user) {
		res.send(req.session.user);
	}
	else {
		res.status(404).send();
	}
});

/// Route for getting information for one user.
app.get('/user/:id', (req, res) => {

	const id = req.params.id // the id is in the req.params object

	// validating the user id
	if (!ObjectID.isValid(id)) {
		return res.status(404).send()
	}

	// findById
	User.findById(id).then((user) => {
		if (!user) {
			res.status(404).send()
		} else {
			res.send(user)
		}
	}).catch((error) => {
		res.status(500).send()
	})
})

// Get user by username
app.get('/user_by_username/:username', (req, res) => {
	const username = req.params.username

	User.findOne({username: username}).then((user) => {
		if (!user) {
			res.status(404).send()
		} else {
			res.send(user)
		}
	}).catch((error) => {
		res.status(500).send()
	})
})

//Ban user
app.patch('/ban_user/:username', (req, res) => {
	const username = req.params.username;

	User.findOneAndUpdate({username: username}, {$set: {banned: true}}, {$new: true}, (err, user) => {
		if (!user) {
			res.status(404).send()
		} else {
			res.send(user)
		}
	}).catch((error) => {
		res.status(500).send()
	})
})

/// Route for adding review to a particular user
/*
Request body expects:
{
	movieName: String,
	reviewDate: Date,
	reviewText: String,
	rating: Number
}
*/
// Get current user's username
app.get('/current_username', (req, res) => {
	if (req.session.username) {
		res.send(req.session.username);
	}
	else {
		res.status(404).send();
	}
});

app.post('/user/:id', (req, res) => {

	const id = req.params.id

	// Create a new review
	const review = {
		movieName: req.body.movieName,
		reviewDate: req.body.reviewDate,
		reviewText: req.body.reviewText,
		rating: req.body.rating
	}

	// validate the user id
	if (!ObjectID.isValid(id)) {
		return res.status(404).send()
	}

	// Update it
	// $new: true gives back the new document
	User.findByIdAndUpdate(id, {$push: {"reviews":review}}, {new: true}).then((user) => {
		if (!user) {
			res.status(404).send()
		} else {
			res.send({ user, review })
		}
	}).catch((error) => {
		res.status(500).send()
	})
})

/// Route for deleting a review
app.delete('/users/:id/:review_id', (req, res) => {

	const id = req.params.id
  const review_id = req.params.review_id

	// validate the user id
	if (!ObjectID.isValid(id)) {
		return res.status(404).send()
	}

	// validate the review_id
	if (!ObjectID.isValid(review_id)) {
		return res.status(404).send()
	}

	// findById
	User.findById(id).then((user) => {
		if (!user) {
			res.status(404).send()
		} else {

            // remove the reservation
            const a = user.reviews.id(review_id)

			if (!a) {
				res.status(400).send() // 400 for bad request
			}
            a.remove()
            user.save().then((result) => {
                // save and send user that was saved and rating that was
                res.send({a, result})
                }).catch((error) => {
					res.status(500).send()
				})
		}
	}).catch((error) => {
		res.status(500).send()
	})

})

app.route('/admin').get(authenticate_admin, (req, res) => {
	//todo: make sure admin and not just any user
	res.sendFile(__dirname + '/views/admin.html');
})

app.listen(port, () => {
	log(`Listening on port ${port}...`)
});
