// Alot of this code comes from the leaflet choropleth tutorial: http://leafletjs.com/examples/choropleth/

// This is the defalt demographic the user will see when they load the page
let demographic = 'Asian';

// Set up map
const map = L.map('map', {
	scrollWheelZoom: false,
	center: [45.54, -122.67],
	zoom: 11
});

// Zoom out a bit on mobile devices to get that whole map in there.
if (window.innerWidth < 600){
	map.setZoom(10);
}

// Simple and free to use basetiles thanks to CartoDB!
const baselayer = L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_nolabels/{z}/{x}/{y}.png', {
	maxZoom: 18,
	attribution: '<a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, <a href="https://carto.com/attribution">CARTO</a>'
}).addTo(map);

// Add a top layer of labels
map.createPane('labels');
map.getPane('labels').style.zIndex = 650;
map.getPane('labels').style.pointerEvents = 'none';
const labels = L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_only_labels/{z}/{x}/{y}.png', {
	pane: 'labels'
}).addTo(map);

// Color map based on what demographic was chosen. If yes ('y'), then the region is blue. Else, it's red.
function getColor(d) {
	return d === 'y' ? '#2c7bb6':
				 d === 'n' ? '#d7191c'
				 : '#fffff';
}

// Set styles for map
function style(feature) {
	return {
		fillColor: getColor(feature.properties.White),
		weight: 1.5,
		opacity: 1,
		color: 'white',
		fillOpacity: 0.7
	};
}

// When you hover over a neighborhood we'll give it some new styles and update the info div.
function highlightFeature(e) {
	var layer = e.target;
	info.update(layer.feature.properties);
	layer.setStyle({
		weight: 3,
		color: '#666'
	});
	if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
		layer.bringToFront();
	}
}

// When you're not hovering over it, we'll reset.
function resetHighlight(e) {
	e.target.setStyle({
		weight: 1.5,
		color: '#fff'
	});
	info.update();
}

// Leaflet method to add controls
var info = L.control();

// create a div with a class "info"
info.onAdd = function (map) {
	this._div = L.DomUtil.create('div', 'info');
	this.update();
	return this._div;
};

// method that we will use to update the control based on feature properties passed
info.update = function (props) {
	this._div.innerHTML =  (props ?
		`<p>An average <b>${demographic}</b> Portlander <b>${props[demographic] === 'y' ? 'could' : 'couldn’t'}</b> afford a two-bedroom apartment in the <b>${props.Neighborhood}</b> neighborhood.</p>`
		: 'Hover for more info');
}
info.addTo(map);

// Add all the functionality above to the map layers
function onEachFeature(feature, layer) {
	layer.on({
		mouseover: highlightFeature,
		mouseout: resetHighlight
	});
}

// Now that we have all our functions and styles set, take our geography, styles and functionality and make a map!
const geojson = L.geoJson(neighborhoods, {
	style: style,
	onEachFeature: onEachFeature
}).addTo(map);

// Let's make out buttons work!
const demographicText = document.querySelector('.demographic');

// Grab all the buttons and add an event listener
const buttons = document.querySelectorAll('.button');

buttons.forEach(button => button.addEventListener('click', function(){
	// Remove any active class then add to clicked button
	buttons.forEach(button => button.classList.remove('active'));
	button.classList.add('active');
	// Grab all text in the button that'll act as our input
	demographic = this.innerText;
	// Update the story text based on our demographic
	demographicText.innerText = `a ${demographic} Portlander`;
	// Update the coloring on the map to the correct data
	geojson.setStyle( function style(feature) {
		return {
			fillColor: getColor(feature.properties[demographic]),
		};
	});
}));
