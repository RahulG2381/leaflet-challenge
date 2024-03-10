// Store our API endpoint as queryUrl.
let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL
d3.json(queryUrl).then(function (data) {
  // Once we get a response, send the data.features object to the createFeatures function.
createFeatures(data.features);
});

function createFeatures(earthquakeData) {
let earthquakeMarkers = [];
console.log(earthquakeData);

  // Function to calculate marker size based on magnitude
function markerSize(magnitude) {
    return magnitude * 20000;  
}

  // Function to calculate marker color based on depth
function getColor(depth) {
    return depth > 90 ? '#800026' :
        depth > 70 ? '#BD0026' :
        depth > 50 ? '#E31A1C' :
        depth > 30 ? '#FC4E2A' :
        depth > 10 ? '#FD8D3C' :
        depth > -10 ? '#FEB24C' :
                        '#FFEDA0';
  }

  // Iterate through the earthquakeData features
for (let i = 0; i < earthquakeData.length; i++) {
    const coordinates = [earthquakeData[i].geometry.coordinates[1], earthquakeData[i].geometry.coordinates[0]];
    const magnitude = earthquakeData[i].properties.mag;
    const depth = earthquakeData[i].geometry.coordinates[2];

    earthquakeMarkers.push(
    L.circle(coordinates, {
        stroke: false,
        fillOpacity: 0.75,
        color: "white",
        fillColor: getColor(depth),
        radius: markerSize(magnitude)
    }).bindPopup(`<h3>Place: ${earthquakeData[i].properties.place},Magnitude: ${earthquakeData[i].properties.mag},Depth: ${earthquakeData[i].geometry.coordinates[2]}</h3><hr><p>${new Date(earthquakeData[i].properties.time)}</p>`)
    );
}

  // Create the base layers.
let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

  // Create a layer group for the earthquake markers
let earthquake = L.layerGroup(earthquakeMarkers);

  // Create a baseMaps object.
    let baseMaps = {
    "Street Map": street
};

  // Create an overlay object.
let overlayMaps = {
    "Earthquake Magnitude": earthquake
};

  // Create our map, giving it the streetmap and earthquakes layers to display on load.
let myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 5,
    layers: [street, earthquake]
});

  // Create a layer control.
  // Pass it our baseMaps and overlayMaps.
  // Add the layer control to the map.
L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
}).addTo(myMap);

  // Creating a static legend control
var legend = L.control({position: "bottomright"});
legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend"),
    depth = [-10, 10, 30, 50, 70, 90];

    div.innerHTML += "<h3 style='text-align: center'>Depth</h3>"

    for (var i = 0; i < depth.length; i++) {
    div.innerHTML +=
    '<i style="background:' + getColor(depth[i] + 1) + '"></i> ' + depth[i] + (depth[i + 1] ? '&ndash;' + depth[i + 1] + '<br>' : '+');
    }
    return div;
};
legend.addTo(myMap)

};


