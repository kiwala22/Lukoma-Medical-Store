class CreateProducts < ActiveRecord::Migration[6.1]
  def change
    create_table :products do |t|
      t.string :batch_no
      t.string :name
      t.date :expiry_date
      t.string :product_type
      t.integer :quantity
      t.decimal :unit_price

      t.timestamps
    end
  end
end
