class SessionsController < ApplicationController
    
    def destroy
        session[:user_id] = nil
        render plain: "Logged Out"
      end
  
      def omniauth
          user = User.from_omniauth(auth)
          user.save
          session[:user_id] = @user.id
          render json: user
      end
      
      private
      
      def auth
          request.env['omniauth.auth']
      end
  
end