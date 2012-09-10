require 'csv'

# convert text file to a javascript array definition.

if ARGV.length <= 0
  puts "usage #{$0} in.txt variable_name"
  exit
end


in_fn = ARGV[0]
var_name = ARGV[1]

puts "var #{var_name} = ["
CSV.open(in_fn, 'r', col_sep=' ') do |v|
  puts "[#{v.join(',')}],"
end
puts "];"
