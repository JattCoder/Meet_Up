class Route {
    constructor(){
        this.destination = {}
        this.waypoints = []
        this.markers = []
        this.infowindow = []
        this.polywindow = []
    }
    get_route(destination = {}){
        if(Object.keys(destination).length != 0){
            var mode = document.getElementById("drivingMode");
            var sel = mode.options[mode.selectedIndex].value;
            document.getElementById('loadfor').innerHTML = 'Finding Route';
            document.getElementById('loading').style.display = '';
            var token = gapi.auth2.getAuthInstance().currentUser.je.tc.access_token;
            fetch('http://localhost:3000/maps/navigation', {  
                method: 'post',
                body: JSON.stringify({start: acc.geopos, destination, email: acc.email, token: token, mode: sel, stops: this.waypoints}),
                headers: {
                    'Content-Type': "application/json"
                },
            }).then(function (response) {
                    if (!response.ok) {
                        throw response;
                    }
                    return response.json();
            }).then(function(data){
                if(data.length < 1){
                    alert('suggest you to take flight to your destination.\nHere are nearby airports.')
                    search.spots('airport');
                    search.plot();
                }
                this.points = []
                this.route = data;
                if(this.flightPath){ this.flightPath.setMap(null); }
                if(this.polywindow){ for(var index in route.polywindow){ route.polywindow[index].close(); } }
                this.destination = destination;
                this.plot(data[0]);
            }.bind(this)).catch(function(error){
                document.getElementById('loading').style.display = 'none';
                console.log('Request failed', error);
            })
        }else{ document.getElementById('loading').style.display = 'none'; }
    }

    plot(data){
        var polyinfo = new google.maps.InfoWindow();
        if(search.markers){ for (var i = 0; i < search.markers.length; i++){ search.markers[i].setMap(null);} }
        if(search.clkinfo) { this.clkinfo.close(); }
        var path = google.maps.geometry.encoding.decodePath(data["overview_polyline"]["points"]);
        this.flightPath = new google.maps.Polyline({
            path: path,
            geodesic: false,
            strokeColor: '#89CFF0',
            strokeOpacity: 2.0,
            strokeWeight: 2
        });
        google.maps.event.addListener(route.flightPath, 'mouseover', function(e) {
            var mode = document.getElementById("drivingMode");
            var sel = mode.options[mode.selectedIndex].value;
            fetch('http://localhost:3000/maps/distance', {  
                method: 'post',
                body: JSON.stringify({start: e.latLng, destination: route.destination, email: acc.email, mode: sel}),
                headers: {
                    'Content-Type': "application/json"
                },
            }).then(function (response) {
                    if (!response.ok) { throw response; } return response.json();
            }).then(function(data){
                polyinfo.setPosition(e.latLng);
                polyinfo.setContent("From: " + data.origin_addresses+"</br>To: "+data.destination_addresses
                                    +"</br>Distance: "+data.rows[0].elements[0].distance.text+"</br>Duration: "
                                    +data.rows[0].elements[0].duration.text);
                polyinfo.open(home.map);
                route.polywindow.push(polyinfo);
            }.bind(this)).catch(function(error){
                document.getElementById('loading').style.display = 'none';
                console.log('Request failed', error);
            })
        });
        google.maps.event.addListener(route.flightPath, 'mouseout', function() {
            for(var index in route.polywindow){ route.polywindow[index].close(); }
        });
        for (var i = 0; i < this.flightPath.getPath().getLength(); i++) { this.points.push(this.flightPath.getPath().getAt(i).toUrlValue(6)); }
        this.flightPath.setMap(home.map);
        var bounds = new google.maps.LatLngBounds();
        for (var i = 0; i < path.length; i++) { bounds.extend(path[i]); }
        home.map.fitBounds(bounds);
        for(var i = 0; i < data.legs.length; i++){
            //steps = data.legs[i].steps
            //endlocation = data.legs[i].end_location
            var marker = new google.maps.Marker({
                position: new google.maps.LatLng(data.legs[i].end_location.lat, data.legs[i].end_location.lng),
                animation: google.maps.Animation.DROP,
                map: home.map,
                icon: 'https://img.icons8.com/ultraviolet/40/000000/marker.png'
            });
            var edinfo = new google.maps.InfoWindow();
            google.maps.event.addListener(marker, 'click', ((marker) =>{
                return () => {
                    if(i == (data.legs.length - 1)){
                        edinfo.setContent(`Destination</br></br>${data.legs[i].end_address}</br>
                                       Distance: ${data.legs[i].distance.text}</br>
                                       Duration: ${data.legs[i].duration.text}</br></br>
                                       <a onclick='letsGo()'>Start</a></br>
                                       <a onclick='cancelRoute()'>Cancel</a>`);
                    }else{
                        edinfo.setContent(`Stop</br></br>${data.legs[i].end_address}</br>
                                       Distance: ${data.legs[i].distance.text}</br>
                                       Duration: ${data.legs[i].duration.text}</br></br>
                                       <a onclick='removeStop(${i})'>Remove Stop</a>`);
                    }
                    edinfo.open(home.map, marker);
                    this.infowindow.push(edinfo);
                }
            })(marker));
            new google.maps.event.trigger( marker, 'click' );
            this.markers.push(marker);
        }
        document.getElementById('loading').style.display = 'none';
    }

    lets_roll(){
        home.map.setCenter(acc.geopos)
        home.map.setZoom(19);
    }
}