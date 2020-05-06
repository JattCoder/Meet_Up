class SettingController < ApplicationController

    def update_settings
        setting = Setting.find_by(user_id: User.find_by(email: params[:email]).id)
        setting.ferries = params[:ferries]
        setting.tolls = params[:tolls]
        setting.highways = params[:highway]
        setting.save
    end

end