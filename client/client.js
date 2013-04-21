Handlebars.registerHelper('meat', function (type) {
    var guest = Session.get('guest');
    return guest.dietary === 'meat';
});
Handlebars.registerHelper('vegetarian', function (type) {
    var guest = Session.get('guest');
    return guest.dietary === 'vegetarian';
});
Handlebars.registerHelper('other', function (type) {
    var guest = Session.get('guest');
    return (guest.dietary != 'vegetarian' && guest.dietary != 'meat') ? guest.dietary : '' ;
});

Template.content.helpers({
    guest: function () {
        if (!$.cookie('guest_id')) {
            var matches = window.location.search.match(/id=([0-9a-z]+)/i)
            if (matches) {
                var id = matches[1];
                var guest = Guests.findOne(id);
                $.cookie('guest_id', id);
                Session.set('guest', guest);
            }
        } else {
            var guest = Guests.findOne($.cookie('guest_id'));
            Session.set('guest', guest);
        }

        return Session.get('guest');
    }
});

Template.content.events({
    'click .option[data-type="meat eater"]': function () {
        Meteor.call('updateDiet', Session.get('guest'), 'meat');
    },
    'click .option[data-type="vegetarian"]': function () {
        Meteor.call('updateDiet', Session.get('guest'), 'vegetarian');
    },
    'blur #dietary_other': function (e) {
        Meteor.call('updateDiet', Session.get('guest'), e.target.value);
    },

    'blur #plusone_name': function (e) {
        Meteor.call('updatePlusOneName', Session.get('guest'), e.target.value);
    },
    'blur #plusone_diet': function (e) {
        Meteor.call('updatePlusOneDiet', Session.get('guest'), e.target.value);
    }
})

var mapCreated = false;
Template.content.rendered = function () {
    var guest = Session.get('guest');
    if (guest && !mapCreated) {
        var directionsDisplay = new google.maps.DirectionsRenderer();
        var directionsService = new google.maps.DirectionsService();
        var mapOptions = {
            zoom: 8,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        var map = new google.maps.Map(document.getElementById("map-canvas"),
            mapOptions);
        directionsDisplay.setMap(map);
        directionsDisplay.setPanel(document.getElementById("directionsPanel"));


        var request = {
            origin: guest.address,
            destination: 'Caswell House,Caswell Lane,Brize Norton,Oxfordshire,OX18 3NJ',
            travelMode: google.maps.TravelMode.DRIVING
        };
        directionsService.route(request, function(result, status) {
            if (status == google.maps.DirectionsStatus.OK) {
                directionsDisplay.setDirections(result);
            }
        });

        mapCreated = true;
    }
}


$(document).ready(function() {
    $('body').prepend('<div class="video-background"></div>');
    $('.video-background').videobackground({
        videoSource: [['/video/encoded.mp4', 'video/mp4'],
            ['/video/encoded.webm', 'video/webm']],
        loop: true,
        //poster: '/',
        loadedCallback: function() {
            $(this).videobackground('mute');
        }
    });
});