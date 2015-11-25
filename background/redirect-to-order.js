/* global chrome */

(function () {

    "use strict";

    // Get the current offer data
    chrome.extension.getBackgroundPage().ibood.getLatestProduct(function (data) {

        // Get the users country
        chrome.extension.getBackgroundPage().settings.get('country', function (country) {

            // Build the url
            var url = "https://www.ibood.com/" + country + "/nl/basket/";

            // Add the url to the form
            document.querySelectorAll("form")[0].setAttribute("action", url);

            // Add the offer id
            document.querySelectorAll("form input[name=offerId]")[0].value = data.offerId;

            // TODO: find a way to find the productId

            // Submit the form!
            document.querySelectorAll("form")[0].submit();
        });

    });

} ());