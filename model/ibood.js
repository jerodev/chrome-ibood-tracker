/* global chrome */

(function () {

    "use strict";

    window.ibood = {
        lastProduct: {},

        /**
         *  Get the information of the current product on iBOOD
         */
        getLatestProduct: function (callback, errorCallback) {

            // Create some variables
            var url,
                x = new XMLHttpRequest();

            // Find out what the ibood link is we want to use
            chrome.extension.getBackgroundPage().settings.get('country', function (country) {

                // Build the url
                url = "https://www.ibood.com/" + country + "/nl/";

                // Add cache bust
                url += "?" + (new Date().getTime());

                // Wait at least 3 seconds before bothering the website again
                if (window.ibood.lastProduct.scrape &&
                    window.ibood.lastProduct.scrape.timestamp + 3 >= new Date().getTime() &&
                    window.ibood.lastProduct.scrape.url === url) {

                    // Send the existing data back
                    callback(window.ibood.lastProduct);

                    // Leave this function
                    return;
                }

                // Send the request
                x.open('GET', url);

                // Response has been received!
                x.onload = function () {

                    // Create variables
                    var data = {},
                        doc = document.implementation.createHTMLDocument("example");

                    // Parse the DOM
                    doc.documentElement.innerHTML = x.responseText;

                    // Scrape required data from website
                    data.title = doc.querySelectorAll('.offer-title .long')[0].innerHTML;
                    data.image = "http:" + doc.querySelectorAll('.offer-img img')[0].getAttribute('data-mobile');
                    data.price_old = doc.querySelectorAll('.price .old-price')[0].innerHTML.replace(/<[^>]*>/g, "");
                    data.price_new = doc.querySelectorAll('.price .new-price')[0].innerHTML.replace(/<[^>]*>/g, "");
                    data.url = doc.querySelectorAll('.button-cta.buy a')[0].href;
                    data.isHunt = doc.querySelectorAll(".huntbeacon.homepage").length > 1;

                    // Keep data about the last website scrape.
                    data.scrape = {
                        timestamp: new Date().getTime(),
                        url: url
                    };

                    // Send the data back to the caller
                    if (typeof callback === 'function') {
                        callback(data);
                    }

                };

                // Ajax error occured
                x.onerror = function () {

                    // Execute the error callback
                    if (typeof callback === 'function' && window.ibood.lastProduct.hasOwnProperty('title')) {
                        callback(window.ibood.lastProduct);
                    } else if (typeof errorCallback === 'function') {
                        errorCallback();
                    }

                };

                // Send the ajaxRequest
                x.send();

            });

        },


        /**
         *  Is there currently a hunt going on?
         */
        isHunt: function (callback) {
            // Create some variables
            var url,
                x = new XMLHttpRequest();

            // Find out what the ibood link is we want to use
            chrome.extension.getBackgroundPage().settings.get('country', function (country) {

                // Build the url
                url = "https://www.ibood.com/" + country + "/nl/";

                // Send the request
                x.open('GET', url);

                // Response has been received!
                x.onload = function () {

                    // Create variables
                    var isHunt = false,
                        doc = document.implementation.createHTMLDocument("example");

                    // Parse the DOM
                    doc.documentElement.innerHTML = x.responseText;

                    // Find out if a hunt is going on
                    isHunt = doc.querySelectorAll(".huntbeacon.homepage").length > 1;

                    // Send the data back to the caller
                    if (typeof callback === 'function') {
                        callback(isHunt);
                    }

                };

                // Ajax error occured
                x.onerror = function (e) {
                    window.console.log('ajax error!', e);
                };

                // Send the ajaxRequest
                x.send();

            });
        },


        /**
         *  Open the current product in a new tab in the browser
         */
        openInTab: function () {

            // Find out what the ibood link is we want to use
            chrome.extension.getBackgroundPage().settings.get('country', function (country) {

                chrome.tabs.create({
                    active: true,
                    url: 'http://www.ibood.com/' + country + '/nl/ibood10y/198b8da6529c3053317859deba4de237'
                    // url: window.ibood.lastProduct.url
                });

            });
        }

    };

} ());