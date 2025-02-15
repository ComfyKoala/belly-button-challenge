// Build the metadata panel
function buildMetadata(sample) {
  d3.json(
    "https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json"
  ).then((data) => {
    // get the metadata field
    let metadata = data.metadata;

    // Filter the metadata for the object with the desired sample number
    let selMetadata = metadata.filter((val) => val.id == sample)[0];

    // Use d3 to select the panel with id of `#sample-metadata`
    let divSample = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    divSample.html("");

    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
    for (const key in selMetadata) {
      let val = `${key.toUpperCase()}: ${selMetadata[key]}`;
      divSample.append("div").text(val);
    }
  });
}

// function to build both charts
function buildCharts(sample) {
  d3.json(
    "https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json"
  ).then((data) => {
    // Get the samples field
    let samples = data.samples;

    // Filter the samples for the object with the desired sample number
    let selSample = samples.filter((val) => val.id == sample)[0];

    // Get the otu_ids, otu_labels, and sample_values
    let otu_ids = selSample.otu_ids;
    let otu_labels = selSample.otu_labels;
    let sample_values = selSample.sample_values;

    // Build a Bubble Chart
    let bubbleTrace = {
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: "markers",
      marker: {
        size: sample_values,
        opacity: 0.7,
        color: otu_ids,
      },
    };

    let bubbleData = [bubbleTrace];

    let bubbleLayout = {
      title: "Bacteria Cultures Per Sample",
      xaxis: { title: "OTU ID" },
      yaxis: { title: "Number of Bacteria" },
      showlegend: false,
    };

    // Render the Bubble Chart
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);

    // For the Bar Chart, map the otu_ids to a list of strings for your
    let barOTU = otu_ids.map((val) => `OTU ${val}`);
    // Build a Bar Chart
    // Don't forget to slice and reverse the input data appropriately
    let barTrace = {
      x: sample_values.slice(0, 10).reverse(),
      y: barOTU.slice(0, 10).reverse(),
      type: "bar",
      orientation: "h",
    };

    let barData = [barTrace];

    let barLayout = {
      title: "Top 10 Bacteria Cultures Found",
      xaxis: { title: "Number of Bacteria" },
      showlegend: false,
    };

    // Render the Bar
    Plotly.newPlot("bar", barData, barLayout);
  });
}

// Function to run on page load
function init() {
  d3.json(
    "https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json"
  ).then((data) => {
    // Get the names field
    let names = data.names;
    // Use d3 to select the dropdown with id of `#selDataset`
    let dropdown = d3.select("#selDataset");
    // Use the list of sample names to populate the select options
    names.forEach((val) => dropdown.append("option").text(val));

    // Get the first sample from the list
    let firstSample = names[0];
    // Build charts and metadata panel with the first sample
    buildMetadata(firstSample);
    buildCharts(firstSample);
  });
}

// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
}

// Initialize the dashboard
init();
