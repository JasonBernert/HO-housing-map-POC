// Set up map
const map = L.map('map', {
	scrollWheelZoom: false,
	center: [45.54, -122.67],
	zoom: 11
});

if (window.innerWidth < 600){
	map.setZoom(10);
}

const baselayer = L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_nolabels/{z}/{x}/{y}.png', {
  maxZoom: 18,
  attribution: '<a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, <a href="https://carto.com/attribution">CARTO</a>'
});

const topLayer = L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_only_labels/{z}/{x}/{y}.png');

baselayer.addTo(map);
// topLayer.addTo(map);

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

const geography = L.geoJson(neighborhoods, {style: style}).addTo(map);
const demographicText = document.querySelector('.demographic');

// Grab all the buttons and add an event listener
const buttons = document.querySelectorAll('.button');
buttons.forEach(button => button.addEventListener('click', function(){
	this.classList.add('active');

	const demographic = this.innerText;
	demographicText.innerText = `a ${demographic} Portlander`;

	geography.setStyle( function style(feature) {
	    return {
	        fillColor: getColor(feature.properties[demographic]),
	    };
	});

})
);
