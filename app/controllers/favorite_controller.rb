class FavoriteController < ApplicationController

    def new
        Favorite.new({user_id: User.find_by(email:params[:email]).id, name: params[:name], address: params[:address], latitude: params[:geo]["lat"], longitude: params[:geo]["lng"]}).save
    end

    def all
        render json: Favorite.where(user_id: User.find_by(email: params[:email]).id)
    end

    def delete
        
    end

end