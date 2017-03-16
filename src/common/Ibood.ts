import { Settings } from "./Settings";

class Ibood {

    public constructor() {
        // Placeholder, might be removed eventualy
    }


    public updateDeals(callBack: Function = null): void {
        
        // Prepare some variables
        var url: string = `https://www.ibood.com/${Settings.Instance.get("country")}/nl/all-deals/`;
        var request: XMLHttpRequest = new XMLHttpRequest();

        // Prepare the request
        request.open("GET", url);
        request.onload = function () {

            var response: string = request.responseText;
            console.log(response);

        }

        // Send the request!
        request.send();

    }

}