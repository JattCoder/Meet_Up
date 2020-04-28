class SearchController < ApplicationController

    def places
        client = GooglePlaces::Client.new(Rails.application.credentials.production[:api_key])
        results = client.spots_by_query(params[:search])
        # render :json results :only[:name, :latitude, :longitude]
    end

end