# filter.rb

require 'csv'
require 'pry'

def median(array)
  sorted_array = array.sort 
  count = sorted_array.count 

  if sorted_array.count % 2 == 0 
    first_half = (sorted_array[0...(count/2)])
    second_half = (sorted_array[(count/2)..-1])

    first_median = first_half[-1]
    second_median = second_half[0]

    true_median = ((first_median + second_median).to_f / 2.to_f)
    true_median
  else 
    true_median = sorted_array[(count/2).floor]
    true_median
  end 

  return true_median
end

properties = CSV.read('properties.csv')
headers = properties.shift
properties.delete_if{|p| p[1].to_i < 10000 || p[1].to_i > 400_000}

properties.map! do |p| 
  p[4] = p[4].to_i
  p
end

properties.delete_if{|p| p[3].include? 'доли'}
properties.delete_if{|p| p[3].include? 'доля'}
properties.delete_if{|p| p[3].include? 'комната'}

properties.map! do |p|
  if p[3].to_s.include? 'Фактически'
    p[3] = p[3].scan(/Фактически \d/).first.gsub('Фактически ', '').to_i
  end
  p
end

properties.map! do |p| 
  if p[3].to_s.include? 'Свободная'
    p[3] = p[3].scan(/Свободная планировка \(\d/).first.gsub('Свободная планировка (', '').to_i
  end
  p
end

properties.map! do |p|
  p[3] = p[3].to_i
  p
end

properties.delete_if{|p| p[3] > 5}

properties.delete_if{|p| p[9] == '3 сан.узла'}
properties.delete_if{|p| p[9] == '4 сан.узла'}

headers.insert(10, 'bathroom_type_id')
properties.map! do |p|
  case p[9]
  when 'совмещенный'
    val = 1
  when 'раздельный'
    val = 2
  when '2 сан.узла'
    val = 3
  end
  p.insert(10, val)
  p
end

properties.delete_if{|p| p[5] == 'кар'}
properties.delete_if{|p| p[5] == 'бревенчатый'}
properties.delete_if{|p| p[5] == 'блок-комнаты'}
properties.delete_if{|p| p[5] == 'мк'}
properties.delete_if{|p| p[5] == 'силикатные блоки'}

headers.insert(6, 'house_type_id')

group = properties.group_by{|p| p[5]}
group.map do |type|
  median = median(type[1].map{|pr| pr[1].to_i})
  puts "#{type[0]} - #{median}"
end

properties.map! do |p|
  case p[5]
  when 'панельный'
    val = 1
  when 'монолитный'
    val = 2
  when 'каркасно-блочный'
    val = 3
  when 'кирпичный'
    val = 4
  end
  p.insert(6, val)
  p
end

headers.push('remont_type_id')
properties.delete_if{|p| p[12] == 'аварийное состояние'}
properties.delete_if{|p| p[12] == 'плохое состояние'}

group = properties.group_by{|p| p[12]}
group.map do |type|
  median = median(type[1].map{|pr| pr[1].to_i})
  puts "#{type[0]} - #{median}"
end

properties.map! do |p|
  case p[12]
  when 'удовлетворительный ремонт'
    val = 1
  when 'нормальный ремонт'
    val = 2
  when 'строительная отделка'
    val = 3
  when 'без отделки'
    val = 4
  when 'хороший ремонт'
    val = 5
  when 'отличный ремонт'
    val = 6
  when 'евроремонт'
    val = 7
  end
  p.push(val)
  p
end

group = properties.group_by{|p| p[2]}
districts_to_exclude = group.map{|type| {type: type[0], count: type[1].count}}.select{|type| type[:count] < 50}.map{|type| type[:type]}

properties.delete_if{|p| districts_to_exclude.include?(p[2])}

group = properties.group_by{|p| p[2]}
sorted_districts = group.map do |type|
  median = median(type[1].map{|pr| pr[1].to_i})
  puts "#{type[0]} - #{median}"
  {type: type[0], median: median}
end.sort_by{|type| type[:median]}.map{|type| type[:type]}

headers.insert(3, 'district_id')
properties.map! do |p|
  p.insert(3, sorted_districts.index(p[2])+1)
end

properties.delete_if{|pr| pr[8].to_f < 5 || pr[9].to_f < 5}

properties.map! do |p|
  p[5] = p[5].to_f
  p
end


puts properties.count
CSV.open('filtered_properties.csv', 'w+') do |writer|
  writer << headers
  properties.each{|p| writer << p}
end

districts = properties.map{|p| p[2]}.uniq
districts.each_with_index do |d, index|
  pr = properties.select{|p| p[2] == d}
  CSV.open("./districts/filtered_properties_#{index}.csv", 'w+') do |writer|
    writer << headers
    pr.each{|p| writer << p}
  end
end

room_1_properties = properties.select{|pr| pr[4].to_i == 1}
room_2_properties = properties.select{|pr| pr[4].to_i == 2}
room_3_properties = properties.select{|pr| pr[4].to_i == 3}
room_4_properties = properties.select{|pr| pr[4].to_i == 4}

CSV.open('1_room_properties.csv', 'w+') do |writer|
  writer << headers
  room_1_properties.each{|p| writer << p}
end

CSV.open('2_room_properties.csv', 'w+') do |writer|
  writer << headers
  room_2_properties.each{|p| writer << p}
end

CSV.open('3_room_properties.csv', 'w+') do |writer|
  writer << headers
  room_3_properties.each{|p| writer << p}
end

CSV.open('4_room_properties.csv', 'w+') do |writer|
  writer << headers
  room_4_properties.each{|p| writer << p}
end

room_1_properties_intervals_count = 1 + Math.log(room_1_properties.count, 2).truncate
interval_step = ((room_1_properties.map{|p| p[8].to_f}.max - room_1_properties.map{|p| p[8].to_f}.min)/room_1_properties_intervals_count).round

min_interval_value = room_1_properties.map{|p| p[8].to_f}.min
max_interval_value = room_1_properties.map{|p| p[8].to_f}.min + interval_step

room_1_properties_intervals_count.times do |index| 
  properties = room_1_properties.select{|p| p[8].to_f >= min_interval_value && p[8].to_f <= max_interval_value}
  CSV.open("./prices/1_room_properties_#{index}.csv", 'w+') do |writer|
    writer << headers
    properties.each{|p| writer << p}
  end
  min_interval_value += interval_step
  max_interval_value += interval_step
end
