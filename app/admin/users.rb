ActiveAdmin.register User do

  # See permitted parameters documentation:
  # https://github.com/activeadmin/activeadmin/blob/master/docs/2-resource-customization.md#setting-up-strong-parameters
  #
  # Uncomment all parameters which should be permitted for assignment
  #
  permit_params :email, :encrypted_password, :username, :reset_password_token, :reset_password_sent_at, :remember_created_at, :sign_in_count, :current_sign_in_at, :last_sign_in_at, :current_sign_in_ip, :last_sign_in_ip, :failed_attempts, :unlock_token, :locked_at, :role
  #
  # or
  #
  # permit_params do
  #   permitted = [:email, :encrypted_password, :username, :reset_password_token, :reset_password_sent_at, :remember_created_at, :sign_in_count, :current_sign_in_at, :last_sign_in_at, :current_sign_in_ip, :last_sign_in_ip, :failed_attempts, :unlock_token, :locked_at, :role]
  #   permitted << :other if params[:action] == 'create' && current_user.admin?
  #   permitted
  # end

  index do
    selectable_column
    id_column
    column :email
    column :username
    column :current_sign_in_at
    column :sign_in_count
    column :created_at
    column :role
    actions
    end

    filter :email
    filter :username
    filter :current_sign_in_at
    filter :sign_in_count
    filter :created_at

    form do |f|
    f.inputs "User Details" do
        f.input :email
        f.input :username
        f.input :password
        f.input :password_confirmation, label: 'Confirmation'
        f.input :role
    end
    f.actions
    end
  
end

   