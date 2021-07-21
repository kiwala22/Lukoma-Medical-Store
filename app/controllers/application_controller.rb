class ApplicationController < ActionController::Base

    before_action :configure_permitted_paramaters, if: :devise_controller?

    def check_user
        if current_user
            render json: {email: current_user.email }
        else
            render json: { }
        end
    end

    protected

    def configure_permitted_paramaters
        devise_parameter_sanitizer.permit(:sign_in, keys: [:username])
    end
end
