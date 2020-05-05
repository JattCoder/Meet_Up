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
                all_locations = data;
                console.log(all_locations);
                alert('got data here');
        }).catch(function(error){
                console.log('Request failed', error);
        })
    }

    all_locations() {
        alert("were in locations")
        all_locations
        debugger
    }
}