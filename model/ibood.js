(function () {

    "use strict";
    
    window.ibood = {
        lastProduct: {},

        /**
         *  Get the information of the current product on iBOOD
         */
        getLatestProduct: function (callback) {

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

                    // Send the data back to the caller
                    if (typeof callback === 'function') {
                        callback(data);
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
         *  Is there currently a hunt going on?
         */
        isHunt: function () {
            return window.ibood.lastProduct.isHunt;
        },


        /**
         *  Open the current product in a new tab in the browser
         */
        openInTab: function () {
            chrome.tabs.create({
                active: true,
                url: window.ibood.lastProduct.url
            });
        }

    };
    
}());