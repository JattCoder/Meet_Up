Rails.application.routes.draw do
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
  resources :user
  resources :sessions, only: [:new, :create, :destroy]
  get 'auth/:provider/callback', to: 'sessions#omniauth'
  get 'auth/failure', to: redirect('/')
  post 'maps/navigation', to: 'navigation#navigate'
  post 'maps/places', to: 'search#places'
  post 'user/new', to: 'user#new'
  post 'user/settings', to: 'setting#update_settings'
  resources :cats
  get 'logout', to: 'sessions#destroy', as: 'logout'
end
