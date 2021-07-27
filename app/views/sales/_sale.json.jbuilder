json.extract! sale, :id, :order, :total_amount, :payment_method, :created_at, :updated_at
json.url sale_url(sale, format: :json)
