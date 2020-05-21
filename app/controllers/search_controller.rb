class SearchController < ApplicationController

    def spot
        results = []
        client = GooglePlaces::Client.new(Rails.application.credentials.production[:api_key])
        business = client.spot(params[:placeid])
        render json: info = {
            "Name" => business["json_result_object"]["name"],
            "Status" => business["json_result_object"]["business_status"],
            "Address" => business["json_result_object"]["formatted_address"],
            "Type" => business["json_result_object"]["types"][0],
            "Geopoints" => business["json_result_object"]["geometry"]["location"],
            "Rating" => business ["json_result_object"]["rating"],
            "Total_Ratings" => business["json_result_object"]["user_ratings_total"]
        }
    end

    def geocode 
        results = []
        gmaps = GoogleMapsService::Client.new(
            key: Rails.application.credentials.production[:api_key], 
            retry_timeout: 40, 
            queries_per_second: 80
        )
        render json: gmaps.reverse_geocode([params[:geo].split(',')[0].to_f,params[:geo].split(',')[1].to_f])

    end

end