class SearchController < ApplicationController

    def places
        results = []
        #input = params[:search].downcase.gsub('walk to') if params[:search].downcase.include?('walk')
        #console.log('look at the page and look for note to work on for extra feature')
        client = GooglePlaces::Client.new(Rails.application.credentials.production[:api_key])
        client.spots_by_query(params[:search]).each do |business|
            info = {
                "Name" => business["json_result_object"]["name"],
                "Status" => business["json_result_object"]["business_status"],
                "Address" => business["json_result_object"]["formatted_address"],
                "Type" => business["json_result_object"]["types"][0],
                "Geopoints" => business["json_result_object"]["geometry"]["location"],
                "Rating" => business ["json_result_object"]["rating"],
                "Total_Ratings" => business["json_result_object"]["user_ratings_total"]
            }
            results << info
        end
        render json: results
    end

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
        render json: gmaps.reverse_geocode(params[:geo])

    end

end