#!/usr/bin/ruby

require 'json'
require_relative 'cutter'

# Read data from file
begin
  input_file = File.read 'input.json'
  data = JSON.parse(input_file, { symbolize_names: true })
rescue
  puts "Cannot parse input file"
end
# create Cutter class instance
c = Cutter.new(data)

# output combinations
c.output.each do |gem, value|
  puts "Gem type: #{gem}"
  value.each do |o|
    puts "From raw chunk size #{o[:chunk]}"
    puts "Cuts \t\t\t Value \t\t Loss \t\t Profit"
    o[:gems].each do |gemset|
      sizes = gemset.map{ |g| g[:size] }
      value = gemset.map{ |g| g[:value] }.inject(0, :+)
      loss = o[:chunk] - sizes.inject(0, :+)
      profit = value - loss
      puts "#{sizes.join(',')} \t\t\t #{value} \t\t #{loss} \t\t #{profit}"

    end
  end
end
