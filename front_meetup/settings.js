class Settings {
    save_settings(){
        document.getElementById('loadfor').value = 'Saving'
        document.getElementById('loading').style.display = '';
        let email = gapi.auth2.getAuthInstance().currentUser["je"].Pt.yu;
        let highway = document.getElementById('highways').checked;
        let tolls = document.getElementById('tolls').checked;
        let ferries = document.getElementById('ferries').checked;
        fetch('http://localhost:3000/user/settings', {  
            method: 'post',
            body: JSON.stringify({highway, tolls, ferries, email}),
            headers: {
                'Content-Type': "application/json"
            },
        }).then((res) =>{
            if(res.ok){
                route.get_route(route.destination);
            }else{
                throw response;
            }
        })
        .catch((error) =>{
            document.getElementById('loadfor').innerHTML = 'Error';
            setTimeout(() =>{
                document.getElementById('loading').style.display = 'none';
            },2000)
        });
    }
}