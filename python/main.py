#!/usr/bin/python

import sys
import json
import math
from pprint import pprint

def cutter(cut_sizes, chunk, ready_cuts = []):
    "Cutter function"
    gems = []
    # Loop possible cut sizes
    for cut in cut_sizes:
      cuts = list(ready_cuts)
      i = 0
      # Collect smaller cuts
      other_cuts = filter(lambda c: c['size'] < cut['size'], cut_sizes)

      while (math.floor(chunk / float(cut['size'])) > i):
        cuts.append(cut)
        gems.append(list(cuts))
        i += 1
        leftover = chunk - (cut['size']*i)
        # call recursively to get smaller possible cuts from leftover
        if (len(other_cuts) > 0):
            gems += cutter(other_cuts, leftover, cuts)
    return gems

# Read file
try:
   file = open("input.json", "r")
   data = json.loads(file.read())
except IOError:
   print "Cannot read input file ", file_name
   sys.exit()

cut_data = []
for gem in data:
    sorted_cuts = sorted(data[gem]['cuts'], key=lambda c: c['size'], reverse=True)
    raw_chunks = data[gem]['rawChunks']

    for chunk in data[gem]['rawChunks']:
        cut_data.append({ 'gem': gem, 'gems': cutter(sorted_cuts, chunk), 'chunk': chunk })

# output combinations
for gems in cut_data:
    print("Gem type: {}".format(gems['gem']))
    print("Chunk: {}".format(gems['chunk']))
    print("Cuts \t\t Value \t\t Loss \t\t Profit")
    for cuts in gems['gems']:
        sizes = [str(c['size']) for c in cuts]
        value = sum([c['value'] for c in cuts])
        loss = gems['chunk'] - sum([c['size'] for c in cuts])
        print("{} \t\t {} \t\t {} \t\t {}".format(",".join(sizes), value, loss, (value - loss)))
