/* global describe, it */

// Overwrite some globals to make sure everything works
GLOBAL.chrome = require('./inc/chrome.js');
GLOBAL.document = (new (require('mock-browser').mocks.MockBrowser)()).getDocument();
GLOBAL.window = { mocha: true };
GLOBAL.XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

// Include some libraries
var expect = require('expect.js');
require('../model/ibood.js');

describe('Model/ibood.js', function () {
    this.timeout(1e4);

    describe('#getLatestProduct()', function () {

        // Test if the ibood offer is an object
        it('should return an offer object', function (done) {

            window.ibood.getLatestProduct(function (offer) {

                expect(offer).to.be.an('object');

                done();

            });

        }).timeout(2e4);


        // Test if the object contains an url, an image and a price
        it('should have image, url and price properties', function (done) {

            window.ibood.getLatestProduct(function (offer) {

                expect(offer.url).to.be.a('string');
                expect(offer.image).to.be.a('string');
                expect(offer.price_old).to.be.a('string');
                expect(offer.price_new).to.be.a('string');

                done();

            });

        });


        // Test if the price is actualy a price
        it('should have a correctly formatted price', function (done) {

            window.ibood.getLatestProduct(function (offer) {

                expect(offer.price_old).to.match(/^€ (\d|,)+$/);
                expect(offer.price_new).to.match(/^€ (\d|,)+$/);

                done();

            });

        });

    });


    describe('#getLatestProductStock()', function () {

        it('should return an integer', function (done) {

            window.ibood.getLatestProductStock(function (stock) {

                expect(stock).to.be.a('number');

                done();

            });

        });


        it('should return a number between 0 and 100', function (done) {

            window.ibood.getLatestProductStock(function (stock) {

                expect(stock).to.be.below(101);
                expect(stock).to.be.above(-1);

                done();

            });

        });

    });


    describe('#isHunt()', function () {

        it('should return a boolean', function (done) {

            window.ibood.isHunt(function (ishunt) {

                expect(ishunt).to.be.a('boolean');

                done();

            });

        });

    });

});
