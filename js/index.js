$(document).ready(function() {

    var followed = [];
    var redirect = "#";
    var delay = 30000;
    //gets param values from url
    $.urlParam = function(name){
        var results = new RegExp('[\\?&amp;]' + name + '=([^#]*)').exec(window.location.href);
        //console.log(name);
        if (results === null) {
            return 0 //returns 0 if there is no current song to follow
        }else{
            return results[1]
        }
        //return results[1] || 0;
    }

    // http://web.mit.edu/odim/www/inspiration/?uri=blahblahblah
    var follow_uri = decodeURIComponent($.urlParam('uri')); // name
    ////console.log(follow_uri);  
    

    //selecting song or following song
    if (follow_uri != 0) {
        //console.log(follow_uri)
        play_and_follow(follow_uri);
    }


   $.ajaxPrefilter(function(options) {
    	if (options.crossDomain && jQuery.support.cors) {
      		options.url = (window.location.protocol === 'http:' ? 'http:' : 'https:') +
                '//cors-anywhere.herokuapp.com/' + 'secondhandsongs.com/performance';
    	}
	});

    function shs_search(name, song) {
        ////console.log(name);
        ////console.log(song);
        var root = "http://www.secondhandsongs.com/search/performance?";
        var commonName = name;
        var title = song;
        var pre_url = root+"commonName="+encodeURI(commonName)+"&title="+encodeURI(title)+"&format=json";
        var url;
        //console.log("searching: "+pre_url);
        $.getJSON(pre_url, function(pre_data) {
            url = pre_data.resultPage[0].uri;
            //console.log("finding samples: "+url);

            $.getJSON(url, function(new_data) {
                $("ul#shs").append("<li>"+new_data.performer.name+"'s "+new_data.title+"</li>");
                ////console.log("secondhand= "+new_data);
                //followSample(url);
                window.location = "?uri="+encodeURIComponent(new_data.uri);
            });
        });
        
        
    }

    function play_and_follow(uri) {
        followed.push(uri);
        
        $.ajaxPrefilter(function(options) {
    		if (options.crossDomain && jQuery.support.cors) {
      			options.url = (window.location.protocol === 'http:' ? 'http:' : 'https:') +
            	    '//cors-anywhere.herokuapp.com/' + uri;
    		}
		});
        $.getJSON(uri, function(data) {
            console.log(data);
            var artist = data.performer.name, title = data.title, originals = $.merge(data.originals,data.usesSamplesFrom), samples = data.sampledBy, covers = data.covers, video = data.external_uri;

            $('#tracking').append("<h3>"+artist+"'s "+title+"</h3>");
            ////console.log(video);
            if (video.length !== 0) {
                var video_id = video[0].uri.slice(data.external_uri[0].uri.length-11,data.external_uri[0].uri.length)
                //console.log(video_id);
                $('#tracking').append("<iframe width='400' height='300' src='http://www.youtube.com/embed/"+video_id+"?autoplay=1' frameborder='0' allowfullscreen autoplay></iframe>");
            } else {
                delay = 3000;
            }

            //$('#tracking').append("<h5>Follow the Sample:</h5>");

            if (originals.length !== 0) {
                //console.log(originals);
                var o = Math.floor(Math.random() * originals.length);
                //console.log(o);
                //$('#tracking').append("<h5>Songs that this work samples:</h5>");
                if (originals[o].original === undefined) {
                    //console.log(followed);
                    //console.log(followed.indexOf(originals[o].performance.uri));
                    if (followed.indexOf(originals[o].performance.uri) == -1) {
                        redirect = "?uri="+encodeURIComponent(originals[o].performance.uri);
                        $('#prev').append("<a href='"+redirect+"'><h3>Influenced By:</h3>"+originals[o].performance.performer.name+"'s "+originals[o].performance.title+"</a>");
                        setTimeout(function(){ $("#prev").find('a')[0].click(); }, delay);
                    } else {
                        /*  while (followed.indexOf(originals[o].performance.uri) == -1) {
                            o = Math.floor(Math.random() * originals.length);
                        }*/
                    }
                }else{
                    if (followed.indexOf(originals[o].original.uri) == -1) {
                        redirect = "?uri="+encodeURIComponent(originals[o].original.uri);
                        $('#prev').append("<a href='"+redirect+"'><h3>Influenced By:</h3>"+originals[o].original.performer.name+"'s "+originals[o].title+"</a>");
                        setTimeout(function(){ $("#prev").find('a')[0].click(); }, delay);
                    } else {
                        /*  while (followed.indexOf(originals[o].original.uri) == -1) {
                            o = Math.floor(Math.random() * originals.length);
                        }*/
                    }
                }
                //window.location = "?uri="+encodeURIComponent(new_data.uri);
            }
            if (samples.length !== 0) {
                //console.log(samples);
                //$('#tracking').append(samples[0].performance.title);
                var s = Math.floor(Math.random() * samples.length);
                //$('#tracking').append("<h5>Songs that have sampled this work</h5>");
                redirect = "?uri="+encodeURIComponent(samples[s].performance.uri);
                $('#next').append("<a href='"+redirect+"'><h3>Influenced:</h3>"+samples[s].performance.performer.name+"'s "+samples[s].performance.title+"</a>");
                setTimeout(function(){ $("#next").find('a')[0].click(); }, delay);
            }
            
            if (originals.length === 0 && samples.length === 0) {
                if (covers.length !== 0) {
                    //console.log(covers);
                    //$('#tracking').append(samples[0].performance.title);
                    var c = Math.floor(Math.random() * covers.length);
                    //$('#tracking').append("<h5>Songs that have sampled this work</h5>");
                    redirect = "?uri="+encodeURIComponent(covers[c].uri);
                    $('#next').append("<a href='"+redirect+"'><h3>Covered By:</h3>"+covers[c].performer.name+"'s "+covers[c].title+"</a>");
                    setTimeout(function(){ $("#next").find('a')[0].click(); }, delay);
                } else {
                    $('#tracking').append("<h5>Could not find any connections for this song.</h5>");
                }
                
            }

        });

        
    }
    


 });
