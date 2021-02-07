# parser.rb

require 'watir'
require 'webdrivers'
require 'csv'
require 'pry'

class Parser
  
  def self.get_advertisements(out_file)
    start_time = Time.now
    browser = Watir::Browser.new :chrome, headless: true
    page    = 0
    link    = "https://realt.by/sale/flats/?search=eJwdijEOgCAQwF5zzh7mEAYHkX8QIBCNiiZi%2FL7A0nZovr5kkj0DkDq2vUiX6osm0D3IpVKJRg0aQWDruTNPyO9d5rXOjiFKKy1xJOb94MnZIAKPI0UmBf8BzQgbzQ%3D%3D&page=#{page}"
    browser.goto link
    csv = CSV.read(out_file, :headers=>true)
    existing_ads = csv['ID']
    page_count = browser.elements(css: '.paging-list a')[-1].text.to_i
    CSV.open(out_file, 'a') do |writer|
      (0..page_count-1).each do |page_number|
        puts "Page Number: #{page_number}"
        link    = "https://realt.by/sale/flats/?search=eJwdijEOgCAQwF5zzh7mEAYHkX8QIBCNiiZi%2FL7A0nZovr5kkj0DkDq2vUiX6osm0D3IpVKJRg0aQWDruTNPyO9d5rXOjiFKKy1xJOb94MnZIAKPI0UmBf8BzQgbzQ%3D%3D&page=#{page_number}"
        browser.goto link
        browser.elements(css: '.listing-item', data_mode: '3').each do |ad|
          ad_id = ad.a(css: '.teaser-title').href.split('/')[-1]
          if !existing_ads.include?(ad_id)
            br2 = Watir::Browser.new :chrome, headless: true
            puts ad.a(css: '.teaser-title').href
            br2.goto ad.a(css: '.teaser-title').href
            price = br2.element(css: '.price-block').element(css: '.d-flex.align-items-center.fs-giant').text.gsub(" USD", '').gsub(' ', '').to_i
            next unless br2.element(css: '.table-params').elements(css: '.color-graydark').select{|a| a.text == 'Район города'}.first 
            district = br2.element(css: '.table-params').elements(css: '.color-graydark').select{|a| a.text == 'Район города'}.first.parent.children[1].children.last.text.gsub('"', '').to_s
            rooms_count = br2.elements(css: '.table-params').last.elements(css: '.color-graydark').select{|a| a.text == 'Комнат всего/разд.'}.first.parent.children[1].text.split(' / ').first
            if br2.elements(css: '.table-params').last.elements(css: '.color-graydark').select{|a| a.text == 'Этаж / этажность'}.first
              floor = br2.elements(css: '.table-params').last.elements(css: '.color-graydark').select{|a| a.text == 'Этаж / этажность'}.first.parent.children[1].text.split(' / ').first
            else
              floor = 1
            end

            if br2.elements(css: '.table-params').last.elements(css: '.color-graydark').select{|a| a.text == 'Тип дома'}.first
              house_type = br2.elements(css: '.table-params').last.elements(css: '.color-graydark').select{|a| a.text == 'Тип дома'}.first.parent.children[1].text
            else
              house_type = 'панельный'
            end

            area_full = br2.elements(css: '.table-params').last.elements(css: '.color-graydark').select{|a| a.text == 'Площадь общая/жилая/кухня'}.first.parent.children[1].text.split(' / ').first
            area_living = br2.elements(css: '.table-params').last.elements(css: '.color-graydark').select{|a| a.text == 'Площадь общая/жилая/кухня'}.first.parent.children[1].text.split(' / ')[1]

            if br2.elements(css: '.table-params').last.elements(css: '.color-graydark').select{|a| a.text == 'Год постройки'}.first
              build_year = br2.elements(css: '.table-params').last.elements(css: '.color-graydark').select{|a| a.text == 'Год постройки'}.first.parent.children[1].text
            else
              build_year = '2020'
            end

            if br2.elements(css: '.table-params').last.elements(css: '.color-graydark').select{|a| a.text == 'Сан/узел'}.first
              bathroom_type = br2.elements(css: '.table-params').last.elements(css: '.color-graydark').select{|a| a.text == 'Сан/узел'}.first.parent.children[1].text
            else
              bathroom_type = 'раздельный'
            end

            if br2.elements(css: '.table-params').last.elements(css: '.color-graydark').select{|a| a.text == 'Ремонт'}.first
              remont = br2.elements(css: '.table-params').last.elements(css: '.color-graydark').select{|a| a.text == 'Ремонт'}.first.parent.children[1].text
            else
              remont = 'без отделки'
            end

            writer << [ad_id, price, district, rooms_count, floor, house_type, area_full, area_living, build_year, bathroom_type, remont]
            br2.close
          else
            puts "#{ad_id} is already in CSV"
          end
        end
        end_time = Time.now
        puts(convert_time(start_time, end_time))
      end
    end
    browser.close
  end

  def self.convert_time(start_time, end_time)
    difference = end_time - start_time
    seconds    =  difference % 60
    difference = (difference - seconds) / 60
    minutes    =  difference % 60
    difference = (difference - minutes) / 60
    hours      =  difference % 24
    "Parsed page time: #{hours.to_i}:#{minutes.to_i}:#{seconds.to_i}"
  end

end

start_time = Time.now
puts "Start time: #{start_time}"
# CSV.open('properties.csv', 'a') do |csv|
#   csv << ['ID', 'price', 'district', 'rooms_count', 'floor', 'house_type', 'area_full', 'area_living', 'build_year', 'bathroom_type', 'remont']
# end
advertisements = Parser.get_advertisements('properties.csv')
end_time = Time.now
puts end_time
puts(Parser.convert_time(start_time, end_time))
