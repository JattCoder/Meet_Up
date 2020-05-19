class Account {
    constructor(googleUser) {
        fetch('http://localhost:3000/user', {  
            method: 'post',
            body: JSON.stringify({name:googleUser.Pt["Ad"], email:googleUser.Pt["yu"], uid:googleUser.Pt["MU"], image:googleUser.Pt["QK"]}),
            headers: {
                'Content-Type': "application/json"
            },
        }).then((response) =>{
            if (!response.ok){ throw response }
            return response.json();
        }).then((data) =>{
            this.email = googleUser.Pt["yu"]
            this.name = googleUser.Pt["Ad"]
            let highway = document.getElementById('highways').checked;
            let tolls = document.getElementById('tolls').checked;
            let ferries = document.getElementById('ferries').checked;
            if(highway != data.highways) document.getElementById('highways').dispatchEvent(new MouseEvent("click"));
            if(tolls != data.tolls) document.getElementById('tolls').dispatchEvent(new MouseEvent("click"));
            if(ferries != data.ferries) document.getElementById('ferries').dispatchEvent(new MouseEvent("click"));
        }).catch((error) =>{
            document.getElementById('loadfor').innerHTML = 'Error';
            setTimeout(() =>{
                document.getElementById('loading').style.display = 'none';
            },2000)
        });
    }

    plot(){
            if (navigator.geolocation) {
                let timeoutVal = 10 * 1000 * 1000;
                orienMotion();
                navigator.geolocation.getCurrentPosition((position) =>{
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
                    let me = this.me;
                    document.getElementById('loading').style.display = 'none';
                    const meinfo = new google.maps.InfoWindow();
                    google.maps.event.addListener(me, 'click', ((me) =>{
                        return () => {
                            meinfo.setContent(`${this.name}</br>
                            ${acc.geopos}`);
                            meinfo.open(home.map, me);
                        }
                    })(me));
                    home.map.setCenter({lat:position.coords.latitude, lng:position.coords.longitude});
                },(error) =>{
                    alert(error.message);
                },{ enableHighAccuracy: true, timeout: timeoutVal, maximumAge: 0 });
            } else {
                console.log("Geolocation not supported!")
            }
    }

}