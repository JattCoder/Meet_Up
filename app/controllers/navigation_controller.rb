class NavigationController < ApplicationController

    def navigate
        #settings = Settings.find_by(userid: current_user.id)
        gmaps = GoogleMapsService::Client.new(
            key: Rails.application.credentials.production[:api_key], 
            retry_timeout: 20, 
            queries_per_second: 10
        )
        render json: routes = gmaps.directions(
            '5625 W Long Ridge Dr, Seven Hills, OH 44131', 
            '4621 Broadview Rd, Cleveland, OH 44109', 
            mode: 'driving', #fetch mode from settings 
            alternatives: false,
            avoid: 'highways', #fetch highway from settings
            avoid: 'ferries', #fetch ferries from settings 
            avoid: 'tolls', #fetch tolls from settings 
            waypoints: '', #if user choose to share location and meetup will be figured out after looking through google contacts
            language: 'en' #fetch language from settings
        )
    end

end

#bounds
#legs
#overview_polyline
#summary
#warnings
#waypoint_order
