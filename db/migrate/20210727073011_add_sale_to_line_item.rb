class AddSaleToLineItem < ActiveRecord::Migration[6.1]
  def change
    add_reference :line_items, :sale, foreign_key: true
  end
end
