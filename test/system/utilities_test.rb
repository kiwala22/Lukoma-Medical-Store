require "application_system_test_case"

class UtilitiesTest < ApplicationSystemTestCase
  setup do
    @utility = utilities(:one)
  end

  test "visiting the index" do
    visit utilities_url
    assert_selector "h1", text: "Utilities"
  end

  test "creating a Utility" do
    visit utilities_url
    click_on "New Utility"

    fill_in "Batch number", with: @utility.batch_number
    fill_in "Product name", with: @utility.product_name
    fill_in "Quantity", with: @utility.quantity
    click_on "Create Utility"

    assert_text "Utility was successfully created"
    click_on "Back"
  end

  test "updating a Utility" do
    visit utilities_url
    click_on "Edit", match: :first

    fill_in "Batch number", with: @utility.batch_number
    fill_in "Product name", with: @utility.product_name
    fill_in "Quantity", with: @utility.quantity
    click_on "Update Utility"

    assert_text "Utility was successfully updated"
    click_on "Back"
  end

  test "destroying a Utility" do
    visit utilities_url
    page.accept_confirm do
      click_on "Destroy", match: :first
    end

    assert_text "Utility was successfully destroyed"
  end
end
