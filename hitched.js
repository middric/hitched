Guests = new Meteor.Collection('guests');
Guests.allow({
	update: function () {
		return true;
	}
})
/* Guest object

{ 
    name: "",
    dietary: meat|vegetarian|"",
    address: "",
    rsvp: true|false,
    plusone: {
        name: "",
        dietary: meat|vegetarian|""
    },
    accommodation: true|false
}

*/