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
     *  Load the Chrome settings before starting
     */
    constructor() {
        this.loadSettings(function () {
            Settings.Instance.settingsLoaded = true;
        });
    }


    /**
     *  Get a settings value by its key
     */
    public get(key: string): any {
        
        if (this.items.hasOwnProperty(key))
            return this.items[key];

        return null;

    }


    /**
     *  Use a single settings instance to work with
     */
    public static get Instance()
    {
        return this._instance || (this._instance = new this());
    }


    /**
     *  Load the settings using the chrome api
     */
    private loadSettings(callBack: Function) : void {
        
        // No need to load the settings twice
        if (this.settingsLoaded)
            callBack();

        // Load the settings using the chrome api
        chrome.storage.sync.get(function (data) {
            Settings.Instance.items = data;
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