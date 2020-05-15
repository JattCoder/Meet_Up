function onLoad (){
    document.getElementById("settings").style.display = 'none';
    document.getElementById("logout_btn").style.display = 'none';
    search = new Search();
    home = new Index;
    favs = new Favorites();
    home.loadmap();
}

function onSearch (){
    var currentUser = gapi.auth2.getAuthInstance().currentUser.je.Pt;
    if (currentUser){
        document.getElementById('loadfor').innerHTML = 'Searching';
        document.getElementById('loading').style.display = '';
        search.spots(document.getElementById("search").value);
        search.plot();
    }else{
        alert("Please Sign in!")
        onSettings();
    }
}

function onMapSpot(event){
    search.spot(event);
}

function onSelection (geo){
    route.get_route(geo);
}

function toFav(location){
    favs.add_new(location);
}

function unlike(location){
    favs.remove(location);
}

function addStop(geo){
    route.waypoints.push(String(geo.Geopoints.lat+","+geo.Geopoints.lng))
    route.get_route(route.destination);
}

function removeStop(index){
    route.waypoints.splice(index, 1);
    route.markers[index].setMap(null);
    route.markers.splice(index, 1);
    route.get_route(route.destination);
}

function cancelRoute(){
    route.flightPath.setMap(null);
    route.destination = [];
    for(index in route.markers){ route.markers[index].setMap(null); }
    home.map.setZoom(15);
    home.map.setCenter(acc.geopos);
}

function letsGo(){
    route.lets_roll();
}

function onSettings (){
    var settings = document.getElementById("settings").style.display;
    if (settings == ''){
        document.getElementById("settings").style.display = 'none';
        document.getElementById("map").style.filter = ""
        next = new Settings();
        next.save_settings();
    }else{
        document.getElementById("map").style.filter = "blur(3px)"
        document.getElementById("settings").style.display = '';
    }
}

function onSignIn(googleUser) {
    if (googleUser){
        acc = new Account(googleUser);
        acc.plot();
        favs = new Favorites();
        route = new Route();
        favs.add_to_maps(googleUser);
        document.getElementById("login_btn").style.display = 'none';
        document.getElementById("logout_btn").value = googleUser.Pt["Ad"]+" - Signout";
        document.getElementById("logout_btn").style.display = '';
    }else{
        alert("Authorization Failed!");
    }
}

function signOut() {
    var googleObj = gapi.auth2.getAuthInstance();
    var name = googleObj.currentUser.je["Pt"]["Ad"];
    googleObj.signOut().then(function () {
        alert(name+' signed out.');
        document.getElementById("logout_btn").style.display = 'none';
        document.getElementById("login_btn").style.display = '';
    });
}

function orienMotion(){
    window.addEventListener('deviceorientation', function(event) {
        var alpha = null;
        if (event.webkitCompassHeading) {
            alpha = event.webkitCompassHeading;
        }
        else {
            alpha = event.alpha;
        }
        var locationIcon = acc.me.get('icon');
        locationIcon.rotation = 360 - alpha;
        acc.me.set('icon', locationIcon);
    }, true);
    window.addEventListener('devicemotion', function(event) {
        //console.log(event.acceleration.x + ' m/s2');
        if(navigator.geolocation){
            navigator.geolocation.getCurrentPosition(function(position){
                var locationIcon = acc.me.get('position');
                locationIcon.position = {lat:position.coords.latitude, lan:position.coords.longitude};
                acc.me.set('position', locationIcon);
                home.map.setCenter({lat:position.coords.latitude, lan:position.coords.longitude})
                acc.geopos = {lat:position.coords.latitude, lan:position.coords.longitude}
            })
        }
    });
}