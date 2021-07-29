Rails.application.routes.draw do
  root to: "dashboard#index"

  resources :line_items
  # resources :baskets

  namespace :api do
    namespace :v1 do
      get 'products/index'
      post 'products/create'
      delete 'products/:id', to: 'products#destroy'

      get 'sales/index'
      post 'sales/create'

      get 'reports/sale_totals'
      get 'reports/averages'
      get 'reports/expired_products'
      get 'reports/low_stock_products'

      get 'check_user', to: "users#check_user"
      get 'check_ability', to: "users#check_user_ability"
    end
  end

  match "products" => "products#index", via: [:get]
  match "sales" => "sales#index", via: [:get]
  match "basket" => "line_items#basket_data", via: [:get]
  match "clear_basket" => "line_items#destroy", via: [:delete]
  
  devise_for :users
  devise_for :admin_users, ActiveAdmin::Devise.config
  ActiveAdmin.routes(self)
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end
