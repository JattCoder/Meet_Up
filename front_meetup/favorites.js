class Favorites {

    add_to_maps(googleUser){
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
            var i, infoWindow = new google.maps.InfoWindow();
            this.markers = []
            for (i = 0; i < data.length; i++) { 
                var marker = new google.maps.Marker({
                  position: new google.maps.LatLng(data[i].latitude, data[i].longitude),
                  animation: google.maps.Animation.DROP,
                  map: home.map,
                  icon: 'https://img.icons8.com/emoji/48/000000/yellow-heart.png'
                });
                var geos = {'lat': data[i].latitude, 'lng': data[i].longitude}
                google.maps.event.addListener(marker, 'click', ((marker, i) =>{
                  return () => {
                    infoWindow.setContent(`${data[i].name}<br/>${data[i].address}</br></br>
                                <a onclick='onSelection(${JSON.stringify(geos)})'>Directions</a> <br/>
                                <a onclick='unlike(${JSON.stringify(data[i])})'>Remove Favorite</a>`)
                    infoWindow.open(home.map, marker);
                  }
                })(marker, i));
                this.markers.push(marker)
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
        }).then(function(res){
            if(res.ok){
                alert(location.Name+" was added");
            }else{
                throw res;
            }
        }).catch(function(error){
            alert(location.Name+" failed to add to your favorites.")
            console.log('Request failed', error);
        })
    }

    remove(location){
        fetch('http://localhost:3000/maps/favorites/delete', {  
            method: 'post',
            body: JSON.stringify({id: location.id}),
            headers: {
                'Content-Type': "application/json"
            },
        }).then(function(res){
            if(res.ok){
                alert(location.Name+" was removed from favorites.");
            }else{
                throw res;
            }
        }).catch(function(error){
                alert(location.Name+" failed to remove from favorites.")
                console.log('Request failed', error);
        })
    }
}