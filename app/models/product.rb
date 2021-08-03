class Product < ApplicationRecord
    has_many :line_items
    # validates :batch_no, uniqueness: :true
    validates_uniqueness_of :batch_no, message: "Batch Number already taken."


    before_destroy :ensure_product_not_referenced

    private
    def ensure_product_not_referenced
        unless line_items.empty?
            errors.add(:base, 'There are Items referencing this Product.')
            throw :abort
        end
    end
end
