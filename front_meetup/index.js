class Index {
  constructor(){
      this.clks = []
  }
  loadmap() {
    const map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 40.674, lng: -73.945},
        zoom: 15,
        disableDefaultUI: true,
        clickableIcons: true,
        rotateControl: true,
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
        map.setOptions({ minZoom: 3, maxZoom: 18 });
        map.draggable = true;
        map.addListener('click', (event) =>{
            if(this.clks) for(let index in this.clks) this.clks[index].close();
            if(search.mapclk.length > 0) for(let index in search.mapclk) search.mapclk[index].close();
            if(favs.infowindow.length > 0) for(let index in favs.infowindow) favs.infowindow[index].close();
            document.getElementById('loading').style.display = '';
            document.getElementById('loadfor').innerHTML = 'Fetching Data';
            if (event.placeId) {
                event.stop();
                for(let num in favs.infowindow) { favs.infowindow[num].close(); }
                onMapSpot(event);
            }else{
                const clk = new google.maps.InfoWindow();
                fetch('http://localhost:3000/maps/geocode', {  
                    method: 'post',
                    body: JSON.stringify({geo: [event.latLng.lat(),event.latLng.lng()]}),
                    headers: {
                        'Content-Type': "application/json"
                    },
                }).then((response) =>{
                    if (!response.ok) { throw response; } return response.json();
                }).then((data) =>{
                    let geopoints = {lat: event.latLng.lat(), lng: event.latLng.lng()};
                    if(route.route && Object.keys(route.route).length != 0){
                        clk.setContent(`${data[0].formatted_address}<br/><br/>
                            <a class='infoLink' onclick='addStop(${JSON.stringify({Geopoints:{lat: geopoints.lat, lng: geopoints.lng}})})'>Add Stop</a>`)
                    }else{
                        clk.setContent(`${data[0].formatted_address}<br/><br/>
                            <a class='infoLink' onclick='onSelection(${JSON.stringify(geopoints)})'>Directions</a>`)
                    }
                    clk.setPosition(geopoints);
                    clk.open(this.map);
                    new google.maps.event.trigger( this.clk, 'click' );
                    document.getElementById('loading').style.display = 'none';
                    this.clks.push(clk)
                }).catch((error) =>{
                        console.log('Request failed', error);
                });
            }
        });
        google.maps.event.addListenerOnce(map, 'idle', () =>{
            this.map = map;
            document.getElementById('loading').style.display = 'none';
        });
    }
}
