class Api::V1::ReportsController < ApplicationController
  before_action :authenticate_user!

  def sale_totals
    sales_amounts = []
    date_labels = []
    ((Date.today - 21) .. Date.today).each do |f|
      date_labels << (f.to_s)
      amounts = Sale.where("created_at >=? AND created_at <= ?", f.beginning_of_day, f.end_of_day).sum(:total_amount)
      sales_amounts << amounts
    end
    @analytics = {labels: date_labels, totals: sales_amounts}

    render json: @analytics

  end

  def averages
    total_daily = Sale.where("created_at >=? AND created_at <= ?", Date.today.beginning_of_day, Date.today.end_of_day).sum(:total_amount)
    average_monthly = (total_daily / 30).to_f

    @averages = {daily: total_daily, average: average_monthly}

    render json: @averages

  end

  def expired_products
    @expired = []
    expired_products = Product.where("expiry_date < ?", Date.today)
    expired_products.each do |product|
      @expired << {batch_no: product.batch_no, expiry_date: product.expiry_date}
    end

    render json: @expired

  end

  def low_stock_products
    @stock = []
    low_stock = Product.where("quantity <= ?", 0)
    low_stock.each do |product|
      @stock << {name: product.name}
    end
    render json: @stock
  end
end