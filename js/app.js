var map;  // map variable

var location_list = []; // locations list from API query
var largeInfowindow;   // popup window

/*-------------- API ID ------------*/
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
    foursquare_fetch();
}


function populateInfoWindow(marker, infowindow, map) {
    if (infowindow.marker != marker) {
        infowindow.marker = marker;
        infowindow.setContent(marker.content);
        infowindow.open(map, marker);
        infowindow.addListener('closeclick', function() {
            infowindow.marker = null;
        });
    }
}


/*------------------------------- Map related methods end ---------------------------------- */


// fetch from foursquare API
function foursquare_fetch(request = 'near', value = 'tokyo,JP', categoryId='4d4b7104d754a06370d81259', ko_obs_array=VM.list_view) {
    var req_link = `https://api.foursquare.com/v2/venues/search?${request}=${value}&categoryId=${categoryId}&client_id=${fourSqureID}&client_secret=${fourSqureSecret}&v=20171212`
    ko_obs_array.removeAll();
    location_list = [];

    fetch(req_link)
    .then(function(response) {
        return response.json();
    })
    .then(function(res_obj) {
        // populate the location list and ko list
        console.log(res_obj);
        res_obj.response.venues.forEach(function(place) {
        	let new_spot = new spot(place);

            new_spot.marker.addListener('click', function() {
                toggleBounce(this);
            });

        	location_list.push(new_spot);
            ko_obs_array.push(new_spot);
        });
    })
    .catch(function(error) {
    	console.log(Error(error).stack);
        alert('something is not working, reload again :(');
    });
}

// spot class
function spot(place) {
    this.lat = place.location.lat;
    this.lng = place.location.lng;
    this.name_1 = place.name.substring(0, place.name.indexOf('('));
    this.name_2 = place.name.substring(place.name.indexOf('('));
    this.search_name = this.name_1 === '' ? this.name_2.toLowerCase() : this.name_1.toLowerCase();
    this.url = place.url;
    this.address = place.location.address;
    this.phone = place.contact.phone;
    this.show = ko.observable(false);
    this.hereNow = place.hereNow.summary;
    this.marker = new google.maps.Marker({
            map: map,
            position: {lat: this.lat, lng: this.lng},
            animation: google.maps.Animation.DROP,
            content: this.name_1 + this.name_2 + " : " + this.address + 'TEL:'+ this.phone
        });
}

// top ViewModel
function view_model() {
    // after loaded, initialize maybe

    var self = this;

    // entire category from fourSquare API
    self.categories = [
        {category_name : 'Arts & Entertainment', category_id : '4d4b7104d754a06370d81259'},
        {category_name : 'College & University' , category_id : '4d4b7105d754a06372d81259'},
        {category_name : 'Food' , category_id: '4d4b7105d754a06374d81259'},
        {category_name : 'Nightlife Spot' , category_id: '4d4b7105d754a06376d81259'},
        {category_name : 'Professional & Other Places', category_id : '4d4b7105d754a06375d81259'},
        {category_name : 'Shop & Service', category_id : '4d4b7105d754a06378d81259'},
        {category_name : 'Travel & Transport', category_id : '4d4b7105d754a06379d81259'}
    ];


    self.input = ko.observable(); // input

    self.list_view = ko.observableArray(); // location lists

    self.selected_category = ko.observable(); // category selected

    // filtering result from input
    self.apply_filter = function() {
    	let filtered_list = location_list.filter(obj => obj.search_name.startsWith(self.input()));

        // select marker visibility
        location_list.forEach(function(place) {
            var match = place.search_name.startsWith(self.input());
            place.marker.setVisible(match);
        });

    	self.list_view(filtered_list);
    };

    // fetching API info from selected category
    self.apply_category = function() {
    	let latlng = new google.maps.LatLng(map.getCenter().lat(), map.getCenter().lng());
        foursquare_fetch('ll',
                           latlng.lat() + ',' + latlng.lng(),
                            self.selected_category().category_id,
                            self.list_view);
    };

    self.show_info_window = function() {
        toggleBounce(this.marker);

        this.show(!this.show());
    }

}

function toggleBounce(marker) {
    console.log('you tried');
    console.log(marker);
    if (marker.getAnimation() == google.maps.Animation.DROP) {
        marker.setAnimation(google.maps.Animation.BOUNCE);
        populateInfoWindow(marker, largeInfowindow, map)
    } else if (marker.getAnimation() !== null) {
        marker.setAnimation(null);
    } else {
        marker.setAnimation(google.maps.Animation.BOUNCE);
        populateInfoWindow(marker, largeInfowindow, map)
    }
}

var VM = new view_model();

ko.applyBindings(VM);

/* --- HIDE button Jquery Hard-coded ------------*/
$('#fold_view_list_btn').on('click', function() {
	$('#view_list').toggleClass('hide');
});


$('#fold_view_list_btn_small').on('click', function() {
	$('#view_list').toggleClass('hide');
});

/* ----- when window get's too small hide the side bar ---*/
$(window).resize(function() {
	if ($(window).width() < 650) {
		$('#view_list').addClass('hide');
	} else {
		$('#view_list').removeClass('hide');
	}
});



