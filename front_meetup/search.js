class Search {

    constructor(){
        this.infowindows = [];
        this.markers = [];
        this.mapclk = [];
    }

    spots(input){
        fetch('http://localhost:3000/maps/places', {  
            method: 'post',
            body: JSON.stringify({search: input}),
            headers: {
                'Content-Type': "application/json"
            },
        }).then((response) =>{
                if (!response.ok) {
                    throw response;
                }
                return response.json();
        }).then((data) =>{
            for (let i = 0; i < favs.markers.length; i++){ favs.markers[i].setMap(null);}
            if(home.clks) for(let index in home.clks) home.clks[index].close();
            if(this.mapclk.length > 0) for(let index in this.mapclk) this.mapclk[index].close();
            if(favs.infowindow.length > 0) for(let index in favs.infowindow) favs.infowindow[index].close();
            this.plot(data);
        }).catch((error) =>{
            document.getElementById('loadfor').innerHTML = 'Failed to find '+input;
            setTimeout(() =>{
                document.getElementById('loading').style.display = 'none';
            },2000)
        })
    }

    spot(event){
        fetch('http://localhost:3000/maps/spot', {  
            method: 'post',
            body: JSON.stringify({placeid: event.placeId}),
            headers: {
                'Content-Type': "application/json"
            },
        }).then((response) =>{
                if (!response.ok) {
                    throw response;
                }
                return response.json();
        }).then((location) =>{
                document.getElementById('loading').style.display = 'none';
                const clkinfo = new google.maps.InfoWindow();
                if(route.route && Object.keys(route.route).length != 0){
                    clkinfo.setContent(`${location.Status}<br/><br/>${location.Name}<br/>${location.Address}
                            <br/>Rating: ${location.Rating} (${location.Total_Ratings})<br/><br/>
                            <a onclick='addStop(${JSON.stringify(location)})'>Add Stop</a>`);
                }else{
                    if(location.Status == null && location.Rating == null && location.Total_Ratings == null){
                        clkinfo.setContent(`${location.Address}<br/><br/>
                        <a onclick='onSelection(${JSON.stringify(location.Geopoints)})'>Directions</a> <br/>
                        <a onclick='toFav(${JSON.stringify(location)})'>Add to Favorites</a>`);
                    }else{
                        clkinfo.setContent(`${location.Status}<br/><br/>${location.Name}<br/>${location.Address}
                            <br/>Rating: ${location.Rating} (${location.Total_Ratings})<br/><br/>
                            <a onclick='onSelection(${JSON.stringify(location.Geopoints)})'>Directions</a> <br/>
                            <a onclick='toFav(${JSON.stringify(location)})'>Add to Favorites</a>`)
                    }
                }
                clkinfo.setPosition({lat: location.Geopoints.lat, lng:location.Geopoints.lng});
                clkinfo.open(home.map);
                this.mapclk.push(clkinfo);
                //home.map.setCenter({lat: location.Geopoints.lat, lng:location.Geopoints.lng});
                new google.maps.event.trigger( clkinfo, 'click' );
        }).catch((error) =>{
            document.getElementById('loadfor').innerHTML = 'Failed to get location information';
            setTimeout(() =>{
                document.getElementById('loading').style.display = 'none';
            },2000)
        })
        //console.log('You clicked on place:' + event.placeId + ', location: ' + event.latLng);
    }

    my_route(input){
        fetch('http://localhost:3000/maps/search_route', {  
            method: 'post',
            body: JSON.stringify({query: input, points: route.points}),
            headers: {
                'Content-Type': "application/json"
            },
        }).then((response) =>{ if (!response.ok) { throw response; } return response.json();
        }).then((data) =>{
            this.plot(data);
        }).catch((error) =>{
            document.getElementById('loadfor').innerHTML = 'Failed to find route';
            setTimeout(() =>{
                document.getElementById('loading').style.display = 'none';
            },2000)
        })
    }

    plot(location = []){
        const infoWindow = new google.maps.InfoWindow();
        if(this.markers){ for (let index in this.markers.length){ this.markers[index].setMap(null);} }
        if(this.clkinfo) { this.clkinfo.close(); }
        let i;
        let spots = [];
        for (i = 0; i < location.length; i++) {
            const marker = new google.maps.Marker({
                position: new google.maps.LatLng(location[i].Geopoints.lat, location[i].Geopoints.lng),
                animation: google.maps.Animation.DROP,
                map: home.map,
                icon: 'https://img.icons8.com/office/40/000000/marker.png'
            });
            google.maps.event.addListener(marker, 'click', ((marker, i) =>{
            return () => {
                if(route.route && Object.keys(route.route).length != 0){
                    infoWindow.setContent(`${location[i].Status}<br/><br/>${location[i].Name}<br/>${location[i].Address}
                            <br/>Rating: ${location[i].Rating} (${location[i].Total_Ratings})<br/><br/>
                            <a onclick='addStop(${JSON.stringify(location[i])})'>Add Stop</a>`);
                }else{
                    if(location[i].Status == null && location[i].Rating == null && location[i].Total_Ratings == null){
                        infoWindow.setContent(`${location[i].Address}<br/><br/>
                        <a onclick='onSelection(${JSON.stringify(location[i].Geopoints)})'>Directions</a> <br/>
                        <a onclick='toFav(${JSON.stringify(location[i])})'>Add to Favorites</a>`);
                    }else{
                        infoWindow.setContent(`${location[i].Status}<br/><br/>${location[i].Name}<br/>${location[i].Address}
                            <br/>Rating: ${location[i].Rating} (${location[i].Total_Ratings})<br/><br/>
                            <a value='directions' onclick='onSelection(${JSON.stringify(location[i].Geopoints)})'>Directions</a> <br/>
                            <a onclick='toFav(${JSON.stringify(location[i])})'>Add to Favorites</a>`)
                    }
                }
                infoWindow.open(home.map, marker);
            }})(marker, i));
            this.markers.push(marker);
            spots.push({lat:location[i].Geopoints.lat, lng:location[i].Geopoints.lng});
        }
        document.getElementById('loading').style.display = 'none';
        const bounds = new google.maps.LatLngBounds();
        for (let i = 0; i < spots.length; i++) { bounds.extend(spots[i]); }
        if(spots.length >= 1) { home.map.fitBounds(bounds); }
    }
}