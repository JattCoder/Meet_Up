Rails.application.routes.draw do
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
  resources :user
  resources :sessions, only: [:new, :create, :destroy]

  #scope :auth do
  #get ':provider/callback', to: 'sessions#omniauth'
  #get 'failure', to: redirect('/')

  #end

  scope :maps do
    post 'navigation', to: 'navigation#navigate'
    post 'distance', to: 'navigation#distance'
    
    get 'places', to: 'places#index'


    post 'spot', to: 'search#spot'
    post 'search_route', to: 'search#route'
    post 'geocode', to:'search#geocode'

    resources :favorites, only: [:index, :destroy, :create]
  end

  
  post 'user', to: 'user#create'
  post 'user/settings', to: 'setting#update_settings'
  #delete 'logout', to: 'sessions#destroy', as: 'logout'
  #new --> get
  #create --> post
end
