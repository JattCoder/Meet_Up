class Search {
    constructor(input){
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
            //home = new Index;
            home.loadmap(data);
            this.all_locations = data;
        }.bind(this)).catch(function(error){
                console.log('Request failed', error);
        })
    }
}