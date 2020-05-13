class Route {
    constructor(){
        this.destination = {}
    }
    get_route(destination = {}){
        if(Object.keys(destination).length != 0){
            var mode = document.getElementById("drivingMode");
            var sel = mode.options[mode.selectedIndex].value;
            document.getElementById('loadfor').innerHTML = 'Finding Route';
            document.getElementById('loading').style.display = '';
            this.current_position = home.geopos;
            this.destination = destination;
            var googleObj = gapi.auth2.getAuthInstance();
            var token = googleObj.currentUser.je.tc.access_token
            fetch('http://localhost:3000/maps/navigation', {  
                method: 'post',
                body: JSON.stringify({start: home.geopos, destination, email: acc.email, token: token, mode: sel}),
                headers: {
                    'Content-Type': "application/json"
                },
            }).then(function (response) {
                    if (!response.ok) {
                        throw response;
                    }
                    return response.json();
            }).then(function(data){
                if(data.length < 1){
                    alert('suggest you take flight to your destination.\nHere are nearby airports.')
                }
                this.route = data;
                home.loadmap(data);
                console.log(data)
            }.bind(this)).catch(function(error){
                document.getElementById('loading').style.display = 'none';
                console.log('Request failed', error);
            })
        }else{ document.getElementById('loading').style.display = 'none'; }
    }

    lets_roll(){
        var map = new google.maps.Map(document.getElementById('map'), {
            center: this.route[0].legs[0].start_location,
            zoom: 18,
            disableDefaultUI: true,
            clickableIcons: false,
            mapTypeId: 'satellite',
            tilt: 45,
            rotateControl: true
            });
    }
}