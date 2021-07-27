class LineItemsController < ApplicationController
  before_action :authenticate_user!
  include CurrentBasket
  before_action :set_basket, only: %i[ create basket_data destroy ]
  #before_action :set_line_item, only: %i[ show edit update destroy ]


  # POST /line_items or /line_items.json
  def create
    product = Product.find(params[:product_id])
    @line_item = @basket.add_product(product)

    if @line_item.save
      render json: @line_item
    else
      render json: @line_item.errors
    end
  end

  def basket_data
    @basket_data = @basket.line_items
    products = []
    
    @basket_data.each do |item|
      products <<  {"id": item.product.id, "name": item.product.name, "quantity": item.quantity, "amount": (item.product.unit_price * item.quantity) }
    end
    render json: products
  end


  # DELETE /line_items/1 or /line_items/1.json
  def destroy
    if @basket.id == session[:basket_id]
      @basket.destroy
      session[:basket_id] = nil
      render json: {status: "OK"}
    else
      render json: {status: "Error"}
    end
  end

  def line_item_destroy
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_line_item
      @line_item = LineItem.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def line_item_params
      params.require(:line_item).permit(:product_id)
    end
end
