function onLoad (){
    document.getElementById("settings").style.display = 'none';
    document.getElementById("logout_btn").style.display = 'none';
    search = new Search();
    home = new Index;
    home.loadmap();
}

function onSearch (){
    var currentUser = gapi.auth2.getAuthInstance().currentUser.je.Pt;
    if (currentUser){
        search.spots(document.getElementById("search").value);
    }else{
        alert("Please Sign in!")
        onSettings();
    }
}

function onMapSpot(event){
    search.spot(event);
}

function onSelection (geo){
    console.log(acc.email+"\nMy Location: "+home.geopos.lat+" : "+home.geopos.lng+"\nDestination: "+geo.lat+" : "+geo.lng);
    route = new Route(geo);
}

function toFav(location){
    favs.add_new(location);
}

function letsGo(route){
    //console.log(route);
    //alert("lets go");
    debugger
    route.lets_roll;
}

function onSettings (){
    var settings = document.getElementById("settings").style.display;
    if (settings == ''){
        document.getElementById("settings").style.display = 'none';
        document.getElementById("map").style.filter = ""
        next = new Settings();
        next.save_settings();
        route = new Route();
    }else{
        document.getElementById("map").style.filter = "blur(3px)"
        document.getElementById("settings").style.display = '';
    }
}

function onSignIn(googleUser) {
    if (googleUser){
        acc = new Account(googleUser);
        favs = new Favorites();
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

function handleOrientation(event) {
    var x = event.beta;
    var y = event.gamma;
    var z = event.alpha;
    var absolute = event.absolute;
    var rad = Math.atan2(y, x);
    var deg = rad * (180 / Math.PI);
    var screenOrientation = screen.orientation || screen.mozOrientation || screen.msOrientation;
    var angle = screenOrientation.angle || window.orientation || 0; 
    deg = deg + angle; 
    this.icon = {
            path: window.google.maps.SymbolPath.ROUND_CLOSED_ARROW,
            scale: 6,
            fillColor: 'red',
            fillOpacity: 0.8,
            strokeWeight: 2,
            rotation: deg
    }
}