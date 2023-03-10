class LineItemsController < ApplicationController
  before_action :authenticate_user!
  include CurrentBasket
  before_action :set_basket, only: %i[ create basket_data destroy line_item_destroy ]
  #before_action :set_line_item, only: %i[ show edit update destroy ]


  # POST /line_items or /line_items.json
  def create
    product = Product.find(params[:product_id])
    quantity = (params[:quantity]).to_i
    if (quantity <= product.quantity)
      @line_item = @basket.add_product(product, quantity)

      if @line_item.save
        render json: {line_item: @line_item, status: "Success"}
      else
        render json: @line_item.errors
      end
    else
      render json: {status: "Number more than items in stock"}
      return
    end
  end

  def basket_data
    @basket_data = @basket.line_items
    products = []
    
    @basket_data.each do |item|
      products <<  {"lineId": item.id, "id": item.product.id, "name": item.product.name, "quantity": item.quantity, "amount": (item.product.unit_price * item.quantity) }
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
    @line_item = LineItem.find(params[:id])
    @basket = Basket.find(@line_item.basket_id)
    if @line_item.delete
      render json: {status: "OK"}
    else
      render json: {status: "Error"}
    end
    
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_line_item
      @line_item = LineItem.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def line_item_params
      params.require(:line_item).permit(:product_id, :quantity)
    end
end
