class AddUserToSales < ActiveRecord::Migration[6.1]
  def change
    add_column :sales, :reference, :string, unique: true
    add_reference :sales, :user, null: false, foreign_key: true
    add_column :sales, :username, :string
  end
end
