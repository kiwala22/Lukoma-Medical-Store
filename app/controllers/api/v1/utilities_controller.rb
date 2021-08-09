class Api::V1::UtilitiesController < ApplicationController
    before_action :authenticate_user!
    before_action :set_utility, only: [:edit, :update, :destroy]

    def index
        @utilities = Utility.all.order("created_at desc")
        render json: {utilities: @utilities, status: "Success"}
    end

    def new
    end

    def create
        @utility = Utility.new(utility_params)

        if @utility.save
          render json: {utility: @utility, status: "Success"}
        else
          render json: {errors: @utility.errors.messages.first, status: "Failed"}
        end
    end

    def edit
    end

    def update
        current_quantity = @utility.quantity
        new_quantity = (current_quantity + (params[:quantity]).to_i)
        @utility.update(quantity: new_quantity)
        render json: { status: "OK" }
    end

    def destroy
        @utility.destroy

        render json: { status: "OK" }
    end

    private

    def set_utility
        @utility = Utility.find(params[:id])
    end

    def utility_params
        params.require(:utility).permit(:batch_number, :product_name, :quantity)
    end
end
