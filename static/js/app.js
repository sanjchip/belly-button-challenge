//set up cont url
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Promise Pending
const dataPromise = d3.json(url);
console.log("Data Promise: ", dataPromise);

// Fetch the JSON data and console log it
d3.json(url).then(function(data) {
    console.log(data);
  });




// Function for horizontal bar chart
function horizontalbchart(bValue) {
  d3.json(url).then((data) => {
    console.log(`BarData: ${data}`);
    // Pulling sample into barData
    let barData = data.samples;

    // Filter the barData
    let filterBar = barData.filter((item) => item.id == bValue);

    // Get the first bValue data
    let filterBarList = filterBar[0];

    // Horizontal bar chart
    let x_axis = filterBarList.sample_values.slice(0, 10).reverse();
    let y_axis = filterBarList.otu_ids.slice(0, 10).reverse().map((item) => `OTU ${item}`);
    let text = filterBarList.otu_labels.slice(0, 10).reverse();

    barChart = {
        x: x_axis,
        y: y_axis,
        text: text,
        type: "bar",
        orientation: "h",
    };

    let chart = [barChart];

    Plotly.newPlot("bar", chart);
  });
}


// Function for bubble chart
function bubbleChart(bValue) {
  d3.json(url).then((data) => {
    console.log(`BubbleData: ${data}`);

    let bubbleData = data.samples;
    let filterBubble = bubbleData.filter((item) => item.id == bValue);
    let filterBubbleList = filterBubble[0];

    let trace = [{
      x: filterBubbleList.otu_ids,
      y: filterBubbleList.sample_values,
      text: filterBubbleList.otu_labels,
      mode: "markers",
      marker: {
        size: filterBubbleList.sample_values,
        color: filterBubbleList.otu_ids,
        colorscale: "Pastel"
      }  
    }];

    let layout = {
      xaxis: {title: "OTU ID"}
    };

    Plotly.newPlot("bubble", trace, layout);
  });
}


// Function for the demographic information
function demoInfo(bValue) {
  d3.json(url).then((data) => {
    console.log(`DemographicData: ${data}`);

    let demoData = data.metadata;
    let filterDemo = demoData.filter((item) => item.id == bValue);
    let demoDataList = filterDemo[0];

    // Clear the elements in div using d3
    d3.select("#sample-metadata").html("");

    // Insert data with key-value pair, then append the data
    Object.entries(demoDataList).forEach(([key,value]) => {
      d3.select("#sample-metadata").append("h5").text(`${key}: ${value}`);
    });

    // Console log it
    console.log(Object.entries(demoDataList));
  });  

}

// Function to start the dashboard
function init() {

  // D3 to access the dropdown menu
  let dropdownMenu = d3.select("#selDataset");

  //Fetch the JSON data and console log it
  d3.json(url).then((data) => {
    console.log(`Data: ${data}`);

    let dropdownId = data.names;

    // Append the item to the id on #setDataset
    dropdownId.forEach((item) => {
      dropdownMenu.append("option").text(item).property("value", item);
    });

    // Get the first item data
    let bValue = dropdownId[0]

    // Call functions
    horizontalbchart(bValue);
    bubbleChart(bValue);
    demoInfo(bValue);
  });  
} 


// Function to update the dashboard
function optionChanged(bValue) {
    horizontalbchart(bValue);
    bubbleChart(bValue);
    demoInfo(bValue);
}

init();