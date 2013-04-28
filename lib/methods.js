(function () {
    Meteor.methods({
        updateDiet: function (guest, to) {
            if (Meteor.isServer && to) {
                Guests.update(
                    {_id: guest._id},
                    {$set: {'dietary': to}}
                )
            }
        },
        updatePlusOneName: function (guest, to) {
            if (Meteor.isServer) {
                Guests.update(
                    {_id: guest._id},
                    {$set: {'plusone.name': to}}
                )
            }
        },
        updatePlusOneDiet: function (guest, to) {
            if (Meteor.isServer) {
                Guests.update(
                    {_id: guest._id},
                    {$set: {'plusone.dietary': to}}
                )
            }
        },
        updateRSVP: function (guest, bool) {
            if (Meteor.isServer) {
                Guests.update(
                    {_id: guest._id},
                    {$set: {'rsvp': bool}}
                );
            }
        }
    });
})();