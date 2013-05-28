module TestHelpers
  def click_cell(*cell_nums)
    cell_nums.each do |num|
      page.find("td[cell='#{num}']").click
    end
  end

  def find_user_icon
    page.find('img.user-icon')
  end

  def find_ai_icon
    page.find('img.ai-icon')
  end

  def num_icons
    page.all(:css, 'img').length
  end
end
