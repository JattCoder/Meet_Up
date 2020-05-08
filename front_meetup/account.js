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

}