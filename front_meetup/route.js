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
            let mode = document.getElementById("drivingMode");
            let sel = mode.options[mode.selectedIndex].value;
            document.getElementById('loadfor').innerHTML = 'Finding Route';
            document.getElementById('loading').style.display = '';
            let token = gapi.auth2.getAuthInstance().currentUser.je.tc.access_token;
            fetch('http://localhost:3000/maps/navigation', {  
                method: 'post',
                body: JSON.stringify({start: acc.geopos, destination, email: acc.email, token: token, mode: sel, stops: this.waypoints}),
                headers: {
                    'Content-Type': "application/json"
                },
            }).then((response) =>{
                    if (!response.ok) {
                        throw response;
                    }
                    return response.json();
            }).then((data) =>{
                if(data.length < 1){
                    alert('suggest you to take flight to your destination.\nHere are nearby airports.')
                    search.spots('airport');
                    search.plot();
                }
                this.points = []
                this.route = data;
                if(this.flightPath) this.flightPath.setMap(null); 
                if(this.polywindow) for(let index in this.polywindow) route.polywindow[index].close(); 
                if(this.markers) for(let index in this.markers) this.markers[index].setMap(null)
                this.destination = destination;
                this.plot(data[0]);
            }).catch((error) =>{
                document.getElementById('loadfor').innerHTML = 'Failed to find Route';
                setTimeout(() =>{
                    document.getElementById('loading').style.display = 'none';
                },2000)
            })
        }else{ document.getElementById('loading').style.display = 'none'; }
    }

    plot(data){
        let polyinfo = new google.maps.InfoWindow();
        if(search.markers){ for (let i = 0; i < search.markers.length; i++){ search.markers[i].setMap(null);} }
        if(search.clkinfo) { this.clkinfo.close(); }
        let path = google.maps.geometry.encoding.decodePath(data["overview_polyline"]["points"]);
        this.flightPath = new google.maps.Polyline({
            path: path,
            geodesic: false,
            strokeColor: '#89CFF0',
            strokeOpacity: 2.0,
            strokeWeight: 2
        });
        google.maps.event.addListener(route.flightPath, 'mouseover', (e) =>{
            let mode = document.getElementById("drivingMode");
            let sel = mode.options[mode.selectedIndex].value;
            fetch('http://localhost:3000/maps/distance', {  
                method: 'post',
                body: JSON.stringify({start: e.latLng, destination: route.destination, email: acc.email, mode: sel}),
                headers: {
                    'Content-Type': "application/json"
                },
            }).then((response) =>{
                    if (!response.ok) { throw response; } return response.json();
            }).then((data) =>{
                polyinfo.setPosition(e.latLng);
                polyinfo.setContent("From: " + data.origin_addresses+"</br>To: "+data.destination_addresses
                                    +"</br>Distance: "+data.rows[0].elements[0].distance.text+"</br>Duration: "
                                    +data.rows[0].elements[0].duration.text);
                polyinfo.open(home.map);
                route.polywindow.push(polyinfo);
            }).catch((error) =>{
                document.getElementById('loadfor').innerHTML = error.Message;
                setTimeout(() =>{
                    document.getElementById('loading').style.display = 'none';
                },2000)
                console.log('Request failed', error);
            })
        });
        google.maps.event.addListener(route.flightPath, 'mouseout', () =>{
            for(let index in route.polywindow){ route.polywindow[index].close(); }
        });
        for (let i = 0; i < this.flightPath.getPath().getLength(); i++) { this.points.push(this.flightPath.getPath().getAt(i).toUrlValue(6)); }
        this.flightPath.setMap(home.map);
        let bounds = new google.maps.LatLngBounds();
        for (let i = 0; i < path.length; i++) { bounds.extend(path[i]); }
        home.map.fitBounds(bounds);
        for(let i = 0; i < data.legs.length; i++){
            //steps = data.legs[i].steps
            //endlocation = data.legs[i].end_location
            const marker = new google.maps.Marker({
                position: new google.maps.LatLng(data.legs[i].end_location.lat, data.legs[i].end_location.lng),
                animation: google.maps.Animation.DROP,
                map: home.map,
                icon: 'https://img.icons8.com/ultraviolet/40/000000/marker.png'
            });
            const edinfo = new google.maps.InfoWindow();
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