Handlebars.registerHelper('meat', function (type) {
    var guest = Session.get('guest');
    return (guest) ? guest.dietary === 'meat': null;
});
Handlebars.registerHelper('vegetarian', function (type) {
    var guest = Session.get('guest');
    return (guest) ? guest.dietary === 'vegetarian': null;
});
Handlebars.registerHelper('other', function (type) {
    var guest = Session.get('guest');
    return (guest.dietary != 'vegetarian' && guest.dietary != 'meat') ? guest.dietary : '' ;
});
Handlebars.registerHelper('attending', function(bool) {
    var guest = Session.get('guest');
    if (guest && guest.rsvp != undefined) {
        return guest.rsvp === bool;
    }
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
    'click .option[data-type="attending"]': function () {
        Meteor.call('updateRSVP', Session.get('guest'), true, function () {
            $('.thankyou').clearQueue().fadeIn('slow', function () {
                $(this).delay(3000).fadeOut('slow');
            });
        });
    },
    'click .option[data-type="not attending"]': function () {
        Meteor.call('updateRSVP', Session.get('guest'), false, function () {
            $('.thankyou').clearQueue().fadeIn('slow', function () {
                $(this).delay(3000).fadeOut('slow');
            });
        });
    },
    'click .option[data-type="meat eater"]': function () {
        Meteor.call('updateDiet', Session.get('guest'), 'meat', function () {
            $('.thankyou').clearQueue().fadeIn('slow', function () {
                $(this).delay(3000).fadeOut('slow');
            });
        });
    },
    'click .option[data-type="vegetarian"]': function () {
        Meteor.call('updateDiet', Session.get('guest'), 'vegetarian', function () {
            $('.thankyou').clearQueue().fadeIn('slow', function () {
                $(this).delay(3000).fadeOut('slow');
            });
        });
    },
    'blur #dietary_other': function (e) {
        Meteor.call('updateDiet', Session.get('guest'), e.target.value, function () {
            $('.thankyou').clearQueue().fadeIn('slow', function () {
                $(this).delay(3000).fadeOut('slow');
            });
        });
    },

    'blur #plusone_name': function (e) {
        Meteor.call('updatePlusOneName', Session.get('guest'), e.target.value, function () {
            $('.thankyou').clearQueue().fadeIn('slow', function () {
                $(this).delay(3000).fadeOut('slow');
            });
        });
    },
    'blur #plusone_diet': function (e) {
        Meteor.call('updatePlusOneDiet', Session.get('guest'), e.target.value, function () {
            $('.thankyou').clearQueue().fadeIn('slow', function () {
                $(this).delay(3000).fadeOut('slow');
            });
        });
    }
})

var mapCreated = false;
Template.content.rendered = function () {
    var guest = Session.get('guest');
    if (guest && guest.address && !mapCreated) {
        var directionsDisplay = new google.maps.DirectionsRenderer();
        var directionsService = new google.maps.DirectionsService();
        var mapOptions = {
            zoom: 8,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            scrollwheel: false
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

window.mobilecheck = function() {
    var check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))check = true})(navigator.userAgent||navigator.vendor||window.opera);
    return check;
}

$(document).ready(function() {
    if (!mobilecheck()) {
        $('body').prepend('<div class="video-background"></div>');
        $('.video-background').videobackground({
            videoSource: [['/video/encoded.mp4', 'video/mp4'],
                ['/video/encoded.webm', 'video/webm']],
            loop: true,
            poster: '/images/video.jpg',
            loadedCallback: function() {
                $(this).videobackground('mute');
            }
        });
        $('.video-background').videobackground('resize');
    }
});