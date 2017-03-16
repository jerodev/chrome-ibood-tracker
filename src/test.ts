/* global GLOBAL */

import { Ibood } from "./common/Ibood";
import { Settings } from "./common/Settings";

// Emulate chrome api
declare var global: any;
declare var require: any;
global.chrome = {
    storage: {
        sync: {
            get: (callback) => {
                callback({
                    country: "be"
                });
            }
        }
    }
};
global.XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
global.document = (new (require('mock-browser').mocks.MockBrowser)()).getDocument();

Ibood.Instance.updateDeals(() => {
    console.log("Done!");
});