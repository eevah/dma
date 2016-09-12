
var moviesArray = []

$(document).ready(function() {
        init();
})


function loadJSON(callback) {   

    var xobj = new XMLHttpRequest()
    xobj.overrideMimeType("application/json")
    xobj.open('GET', 'data/dma-interview.json', true);
    xobj.onreadystatechange = function () {
          if (xobj.readyState == 4 && xobj.status == "200") {
            callback(xobj.responseText)
          }
    }
    xobj.send(null)
 }

function init() {
     loadJSON(function(response) {
        // Parse JSON string into object
        var data = JSON.parse(response)
        moviesArray = data.items
        renderList(moviesArray)
     });
}

function renderList(moviesList) {

    var moviesNumber = document.getElementById("movies-number")
    moviesNumber.innerText = "Displaying " + moviesList.length + " of " + moviesList.length
    var list = document.getElementById("movies-list")

    if (list) {
        while (list.firstChild) {
            list.removeChild(list.firstChild);
        }
    }

    // Create list item for each movie
    for (var i = 0; i < moviesList.length; i++) {
        var li = document.createElement("li")

        var wrapper = document.createElement("div")
        wrapper.className = "li-wrapper"
        
        var moviePic = document.createElement("div")
        moviePic.className = "movie-pic"

        var img = document.createElement("img")
        img.className = "movie-pic-src"
        img.src = moviesList[i].image

        moviePic.appendChild(img)

        var movieInfo = document.createElement("div")
        movieInfo.className = "movie-info"

        var movieTitle = document.createElement("div")
        movieTitle.className = "movie-title"
        movieTitle.innerText = moviesList[i].title

        var movieRating = document.createElement("div")
        movieRating.className = "movie-rating"
        movieRating.innerText = "Rating: " + moviesList[i].rating.toUpperCase()

        var releaseDate = document.createElement("div")
        releaseDate.innerText = "Release Date: " + moment(moviesList[i].date).format("MMM D, YYYY") 

        var runTime = document.createElement("div")
        runTime.innerText = "Run Time: " + formatRunTime(moviesList[i].run_time)

        var btnAdd = document.createElement("button")
        btnAdd.innerText = "Add to watchlist"

        movieInfo.appendChild(movieTitle)
        movieInfo.appendChild(movieRating)
        movieInfo.appendChild(releaseDate)
        movieInfo.appendChild(runTime)
        movieInfo.appendChild(btnAdd)

        wrapper.appendChild(moviePic)
        wrapper.appendChild(movieInfo)
        li.appendChild(wrapper)

        list.appendChild(li)
    }

}

function formatRunTime(timeInSeconds) {

    var minutes = Math.floor(timeInSeconds / 60)
    var hours = Math.floor(timeInSeconds / 3600)

    minutes = minutes - hours * 60

    var hourLabel = (hours > 1) ? "hrs " : "hr "
    var minuteLabel = (minutes > 1) ? "mins " : "min "

    return hours + hourLabel + minutes + minuteLabel
}

function sortMovies(sortBy) {
    var params = sortBy.split("-")

    if (params[0] === "name") {
        var byName = sortMoviesByName(params[1])
        renderList(byName)
    }
    else if (params[0] === "date") {
        var byDate = sortMoviesByDate(params[1])
        renderList(byDate)
    }
}

function sortMoviesByDate(order) {
    var byDate = moviesArray.slice(0)

    if (order === "asc") {
        byDate.sort(function(a,b) {
            return moment(a.date) - moment(b.date)
        });
    }
    else {
         byDate.sort(function(a,b) {
            return moment(b.date) - moment(a.date)
        });
    }

    return byDate
}

function sortMoviesByName(order) {
    var byName = moviesArray.slice(0)

    if (order === "asc") {
        byName.sort(function(a,b) {
            return a.slug < b.slug ? -1 : a.slug > b.slug ? 1 : 0  
        });
    }
    else {
        byName.sort(function(a,b) {
            return b.slug < a.slug ? -1 : b.slug > a.slug ? 1 : 0  
        });
    }
    return byName
}