'use strict';
let loginUser = ""
const loginBtn = document.getElementById("loginBtn")
//loginBtn.addEventListener("click",validate)

function validate(){
	const toValidateName = document.querySelector('#username').value;
	const toValidatePassword = document.querySelector('#password').value;
	if ((toValidateName==="admin" && toValidatePassword=="admin")||(toValidateName==="user" && toValidatePassword=="user")){
		loginUser = toValidateName
	window.alert("Login Successful.")
	setTimeout(welcome,500)
	}
	else
	{window.alert("Login Failed. Please try again.")}}

function welcome(){
	const toHide = document.querySelector('#loginPanel')
	toHide.style.visibility = "hidden"

	const wcomeDiv = document.createElement("div")
	wcomeDiv.id = "wcomeDiv"

	const emphzSpan = document.createElement("span")
	emphzSpan.id = "emphasize"
	emphzSpan.appendChild(document.createTextNode(loginUser))

	const wcomeText0 = document.createTextNode("Dear  ")
	const wcomeText01 = document.createTextNode("  ,")
	const wcomeText1 = document.createTextNode("Welcome to 309Movies Movie Review Website!")
	const wcomeText2 = document.createTextNode("The website will be redirected to your profile in 8 seconds. ")
	const wcomeText3 = document.createTextNode("If the browser doesn't respond, ")
	const wcomeText4 = document.createTextNode("please click the following link:")

	wcomeDiv.appendChild(wcomeText0)
	wcomeDiv.appendChild(emphzSpan)
	wcomeDiv.appendChild(wcomeText01)
	wcomeDiv.appendChild(document.createElement("br"))
	wcomeDiv.appendChild(wcomeText1)
	wcomeDiv.appendChild(document.createElement("br"))
	wcomeDiv.appendChild(document.createElement("br"))
	wcomeDiv.appendChild(wcomeText2)
	wcomeDiv.appendChild(document.createElement("br"))
	wcomeDiv.appendChild(document.createElement("br"))
	wcomeDiv.appendChild(wcomeText3)
	wcomeDiv.appendChild(document.createElement("br"))
	wcomeDiv.appendChild(wcomeText4)

	const linkText = document.createTextNode("Go to your page......")
	const profileLink = document.createElement("a");
	if (loginUser==="admin"){
	profileLink.href="admin.html"}
	else if(loginUser==="user"){
	profileLink.href="profile.html"
	}
	wcomeDiv.appendChild(document.createElement("br"))
	wcomeDiv.appendChild(document.createElement("br"))
	profileLink.appendChild(linkText)
	wcomeDiv.appendChild(profileLink)
	document.querySelector('#loginMsg').appendChild(wcomeDiv)
	document.querySelector('#loginMsg').style.visibility="visible"
	if (loginUser==="admin"){
	setTimeout(function(){location.href="admin.html"} , 8000)}
	else if(loginUser==="user"){
	setTimeout(function(){location.href="profile.html"} , 8000)
	}


}
