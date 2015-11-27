/* global chrome */

(function () {

    "use strict";

    window.computer = {

        intervalCheckLocked: null,
        isLocked: false,

        /**
         *  Start an interval check to see if the computer is locked.
         */
        startLockedCheckInterval: function (intervalTime) {

            // Default interval time is 90 seconds
            intervalTime = intervalTime || 90;

            // Start the checking and updated the islocked status
            window.computer.intervalCheckLocked = setInterval(function () {

                chrome.idle.queryState(15, function (state) {
                    window.computer.isLocked = state === "locked";
                });

            }, intervalTime * 1000);

        }

    };


    // Start the checking!
    window.computer.startLockedCheckInterval();

} ());