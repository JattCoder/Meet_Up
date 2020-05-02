class UserController < ApplicationController

    def new
    end

    def login
        redirect_to menu_path if session[:user_id] != nil
    end
    
end