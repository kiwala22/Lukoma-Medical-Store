class AddSaleDateToSales < ActiveRecord::Migration[6.1]
  def change
    add_column :sales, :sale_date, :datetime
  end
end
