require 'spec_helper'

describe "user playing game", :js => true do
  before(:each) do
    visit root_path
  end

  context "initial board" do
    it "should display board" do
      page.has_css?('table.board').should == true
    end

    it "should be empty" do
      page.has_css?('img').should == false
    end
  end

  context "a valid move" do
    it "game should place icon on user click" do
      click_cell(1)
      expect(find_user_icon).to_not raise_error(Capybara::ElementNotFound)
    end

    it "game should respond with ai move" do
      click_cell(1)
      expect(find_ai_icon).to_not raise_error(Capybara::ElementNotFound)
    end
  end

  context "an invalid move" do
    it "should not change board when existing user icon is clicked" do
      click_cell(1)
      num_icons = page.all(:css, 'img.user-icon').length
      click_cell(1)
      page.driver.browser.switch_to.alert.accept
      expect(page.all(:css, 'img.user-icon').length).to eq num_icons
    end

    it "should not change board when existing ai icon is clicked" do
      click_cell(1)
      num_icons = page.all(:css, 'img.ai-icon').length
      click_cell(5)
      page.driver.browser.switch_to.alert.accept
      expect(page.all(:css, 'img.ai-icon').length).to eq num_icons
    end
  end

  context "a finished game" do
    it "should not register clicks when game finished" do
      click_cell(1,2,6)
      page.driver.browser.switch_to.alert.accept
      expect { click_cell(4) }.not_to change {num_icons}
    end
  end

end
