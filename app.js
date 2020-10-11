/// Generate page
function makePage(sample) {
    
  // D3 to filter json data
  d3.json("samples.json").then((data) => {
      
      // Generate array
      var filteredData = data.samples.filter(result => result.id == sample);
      
      var sampleData = filteredData[0];
      
      otuIds = sampleData.otu_ids;
      otuLabels = sampleData.otu_labels;
      sampleValues = sampleData.sample_values;
  
      // Add label
      otuIdsLabeled = otuIds.map(i => 'OTU ' + i);
  
      // Use slice for bar chart
      chartValues = sampleValues.slice(0,11);
      chartIds = otuIdsLabeled.slice(0,11);
      chartLabels = otuLabels.slice(0,11);

      // Bar chart
      var trace1 = {
          x: chartValues,
          y: chartIds,
          type: "bar",
          orientation: "h",
          text: chartLabels,
      };

      Plotly.newPlot("bar", [trace1]);

      // Bubble chart
      var trace2 = {
          x: otuIds,
          y: sampleValues,
          text: otuLabels,
          mode: "markers",
          marker: {
              color: otuIds,
              size: sampleValues
            },
      };

      Plotly.newPlot("bubble", [trace2]);        

      // Metadata is filtered for id
      var filteredMetaData = data.metadata.filter(data => data.id == sample);
      
      var meta = filteredMetaData[0];

      // Generates Demographic
      var demo = d3.select("#sample-metadata");
      demo.html("");

      // Demo fields
      demoFields = ["id", "ethnicity", "gender", "age", "location", "bbtype", "wfreq"];

      // Loop through demo fields
      demoFields.forEach((field) => {
          demo.append("tr").append("td").text(`${field}: ${meta[field]}`);
      });
          
  });

};

function init() {
  // Populate dropdown
  d3.json("samples.json").then((data) => {

    // Selector
    var selector = d3.select("#selDataset");

    // Html is appended
    data.names.forEach((result) => {
    selector
        .append("option")
        .text(result)
        .property("value", result)
    });

    makePage(data.names[0])
  });
}

// Listen for a change in the dropdown
function optionChanged(selection){
  makePage(selection);
};

init()