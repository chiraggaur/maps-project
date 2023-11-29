// The map is centered at Anjuna,Goa by default
// The distance between currlocation of our marker and hotels is set to a minimum of 0.2miles for markers to display or disappear
// The app uses a dummy dataset of 20 items
// Drag the Location Marker with red color to change current location on this map

const hotelsMenu = document.getElementById('hotels-menu');

var initialLatLng = { lat: 15.5871, lng: 73.7421 }; // initial latitude and longitude to center map at Anjuna, Goa
var hotelsArr = []; // Array for filtered hotels based on currLocation's distance from all hotels
var markersArr = []; // Array containing marker objects for all markers present on the map

function calculate_distance(mk1, mk2) {
  var R = 3958.8; // Radius of the Earth in miles
  var rlat1 = mk1.lat * (Math.PI/180); // Convert degrees to radians
  var rlat2 = mk2.lat * (Math.PI/180); // Convert degrees to radians
  var difflat = rlat2-rlat1; // Radian difference (latitudes)
  var difflon = (mk2.lng - mk1.lng) * (Math.PI/180); // Radian difference (longitudes)

  var d = 2 * R * Math.asin(Math.sqrt(Math.sin(difflat/2)*Math.sin(difflat/2)+Math.cos(rlat1)*Math.cos(rlat2)*Math.sin(difflon/2)*Math.sin(difflon/2))); // convert distance to miles
  return d;
} // calculates the distance between currLocation and currMarker in the iteration both passed as params in the function call

function initMap(){ // map initializer function
  var myStyles =[
    {
        featureType: "poi",
        elementType: "labels",
        stylers: [
              { visibility: "off" }
        ]
    }
  ]; // remove all default stylers from map and also the places of interest markers from the map

  var options = {
    zoom: 16,
    center: initialLatLng,
    disableDefaultUI: true,
    styles: myStyles,
  } // options for map object 

  var map = new google.maps.Map(document.getElementById('map'), options); // a new instance of map is created and pushed into the map element in our HTML

  var locationMarker = new google.maps.Marker({
    position: initialLatLng,
    map: map,
    icon: 'marker.png',
    draggable: true
  }); // Draggable Marker for our currLocation 

  function clearMarkers() {
    for (var i = 0; i < markersArr.length; i++ ) {
      markersArr[i].setMap(null);
    }
    markersArr = [];
  } // Clear all markers on state change i.e., change in the hotels array

  google.maps.event.addListener(locationMarker, 'dragend', function (evt) {
    initialLatLng.lat = evt.latLng.lat().toFixed(6); // set initial latitude to new value on location marker drag
    initialLatLng.lng = evt.latLng.lng().toFixed(6); // set initial longitude to new value on location marker drag
    map.panTo(evt.latLng); // pan the map to new coordinates
    clearMarkers(); // clear all markers on state change
    addHotelsOnMap(); // add new hotels and markers according to distance filter
    createSidebar(); // create the sidebar with new list of hotels on marker drag
  });
  
  map.setCenter(locationMarker.position); // center map on location marker's current position

  // adds the location marker on the map
  locationMarker.setMap(map);

  function addHotelsOnMap(){
    hotelsArr = [];
    data.forEach(hotel => {
      var distance = calculate_distance(initialLatLng, hotel.coords);
      if(distance < 0.2){
        hotelsArr.push(hotel);
      }
    });
    hotelsArr.forEach(hotel => addMarker(hotel));
  } // pushes hotels into hotels array based on distance from currentLocation of locationMarker

  addHotelsOnMap(); // add hotels on map initialization
  createSidebar(); // create sidebar on map initialization

  function addMarker(props){
      var marker = new google.maps.Marker({
        position: props.coords,
        map: map,
        icon: 'bed.png'
      }); // pass marker options as params for new instance of marker
  
      var infoWindow = new google.maps.InfoWindow({
        content: `<h1>${props.name}</h2>`
      }); // create infowindow upon click on hotel markers
    
      marker.addListener('click', function(){
        infoWindow.open(map, marker);
      });  // add listener for click event on marker to open infoWindow

      markersArr.push(marker); // add marker object in markers array
  }
} // create new markers for each hotel passed in as prop

function createSidebar(){
  hotelsMenu.innerHTML = ''; // clear sidebar on state-change(change in currentLocation)
  hotelsArr.forEach(hotel => {
    var li = document.createElement('li');
    var a = document.createElement('a');
    li.classList.add('hotels-menu-item');
    a.innerText = hotel.name;
    a.setAttribute('href', './hotels.html');
    a.addEventListener('click', () => {
      localStorage.setItem('selectedHotel', hotel.name);
    });
    li.append(a);
    hotelsMenu.append(li);
  })
} // sidebar creator function