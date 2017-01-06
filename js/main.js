// Set up map
var map = L.map('map', {
	scrollWheelZoom: false,
	center: [45.5231, -122.6765],
	zoom: 11
});

var baselayer = L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_nolabels/{z}/{x}/{y}.png', {
  maxZoom: 18,
  attribution: '<a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, <a href="https://carto.com/attribution">CARTO</a>'
});

var topLayer = L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_only_labels/{z}/{x}/{y}.png');

baselayer.addTo(map);
topLayer.addTo(map);

L.geoJson(neighborhoods).addTo(map);


// ROADS ON TOP
    // var topPane = map._createPane('leaflet-top-pane', map.getPanes().mapPane);
    // topPane.appendChild(topLayer.getContainer());
    // topLayer.setZIndex(7);
