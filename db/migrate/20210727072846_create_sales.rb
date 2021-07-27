class CreateSales < ActiveRecord::Migration[6.1]
  def change
    create_table :sales do |t|
      t.json :order
      t.integer :total_amount
      t.string :payment_method, default: "Cash"

      t.timestamps
    end
  end
end
