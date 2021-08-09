class CreateUtilities < ActiveRecord::Migration[6.1]
  def change
    create_table :utilities do |t|
      t.string :batch_number
      t.string :product_name
      t.integer :quantity

      t.timestamps
    end
  end
end
