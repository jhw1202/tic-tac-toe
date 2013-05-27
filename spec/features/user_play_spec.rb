require 'spec_helper'

describe "user playing game", :js => true do
  before(:each) do
    visit root_path
  end

  it "should show board" do
    page.has_css?('table.board').should == true
  end

  context "valid move" do
    it "should place icon on user click" do
      page.find("td[cell='1']").click
      expect(page.find('img.user-icon')).to_not raise_error(Capybara::ElementNotFound)
    end
  end

  context "invalid move" do
    it "should not change board when existing move clicked" do
      page.find("td[cell='1']").click
      num_icons = page.all(:css, 'img').length
      page.find("td[cell='1']").click
      page.driver.browser.switch_to.alert.accept
      expect(page.all(:css, 'img').length).to eq num_icons
    end
  end

end
