class SessionsController < ApplicationController
    
    def destroy
        session[:user_id] = nil
        redirect_to root_path, notice: "Logged out!"
      end
  
      def omniauth
          @user = User.from_omniauth(auth)
          @user.save
          session[:user_id] = @user.id
          redirect_to root_path
          #request.location.country
      end
      
      private
      
      def auth
          request.env['omniauth.auth']
      end
  
end