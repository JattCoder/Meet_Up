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

    def distance (loc1, loc2)
        rad_per_deg = Math::PI/180  # PI / 180
        rkm = 6371                  # Earth radius in kilometers
        rm = rkm * 1000             # Radius in meters
      
        dlat_rad = (loc2[0]-loc1[0]) * rad_per_deg  # Delta, converted to rad
        dlon_rad = (loc2[1]-loc1[1]) * rad_per_deg
      
        lat1_rad, lon1_rad = loc1.map {|i| i * rad_per_deg }
        lat2_rad, lon2_rad = loc2.map {|i| i * rad_per_deg }
      
        a = Math.sin(dlat_rad/2)**2 + Math.cos(lat1_rad) * Math.cos(lat2_rad) * Math.sin(dlon_rad/2)**2
        c = 2 * Math::atan2(Math::sqrt(a), Math::sqrt(1-a))
      
        meters = rm * c # Delta in meters
        miles = meters * 0.000621371
        return miles
      end

end