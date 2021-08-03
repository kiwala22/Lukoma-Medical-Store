class Api::V1::SalesController < ApplicationController
    # before_action :authenticate_user!
    include CurrentBasket
    before_action :set_basket, only: [:create]
    #before_action :set_sale, only: %i[ show edit update destroy ]
  
    # GET /sales or /sales.json
    def index
      @sales = Sale.all.order("created_at desc")
      render json: {sales: @sales, status: "Success"}
    end
  
    # POST /sales or /sales.json
    def create
      ## Find the products from the basket
      items = @basket.line_items
  
      ## Process the Order
      order = []
      items.each do |item|
        prod_quantity = Product.find(item.product.id).quantity
        if prod_quantity < item.quantity || item.quantity == 0
          render json: {error: "Some quantities chosen are more than available stock", status: "Failed"}
          return
        else
          order << {"id": item.product.id, "name": item.product.name, "quantity": item.quantity, "amount": (item.product.unit_price * item.quantity) }.as_json
        end
      end
  
      total_amount = 0
      order.each do |product|
        total_amount += (product["amount"]).to_f
      end
      @sale = Sale.new({
        order: order,
        reference: generate_reference(),
        total_amount: total_amount,
        user_id: current_user.id,
        username: current_user.username
      })
  
      if @sale.save
        ## If the order is saved, reduce the quantity on the corresponding products
        order.each do |product|
          stock = Product.find(product["id"])
          sold_quantity = product["quantity"].to_i
          remaining_quantity = (stock.quantity - sold_quantity).to_i
          stock.update(quantity: remaining_quantity)
        end
        render json: {sale: @sale, status: "Success"}
      else
        render json: @sale.errors
      end
    end

    private
    def generate_reference
      begin
        reference = rand(36**8).to_s(36).upcase
      end while Sale.where(reference: reference).exists?
      return "SAL-"+reference
    end
  
  end
  