/* Function makes a list of links from a given search term using the
   SecondHandSong API.  Needs an artist name, and outputs a list. */
function makelist(search) {
   
    var result = [];
    var artistdone = false;
    var songdone = false;
    //checkAndSubmit(artistdone, songdone);
    var search = "alabama";
    var root = "http://www.secondhandsongs.com/search/artist?";
    var url = root+"commonName="+search+"&format=json";
	
	$.ajaxPrefilter(function(options) {
    	if (options.crossDomain && jQuery.support.cors) {
      		options.url = (window.location.protocol === 'http:' ? 'http:' : 'https:') +
                //'//cors-anywhere.herokuapp.com/' + ('secondhandsongs.com/search/artist' || 'secondhandsongs.com/search/performance');
    			'//cors-anywhere.herokuapp.com/' + (url);
    	}
	});
	
    console.log("getting url... "+url);
    $.getJSON(url, function(data) {

        var artists = data.resultPage;
        //console.log("artists: ");
        //console.log(artists);

        $.each(artists, function(i, val) {
            //console.log("artist number "+i+": "+val.commonName);
            //console.log(val.performances);
                console.log("begin each");
                $.ajaxPrefilter(function(options) {
					if (options.crossDomain && jQuery.support.cors) {
						options.url = (window.location.protocol === 'http:' ? 'http:' : 'https:') +
							//'//cors-anywhere.herokuapp.com/' + ('secondhandsongs.com/search/artist' || 'secondhandsongs.com/search/performance');
							'//cors-anywhere.herokuapp.com/' + (val.uri);
					}
				});
				
                $.getJSON(val.uri+"/performance?format=json", function(ss) {

                    //for each song (ssval) of selected artist (val)
                    console.log("anonymous function...");
                    console.log(ss);
                    $.each(ss, function(ssi, ssval) {
                        console.log(ssi);
                        console.log("hi");
                        console.log(ssval);
                        console.log("?");
                        console.log(ssval.uri);
                        
                        $.ajaxPrefilter(function(options) {
							if (options.crossDomain && jQuery.support.cors) {
								options.url = (window.location.protocol === 'http:' ? 'http:' : 'https:') +
									//'//cors-anywhere.herokuapp.com/' + ('secondhandsongs.com/search/artist' || 'secondhandsongs.com/search/performance');
									'//cors-anywhere.herokuapp.com/' + (ssval.uri);
							}
						});
                        $.getJSON(ssval.uri+"?format=json", function(s) {
                            console.log("song: "+s.title);
                            
                            var originals = s.originals;
                            var usesSamplesFroms = s.usesSamplesFrom;
                            var sampledBys = s.sampledBy;
                            var covers = s.covers;

                            //console.log(result);
                            //console.log(usesSamplesFrom);
                            //console.log(sampledBy);
                            //console.log(covers);
                            //derivedWorks

                            //ORIGINALS
                            //console.log(s.originals);
                            if (typeof(originals) != 'undefined') {
                                console.log("are there originals?");
                                console.log(originals);
                                $.each(originals, function(oi, oval) {

                                    if (oval.original == null) {
                                        // Maybe later can handle songs that have been redone by many, many artists
                                        // such as christmas songs.
                                    }else{

                                        //console.log(val);
                                        //console.log(oval);
                                        //console.log(oval.original.performer);
                                        //console.log("result?");
                                        //console.log(result);
                                        var olinkedArtist = oval.original.performer;
                                        var original = {
                                          source : val.commonName.toString(), 
                                          target : olinkedArtist.name.toString(), 
                                          type : "original", 
                                          suri: val.uri,
                                          turi: olinkedArtist.uri
                                        };
                                        //console.log("original?");
                                        console.log(original);
                                        //console.log(result);
                                        result.push(original);
                                        //console.log(result);
                                        //result[result.length] = original; 
                                        //console.log(result[result.length-1]);
                                        //console.log(result.length);
                                        //console.log("plus an original original: "+original);
                                        //console.log(result);
                                        
                                    }
                                });
                                
                                
                            }

                            //USES SAMPLES FROM
                            //console.log(s.usesSamplesFrom);
                            if (typeof(usesSamplesFroms) != 'undefined') {
                                console.log("are there usesSamplesFrom?");
                                console.log(usesSamplesFroms);
                                $.each(usesSamplesFroms, function(fi, fval) {
                                    var flinkedArtist = fval.performance.performer;
                                    var usesSamplesFrom = { 
                                      source : val.commonName, 
                                      target : flinkedArtist.name, 
                                      type : "usesSamplesFrom", 
                                      suri: val.uri,
                                      turi: flinkedArtist.uri
                                    }
                                    //console.log("usesSamplesFrom?");
                                    console.log(usesSamplesFrom); 
                                    result.push(usesSamplesFrom);
                                    
                                });
                                
                            }

                            //SAMPLED BY
                            //console.log(s.sampledBy);
                            if (typeof(sampledBys) != 'undefined') {
                                console.log("are there sampledBy?");
                                console.log(sampledBys);

                                $.each(sampledBys, function(bi, bval) {
                                    var blinkedArtist = bval.performance.performer;
                                    var sampledBy = { 
                                      source : val.commonName, 
                                      target : blinkedArtist.name, 
                                      type : "sampledBy", 
                                      suri: val.uri,
                                      turi: blinkedArtist.uri
                                    }
                                    //console.log("sampledBy?");
                                    console.log(sampledBy);
                                    result.push(sampledBy); 
                                });
                                
                            }

                            //COVERS
                            //console.log(s.covers);
                            if (typeof(covers) != 'undefined') {
                                console.log("are the covers?");
                                console.log(covers);

                                $.each(covers, function(ci, cval) {
                                    var clinkedArtist = cval.performer;
                                    var cover = { 
                                      source : val.commonName, 
                                      target : clinkedArtist.name, 
                                      type : "cover", 
                                      suri: val.uri,
                                      turi: clinkedArtist.uri
                                    }
                                    //console.log("cover?");
                                    console.log(cover);
                                    result.push(cover);
                                });
                                
                            }

                            //console.log("artist number "+i);
                            //console.log("artists.length = "+artists.length);
                            //console.log("originals = "+originals);
                            //console.log("sampledBy = "+sampledBy);
                            //console.log("usesSamplesFrom = "+usesSamplesFrom);
                            /*var test = (i >= artists.length - 1);
                            console.log("done? "+i+" >= "+(artists.length - 1)+"? "+test);
                            if (i >= artists.length - 1 ) {
                              console.log("result: ");
                              console.log(result);
                              //console.log("made list");

                              // Makes a visualization using list of links created.
                              makenetwork(result);
                            }*/
                            return true;
                            
                        }).done(function() {
                          console.log("done? "+ssi+" >= "+(ss.length - 1)+"? ");
                          if (ssi >= ss.length - 1) {
                            console.log("LAST SONG");
                            songdone = true;
							
                            if (artistdone) {
                              console.log("THAT'S IT");
                              console.log(result);
                              makenetwork(result);
                            }
                            //console.log("result: ");
                            //console.log(result);
                            
                          }
                          
                        });
                    });

                 
                }).done(function() {
                  console.log("done? "+i+" >= "+(artists.length - 1)+"? ");
                  if (i >= artists.length - 1) {
                    console.log("LAST ARTIST");
                    artistdone = true;
                    //console.log("result: ");
                    //console.log(result);
                     
                  }
                  console.log("end each artist");
                });
            
           
        });
        
        
    });
    
    

    function checkAndSubmit(c1, c2) {
      console.log(c1+","+c2);
      if (!(c1 && c2)) {
          setTimeout(checkAndSubmit, 500); // setTimeout(func, timeMS, params...)
      } else {
          // Set location on form here if it isn't in getLocation()
          console.log("THAT'S IT");
          console.log(result);
      }
    }
  

}


var currentArtist = {};
/* Function uses D3.js to create a force-directed graph from a given list of links */
function makenetwork(links_list) {
    
    // http://blog.thomsonreuters.com/index.php/mobile-patent-suits-graphic-of-the-day/
    var color = d3.scale.category20();
    var links = links_list;
    //console.log("lists");
    //console.log(links);
    /*var links = [
      {source: "Microsoft", target: "Amazon", type: "licensing"},
      {source: "Amazon", target: "Microsoft", type: "licensing"},
      {source: "Microsoft", target: "HTC", type: "licensing"},
      {source: "Samsung", target: "Apple", type: "suit"},
      {source: "Motorola", target: "Apple", type: "suit"},
      {source: "Nokia", target: "Apple", type: "resolved"},
      {source: "HTC", target: "Apple", type: "suit"},
      {source: "Kodak", target: "Apple", type: "suit"},
      {source: "Microsoft", target: "Barnes & Noble", type: "suit"},
      {source: "Microsoft", target: "Foxconn", type: "suit"},
      {source: "Apple", target: "HTC", type: "suit"},
      {source: "Microsoft", target: "Inventec", type: "suit"},
      {source: "Samsung", target: "Kodak", type: "resolved"},
      {source: "LG", target: "Kodak", type: "resolved"},
      {source: "RIM", target: "Kodak", type: "suit"},
      {source: "Sony", target: "LG", type: "suit"},
      {source: "Kodak", target: "LG", type: "resolved"},
      {source: "Apple", target: "Nokia", type: "resolved"},
      {source: "Qualcomm", target: "Nokia", type: "resolved"},
      {source: "Apple", target: "Motorola", type: "suit"},
      {source: "Microsoft", target: "Motorola", type: "suit"},
      {source: "Motorola", target: "Microsoft", type: "suit"},
      {source: "Kodak", target: "Samsung", type: "resolved"},
      {source: "Apple", target: "Samsung", type: "suit"},
      {source: "Kodak", target: "RIM", type: "suit"},
      {source: "Nokia", target: "Qualcomm", type: "suit"}
    ];*/
    //console.log("making network");
    var nodes = {};
    var linkedByName = {};
    var locked = false;
    console.log("locked="+locked);

    // Compute the distinct nodes from the links.
    links.forEach(function(link) {
      //console.log("each link");
      //console.log(link);
      link.source = nodes[link.source] || (nodes[link.source] = {name: link.source, uri: link.suri/*, px: 576.000621444101, py: 300.0003496448752, x: 576.000621444101, y: 300.0003496448752*/});
      link.target = nodes[link.target] || (nodes[link.target] = {name: link.target, uri: link.turi/*, px: 576.000621444101, py: 300.0003496448752, x: 576.000621444101, y: 300.0003496448752*/});
      linkedByName[link.source.name + "," + link.target.name] = 1; // makes list of adjacent nodes
      //console.log(link.source);
    });
    //console.log(nodes);
    //console.log(nodes);
    //console.log(linkedByName);

    var width = 960,
        height = 400;

    var force = d3.layout.force()
        .nodes(d3.values(nodes))
        .links(links)
        .size([width *= 1.2, height *= 1.2])
        .linkDistance(60)
        .charge(-300)
        .on("tick", tick)
        .start();

    var svg = d3.select("header").append("svg")
        .attr("width", width)
        .attr("height", height);
        

    var link = svg.selectAll(".link")
        .data(force.links())
      .enter().append("path")
        .attr("class", "link");

    var node = svg.selectAll(".node")
        .data(force.nodes())
      .enter().append("g")
        .attr("class", "node")
        .on("mouseover", mouseover())
        .on("mouseout", mouseout())
        .on("click", onclick())
        .call(force.drag);

    //var node = svg.selectAll("circle.node")
      //.data(json.nodes)
      //.enter().append("circle")
      //.attr("class", "node")
      



    node.append("circle")
        //.attr("r", 8);
        .attr("r", 5)
        .style("fill", function(d) { return color(d.type); })
        //.call(force.drag);

    node.append("text")
        .attr("x", 12)
        .attr("dy", ".35em")
        .text(function(d) { return d.name; });

    

    function isConnected(a, b) {
        //console.log(a.name+","+b.name+","+linkedByName[a.name + "," + b.name]);
        return linkedByName[a.name + "," + b.name] || linkedByName[b.name + "," + a.name] || a.name == b.name;
    }


    function tick() {
      link.attr("d", function(d) {
        var dx = d.target.x - d.source.x,
            dy = d.target.y - d.source.y,
            dr = Math.sqrt(dx * dx + dy * dy);
        return "M" + d.source.x + "," + d.source.y + "A" + dr + "," + dr + " 0 0,1 " + d.target.x + "," + d.target.y;
        });

      node
          .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
    }

    

    function mouseover() {
      return function(d) {
          console.log("locked="+locked);
          if (!locked) {
            getArtistInfo(d, "basic");
          }
          d3.select(this).select("circle").transition()
            .duration(750)
            .attr("r", 9);
          //var thechosen = d;
          //console.log(d);
          node.style("fill-opacity", .1).style("fill-opacity", function(o) {
              //console.log(o.name);
              //console.log(isConnected(d, o) ? 1 : .1);
              return isConnected(d, o) ? 1 : .1;
          });
          link.style("stroke-opacity", .1).style("stroke-opacity", function(o) {
              return o.source === d || o.target === d ? 1 : .1;
          });
      };
    }
    
    function mouseout() {
      console.log("locked="+locked);
      if (locked) {
        return "";
      } else {
        return function(d) {
            //$("#sidebar").html("");
            d3.select(this).select("circle").transition()
              .duration(750)
              .attr("r", 5);
            node.style("fill-opacity", 1).style("fill-opacity", function(o) {
              return isConnected(d, o) ? 1 : 1;
            });
            link.style("stroke-opacity", 1).style("stroke-opacity", function(o) {
                return o.source === d || o.target === d ? 1 : 1;
            });
        };
      }
      
      
      
    }

    function onclick() {
        return function(d) {
            if (locked) {
              if (d.name == currentArtist.commonName) {
                locked = false;
                console.log(locked);

                d3.select(this).select("circle").transition()
                .duration(750)
                .attr("r", 5)
                .style("fill", color(d.type));
              } else {
                getComparison(d);
              }
              
            } else {
              getArtistInfo(d, "more");
              //showMoreInfo(d); // displays info in sidebar. function defined below.
              d3.select(this).select("circle").transition()
                .duration(750)
                .attr("r", 9)
                .style("fill", "red");
              //var thechosen = d;
              //console.log(d);
              node.style("fill-opacity", .1).style("fill-opacity", function(o) {
                  //console.log(o.name);
                  //console.log(isConnected(d, o) ? 1 : .1);
                  return isConnected(d, o) ? 1 : .1;
              });
              link.style("stroke-opacity", .1).style("stroke-opacity", function(o) {
                  return o.source === d || o.target === d ? 1 : .1;
              });
            }
            

              
        };
      }
      
    


function getComparison(node) {

    $("#picture").html("");
    $("#artistName").html("");
    $("#basicInfo").html(""); 
    $("#moreInfo").html("");
    $("#performanceInfo").html("");

  //name, aliases, members, picture, birthDate, homeCountry, deaathDate, performances, comments, song_count, original_count, sample_count, covers_count
  var newArtist = {};

  $.getJSON(node.uri+"?format=json", function(aData) {
    //most basic information
    newArtist.commonName = aData.commonName; //what happens when null?
    newArtist.country = aData.homeCountry;
    newArtist.comments = aData.comments;
    newArtist.birthDate = aData.birthDate;
    newArtist.deathDate = aData.deathDate;
    newArtist.aliases = aData.aliases;
    newArtist.members = aData.members;
    newArtist.picture = aData.picture;
    
    if (typeof(currentArtist.picture) !== 'undefined' && typeof(newArtist.picture) !== 'undefined') {
      $("#picture").html("<img src='"+currentArtist.picture+"' /><img src='"+newArtist.picture+"' />");
    }
    $("#artistName").html("<p>"+currentArtist.commonName+" vs. "+newArtist.commonName+"</p>");
    
    $("#moreInfo").append("<p>"+currentArtist.commonName+": "+currentArtist.comments+"</p>");
    $("#moreInfo").append("<p>"+newArtist.commonName+": "+newArtist.comments+"</p>");

    /*$.each(currentArtist.performances, function(i, val) {
        $.getJSON(val.uri+"?format=json", function(sData) {
          //console.log("sData");
          //console.log(sData.originals);
          if (typeof(sData.sampledBy) !== 'undefined') { 
            $.each(sData.sampledBy, function(si, sval) {
              if (sval.performer.name == newArtist.commonName) {
                $("#performanceInfo").append("<p>"+val.title+"</p>")
              }
            });
          }
          if (typeof(sData.originals) !== 'undefined') { artist.sample_count += sData.originals.length;}
          if (typeof(sData.usesSamplesFrom) !== 'undefined') { artist.sample_count += sData.usesSamplesFrom.length;}
          if (typeof(sData.covers) !== 'undefined') { artist.cover_count += sData.covers.length;}

          //console.log(artist);
        }).done(function() {

        });*/
  });
}

function getArtistInfo(node, data) {
  //name, aliases, members, picture, birthDate, homeCountry, deaathDate, performances, comments, song_count, original_count, sample_count, covers_count
  var artist = {};

  $.getJSON(node.uri+"?format=json", function(aData) {
    //most basic information
    artist.commonName = aData.commonName; //what happens when null?
    artist.country = aData.homeCountry;
    artist.comments = aData.comments;
    artist.birthDate = aData.birthDate;
    artist.deathDate = aData.deathDate;
    artist.aliases = aData.aliases;
    artist.members = aData.members;
    artist.picture = aData.picture;
    //console.log(artist);

    //get performance and sample information
    $.getJSON(aData.performances+"?format=json", function(pData) {
      //console.log(pData);
      artist.performances = pData;
      artist.song_count = pData.length;

      artist.original_count = 0;
      artist.sample_count = 0;
      artist.cover_count = 0;
      $.each(artist.performances, function(i, val) {
        $.getJSON(val.uri+"?format=json", function(sData) {
          //console.log("sData");
          //console.log(sData.originals);
          if (typeof(sData.sampledBy) !== 'undefined') { artist.original_count += sData.sampledBy.length;}
          if (typeof(sData.originals) !== 'undefined') { artist.sample_count += sData.originals.length;}
          if (typeof(sData.usesSamplesFrom) !== 'undefined') { artist.sample_count += sData.usesSamplesFrom.length;}
          if (typeof(sData.covers) !== 'undefined') { artist.cover_count += sData.covers.length;}

          //console.log(artist);
        }).done(function() {
          if (i >= artist.performances.length - 1) {
            console.log("locked="+locked);
            if (locked) {
              alert("locked on "+currentArtist.commonName);
            } else {
              currentArtist = artist;
              console.log(currentArtist);

              $("#picture").html("");
              $("#artistName").html("");
              $("#basicInfo").html(""); 
              $("#moreInfo").html("");
              $("#performanceInfo").html("");

              if (typeof(artist.picture) !== 'undefined') {
                $("#picture").html("<img src='"+artist.picture+"' />");
              }
              $("#artistName").html("<p>"+artist.commonName+"</p>");
              $("#basicInfo").html("<p>"+artist.song_count+" songs, "+artist.sample_count+" samples, "+artist.original_count+" originals, "+artist.cover_count+" covers</p>"); 
              
              if (data == "more") {
                $("#moreInfo").append("<p>"+artist.comments+"</p>");

                $.each(artist.performances, function(i, val) {
                  $("#performanceInfo").append("<a href='follow.html?uri="+encodeURI(val.uri)+"'>"+val.title+"</a>");
                });
                locked = true;
              console.log("locked="+locked);
              }

              //return artist;
            }
            

          }
          
        });

        
      });
      

    });
  });
  
}

}
