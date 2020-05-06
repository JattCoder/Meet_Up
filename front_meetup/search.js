class Search {
    constructor(input){
        var all_locations = []
        fetch('http://localhost:3000/maps/places', {  
            method: 'post',
            body: JSON.stringify({search: input}),
            headers: {
                'Content-Type': "application/json"
            },
        }).then(function (response) {
                if (!response.ok) {
                    throw response;
                }
                return response.json();
        }).then(function(data){
            home = new Index;
            home.loadmap(data);
        }).catch(function(error){
                console.log('Request failed', error);
        })
    }
}