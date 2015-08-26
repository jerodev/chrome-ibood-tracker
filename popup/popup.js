(function () {
    "use strict";
    
    /**
     *  Update the content of the popup
     */
    function updatePopup(data) {
        
        var doUpdate = function (data) {
            // Set the values in the popup
            document.querySelectorAll("#content h1")[0].innerHTML = data.title;
            document.querySelectorAll("#content img")[0].src = data.image;
            document.querySelectorAll("#content .price-old")[0].innerHTML = data.price_old;
            document.querySelectorAll("#content .price-new")[0].innerHTML = data.price_new;
            
            // Reset click event on pop-up
            document.querySelectorAll("#content a")[0].removeEventListener(
                'click', 
                chrome.extension.getBackgroundPage().ibood.openInTab,
                false
            );
            document.querySelectorAll("#content a")[0].addEventListener(
                'click', 
                chrome.extension.getBackgroundPage().ibood.openInTab, 
                false
            );
        };
        
        // If we don't have data, get the latest, otherwise, just update it with the given data
        if (data !== undefined) {
            doUpdate(data);
        } else {
            chrome.extension.getBackgroundPage().ibood.getLatestProduct(doUpdate);
        }
        
    }

    
    /**
     *  Start here!
     */
    document.addEventListener('DOMContentLoaded', function () {
        
        // Load the latest data
        updatePopup();
        
    });
    
}());