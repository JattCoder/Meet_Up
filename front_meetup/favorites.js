class Favorites {

    constructor(){
        this.markers = []
        this.infowindow = []
        this.data = []
    }

    add_to_maps(googleUser){
        let get = new URL("http://localhost:3000/maps/favorites"),
            params = {email: googleUser.Pt.yu}
            Object.keys(params).forEach(key => get.searchParams.append(key, params[key]))
        fetch(get).then(function (response) {
            if (!response.ok) { throw response; }
            return response.json();
        }).then(function(data){
            this.data = data;
            this.plot();
        }.bind(this)).catch(function(error){
            document.getElementById('loadfor').innerHTML = 'Failed to fetch your Favorites';
            setTimeout(function(){
                document.getElementById('loading').style.display = 'none';
            },2000)
        })
    }

    //read me
    //use es6
    

    plot(){
        let data = this.data;
        let i, infoWindow = new google.maps.InfoWindow();
        for (i = 0; i < data.length; i++) { 
            let marker = new google.maps.Marker({
              position: new google.maps.LatLng(data[i].latitude, data[i].longitude),
              animation: google.maps.Animation.DROP,
              map: home.map,
              icon: 'https://img.icons8.com/emoji/48/000000/yellow-heart.png'
            });
            let geos = {'lat': data[i].latitude, 'lng': data[i].longitude}
            google.maps.event.addListener(marker, 'click', ((marker, i) =>{
              return () => {
                if(home.clks) for(let index in home.clks) home.clks[index].close();
                if(search.mapclk.length > 0) for(let index in search.mapclk) search.mapclk[index].close();
                infoWindow.setContent(`${data[i].name}<br/>${data[i].address}</br></br>
                            <a onclick='onSelection(${JSON.stringify(geos)})'>Directions</a> <br/>
                            <a onclick='unlike(${JSON.stringify(data[i])})'>Remove Favorite</a>`)
                infoWindow.open(home.map, marker);
              }
            })(marker, i));
            this.markers.push(marker);
            this.infowindow.push(infoWindow);
        }
    }

    add_new(location){
        fetch('http://localhost:3000/maps/favorites', {  
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
            for(let index in search.infowindows) { search.infowindows[index].close(); fav.plot(); }
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

    remove(info){
        fetch('http://localhost:3000/maps/favorites/'+info.id, {  
            method: 'delete',
            body: JSON.stringify({id: info.id, email: acc.email}),
            headers: {
                'Content-Type': "application/json"
            },
        }).then(function(res){
            if(!res.ok){ throw res; }
        }).then(function(data){
            this.data = data;
            document.getElementById('loadfor').innerHTML = info.name+' Removed';
            setTimeout(function(){
                document.getElementById('loading').style.display = 'none';
            },2000)
            for(let num in this.infowindow) { this.infowindow[num].close(); }
            this.markers[index].setMap(null);
        }.bind(this)).catch(function(error){
            document.getElementById('loadfor').innerHTML = 'Failed to remove '+info.name;
            setTimeout(function(){
                document.getElementById('loading').style.display = 'none';
            },2000)
        })
    }
}