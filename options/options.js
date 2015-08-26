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
                chrome.extension.getBackgroundPage().settings.set('checkInterval', value);
                
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
                chrome.extension.getBackgroundPage().settings.set('checkIntervalHunt', value);
                
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