class LineItem < ApplicationRecord
  belongs_to :product
  belongs_to :basket
end
