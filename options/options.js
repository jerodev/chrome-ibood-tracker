(function () {
    "use strict";
    
    
    /**
     *  Load the current settings
     */
    function loadSettings() {
        
        // Select the chosen country
        chrome.extension.getBackgroundPage().settings.get('country', function (data) {
            
            // Add a class to the correct country flag
            var item = document.querySelectorAll("input[value=" + data + "]")[0];
            item.parentElement.className = "list-group-item active";
            item.checked = true;
            
            // When changing the country, save the settings
            var i = 0,
                chk_country = document.querySelectorAll(".list-group.countries")[0];
            chk_country.addEventListener(
                'click',
                function () {
                    // Find the selected item
                    var chk = document.querySelectorAll(".list-group.countries input[name=country]:checked")[0];
                    
                    // Keep this setting
                    chrome.extension.getBackgroundPage().settings.set('country', chk.value);

                    // De-activate the previous node
                    document.querySelectorAll(".countries .list-group-item.active")[0].className = "list-group-item";

                    // Activate this node
                    chk.parentElement.className = "list-group-item active";
                }
            );
            
        });
        
        // Get the time interval to check for updates
        chrome.extension.getBackgroundPage().settings.get('checkInterval', function (data) {
        
            // Fill in the field with the settings data.
            document.getElementById("checkInterval").value = data / 1000;
            
            // Add an event listener to check for changes in value
            document.getElementById("checkInterval").addEventListener("change", function () {
                
                // Get the value
                var value = this.value * 1000;
                
                // Write the value to the settings
                if (value > 0) {
                    chrome.extension.getBackgroundPage().settings.set('checkInterval', value);
                } else {
                    document.getElementById("checkInterval").value = 1;
                    chrome.extension.getBackgroundPage().settings.set('checkInterval', 1);
                }
                
            });
        });
        
        
        // Same as the above but for the hunt interval
        chrome.extension.getBackgroundPage().settings.get('checkIntervalHunt', function (data) {
        
            // Fill in the field with the settings data.
            document.getElementById("checkIntervalHunt").value = data / 1000;
            
            // Add an event listener to check for changes in value
            document.getElementById("checkIntervalHunt").addEventListener("change", function () {
                
                // Get the value
                var value = this.value * 1000;
                
                // Write the value to the settings
                if (value > 0) {
                    chrome.extension.getBackgroundPage().settings.set('checkIntervalHunt', value);
                } else {
                    document.getElementById("checkIntervalHunt").value = 1;
                    chrome.extension.getBackgroundPage().settings.set('checkIntervalHunt', 1);
                }
                
            });
        });
        
        
        // Get the Product alert keywords
        chrome.extension.getBackgroundPage().settings.get('productAlertKeywords', function (data) {
        
            // Fill in the field with the settings data.
            if (data && typeof data === "object") {
                document.getElementById("productAlertKeywords").value = data.join(",");
            }
            
            // Add an event listener to check for changes in value
            document.getElementById("productAlertKeywords").addEventListener("change", function () {
                
                // Get the value
                var value = this.value;
                
                // Split the value into an array
                value = value.split(",");
                
                // Write the value to the settings
                chrome.extension.getBackgroundPage().settings.set('productAlertKeywords', value);
                
            });
        });
        
    }

    
    /**
     *  Start here!
     */
    document.addEventListener('DOMContentLoaded', function () {
        
        // Load the settings
        loadSettings();
        
    });
    
}());