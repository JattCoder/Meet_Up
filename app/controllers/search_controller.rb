class SearchController < ApplicationController

    def places
        results = []
        client = GooglePlaces::Client.new(Rails.application.credentials.production[:api_key])
        client.spots_by_query(params[:search]).each do |business|
            info = {
                "Name" => business["json_result_object"]["name"],
                "Status" => business["json_result_object"]["business_status"],
                "Address" => business["json_result_object"]["formatted_address"],
                "Type" => business["json_result_object"]["types"][0],
                "Geopoints" => business["json_result_object"]["geometry"]["location"],
                "Rating" => business ["json_result_object"]["rating"],
                "Total Ratings" => business["json_result_object"]["user_ratings_total"]
            }
            results << info
        end
        # render :json results :only[:name, :latitude, :longitude]
    end

end