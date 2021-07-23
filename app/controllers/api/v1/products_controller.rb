class Api::V1::ProductsController < ApplicationController
    before_action :authenticate_user!
    before_action :set_product, only: [:edit, :update, :destroy]

    def index
        @products = Product.all
        render json: @products
    end

    def new
    end

    def create
        @product = Product.new(product_params)


        if @product.save
          render json: @product
        else
          render json: @product.errors
        end
    end

    def edit
    end

    def update
    end

    def destroy
        @product.destroy

        render json: { notice: 'product was successfully removed.' }
    end

    private

    def set_product
        @product = product.find(params[:id])
    end

    def product_params
        params.permit(:batch_no, :name, :quantity, :unit_price, :product_type, :expiry_date)
    end
end
