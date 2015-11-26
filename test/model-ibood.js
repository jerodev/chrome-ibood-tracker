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

    describe('#getLatestProduct()', function () {

        // Test if the ibood offer is an object
        it('should return an offer object', function (done) {

            window.ibood.getLatestProduct(function (offer) {

                expect(offer).to.be.an('object');

                done();

            });

        });


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


    describe('#isHunt()', function () {

        it('should return a boolean', function (done) {

            window.ibood.isHunt(function (ishunt) {

                expect(ishunt).to.be.a('boolean');

                done();

            });

        });

    });

});