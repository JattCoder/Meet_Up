class NavigationController < ApplicationController

    def navigate
        highways = 'highways'
        ferries = 'ferries'
        tolls = 'tolls'
        destination = [params[:destination][:lat],params[:destination][:lng]]
        start = [params[:start][:lat], params[:start][:lng]]
        settings = Setting.find_by(user_id: User.find_by(email: params[:email]).id)
        highways = '' if settings.highways == false
        ferries = '' if settings.ferries == false
        tolls = '' if settings.tolls == false
        gmaps = GoogleMapsService::Client.new(
            key: Rails.application.credentials.production[:api_key], 
            retry_timeout: 20, 
            queries_per_second: 10
        )
        render json: routes = gmaps.directions(
            start, 
            destination, 
            mode: 'driving', #default is driving, in future will be able to change to walking, transit or driving
            alternatives: false,
            avoid: highways,
            avoid: ferries,
            avoid: tolls,
            waypoints: '', #if user choose to share location and meetup will be figured out after looking through google contacts
            language: 'en' #default is en, will be able to change to different language
        )
        
    end

end

#bounds
#legs
#overview_polyline
#summary
#warnings
#waypoint_order
