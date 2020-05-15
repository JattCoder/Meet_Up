class Account {
    constructor(googleUser) {
        fetch('http://localhost:3000/user/new', {  
            method: 'post',
            body: JSON.stringify({name:googleUser.Pt["Ad"], email:googleUser.Pt["yu"], uid:googleUser.Pt["MU"], image:googleUser.Pt["QK"]}),
            headers: {
                'Content-Type': "application/json"
            },
        }).then(function(response){
            if (!response.ok){ throw response }
            return response.json();
        }).then(function(data){
            this.email = googleUser.Pt["yu"]
            this.name = googleUser.Pt["Ad"]
            var highway = document.getElementById('highways').checked;
            var tolls = document.getElementById('tolls').checked;
            var ferries = document.getElementById('ferries').checked;
            if(highway != data.highways) document.getElementById('highways').dispatchEvent(new MouseEvent("click"));
            if(tolls != data.tolls) document.getElementById('tolls').dispatchEvent(new MouseEvent("click"));
            if(ferries != data.ferries) document.getElementById('ferries').dispatchEvent(new MouseEvent("click"));
        }.bind(this)).catch(function(error){
            console.log('Request failed', error);
        });
    }

    plot(){
            if (navigator.geolocation) {
                var timeoutVal = 10 * 1000 * 1000;
                orienMotion();
                navigator.geolocation.getCurrentPosition(function(position) {
                    this.geopos = {lat:position.coords.latitude, lng:position.coords.longitude};
                    this.me = new google.maps.Marker({
                        position: new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
                        //animation: google.maps.Animation.DROP,
                        map: home.map,
                        icon: {
                            path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                            strokeColor : '#FFCC00',
                            strokeWeight : 5,
                            scale: 2.5
                        },
                    });
                    var me = this.me;
                    document.getElementById('loading').style.display = 'none';
                    var meinfo = new google.maps.InfoWindow();
                    google.maps.event.addListener(me, 'click', ((me) =>{
                        return () => {
                            meinfo.setContent(`${this.name}`);
                            meinfo.open(home.map, me);
                        }
                    })(me));
                    home.map.setCenter({lat:position.coords.latitude, lng:position.coords.longitude});
                }.bind(this), function(error) {
                    alert(error.message);
                },{ enableHighAccuracy: true, timeout: timeoutVal, maximumAge: 0 });
            } else {
                console.log("Geolocation not supported!")
            }
    }

}