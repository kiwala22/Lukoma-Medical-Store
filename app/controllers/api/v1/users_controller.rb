class Api::V1::UsersController < ApplicationController
    def check_user
        if current_user
            render json: {email: current_user.email }
        else
            render json: {Error: "Unauthorized" }
        end
    end

    def check_user_ability
        if current_user.role == "admin"
            render json: { status: "Authorized" }
        else
            render json: { status: "Denied" }
        end
    end
end
