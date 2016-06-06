/* global chrome */
(function () {

    "use strict";

    window.ibood = {

        ishunt: false,
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

                // A function to load the stock
                var loadStock = function (callback, offer) {

                    // Do we also want to display the stock?
                    chrome.extension.getBackgroundPage().settings.get('displayStock', function (displayStock) {

                        // Only load the stock when the option is enabled and a hunt is going on
                        if (!displayStock || !window.ibood.ishunt) {

                            // Send the data back to the caller
                            if (typeof callback === 'function') {
                                callback(offer);
                            }

                        } else {

                            // Load the stock data, then return the product
                            window.ibood.getLatestProductStock(function (stock) {

                                // Add the stock to the data
                                offer.stock = stock;

                                // Send the data back to the caller
                                if (typeof callback === 'function') {
                                    callback(offer);
                                }

                            });

                        }
                    });
                }

                // Build the url
                url = "http://feeds.ibood.com/" + country + "/offer.json";

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

                    // Make sure the request was valid!
                    if (x.status != 200) {
                        x.onerror();
                        return;
                    }

                    // Create variables
                    var data = JSON.parse(x.responseText),
                        offer = {};

                    // Parse the price and image data
                    var priceData = document.implementation.createHTMLDocument("priceData");
                    priceData.documentElement.innerHTML = data.Price;
                    var imageData = document.implementation.createHTMLDocument("imageData");
                    imageData.documentElement.innerHTML = data.Image;

                    // Scrape required data from website
                    offer.id = data.Id;
                    offer.title = data.ShortTitle;
                    offer.image = "http:" + imageData.querySelectorAll('img')[0].getAttribute('data-mobile');
                    offer.price_old = priceData.querySelectorAll('.old-price')[0].innerHTML.replace(/<[^>]*>/g, "");
                    offer.price_new = priceData.querySelectorAll('.price .new-price')[0].innerHTML.replace(/<[^>]*>/g, "");
                    offer.url = data.Permalink;

                    // Keep data about the last website scrape.
                    offer.scrape = {
                        timestamp: new Date().getTime(),
                        url: url
                    };

                    // Load the stock if needed
                    loadStock(callback, offer);

                };

                // Ajax error occured
                x.onerror = function () {

                    // Abort the request to prevent the request from running twice
                    x.abort();

                    // It seems the request was not valid.
                    // Use website scraping as a fallback.
                    var offer = {},
                        url = "https://www.ibood.com/" + country + "/nl/",
                        xf = new XMLHttpRequest();
                    xf.open('GET', url);

                    xf.onload = function () {

                        // Make sure the request was valid!
                        if (xf.status != 200) {
                            xf.onerror();
                            return;
                        }

                        // We have a response, start scraping
                        var dom = document.implementation.createHTMLDocument("scrapeDOM");
                        dom.documentElement.innerHTML = xf.responseText;

                        // Set the data
                        offer.id = dom.querySelectorAll(".dropdown-primary")[0].getAttribute("data-offer-id");
                        offer.title = dom.querySelectorAll("h3")[0].textContent;
                        offer.image = dom.querySelectorAll(".dropdown-primary img")[0].getAttribute("src");
                        offer.price_old = dom.querySelectorAll(".old-price")[0].textContent.replace(/[^\d]/g, "") / 100;
                        offer.price_new = dom.querySelectorAll(".new-price")[0].textContent.replace(/[^\d]/g, "") / 100;
                        offer.url = dom.querySelectorAll(".dropdown-primary a")[0].href;

                        // Make sure the image url is correct
                        if (offer.image.substr(0, 2) == "//") {
                            offer.image = "http:" + offer.image;
                        }

                        // Format the prices
                        offer.price_new = ("€ " + offer.price_new).replace(".", ",");
                        offer.price_old = ("€ " + offer.price_old).replace(".", ",");

                        // Keep data about the last website scrape.
                        offer.scrape = {
                            timestamp: new Date().getTime(),
                            url: offer.url
                        };

                        // Load the stock if needed
                        loadStock(callback, offer);
                    };

                    xf.onerror = function () {

                        // Still no luck!
                        // Execute the error callback
                        if (typeof callback === 'function' && window.ibood.lastProduct.hasOwnProperty('title')) {
                            callback(window.ibood.lastProduct);
                        } else if (typeof errorCallback === 'function') {
                            errorCallback();
                        }

                    };

                    xf.send();
                };

                x.ontimeout = x.onerror;

                // Send the ajaxRequest
                x.timeout = 4e3;
                x.send();

            });

        },


        /**
         *  Get the stock for the latest product
         */
        getLatestProductStock: function (callback) {

            // Create some variables
            var url,
                x = new XMLHttpRequest();

            // Find out what the ibood link is we want to use
            chrome.extension.getBackgroundPage().settings.get('country', function (country) {

                // Build the url
                url = "http://feeds.ibood.com/" + country + "/stock.jsonp?c=s&_=";

                // Add cache bust
                url += (new Date().getTime());

                // Send the request
                x.open('GET', url);

                // Response has been received!
                x.onload = function () {

                    // Find the stockobject
                    var stockobj = x.responseText;
                    stockobj = JSON.parse(stockobj.replace(/^.*?s\((\[.*?\])\);$/, '$1'))[0];

                    // Find the stock for this product
                    var stock = 0;
                    for (var key in stockobj) {

                        // Only check if the key exists
                        if (!stockobj.hasOwnProperty(key)) {
                            continue;
                        }

                        // If the product id matches, update the stock info
                        if (stockobj[key][0] == window.ibood.lastProduct.id) {
                            callback(stockobj[key][1]);
                            break;
                        }

                    }

                    // Send stock info back with the callback
                    if (typeof callback === 'function') {
                        callback(stock);
                    }

                };
                x.ontimeout = x.onerror;

                // Send the ajaxRequest
                x.timeout = 4e3;
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

                    // Set a local backup variable
                    window.ibood.ishunt = isHunt;

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
            chrome.tabs.create({
                active: true,
                url: window.ibood.lastProduct.url
            });

        },


        /**
         *  Try opening the order page directly
         */
        openOrderPage: function () {

            // Load the product page using xhr to find the product id
            var x = new XMLHttpRequest();
            x.open('GET', window.ibood.lastProduct.url);

            // Response has been received!
            x.onload = function () {

                // Parse the response html
                var html = document.implementation.createHTMLDocument("html");
                html.documentElement.innerHTML = x.responseText;

                // Get the product id
                window.ibood.lastProduct.productId = html.getElementById("productId").value;

                // Create a virtual form to submit
                chrome.tabs.create({
                    active: true,
                    url: chrome.extension.getURL('background/redirect-to-order.html')
                });

            };

            // Ajax error occured
            x.onerror = function () {

                // Open the current product page
                window.ibood.openInTab();

            };

            // Send the ajaxRequest
            x.send();

        }

    };

    // How do we communicate the settings object?
    if (typeof window === 'undefined' || window.mocha === true) {
        module.exports = window.ibood;
    }

} ());
