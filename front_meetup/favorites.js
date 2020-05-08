class Favorites {

    add_to_maps(googleUser,map){
        fetch('http://localhost:3000/maps/favorites/all', {  
            method: 'post',
            body: JSON.stringify({email: googleUser.Pt["yu"]}),
            headers: {
                'Content-Type': "application/json"
            },
        }).then(function (response) {
                if (!response.ok) { throw response; }
                return response.json();
        }).then(function(data){
            var marker, i, infoWindow = new google.maps.InfoWindow();
            for (i = 0; i < data.length; i++) { 
                marker = new google.maps.Marker({
                  position: new google.maps.LatLng(data[i].latitude, data[i].longitude),
                  animation: google.maps.Animation.DROP,
                  map: map,
                  icon: 'https://img.icons8.com/emoji/48/000000/yellow-heart.png'
                });
                var geos = {'lat': data[i].latitude, 'lng': data[i].longitude}
                google.maps.event.addListener(marker, 'click', ((marker, i) =>{
                  return () => {
                    infoWindow.setContent(`${data[i].name}<br/>${data[i].address}</br></br>
                                <a onclick='onSelection(${JSON.stringify(geos)})'>Directions</a> <br/>
                                <a onclick='remove(${JSON.stringify(data[i])})'>Remove Favorite</a>`)
                    infoWindow.open(map, marker);
                  }
                })(marker, i));
            }
        }.bind(this)).catch(function(error){
                console.log('Request failed', error);
        })
    }

    add_new(location){
        fetch('http://localhost:3000/maps/favorites/new', {  
            method: 'post',
            body: JSON.stringify({name: location.Name, address: location.Address, geo: location.Geopoints, email: acc.email}),
            headers: {
                'Content-Type': "application/json"
            },
        }).catch(function(error){
                console.log('Request failed', error);
        })
    }

    remove(location){
        console.log(location)
    }
}