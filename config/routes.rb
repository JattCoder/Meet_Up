Rails.application.routes.draw do
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
  resources :user
  resources :sessions, only: [:new, :create, :destroy]
  get 'auth/:provider/callback', to: 'sessions#omniauth'
  get 'auth/failure', to: redirect('/')
  get 'maps/navigation', to: 'navigation#navigate'
  post 'maps/places', to: 'search#places'
  resources :cats
  get 'logout', to: 'sessions#destroy', as: 'logout'
end
