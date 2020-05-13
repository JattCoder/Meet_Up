class NavigationController < ApplicationController

    def navigate
        highways = 'highways'
        ferries = 'ferries'
        tolls = 'tolls'
        coors = []
        mode = params[:mode]
        destination = [params[:destination][:lat],params[:destination][:lng]]
        start = [params[:start][:lat], params[:start][:lng]]
        settings = Setting.find_by(user_id: User.find_by(email: params[:email]).id)
        highways = '' if settings.highways == false
        ferries = '' if settings.ferries == false
        tolls = '' if settings.tolls == false
        gmaps = GoogleMapsService::Client.new(
            key: Rails.application.credentials.production[:api_key], 
            retry_timeout: 40, 
            queries_per_second: 80
        )
        waypoints = {lat: 41.4186983,lng: -81.7364368}
        routes = gmaps.directions(
            start, 
            destination, 
            mode: mode, 
            alternatives: false,
            avoid: [highways, ferries, tolls],
            waypoints: '', #if user choose to share location and meetup will be figured out after looking through google contacts
            language: 'en' #default is en, will be able to change to different language
        )
        render json: routes
    end

    def check_contacts

    end
end
