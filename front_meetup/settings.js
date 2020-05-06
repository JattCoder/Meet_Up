class Settings {
    save_settings(){
        var email = gapi.auth2.getAuthInstance().currentUser["je"].Pt.yu;
        var highway = document.getElementById('highways').checked;
        var tolls = document.getElementById('tolls').checked;
        var ferries = document.getElementById('ferries').checked;
        fetch('http://localhost:3000/user/settings', {  
            method: 'post',
            body: JSON.stringify({highway, tolls, ferries, email}),
            headers: {
                'Content-Type': "application/json"
            },
        }).catch(function(error){
            console.log('Request failed', error);
        });
    }

    re_route(){

    }
}