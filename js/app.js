var map;

var akiba = {title: 'akihabara', position: {lat: 35.7022077, lng: 139.7722649}};
var tokyo_station = {title: 'tokyo station', position: {lat: 35.6811673, lng: 139.7648575}};
var shinagawa_station = {title: 'shinagawa_station', position: {lat: 35.6284713, lng: 139.7365656}};

var places = [akiba, tokyo_station, shinagawa_station];
var location_list = [];
var markers = [];
var largeInfowindow;

var fourSqureID = "MDWWWT2K41IZ4MFE44GS10UMIO1LP1XLPXXL2O00ME2LMQSQ";
var fourSqureSecret = "SSXUSJE3EXP4YIJHVDCJKDPCHY5445FX4XV1P3IO5HGZAAJ4";

/*------------------------------- Map related methods start ---------------------------------- */
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: 35.6783528, lng: 139.748912}, // focus in tokyo
      zoom: 12,
      mapTypeControl: false
    });

    largeInfowindow = new google.maps.InfoWindow();
    create_marker(places, map);
    google.maps.event.addListener(map, 'click', function(event) {
      console.log(event.latLng.lat() + " " + event.latLng.lng());
    });
    foursquare_fetch();
}

function create_marker(places, map) {
    places.forEach(function(place, index) {
        let marker = new google.maps.Marker({
            map: map,
            position: place.position,
            title: place.title,
            animation: google.maps.Animation.DROP,
            id: index
        });
        markers.push(marker);
        marker.addListener('click', function() {
            populateInfoWindow(this, largeInfowindow, map);
        });
    });
}


function populateInfoWindow(marker, infowindow, map) {
    if (infowindow.marker != marker) {
        infowindow.marker = marker;
        infowindow.setContent(marker.title);
        infowindow.open(map, marker);
        infowindow.addListener('closeclick', function() {
            infowindow.marker = null;
        });
    }
}


/*------------------------------- Map related methods end ---------------------------------- */

function test_input(input) {
    console.log(input);
}


function foursquare_fetch(request = 'near', value = 'tokyo,JP', categoryId='4d4b7104d754a06370d81259', ko_obs_array=VM.list_view) {
    var req_link = `https://api.foursquare.com/v2/venues/search?${request}=${value}&categoryId=${categoryId}&client_id=${fourSqureID}&client_secret=${fourSqureSecret}&v=20171212`
    ko_obs_array.removeAll();
    fetch(req_link)
    .then(function(response) {
        return response.json();
    })
    .then(function(res_obj) {
        console.log(res_obj);
        let locations = [] // a set of places find given the coordinates
        res_obj.response.venues.forEach(function(place) {
        	let index = place.name.indexOf('(');
        	console.log(place.name.substring(0, index));
        	location_list.push(new spot(place));
            ko_obs_array.push(new spot(place));
        });
    })
    .catch(function(error) {
        alert('something is not working, reload again :(');
    });
}

function spot(place) {
    this.lat = place.location.lat;
    this.lng = place.location.lng;
    this.name_1 = place.name.substring(0, place.name.indexOf('('));
    this.name_2 = place.name.substring(place.name.indexOf('('));
    this.search_name = this.name_1 === '' ? this.name_2.toLowerCase() : this.name_1.toLowerCase();
    this.url = place.url;
    this.address = place.location.address;
    this.phone = place.contact.phone;
}


function view_model() {
    // after loaded, initialize maybe

    var self = this;

    self.categories = [
        {category_name : 'Arts & Entertainment', category_id : '4d4b7104d754a06370d81259'},
        {category_name : 'College & University' , category_id : '4d4b7105d754a06372d81259'},
        {category_name : 'Food' , category_id: '4d4b7105d754a06374d81259'},
        {category_name : 'Nightlife Spot' , category_id: '4d4b7105d754a06376d81259'},
        {category_name : 'Professional & Other Places', category_id : '4d4b7105d754a06375d81259'},
        {category_name : 'Shop & Service', category_id : '4d4b7105d754a06378d81259'},
        {category_name : 'Travel & Transport', category_id : '4d4b7105d754a06379d81259'}
    ];


    self.input = ko.observable();

    self.list_view = ko.observableArray();

    self.selected_category = ko.observable();

    self.sel_cat_name = ko.computed(function() {
        return self.selected_category() == undefined ?
                            '' : self.selected_category().category_name;
    }, self);

    self.apply_filter = function() {
    	let filtered_list = location_list.filter(obj => obj.search_name.startsWith(self.input()));
    	console.log(filtered_list);
    	self.list_view(filtered_list);
    };

    self.apply_category = function() {
    	let latlng = new google.maps.LatLng(map.getCenter().lat(), map.getCenter().lng());
        foursquare_fetch('ll',
                           latlng.lat() + ',' + latlng.lng(),
                            self.selected_category().category_id,
                            self.list_view);
    };

}

/* --- HIDE button Jquery Hard-coded ------------*/
$('#fold_view_list_btn').on('click', function() {
	console.log('something');
	$('#view_list').toggleClass('hide');
});
var VM = new view_model();

ko.applyBindings(VM);


