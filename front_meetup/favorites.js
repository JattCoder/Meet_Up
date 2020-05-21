class Favorites {

    constructor(){
        this.markers = []
        this.infowindow = []
        this.data = []
    }

    add_to_maps(googleUser){
        let get = new URL("http://localhost:3000/maps/favorites"),
            params = {email: googleUser.getBasicProfile().getEmail()}
            Object.keys(params).forEach(key => get.searchParams.append(key, params[key]))
        fetch(get).then((response) =>{
            if (!response.ok) { throw response; }
            return response.json();
        }).then((data) =>{
            this.data = data;
            this.plot();
        }).catch((error) =>{
            document.getElementById('loadfor').innerHTML = 'Failed to fetch your Favorites';
            setTimeout(() =>{
                document.getElementById('loading').style.display = 'none';
            },2000)
        })
    }

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
                            <a class='infoLink' onclick='onSelection(${JSON.stringify(geos)})'>Directions</a> <br/>
                            <a class='infoLink' onclick='unlike(${JSON.stringify(i)})'>Remove Favorite</a>`)
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
        }).then((response) =>{
            if (!response.ok) { throw response; }
            return response.json();
        }).then((data) =>{
            document.getElementById('loadfor').innerHTML = location.Name+' Added';
            for(let index in search.infowindows) { search.infowindows[index].close(); }
            for(let index in this.infowindow) { this.infowindow[index].close(); }
            for(let index in this.markers) { this.markers[index].setMap(null); }
            this.data = data;
            this.plot();
            setTimeout(() =>{
                document.getElementById('loading').style.display = 'none';
            },2000)
        }).catch((error) =>{
            console.log(error)
            document.getElementById('loadfor').innerHTML = 'Failed to add '+location.Name;
            setTimeout(() =>{
                document.getElementById('loading').style.display = 'none';
            },2000)
        })
    }

    remove(index){
        let info = this.data[index];
        fetch('http://localhost:3000/maps/favorites/'+info.id, {  
            method: 'delete',
            body: JSON.stringify({id: info.id, email: acc.email}),
            headers: {
                'Content-Type': "application/json"
            },
        }).then((response) =>{
            if (!response.ok) { throw response; }
            return response.json();
        }).then((data) =>{
            this.data = data;
            document.getElementById('loadfor').innerHTML = info.name+' Removed';
            setTimeout(() =>{
                document.getElementById('loading').style.display = 'none';
            },2000)
            for(let num in favs.infowindow) { favs.infowindow[num].close(); }
            for(let num in favs.markers) { favs.markers[num].setMap(null); }
            //this.markers[index].setMap(null);
            this.plot()
        }).catch((error) =>{
            debugger
            document.getElementById('loadfor').innerHTML = 'Failed to remove '+info.name;
            setTimeout(() =>{
                document.getElementById('loading').style.display = 'none';
            },2000)
        })
    }
}