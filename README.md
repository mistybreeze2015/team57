# team57
Movie Project, made by team57, in CSC309

Hi! Welcome to 309Movies. This website presents relevant information about movies!

There is no need to login to use our website, but logging in provides more functionality.

Below is an outline on how to use our website, and some descriptions:

Header:
Every page, except for the admin page, contains a header at the top, allowing navigation
through our website. Clicking on the logo or the 'Home' tab takes you to Home page.
Clicking on the 'Newest' tab takes you to the Newest page, clicking on the 'Upcoming'
tab takes you to the Upcoming page, and clicking on the 'Search' tab takes you to the
Search page. Lastly, clicking on the 'login' at the top right takes you to the login
page where you can log in as a user or an admin.
In phase 2, we will update the header such that once a user has logged in, the login
anchor will be a link to the user's profile page instead of the login page.

Index.html:
This is the Home page. It contains a list of the most popular movies. Currently, the list
is simply hardcoded in - we will add sorting functionality in phase 2. Clicking on a movie
banner takes you to the corresponding movie's 'movie.html' page.

Newest.html:
Similar to Index.html in look and functionality. However, the movies displayed are the
newest available movies, which is to be implemented in phase 2. Clicking on a movie banner
takes you to the corresponding movie's 'movie.html' page.

Upcoming.html:
Similar to Index.html and Newest.html, but instead the movies displayed are movies that
are not yet released, but are soon to come. Clicking on a movie banner takes you to the
corresponding movie's 'movie.html' page.

Search.html:
Allows users to search for particular movies by keyword, or by groupings. Select any of
the available filters, enter a keyword if necessary, and click the search icon. The page
gets populated by movie banners corresponding to the search query! For now, the movies
displayed are hardcoded. No movie banners are displayed until the search button is clicked.

Movie.html:
This page displays information about a particular movie. The movie id is passed as a value
in the url. Various data from the movie object is dynamically placed into the webpage.
Below the movie data are user comments and reviews. At the very bottom of the page is a
comment box allowing the current user to leave a comment or a review. Enter text and click
submit (or reset if you change your mind), and watch your comment appear with the comments
on top. To delete the comment, simply click the delete button next your comment. If you wish
to edit the comment, you can double click your comment, and voila! Enter your edited comment,
and double click again to confirm your edit.

Login.html:
This page allows you to login into our website. You can enter user/user to access your profile
as a user, or you may enter admin/admin to access admin functionality. If the login fails, an
alert lets you know that it failed and that you should try again. If a login is successful, an
alert displays that the login was successful - click OK to continue. After clicking OK, a
placeholder page appears that welcomes you to the website. After 8 seconds, you are redirected
to your profile if you are a user, or to the admin page if you're the admin.

Profile.html:
The profile page displays information about you, as the user. You have a profile picture and a
username (which will be editable in phase 2), and a nice banner showing how long you've been a
member. Next, you are shown which movies you have recently rated on the website, your most
recent reviews (which you can delete by clicking on the 'Delete Review' button), and your very
own 'To-Watch List' (will be made editable in phase 2)!

Admin.html:
This is the admin page, where you can ban users and add new movie data into the website data.
On the top left, you can search for users by their usernames. Clicking on the search icon
populates the user data fields seen in the middle. The 'Ban' button removes this user from the
website (to be implemented in phase 2). On the right side, you can enter movie data and click
the 'add' button to add the movie into the website data (to be implemented in phase 2). And
lastly, you get a cute picture of a cat - admin privileges! 

Contributors:
![Screenshot](https://github.com/mistybreezy/team57/blob/main/contributors.png?raw=true)
