class Api::V1::ReportsController < ApplicationController
  before_action :authenticate_user!
  include CurrentBasket

  ## Change the sale_totals and averages methods to use sale date using the SQL COALESCE method
  def sale_totals
    sales_amounts = []
    date_labels = []
    ((Date.today - 21) .. Date.today).each do |f|
      date_labels << (f.to_s)
      amounts = Sale.where("COALESCE(sale_date, created_at) >= ? AND COALESCE(sale_date, created_at) <= ?", f.beginning_of_day, f.end_of_day).sum(:total_amount)
      sales_amounts << amounts
    end
    @analytics = {labels: date_labels, totals: sales_amounts}

    render json: @analytics

  end

  def averages
    total_daily = Sale.where("COALESCE(sale_date, created_at) >= ? AND COALESCE(sale_date, created_at) <= ?", Date.today.beginning_of_day, Date.today.end_of_day).sum(:total_amount)
    total_month = Sale.where("COALESCE(sale_date, created_at) >= ? AND COALESCE(sale_date, created_at) <= ?", Date.today.beginning_of_month, Date.today.end_of_month).sum(:total_amount)
    days_in_month = Time.now.end_of_month.day
    average_monthly = (total_month / days_in_month).to_f

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
      @stock << {batch_no: product.batch_no, name: product.name}
    end
    render json: @stock
  end
end