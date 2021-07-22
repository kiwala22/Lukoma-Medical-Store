class Api::V1::ProductsController < ApplicationController
    before_action :authenticate_user!

    def index
        @products = Product.all
        render json: @products
    end

    def new
    end

    def create
    end

    def edit
    end

    def update
    end

    def destroy
    end
end
