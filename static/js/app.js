function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
  d3.json(`/metadata/${sample}`).then((meta_data) =>{
    // Use d3 to select the panel with id of `#sample-metadata`
    console.log(meta_data);
    panel = d3.select('#sample-metadata');  
    // Use `.html("") to clear any existing metadata
    panel.html("");    
    // Use `Object.entries` to add each key and value pair to the panel
    Object.entries(meta_data).forEach(([key, value]) => {
      console.log(`${key} ${value}`);
      panel.append("div").html(`<p>${key}: ${value}</p>`);
    });
  });  
    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
      
}

function buildCharts(sample) {
  sample_data = {};
  // @TODO: Use `d3.json` to fetch the sample data for the plots
    d3.json(`/samples/${sample}`).then((sample_data) =>{
      console.log(sample_data);
      // @TODO: Build a Bubble Chart using the sample data
      var trace1 = {
        x: sample_data['otu_ids'],
        y: sample_data['sample_values'],
        mode: 'markers',
        text: sample_data['otu_labels'],
        marker: {
          size: sample_data['sample_values'],
          color: sample_data['otu_ids'],
          colorscale: 'Rainbow'
        }
      };
    
      var data = [trace1];
          
      var layout = {
        title: `All Data for sample ${sample}`,
        showlegend: false,
        xaxis: {
          title: 'otu_ids',
        }
        
      };
    
      Plotly.newPlot('bubble', data, layout);
    });
    

    
    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each)."
    d3.json(`/samples/${sample}`).then((sample_data) =>{
    var data = [{
      values: sample_data['sample_values'].slice(0,10),
      labels: sample_data['otu_ids'].slice(0,10),
      text: sample_data['otu_labels'].slice(0,10),
      hoverinfo : 'text',
      textinfo: 'percent',
      type: 'pie'
    }];
    console.log(data);
    var layout = {
      title: `Top 10 Samples for ${sample}`,
      height: 400,
      width: 500
    };
    
    Plotly.newPlot('pie', data, layout);
  });

    
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    console.log(sampleNames);
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
