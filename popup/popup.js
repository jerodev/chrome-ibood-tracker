(function () {
    "use strict";
    
    
    /**
     *  There was an ajax error when requesting new products, display this to the user
     */
    function setError(message) {
        
        // Set a default message
        if (message === undefined) {
            message = "De iBOOD site is tijdelijk niet beschikbaar.<br />U krijgt een notificatie wanneer dit terug lukt.";
        }
        
        // Find the error element
        var error_el = document.querySelectorAll("#content .error")[0];
        
        // Add a message
        error_el.text = message;
    }
    
    
    /**
     *  Update the content of the popup
     */
    function updatePopup(data) {
        
        var doUpdate = function (data) {
            // Remove any existing error
            document.querySelectorAll("#content .error")[0].innerHTML = "";
            
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
            chrome.extension.getBackgroundPage().ibood.getLatestProduct(doUpdate, setError);
        }
        
    }

    
    /**
     *  Start here!
     */
    document.addEventListener('DOMContentLoaded', function () {
        
        // Load the latest data
        updatePopup();
        
        // Find out if the ibood website takes long to respond
        setTimeout(function () {
            
            // Has the title been set?
            if (document.querySelectorAll("#content h1")[0].innerHTML.length === 0) {
                
                // Display an error message
                setError("De iBOOD site doet er lang over om te antwoorden...");
            }
            
        }, 5e3);
        
    });
    
}());