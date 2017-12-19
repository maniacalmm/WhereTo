var map;
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: 35.6783528, lng: 139.748912}, // focus in tokyo
      zoom: 12,
      mapTypeControl: false
    });
    // get geo info onclick
    google.maps.event.addListener(map, 'click', function(event) {
      console.log(event.latLng.lat() + " " + event.latLng.lng());
    });
}