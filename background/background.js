(function () {
    "use strict";
    
    
    /**
     *  Check if a new product has been introduced
     */
    function doUpdateCheck() {
        window.ibood.getLatestProduct(function (data) {

            // Is there a new product?
            if (data.title !== window.ibood.lastProduct.title) {
                
                // Set the new data as current product
                window.ibood.lastProduct = data;

                // Display a message with the newest product
                sendNotification(data.title, data.price_new, data.image);
            }

        });
    }
    
    
    /**
     *  Send a notification to the user
     */
    function sendNotification(title, message, image) {
        
        // Create a callback to show the notification
        var showNotification = function (title, message, imageblob) {
        
            // Create the options object
            var options = {};
            options.type = imageblob === undefined ? 'basic' : 'image';
            options.title = title;
            options.message = message;
            options.iconUrl = "../images/icon-128.png";

            // Add an image if we use images
            if (options.type === 'image') {
                options.imageUrl = imageblob;
            }
            
            // Display the notification
            chrome.notifications.create(options);
        };
        
        // If there is an image, we should load it using xhr.
        if (image !== undefined) {
            
            var xhr = new XMLHttpRequest();
            xhr.open('GET', image, true);
            xhr.responseType = 'blob';
            xhr.onload = function (e) {
                var imageblob = window.URL.createObjectURL(this.response);
                
                showNotification(title, message, imageblob);
            };
            xhr.send();
            
        } else {
            showNotification(title, message);
        }
    }
    
    // Set an event listener for notifications
    chrome.notifications.onClicked.addListener(window.ibood.openInTab);
    
    // Scrape ibood for the first time
    doUpdateCheck();
    
    // Check ibood to find out if a hunt is going on.
    window.ibood.isHunt(function(isHunt){
    
        // Get the correct time interval
        window.settings.get('checkInterval' + (isHunt ? 'Hunt' : ''), function(interval){
        
            // Start the update checker on the correct interval
            setInterval(doUpdateCheck, interval);
            
        });
        
    });
    
    
}());