Guests = new Meteor.Collection('guests');

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