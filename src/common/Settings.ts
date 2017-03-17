/// <reference path="../dts/chrome.d.ts"/>

export class Settings {
    private static _instance: Settings;
    private items: { [index: string]: any } = {
        "checkInterval": 3e5,
        "checkIntervalHunt": 8e3,
        "country": "be",
        "displayStock": false,
        "enableNotifications": true,
        "productAlertDirectOrder": false
    };
    private settingsLoaded: boolean = false;


    /**
     *  Get a settings value by its key
     */
    async pull(key: string, callBack: Function = null): Promise<any> {
        return new Promise<any>(resolve => {
            
            this.loadSettings(() => {

                // Load the data
                var data: any = null;
                if (Settings.Instance.items.hasOwnProperty(key))
                    data = this.items[key];

                // Send the data back
                resolve(data);

                // If you realy want a callback, we can do that too
                if (callBack != null)
                    callBack(data);

            });

        });
    }


    /**
     *  Use a single settings instance to work with
     */
    public static get Instance() {
        return this._instance || (this._instance = new this());
    }


    /**
     *  Load the settings using the chrome api
     */
    private loadSettings(callBack: Function): void {

        // No need to load the settings twice
        if (this.settingsLoaded)
            callBack();

        // Load the settings using the chrome api
        chrome.storage.sync.get(function (data) {
            
            // Merge items with default items
            for (var key in data)
                Settings.Instance.items[key] = data[key];

            // Settings are loaded, go back
            Settings.Instance.settingsLoaded = true;
            callBack();

        });

    }


    /**
     *  Create or update a key in the settings storage
     */
    public put(key: string, value: any): void {
        
        // Update the local value
        this.items[key] = value;

        // Update the Chrome storage
        chrome.storage.sync.set(this.items);

    }

}