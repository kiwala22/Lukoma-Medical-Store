ActiveAdmin.register Product do

  # See permitted parameters documentation:
  # https://github.com/activeadmin/activeadmin/blob/master/docs/2-resource-customization.md#setting-up-strong-parameters
  #
  # Uncomment all parameters which should be permitted for assignment
  #
  permit_params :batch_no, :name, :expiry_date, :product_type, :quantity, :unit_price
  #
  # or
  #
  # permit_params do
  #   permitted = [:batch_no, :name, :expiry_date, :product_type, :quantity, :unit_price]
  #   permitted << :other if params[:action] == 'create' && current_user.admin?
  #   permitted
  # end
  
end
