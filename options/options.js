/* globals chrome */

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
            var chk_country = document.querySelectorAll(".list-group.countries")[0];
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
            document.getElementById("checkInterval").value = data / 1e3;


            // Function for saving the interval
            var saveInterval = function (e) {

                // Get the value
                var value = e.currentTarget.value * 1e3;

                // Write the value to the settings
                if (value > 0) {
                    chrome.extension.getBackgroundPage().settings.set('checkInterval', value);
                } else {
                    document.getElementById("checkInterval").value = 1;
                    chrome.extension.getBackgroundPage().settings.set('checkInterval', 1);
                }

                // Display the restart notification
                showRestartNotification();

            };


            // Add an event listener to check for changes in value
            document.getElementById("checkInterval").addEventListener("keyup", saveInterval);
            document.getElementById("checkInterval").addEventListener("change", saveInterval);
        });


        // Same as the above but for the hunt interval
        chrome.extension.getBackgroundPage().settings.get('checkIntervalHunt', function (data) {

            // Fill in the field with the settings data.
            document.getElementById("checkIntervalHunt").value = data / 1e3;


            // Function for saving updated version
            var saveIntervalHunt = function (e) {

                // Get the value
                var value = e.currentTarget.value * 1e3;

                // Write the value to the settings
                if (value > 0) {
                    chrome.extension.getBackgroundPage().settings.set('checkIntervalHunt', value);
                } else {
                    document.getElementById("checkIntervalHunt").value = 1;
                    chrome.extension.getBackgroundPage().settings.set('checkIntervalHunt', 1);
                }

                // Display the restart notification
                showRestartNotification();

            };


            // Add an event listener to check for changes in value
            document.getElementById("checkIntervalHunt").addEventListener("keyup", saveIntervalHunt);
            document.getElementById("checkIntervalHunt").addEventListener("change", saveIntervalHunt);
        });


        // Get the Product alert keywords
        chrome.extension.getBackgroundPage().settings.get('productAlertKeywords', function (data) {

            // If the textbox is not available, don't bother!
            if (document.getElementById('productAlertKeywords') === null) {
                return false;
            }

            // Fill in the field with the settings data.
            if (data && typeof data === "object") {
                document.getElementById('productAlertKeywords').value = data.join(",");
            }

            // Add an event listener to check for changes in value
            document.getElementById("productAlertKeywords").addEventListener("keyup", function (e) {

                // Get the value
                var value = e.currentTarget.value;

                // Make sure a value is present
                if (value.length > 0 && !value.match(/^\s+$/)) {

                    // Split the value into an array
                    value = value.split(/\s*,\s*/);

                } else {

                    // Reset value to an empty array
                    value = [];

                }

                // Write the value to the settings
                chrome.extension.getBackgroundPage().settings.set('productAlertKeywords', value);

            });
        });


        // Set the version number
        if (document.getElementById('versionNumber') !== null && typeof chrome.runtime.getManifest === 'function') {

            // Get the manifest object
            var manifest = chrome.runtime.getManifest();

            // Display the version number
            document.getElementById('versionNumber').innerHTML = "v" + manifest.version;

        }

    }


    /**
     *  Display a message to restart the extension
     */
    function showRestartNotification() {

        // Find the notification and show it
        if (document.getElementById("restartNotification") !== null) {

            // Add the event listener for restarting the application
            document.querySelectorAll("#restartNotification .btn")[0].addEventListener(
                "click",
                function () {

                    // Restart the extension
                    chrome.runtime.reload();

                },
                false
            );

            // Actualy show the element
            document.getElementById("restartNotification").className = "visible";
        }

    }


    /**
     *  Start here!
     */
    document.addEventListener('DOMContentLoaded', function () {

		// Set the height of flex rows
		var rows = document.querySelectorAll('.row-flex');
		for (var i = 0; i < rows.length; i++) {

			// Find the panels in this row
			var panels = rows[i].querySelectorAll('.panel-body');

			// Find the longest panel-body
			var height = 0, j;
			for (j = 0; j < panels.length; j++) {

				var pheight = panels[j].clientHeight;
				if (pheight > height) {
					height = pheight;
				}

			}

			// Set the height for all panels
			for (j = 0; j < panels.length; j++) {
				panels[j].style.height = height + "px";
			}

		}

        // Load the settings
        loadSettings();

    });

} ());