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
            this.markers = []
            this.infowindow = []
            this.data = data;
            this.plot();
        }.bind(this)).catch(function(error){
            document.getElementById('loadfor').innerHTML = 'Failed to fetch your Favorites';
            setTimeout(function(){
                document.getElementById('loading').style.display = 'none';
            },2000)
        })
    }

    plot(){
        var data = this.data;
        var i, infoWindow = new google.maps.InfoWindow();
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
                            <a onclick='unlike(${JSON.stringify(i)})'>Remove Favorite</a>`)
                infoWindow.open(home.map, marker);
              }
            })(marker, i));
            this.markers.push(marker);
            this.infowindow.push(infoWindow);
        }
    }

    add_new(location){
        fetch('http://localhost:3000/maps/favorites/new', {  
            method: 'post',
            body: JSON.stringify({name: location.Name, address: location.Address, geo: location.Geopoints, email: acc.email}),
            headers: {
                'Content-Type': "application/json"
            },
        }).then(function(res){
            if(!res.ok){ throw res; }
        }).then(function(data){
            this.data = data;
            document.getElementById('loadfor').innerHTML = location.Name+' Added';
            setTimeout(function(){
                document.getElementById('loading').style.display = 'none';
            },2000)
        }.bind(this)).catch(function(error){
            document.getElementById('loadfor').innerHTML = 'Failed to add '+location.Name;
            setTimeout(function(){
                document.getElementById('loading').style.display = 'none';
            },2000)
        })
    }

    remove(index){
        var location = this.data[index];
        fetch('http://localhost:3000/maps/favorites/delete', {  
            method: 'post',
            body: JSON.stringify({id: location.id, email: acc.email}),
            headers: {
                'Content-Type': "application/json"
            },
        }).then(function(res){
            if(!res.ok){ throw res; }
        }).then(function(data){
            this.data = data;
            document.getElementById('loadfor').innerHTML = location.name+' Removed';
            setTimeout(function(){
                document.getElementById('loading').style.display = 'none';
            },2000)
            for(var num in favs.infowindow) { favs.infowindow[num].close(); }
            favs.markers[index].setMap(null);
        }.bind(this)).catch(function(error){
            document.getElementById('loadfor').innerHTML = 'Failed to remove '+location.name;
            setTimeout(function(){
                document.getElementById('loading').style.display = 'none';
            },2000)
        })
    }
}