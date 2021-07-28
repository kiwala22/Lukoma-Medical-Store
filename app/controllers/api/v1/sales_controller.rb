class Api::V1::SalesController < ApplicationController
    before_action :authenticate_user!
    include CurrentBasket
    before_action :set_basket, only: [:create]
    #before_action :set_sale, only: %i[ show edit update destroy ]
  
    # GET /sales or /sales.json
    def index
      @sales = Sale.all.order("created_at asc")
      render json: @sales
    end
  
    # POST /sales or /sales.json
    def create
      ## Find the products from the basket
      items = @basket.line_items
  
      ## Process the Order
      order = []
      items.each do |item|
        order << {"id": item.product.id, "name": item.product.name, "quantity": item.quantity, "amount": (item.product.unit_price * item.quantity) }.as_json
      end
  
      total_amount = 0
      order.each do |product|
        total_amount += (product["amount"]).to_f
      end
      @sale = Sale.new({
        order: order,
        total_amount: total_amount
      })
  
      if @sale.save
        puts order
        ## If the order is saved, reduce the quantity on the corresponding products
        order.each do |product|
          stock = Product.find(product["id"])
          sold_quantity = product["quantity"].to_i
          remaining_quantity = (stock.quantity - sold_quantity).to_i
          stock.update(quantity: remaining_quantity)
        end
        render json: @sale
      else
        render json: @sale.errors
      end
    end
  
  end
  