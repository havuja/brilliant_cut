
  // Fetch input data
  var raw_data = () => {
    return fetch('https://raw.githubusercontent.com/wunderdogsw/wunderpahkina-vol7/master/input.json').then(function(resp) {
      return resp.json();
    });
  }

  // Process input data
  var process = (data) => {
    cut_data = {}

    for (var g in data) {
      cut_data[g] = []
      sorted_cuts = data[g]['cuts'].sort((a, b) => {
        return a.size - b.size;
      }).reverse();

      for (var chunk in data[g]['rawChunks']) {
        cut_data[g].push({ gems: cutter(sorted_cuts, data[g]['rawChunks'][chunk]), chunk: data[g]['rawChunks'][chunk] })
      }
    }
    return cut_data
  }

  // Solve available cuts for given raw chunk
  var cutter = (cut_sizes, chunk, ready_cuts = []) => {
    var gems = [];

    for (var cut in cut_sizes) {
      var cuts = ready_cuts.map(c => c);
      let i = 0;
      let other_cuts = cut_sizes.filter( c => c.size < cut_sizes[cut].size );

      while (Math.floor(chunk / cut_sizes[cut].size) > i){
        cuts.push(cut_sizes[cut]);
        gems.push(cuts.map(c => c));
        i++;
        let leftover = chunk - (cut_sizes[cut].size * i)
        if (other_cuts.length > 0){
          gems = [...gems, ...cutter(other_cuts, leftover, cuts)]
        }
      }
    }
    return gems
  }

  // Create full table row, colspan 4
  var full_row = (txt) => {
    let tr = document.createElement('tr');
    let td = document.createElement('td')
    td.appendChild(document.createTextNode(txt));
    td.colSpan = 4;
    tr.appendChild(td)
    return tr
  }

  var items = raw_data().then(process).then((values) => {
    const tbody = document.getElementById("gems");
    let rows = [];

    for (var gem in values) {
      //Full row gem type
      rows.push(full_row(gem));

      for (var key in values[gem]) {
        //Full row raw chunk size
        rows.push(full_row("Chunk size "+values[gem][key].chunk));

        for (var cut in values[gem][key].gems) {
          let val = []
          // Sizes
          val.push(values[gem][key].gems[cut].map(c => c.size));
          // Value
          val.push(values[gem][key].gems[cut].map(c => c.value).reduce( (accumulator, currentValue) => accumulator + currentValue ));
          // Loss
          val.push(values[gem][key].chunk - val[0].reduce( (accumulator, currentValue) => accumulator + currentValue ));
          // Profit
          val.push(val[1] - val[2]);
          //Create data row
          tr = document.createElement('tr');

          for (var i in [...Array(4)]) {
            var td = document.createElement('td')
            td.appendChild(document.createTextNode(val[i]));
            tr.appendChild(td)
          }
          rows.push(tr);
        }
      }
    }
    // Append rows to tbody
    rows.forEach(r => tbody.appendChild(r));
  });
