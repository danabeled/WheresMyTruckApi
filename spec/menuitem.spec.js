var MenuItem = require('../app/models/MenuItem');

describe("Menu Item Schema", function(){

    it("should require a name field", function(){
        var m = new MenuItem();

        m.validate(function(err){
            expect(err.errors.name.message).toEqual("Path `name` is required.");
        })
    });
})