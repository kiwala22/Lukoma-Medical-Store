require "test_helper"

class Api::V1::ReportsControllerTest < ActionDispatch::IntegrationTest
  test "should get sale_totals" do
    get api_v1_reports_sale_totals_url
    assert_response :success
  end

  test "should get averages" do
    get api_v1_reports_averages_url
    assert_response :success
  end

  test "should get expired_products" do
    get api_v1_reports_expired_products_url
    assert_response :success
  end

  test "should get low_stock_products" do
    get api_v1_reports_low_stock_products_url
    assert_response :success
  end
end
