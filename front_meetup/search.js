class Search {
    spots(input){
        fetch('http://localhost:3000/maps/places', {  
            method: 'post',
            body: JSON.stringify({search: input}),
            headers: {
                'Content-Type': "application/json"
            },
        }).then(function (response) {
                if (!response.ok) {
                    throw response;
                }
                return response.json();
        }).then(function(data){
            //home = new Index;
            home.loadmap(data);
            this.all_locations = data;
        }.bind(this)).catch(function(error){
            document.getElementById('loading').style.display = 'none';
            console.log('Request failed', error);
        })
    }

    spot(event){
        fetch('http://localhost:3000/maps/spot', {  
            method: 'post',
            body: JSON.stringify({placeid: event.placeId}),
            headers: {
                'Content-Type': "application/json"
            },
        }).then(function (response) {
                if (!response.ok) {
                    throw response;
                }
                return response.json();
        }).then(function(location){
            console.log(location)
                //var mdinfo = new google.maps.InfoWindow();
                var mdinfo = home.mdinfo;
                if(location.Status == null && location.Rating == null && location.Total_Ratings == null){
                    mdinfo.setContent(`${location.Address}<br/><br/>
                        <a onclick='onSelection(${JSON.stringify(location.Geopoints)})'>Directions</a> <br/>
                        <a onclick='toFav(${JSON.stringify(location)})'>Add to Favorites</a>`);
                }else{
                    mdinfo.setContent(`${location.Status}<br/><br/>${location.Name}<br/>${location.Address}
                        <br/>Rating: ${location.Rating} (${location.Total_Ratings})<br/><br/>
                        <a onclick='onSelection(${JSON.stringify(location.Geopoints)})'>Directions</a> <br/>
                        <a onclick='toFav(${JSON.stringify(location)})'>Add to Favorites</a>`);
                }
                mdinfo.setPosition({lat: location.Geopoints.lat, lng:location.Geopoints.lng});
                mdinfo.open(home.map, this);
                mdinfo.open(home.map, this);
            
                home.map.setCenter({lat: location.Geopoints.lat, lng:location.Geopoints.lng});
                new google.maps.event.trigger( mdinfo, 'click' );
        }).catch(function(error){
                console.log('Request failed', error);
        })
        //console.log('You clicked on place:' + event.placeId + ', location: ' + event.latLng);
    }
}