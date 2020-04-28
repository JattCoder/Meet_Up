class SessionsController < ApplicationController
    
    def destroy
      session[:user_id] = nil
      redirect_to root_path, notice: "Logged out!"
    end

    def omniauth
        @user = Account.from_omniauth(auth)
        @user.save
        session[:user_id] = @user.id
        redirect_to menu_path
    end
    
    private
    
    def auth
        request.env['omniauth.auth']
    end
  
end