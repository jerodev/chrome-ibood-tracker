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
        
    }

    
    /**
     *  Start here!
     */
    document.addEventListener('DOMContentLoaded', function () {
        
        // Load the settings
        loadSettings();
        
    });
    
}());