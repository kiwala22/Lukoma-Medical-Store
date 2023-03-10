class Api::V1::ProductsController < ApplicationController
    before_action :authenticate_user!
    before_action :set_product, only: [:edit, :update, :destroy]

    def index
        @products = Product.all.where("quantity > ?", 0).order("created_at desc")
        render json: {products: @products, status: "Success"}
    end

    def new
    end

    def create
        @product = Product.new(product_params)

        if @product.save
          render json: {product: @product, status: "Success"}
        else
          render json: {errors: @product.errors.messages.first, status: "Failed"}
        end
    end

    def edit
    end

    def update
    end

    def destroy
        @product.destroy

        render json: { status: "OK" }
    end

    private

    def set_product
        @product = Product.find(params[:id])
    end

    def product_params
        params.permit(:batch_no, :name, :quantity, :unit_price, :product_type, :expiry_date)
    end
end
