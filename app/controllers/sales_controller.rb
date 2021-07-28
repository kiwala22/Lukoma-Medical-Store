class SalesController < ApplicationController
  before_action :authenticate_user!
  include CurrentBasket

  def index
  end

end
