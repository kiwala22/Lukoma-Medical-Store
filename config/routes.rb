Rails.application.routes.draw do
  resources :sales
  resources :line_items
  resources :baskets
  root to: "dashboard#index"

  namespace :api do
    namespace :v1 do
      get 'products/index'
      post 'products/create'
      delete 'products/:id', to: 'products#destroy'
    end
  end

  match "check_user" => "application#check_user", via: [:get]
  match "products" => "products#index", via: [:get]
  match "basket" => "line_items#basket_data", via: [:get]
  match "clear_basket" => "line_items#destroy", via: [:delete]
  
  devise_for :users
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end
