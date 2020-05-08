class Index {
  loadmap(location = []) {
    var infoWindow;
    var map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 40.674, lng: -73.945},
        zoom: 15,
        disableDefaultUI: true,
        clickableIcons: false,
        styles: [
            {elementType: 'geometry', stylers: [{color: '#242f3e'}]},
            {elementType: 'labels.text.stroke', stylers: [{color: '#242f3e'}]},
            {elementType: 'labels.text.fill', stylers: [{color: '#746855'}]},
            {
            featureType: 'administrative.locality',
            elementType: 'labels.text.fill',
            stylers: [{color: '#d59563'}]
            },
            {
            featureType: 'poi',
            elementType: 'labels.text.fill',
            stylers: [{color: '#d59563'}]
            },
            {
            featureType: 'poi.park',
            elementType: 'geometry',
            stylers: [{color: '#263c3f'}]
            },
            {
            featureType: 'poi.park',
            elementType: 'labels.text.fill',
            stylers: [{color: '#6b9a76'}]
            },
            {
            featureType: 'road',
            elementType: 'geometry',
            stylers: [{color: '#38414e'}]
            },
            {
            featureType: 'road',
            elementType: 'geometry.stroke',
            stylers: [{color: '#212a37'}]
            },
            {
            featureType: 'road',
            elementType: 'labels.text.fill',
            stylers: [{color: '#9ca5b3'}]
            },
            {
            featureType: 'road.highway',
            elementType: 'geometry',
            stylers: [{color: '#746855'}]
            },
            {
            featureType: 'road.highway',
            elementType: 'geometry.stroke',
            stylers: [{color: '#1f2835'}]
            },
            {
            featureType: 'road.highway',
            elementType: 'labels.text.fill',
            stylers: [{color: '#f3d19c'}]
            },
            {
            featureType: 'transit',
            elementType: 'geometry',
            stylers: [{color: '#2f3948'}]
            },
            {
            featureType: 'transit.station',
            elementType: 'labels.text.fill',
            stylers: [{color: '#d59563'}]
            },
            {
            featureType: 'water',
            elementType: 'geometry',
            stylers: [{color: '#17263c'}]
            },
            {
            featureType: 'water',
            elementType: 'labels.text.fill',
            stylers: [{color: '#515c6d'}]
            },
            {
            featureType: 'water',
            elementType: 'labels.text.stroke',
            stylers: [{color: '#17263c'}]
            }]
        });
        map.draggable = true;
        if (location.length < 1){
            infoWindow = new google.maps.InfoWindow;
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function(position) {
                    var pos = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                    this.geopos = pos;
                    this.map = map;
                    infoWindow.setPosition(pos);
                    infoWindow.setContent('Your Location');
                    infoWindow.open(map);
                    map.setCenter(pos);
                }.bind(this), function() {
                    handleLocationError(true, infoWindow, map.getCenter());
                });
            } else {
                handleLocationError(false, infoWindow, map.getCenter());
            }
        }else if(location[0]["overview_polyline"]!= null){
            var path = google.maps.geometry.encoding.decodePath(location[0]["overview_polyline"]["points"]);
            var flightPath = new google.maps.Polyline({
                path: path,
                geodesic: true,
                strokeColor: '#FF0000',
                strokeOpacity: 1.0,
                strokeWeight: 2
            });
            flightPath.setMap(map);
            var bounds = new google.maps.LatLngBounds();
            for (var i = 0; i < path.length; i++) { bounds.extend(path[i]); }
            map.fitBounds(bounds);
            var st = location[0]["legs"][0].start_location
            var ed = location[0]["legs"][0].end_location
            var start = new google.maps.Marker({
                position: new google.maps.LatLng(st['lat'], st['lng']),
                animation: google.maps.Animation.DROP,
                map: map
            });
            var stinfo = new google.maps.InfoWindow();
            google.maps.event.addListener(start, 'click', ((start) =>{
                return () => {
                    stinfo.setContent(`${acc.name}`);
                    stinfo.open(map, start);
                }
            })(start));
            //var midpoint = new google.maps.Marker({
            //    position: new google.maps.LatLng(location[i].Geopoints.lat, location[i].Geopoints.lng),
            //    animation: google.maps.Animation.DROP,
            //    map: map
            //});
            var destination = new google.maps.Marker({
                position: new google.maps.LatLng(ed['lat'], ed['lng']),
                animation: google.maps.Animation.DROP,
                map: map
            });
            console.log(location[0])
            //total distance, duration and estimated arrival
            var edinfo = new google.maps.InfoWindow();
            google.maps.event.addListener(destination, 'click', ((destination) =>{
                return () => {
                    edinfo.setContent(`Destination</br></br>${location[0]["legs"][0].end_address}</br>
                                       Distance: ${location[0]["legs"][0].distance.text}</br>
                                       Duration: ${location[0]["legs"][0].duration.text}</br>
                                       Estimated Arrival: </br></br>
                                       <a onclick='letsGo(${location[0]})'>Start</a>`);
                    edinfo.open(map, destination);
                }
            })(destination));
            new google.maps.event.trigger( start, 'click' );
            new google.maps.event.trigger( destination, 'click' );
        }else{
            infoWindow = new google.maps.InfoWindow();
            var marker, i, center;
            for (i = 0; i < location.length; i++) { 
                marker = new google.maps.Marker({
                  position: new google.maps.LatLng(location[i].Geopoints.lat, location[i].Geopoints.lng),
                  animation: google.maps.Animation.DROP,
                  map: map
                });
                google.maps.event.addListener(marker, 'click', ((marker, i) =>{
                  return () => {
                    if(location[i].Status == null && location[i].Rating == null && location[i].Total_Ratings == null){
                        infoWindow.setContent(`${location[i].Address}<br/><br/>
                        <a onclick='onSelection(${JSON.stringify(location[i].Geopoints)})'>Directions</a> <br/>
                        <a onclick='toFav(${JSON.stringify(location[i])})'>Add to Favorites</a>`);
                    }else{
                        infoWindow.setContent(`${location[i].Status}<br/><br/>${location[i].Name}<br/>${location[i].Address}
                            <br/>Rating: ${location[i].Rating} (${location[i].Total_Ratings})<br/><br/>
                            <a onclick='onSelection(${JSON.stringify(location[i].Geopoints)})'>Directions</a> <br/>
                            <a onclick='toFav(${JSON.stringify(location[i])})'>Add to Favorites</a>`)
                    }
                    infoWindow.open(map, marker);
                  }
                })(marker, i));
            }
            if (location.length == 1){
                center = {
                    lat: location[0].Geopoints.lat,
                    lng: location[0].Geopoints.lng
                }
            }else{
                var geo = location[location.length/2]
                center = {
                    lat: geo.Geopoints.lat,
                    lng: geo.Geopoints.lng
                }
                map.setZoom(11);
            }
            map.setCenter(center);
        }
    }

    handleLocationError(browserHasGeolocation, infoWindow, pos) {
        infoWindow.setPosition(pos);
        infoWindow.setContent(browserHasGeolocation ?
                  'Error: The Geolocation service failed.' :
                  'Error: Your browser doesn\'t support geolocation.');
        infoWindow.open(map);
    }
}
