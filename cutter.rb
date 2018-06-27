
class Cutter

  # initialize
  # @param data [Hash] Input data
  def initialize(data)
    @cut_data = {}
    data.each do |gem, value|
      @cut_data[gem.to_sym] = []
      sorted_cuts = value[:cuts].sort_by { |c| c[:size] }.reverse

      value[:rawChunks].each do |chunk|
        @cut_data[gem.to_sym].push({ gems: cut(sorted_cuts, chunk), chunk: chunk })
      end

    end
  end

  # Resolve cuts
  # @param cut_sizes [Array] Available cut sizes
  # @param chunk [Integer] Raw chunk size to cutted from
  # @param ready_cuts [Array] Ready made cuts to add
  # @return gems [Array] Possible cut sets as arrays from raw chunk
  def cut(cut_sizes, chunk, ready_cuts = [])
    gems = []

    cut_sizes.each do |cut|
      cuts = ready_cuts.flatten
      i = 0
      other_cuts = cut_sizes.select { |c| c[:size] < cut[:size] }

      while (chunk / cut[:size]).floor > i do
        cuts.push(cut)
        gems.push(cuts.flatten)
        i += 1
        leftover = chunk - (cut[:size]*i)
        # call recursively to get smaller possible cuts from leftover
        gems += cut(other_cuts, leftover, cuts) if other_cuts.size > 0
      end
    end
    gems
  end

  # Output result
  # @return output [Hash] Possible cut sets from raw chunk
  def output
    @cut_data
  end
end
