class CatsController < ApplicationController

  def index
    data = RestClient.get("http://catapi.com/cats", headers: {key: ENV[CAT_API_KEY]})
    
  end
end