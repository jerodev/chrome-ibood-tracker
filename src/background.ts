import { Ibood } from "./common/Ibood";
import { Settings } from "./common/Settings";

// Check for updates on the ibood website
var checkForUpdates: Function = async function () {



};

// Start a new timeout to update ibood products
var startTimeout: Function = async function () {
    
    // Find the correct update timeout for this situation
    var isHunt: boolean = await Ibood.Instance.isHunt();
    var timeout: number
    if (isHunt)
        timeout = await Settings.Instance.pull("checkIntervalHunt");
    else
        timeout = await Settings.Instance.pull("checkInterval");

    // Start the timeout
    setTimeout(async function () {

        // Update products and notifications
        await checkForUpdates();

        // Start a new timeout
        startTimeout();

    }, timeout);

};



// Start some scripts
(function () {

    checkForUpdates();
    startTimeout();

} ());