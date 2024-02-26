<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: Arial;
        }

        #toolbar {
        	display: flex;
        	justify-content: left;
        	align-items: center;
            background-color: black;
            padding: 20px;
            text-align: left;
        }

        #section1 {
            height: 40vh;
            width: 100%;
            position: relative;
            background-image: url("people.png");
            display: flex;
            flex-direction: column;
            justify-content: flex-end;
        }

        #bottomLeftButton {
            position: absolute;
            bottom: 0;
            margin-left: 20px;
            left: 0;
            margin-bottom: 10px;
            display: flex;
            flex-direction: column;
            align-items: flex-start;
        }

        #submitButton {
            margin-bottom: 10px;
        }

        #inputContainer {
            display: flex;
            flex-direction: wrap;
            align-items: flex-start;
        }

        #inputContainer input {
            margin-right: 20px;
            margin-bottom: 10px;
        }

        a{
			text-decoration: none;
			color: white;
        }

        #section2 {
            height: 50vh;
            width: 100%;
            display: flex;
        }

        #imageContainer {
            width: 50%;
            overflow: hidden;
        }

        #imageContainer img {
            width: 100%;
            height: auto;
            display: block;
        }

        #textContainer {
            width: 50%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
        }

        #section2 p {
            color: red;
            font-weight: bold;
            font-size: 2vw;
            margin: 0; /* Remove default margin */
        }

        #section2 .workgroup-description {
            font-weight: bold;
            font-size: 1vw;
            margin: 0; /* Remove default margin */
        }

        .buttonBox{
        	background-color: red;
        	color: white;
        	text-align: center;
        	font-weight: bold;
        	margin-bottom: 20px;
        	margin-top: 20px;
        	padding: 5px;
        }

        #button9 {
		    position: absolute;
		    right: 0;
		    background-color: red;
		    color: white;
		    padding: 5px;
            font-weight: bold;
		    margin-top: 0;
		    border-radius: 50px;
		}

        #section3 {
            background-color: red;
            height: 100vh;
            width: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
        }

        #spotlightTitle {
            margin-top: 20px;
            margin-bottom: 40px;
            color: white;
            width: 100%;
            font-size: 40px;
            font-weight: bold;
            text-align: center;
        }

        #imageRow {
            display: flex;
            justify-content: space-around;
            width: 100%;
        }

        #imageRow img {
            width: 30%; /* Adjust as needed */
            height: auto;
            display: block;
        }

        a {
            font-weight: bold;
            margin-right: 20px;
        }
    </style>
</head>
<body>

    <div id="toolbar">
        <a href="#link1">Home</a>
        <a href="#link2">About Us</a>
        <a href="#link3">Research Library</a>
        <a href="#link1">News and Events</a>
        <a href="#link2">Partners</a>
        <a href="#link3">Projects</a>
        <a href="#link1">Blog</a>
        <a href="#link2">Contact Us</a>
        <a href="#link9" id="button9">Sign In</a>
    </div>

    <div id="section1">
        <div id="bottomLeftButton">
            <div class="buttonBox">View Projects</div>
            <div style="width: 100%;" id="inputContainer">
                <input type="text">
                <input type="text">
                <input type="text">
            </div>
        </div>
    </div>

    <div id="section2">
        <div id="imageContainer">
            <img src="science.png" alt="Science Image">
        </div>
        <div id="textContainer">
            <p style="color: red; margin-top: 40px;">The Technology Health and Equity Workgroup</p>
            <p class="workgroup-description" style="color: black; padding: 20px;">The Technology Health and Equity (THE) Workgroup is a research, education, and advocacy group led by Dr. Delores C.S. James. THE Workgroup conducts research on how social media and current and emerging technologies can be used to promote health, improve health outcomes, and increase health equity</p>
            <div class="buttonBox" style="margin-top: 0; margin-bottom: 20px;">Learn More</div>
        </div>
    </div>

    <div id="section3">
        <div id="spotlightTitle" style="margin-top: 20px; margin-bottom: 40px; color: white;">T.H.E. Spotlight</div>
        <div id="imageRow">
            <img src="science.png" alt="Image 1">
            <img src="science.png" alt="Image 1">
            <img src="science.png" alt="Image 1">
        </div>
    </div>
    <div id="toolbar" style="justify-content: center; color: white;">
		<span style="margin-right: 20px; font-weight: bold;">Connect With Us</span>
    	<span style="margin-right: 20px; font-weight: bold;">Logo</span>
    	<span style="margin-right: 20px; font-weight: bold;">Logo</span>
    	<span style="margin-right: 20px; font-weight: bold;">Logo</span>
    </div>
</body>
</html>
