

$(document).ready(function() {

    //gets param values from url
    $.urlParam = function(name){
        var results = new RegExp('[\\?&amp;]' + name + '=([^#]*)').exec(window.location.href);
        console.log(name);
        if (results === null) {
            return 0 //returns 0 if there is no current song to follow
        }else{
            return results[1]
        }
        //return results[1] || 0;
    }

    // http://web.mit.edu/odim/www/inspiration/?uri=blahblahblah
    var follow_uri = decodeURIComponent($.urlParam('uri')); // name
    //console.log(follow_uri);  
    

    //selecting song or following song
    if (follow_uri != 0) {
        console.log(follow_uri)
        //play_and_follow(follow_uri);
    }
})
