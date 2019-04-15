var Menu = require('../app/models/Menu');

describe("Menu Schema", function(){

    it("should require a name field", function(){
        var m = new Menu();

        m.validate(function(err){
            expect(err.errors.truck.message).toEqual("Path `truck` is required.");
        })
    });
})