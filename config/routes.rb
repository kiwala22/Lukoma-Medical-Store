Rails.application.routes.draw do
  root to: "dashboard#index"

  match "check_user" => "application#check_user", via: [:get]
  
  devise_for :users
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end
