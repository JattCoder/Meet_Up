class Settings {
    save_settings(){
        document.getElementById('loadfor').value = 'Saving'
        document.getElementById('loading').style.display = '';
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
        }).then(function(res){
            if(res.ok){
                route.get_route(route.destination);
            }else{
                throw response;
            }
        })
        .catch(function(error){
            document.getElementById('loadfor').innerHTML = 'Error';
            setTimeout(function(){
                document.getElementById('loading').style.display = 'none';
            },2000)
        });
    }
}