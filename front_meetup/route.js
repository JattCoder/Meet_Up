class Route {
    constructor(destination){
        this.current_position = home.geopos;
        this.destination = destination;
        fetch('http://localhost:3000/maps/navigation', {  
            method: 'post',
            body: JSON.stringify({start: home.geopos, destination, email: acc.email}),
            headers: {
                'Content-Type': "application/json"
            },
        }).then(function (response) {
                if (!response.ok) {
                    throw response;
                }
                return response.json();
        }).then(function(data){
            home.loadmap(data);
            console.log(data)
        }).catch(function(error){
                console.log('Request failed', error);
        })
    }
}