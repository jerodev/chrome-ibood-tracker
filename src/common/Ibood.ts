import { Offer } from "./Models";
import { Settings } from "./Settings";

export class Ibood {
    private static _instance: Ibood;

    public constructor() {
        // Placeholder, might be removed eventualy
    }


    /**
     *  Use a single settings instance to work with
     */
    public static get Instance()
    {
        return this._instance || (this._instance = new this());
    }


    async updateDeals(callBack: Function = null): Promise<void> {
        
        // Prepare some variables
        var country: string = await Settings.Instance.pull("country");
        var url: string = `https://www.ibood.com/${country}/nl/all-deals/`;
        //var url: string = "https://www.ibood.com/be/nl/all-deals/";
        var request: XMLHttpRequest = new XMLHttpRequest();

        // Prepare the request
        request.open("GET", url);
        request.onload = () => {

            // We have a response, start scraping
            var dom = document.implementation.createHTMLDocument("scrapeDOM");
            dom.documentElement.innerHTML = request.responseText;

            // Scrape the different offers
            var offers: Array<Offer> = new Array<Offer>();
            var domoffers = dom.querySelectorAll(".offer-product-wrap");
            for (var i in domoffers)
            {
                var domoffer = domoffers[i];

                // Create a new Offer object
                var offer = new Offer();
                offer.url = domoffer.querySelectorAll("a:first-of-type")[0].getAttribute("href");
                offer.title = domoffer.querySelectorAll("h5")[0].textContent;
                offer.image_url = domoffer.querySelectorAll(".image img")[0].getAttribute("src").replace("small", "large");
                offer.price_old = +domoffer.querySelectorAll(".old-price .strike span")[0].textContent.replace(/,/, ".").replace(/[^\d\.]/, '');
                offer.price_new = +domoffer.querySelectorAll(".new-price .price")[0].textContent.replace(/,/, ".").replace(/[^\d\.]/, '');

                // Update some special cases
                if (offer.image_url.match(/^\/\//))
                    offer.image_url = "http:" + offer.image_url;

                // Add the offer to the list
                offers.push(offer);
            }

            console.log(offers);



        }

        // Send the request!
        request.send();

    }

}