/* global chrome */

(function () {

    "use strict";

    // Wait for the dom to load
    document.addEventListener("DOMContentLoaded", function() {

        // Get the users country
        chrome.extension.getBackgroundPage().settings.get('country', function (country) {

            // Build the url
            var url = "https://www.ibood.com/" + country + "/nl/basket/";

            // Add the url to the form
            document.querySelectorAll("form")[0].setAttribute("action", url);

            // Add the offer id
            document.querySelectorAll("form input[name=offerId]")[0].value =
                chrome.extension.getBackgroundPage().ibood.lastProduct.id;

            // Add the product id
            document.querySelectorAll("form input[name=productId]")[0].value =
                chrome.extension.getBackgroundPage().ibood.lastProduct.productId;

            // Submit the form!
            document.querySelectorAll("form")[0].submit();

        });

    });

} ());