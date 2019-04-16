var MenuItem = require('../app/models/MenuItem');

describe("Menu Item Schema", function(){

    it("should require a name field", function(){
        var m = new MenuItem();

        m.validate(function(err){
            expect(err.errors.name.message).toEqual("Path `name` is required.");
        })
    });

    it("should require a price field", function(){
        var m = new MenuItem();

        m.validate(function(err){
            expect(err.errors.price.message).toEqual("Path `price` is required.")
        })
    })

    it("should not accept non-numbers for a price", function(){
        var m = new MenuItem({
            price: "Hello there!"
        });

        m.validate(function(err){
            expect(err.errors.price.message).toEqual('Cast to Number failed for value "Hello there!" at path "price"');
        })
    })
})