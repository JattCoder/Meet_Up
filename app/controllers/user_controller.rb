class UserController < ApplicationController

    def new
        settings = {}
        user = User.find_by(email: params[:email])
        if user == nil
            user = User.new({name: params[:name], email: params[:email], uid: params[:uid], image: params[:image]})
            if user.save
                set = Setting.new({user_id: user.id, location_share: false, ferries: false, tolls: false, highways: false})
                if !set.save
                    User.destroy(id: user.id)
                end
            end
        end
        profile_settings = Setting.find_by(user_id: user.id)
        settings = {
            "location" => profile_settings.location_share,
            "ferries" => profile_settings.ferries,
            "tolls" => profile_settings.tolls,
            "highways"=> profile_settings.highways
        }
        render json: settings
    end
    
end