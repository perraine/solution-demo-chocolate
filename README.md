# EVRYTHNG Demo App

## Introduction

This demo app's purpose is to demonstrate key scenarios using the EVRYTHNG API to prove the power of the EVRYTHNG platform across various use cases and solutions.

Demo with Sample content:
[http://tinyurl.com/evt-sol-demos](https://evt-sol-demos-01.netlify.com/?appKey=0JKSNDSBpv0qlYKjai8PBprl5ROuCkBUXJsiqMlZnfDflii6xq0Ww0Y6Fidzwpvr7vjUvV6RWy1BvSdS)


## Setting up your Demo App

To create your own demo you'll need an active EVRYTHNG account.

(In the next version of the app an automated process will do the following steps)

You'll need to create a new Project, and create a single application under this called 'Demo'.

You then create the product you wish your demo to revolve around - in the example this is a bottle of wine.

You then need to create your selection of Thngs that will represent your various scenarios within the app - each Thng has its own unique QR Code, which when scanned will direct you to the correct app screen for that Thng.

As the app is [hosted centrally on Netlify](https://evt-sol-demos-01.netlify.com/?appKey=0JKSNDSBpv0qlYKjai8PBprl5ROuCkBUXJsiqMlZnfDflii6xq0Ww0Y6Fidzwpvr7vjUvV6RWy1BvSdS) - the demo URL requires a `appKey` set in the URL query string to identify the application your wish the demo to access - if you wish to use the EU region for your app you'll need to add a `region=eu` parameter (otherwise the app defaults to the US region). Once you have visited the URL the query is autopopulated when using the app menu, and any scans you do will add the correct `appKey` and Region to the URL for you.

A seeding script is being prepared to get the Thngs and products and action types in place as a starting point for the demo.

Once the admin UI has been created all Thng information will be editable via an external Google Sheet - for now you can edit your Thng directly via the console and once saved, and the app refreshed, your changes will be visible.


## App Architecture / Permissions

The app doesn't rely on any extensive application libraries, only javascript, jQuery, CSS and HTML. The application source has seperated files for the various screens with coresponding .js files.

The application is set up and populated from data on the scanned Thng, the Thng's product and from the data on the application itself.


## States

The app is driven by states - each time the app is loaded the Thng ID and a state are passed into the URL, which in turn govern which screen is displayed in the app, and which Thng is retrieved via the API. 

It's important that when you set up your demo Thngs in the Dashboard that you ensure your redirects point to the App's address and include the Thng ID, `appKey`, and `state` in order for the app to render the screens your require.

An easy way to do this is to set up an [account level Redirector](https://developers.evrythng.com/docs/using-the-dashboard-reactor-and-redirector#section-redirector) to redirect products of the type you are working with in a particular demo and template the Thng ID using `&thng={thng.id}`.

Here is an example:
```
https://evt-sol-demos-02.netlify.com?appKey=IZEqh63LAJliTM2e1BJ4l59xheOIiUjBxbr3N5fCtKDLEGrEDVA2179xM2Ll8EK16fXgH2QRkcCgW4Z2&region=eu&state=offer&thng={thng.id}
```


## User Access

The app works by setting up an anonymous user, and storing this locally in `localStorage` for quick reference during subsequent loading of the application. The location context is also stored at this point.


## `localStorage` and Menu Creation

> As the app uses `localStorage` for a few features in the demo, you can't use incognito or 'private' modes on your browser otherwise the app will fail.

The anonymous user details, location and menu are all stored as `localStorage` items. They are prefixed with a unique `appId` so you can run mulitple demos without any risk of overlapping data or problems.

If you need to clear your `localStorage` at any point this can be done by pressing the three dots in the header, on the right. An alert will appear to inform you the storage has been cleared. A simple reload of the page will repopulate of all `localStorage` items for you.

The menu for the application can be access via the 3 lines in the header of the app on the left-hand side of the page.

The creation of this menu for your demo application takes place on initial loading of your application and is stored in `localStorage` on your demo device browser. The menu is built by looping through all of the Thngs in your app and looking at the following fields/`customFields`:

- `id` - The Thng ID is fixed in the system.
- `state` - The `state` defines what view the app will go to for that Thng.
- `menuLabel` - The `menuLabel` value will be the text you see in the app menu.
- `actionType` - The `actionType` declares which action should be logged in the system when the Thng is scanned, or the menu item selected (the `actionType` must correspond to an action type set up in your account).

You may see a double load on initial loading of the app - this is the menu being generated from the items above, once done it'll be commited to `localStorage`.


## Application Settings

The demo app has the following configurable options, which are set via `customFields` on the application:

- `name` - The name of the app becomes the title in the tilte bar of your browser.
- `bannerBrand` (default: https://i.imgur.com/BzHgU4e.png) - This is the branding for your app, try to use a transparent PNG, the image will be automatically resized to fit appropriately in the header of your demo.
- `bannerColor` (default: `#EA000A`) - This is the colour of the top header and modal/overlay headers thoughout the demo. It will take any hex reference (`#EA000A`), `rgb(r,g,b)`, `hsl(r,g,b)` value, or even HTML colour names, such as `tomato` or `silver`.
- `bannerTextColor` (default: white) - This is the text colour for the nav/three dot icons and titles of modals/overlays, and MUST be a contrasting colour to the bannerColor - you can use the same colour formats as 'bannerColor'.

These values are set on the same screen you'll find your 'API Key', which is set in the URL for your app. Do not use the 'Trusted App Key', as this will not work.


## Scenarios

Currently the app can demonstrate:

- SCANTHNG
- Product Offer (Pre-Purchase)
- Product Offer (Post Purchase)
- Purchased/Owned
- Product Recall
- Product in Grey Market (link to modal for product timeline)
- Product Expired
- Product Registration
- Product Reward (reload the same page to show how scans can contribute towards a reward)
- Product Counterfeit Check
- Product Reorder
- Product Duty Check

The best way to cover how the various screens for these scenarios are configured is to go through each screen in turn and identify how each feature of the screen is controlled:


## Start

The default state of the app if there is no Thng ID, or state defined is the start screen. This has a simple demo of SCANTHNG, allowing a QR code to be scanned directly in the App.

On successful scan the Redirector will work to send the app to the correct screen. If the scan fails a suitable error message is displayed.


## Offer: Redeem Offer

`state: "offer"`

One of the more complex screens in the app, the offer screen is populated substantially via data stored on the Thng.

- Product Image: Taken from the product image within the Dashboard/associated with the Thng
- 'i Button' links to a modal which is populated if a custom field of `provenance01` or `sustainability01` is found (subsequent provenance items can be added by adding a new custom field with the number increasing each time: `provenance02`, `provenance03` etc).
    - For a Provenance item to be rendered correctly you'll need to supply at least two values, seperated by a pipe '|' - the first value becomes the label for the provenance item, and the second the value. An optional third item can be added, which is simply a colour reference, which will add a dot next to the value of this chosen colour. Full Example: `Higgs Index|75|green`
    - Sustainability takes the same pipe seperated values as provenance - only appearing if `sustainability01` is found. There are four values - the first is a icon reference for the left hand side of the accordion (taken from the material design icons site), the next is the title of the accordion panel, the next is the copy/text for the accordion, a final value is 'open', which should only be set on one sustainablity item, to have one accordion item defaulted open. Full example: `mdi-heart|Care Instructions|Look after your stuff`
- If you wish to show a video link from the icon on the right of the product image simply add a `video` custom field to your Thng with the YouTube video id (eg `AZXjwZJqgyM`)
- The title is taken from the Thng `name`
- The description is taken from the Thng `description`
- The star review value is currently fixed
- The reviews are populated if a custom field of `review01` found (subsequent items added in the same manner as provenance: `review02`, `review03` etc).
    - Each review custom field value takes five values, seperated by a pipe '|' - the first value is the rating (1-5), the second is the title of the review, the third is the reviewers name, forth is the date of the review and the final value is the review text itself (the useful values in the app are randomly generated). Full Example: `5|Wonderful plonk!|D Kidger|14 Mar 2016|I loved this product!` 
- The price is take from the Thng `price` custom field.
- The offer button text is taken from the `button` custom field.
- 'Additional Links' component(s) will be added under the offer button if a `link01` custom field is found - this takes two values, seperated by a pipe, the first being the text of the link the second being an icon (optional). Full Example: `Add to Wish List|mdi-heart-outline`.
- A 'Related products' are shown if the `showRecommended` custom field is added to your Thng and set to `true` - you will need to have at least one Thng in your demo Dashboard that has a tag of `"Recommended"` in order to make this work (it will pull the Thng name, a `rating` custom field (1-5), price and use the product image for each of these).

> A `post-purchase` property must be set for the Offer page to load.

When you select the button on the offer page a modal will slide up - the content within this modal is fixed.

On clicking the barcode the offer status is set as redeemed (by setting a `post-purchase` property on the Thng to `true`) - the alert title, text and button that appears to confirm that the offer has been redeemed are fixed.

Selecting the button defaults the app back to the Start state - and returning to the Offer page will show a post-purchase state, which is similar to the Offer page (video link etc taken from the Thng as before), but without the button and with a post-purchase offer.

The offer text is split into two `customFields`: `postPurchaseText` and `postPurchaseOfferBox` - which are displayed in sequence (`postPurchaseOfferBox` being the bold text - ideally a code/call to action)

To return the post-purchase state back to `false` click the light grey 'Return Product' link at the end of the content - an alert will appear to show this has been done.

**Example Thng**

```
{
  "customFields": {
    "actionType": "scans",
    "button": "Take the Offer",
    "link01": "Add to Wish List|mdi-heart-outline",
    "menuLabel": "Offer",
    "postPurchaseOfferBox": "Post Purchase offer box",
    "postPurchaseText": "Some post-purchase text",
    "price": "£9.99",
    "provenance01": "Higgs Index|75|green",
    "review01": "5|Wonderful plonk!|D Kidger|14 Mar 2016|I loved this product!",
    "showRecommended": "true",
    "state": "offer",
    "sustainability01": "mdi-heart|Care Instructions|Look after your stuff",
    "video": "AZXjwZJqgyM"
  },
  "name": "Cube - Offer",
  "description": "Cube in the color of your choice",
  "product": "UFKE9nHBBg8atKaawgVrKKbs",
  "properties": {
    "post-purchase": false
  }
}
```


## Purchases/Owned

`state: "owned"`

This list is populated by looking for Thngs with the tag `"Purchased"` - the image is taken from the product the Thng is linked to, and the `price` and `rating` are `customFields` on each Thng with the tag.

**Example Thng**

```
{
  "customFields": {
    "actionType": "scans",
    "menuLabel": "Owned",
    "price": "£4.99",
    "rating": "4",
    "state": "owned"
  },
  "tags": [
    "Purchased"
  ],
  "name": "Cube - Purchased",
  "description": "A purchased Cube",
  "product": "UFKE9nHBBg8atKaawgVrKKbs"
}
```


## Recall

`state: "recall"`

The image is taken from the Thng's `product`. The title from the Thng `name`, text from the Thng `description` and the button text from a custom field of `button`.

**Example Thng**

```
{
  "customFields": {
    "button": "Recall Me",
    "menuLabel": "Recall",
    "state": "recall"
  },
  "name": "Cube - Recall",
  "description": "A Cube with a problem",
  "product": "UFKE9nHBBg8atKaawgVrKKbs"
}
```


## Grey

`state: "grey"`

The image is taken from the Thng's `product`. The title from the Thng `name` and the button text from a custom field of `button`. The `destination` and `scanned` custom fields on this Thng show the relevant country initials in the summary.

The timeline is populated if a custom field of `timeline01` is found on the Thng (subsequent timeline items can be added by adding a new custom field with the number increasing each time: `timeline02`, `timeline03` etc).

The timeline custom field value takes four values, seperated by a pipe '|' - the first value is the date, the second the title, the third the location and the optional fourth is the material design icon reference. Full Example: `14 Mar 2016|Case sent to Retailer|Le Harve|mdi-cube-send`

The first item on the timeline is always the most recent scan, set to the location you are demoing from.

**Example Thng**

```
{
  "customFields": {
    "actionType": "_greyscan",
    "button": "Grey Market Action",
    "destination": "UK",
    "menuLabel": "Grey",
    "scanned": "RU",
    "state": "grey",
    "timeline01": "14 Mar 2016|Case sent to Retailer|Le Harve|mdi-cube-send"
  },
  "name": "Cube - Grey",
  "description": "A grey market Cube",
  "product": "UFKE9nHBBg8atKaawgVrKKbs"
}
```


## Expired

`state: "expired"`

The image is taken from the Thng's `product`. The title from the Thng `name`, text from the Thng `description` and the button text from a custom field of `button`.

**Example Thng**

```
{
  "customFields": {
    "actionType": "_expired",
    "button": "Complete Expiry",
    "menuLabel": "Expired",
    "state": "expired"
  },
  "name": "Cube - Expired",
  "description": "A Cube that has expired and gone to meet its maker.",
  "product": "UFKE9nHBBg8atKaawgVrKKbs"
}
```


## Registration

`state: "registration"`

The image is taken from the Thng's `product`. The title from the Thng `name`, text from the Thng `description` and the button text from a custom field of `button`.

The form items are populated if a custom field of `form01` is found on the Thng. The form custom field value takes two values, seperated by a pipe '|' - the first value is the input label, the optional second value is any prefilled data you may wish to add to the form. Full Example: `Email|a.n.other@example.com`. The button text can be set with the value of a `button` custom field.

You can also choose to add a field with today's date dynamically at the end of the form by setting the custom field `showAutomaticPurchaseDate` to `true`.

**Example Thng**

```
{
  "customFields": {
    "actionType": "_registration",
    "form01": "Name|John Smith",
    "form02": "Email|my.example@email.com",
    "form03": "Password|Secrets",
    "menuLabel": "Registration",
    "showAutomaticPurchaseDate": "true",
    "state": "registration",
    "button": "Register Product"
  },
  "name": "Cube - Registration",
  "description": "Register your new Cube for additional Cube-related benefits",
  "product": "UFKE9nHBBg8atKaawgVrKKbs"
}
```


## Reward

`state: "reward"`

The image is taken from the Thng's `product`. The title from the Thng `name`, text from the Thng `description` and the button text from a custom field of `button`.

The page loads initially showing one more scan is required for the offer to be claimable... if you reload the page/scan the same Thng again the page will show the offer as redeemable.

It's a bit fake but will work as long as you're aware that this page simply switches back and forth between these states!

The previous reward items are populated if a custom field of 'previousReward01' is found on the Thng. The previousReward custom field value takes two values, seperated by a pipe '|' - the first is the title of the reward, the second is the date the offer was redeemed. Full Example: `Shared an Offer|Claimed 23 Dec 2016`

The new reward is set by two `customFields`: `newRewardTitle` and `newRewardRedeemDate`.

**Example Thng**

```
{
  "customFields": {
    "actionType": "_reward",
    "button": "Claim this Reward",
    "menuLabel": "Reward",
    "newRewardRedeemDate": "13/3/17",
    "newRewardTitle": "New Reward",
    "previousReward01": "Shared an Offer|Claimed 23 Dec 2016",
    "state": "reward"
  },
  "name": "Cube - Reward",
  "description": "Be rewarded for buying this Cube",
  "product": "UFKE9nHBBg8atKaawgVrKKbs"
}
```


## Counterfeit Check

`state: "counterfeitcheck"`

The image is taken from the Thng's `product`. The title from the Thng `name`, text from the Thng `description` and (if `counterfeit` is set to `true`) the button text from a custom field of `button`.

The counterfeit state is set by a `counterfeit` `true`/`false` custom field - if `true` then the user is shown that the product is counterfeit and given the option to enter more details about the product via a button. If `false` then the product is shown as genuine and a timeline (see 'Grey' above for how timeline elements are added) - two Thngs are created by default to show the true and false behaviour of this scenario.

**Example Thng**

```
{
  "customFields": {
    "actionType": "_counterfeit",
    "button": "Report",
    "counterfeit": "true",
    "menuLabel": "Counterfeit",
    "state": "counterfeitcheck"
  },
  "name": "Cube - Counterfeit",
  "description": "A Cube with suspiciously rounded edges",
  "product": "UFKE9nHBBg8atKaawgVrKKbs"
}
```


## Reorder

`state="reorder"`

The image is taken from the Thng's `product`. The title from the Thng `name`, text from the Thng `description` and the button text from a custom field of `button`.

This page uses the same template as offer, on clicking the button a modal is displayed with a list of retailers where the product can be ordered. The previous reorder items are populated when a custom field of `reorder01` is found on the Thng (more can be added `reorder02`, `reorder03` etc). 

The reorder custom field value takes five values, seperated by a pipe '|' - the first is the title of the reorder location, the second is the price, the third is the logo of the company the reorder is from, the fourth is a string of text (description if required) and the final optional value is a link to an external site if required (use '#' if you don't want a link). Full Example: `Waitrose|£9.99|https://img.jpg|Reassuringly expensive!|#`

**Example Thng**

```
{
  "customFields": {
    "actionType": "_reorder",
    "button": "Reorder This Product",
    "menuLabel": "Reorder",
    "price": "£9.99",
    "reorder01": "Waitrose|£9.99|https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Waitrose_Logo.svg/2000px-Waitrose_Logo.svg.png|Reassuringly expensive!|#",
    "state": "reorder"
  },
  "name": "Cube - Reorder",
  "product": "UFKE9nHBBg8atKaawgVrKKbs"
}
```


## Duty Check

`state="dutycheck"`

The image is taken from the Thng's `product`. The title from the Thng `name`, text from the Thng `description` and the button text from a custom field of `button`. 

This works in a similar fashion to the Counterfeit Check, looking for a `dutypaid` custom field of true/false - if `true`, then the product image has a check if `false` then a cross is shown on the product image.

**Example Thng**

```
{
  "customFields": {
    "actionType": "_dutypaid",
    "dutypaid": "true",
    "menuLabel": "Duty Paid",
    "state": "dutycheck"
  },
  "name": "Cube - Duty Paid",
  "description": "A Cube that has paid its dues",
  "product": "UFKE9nHBBg8atKaawgVrKKbs"
}
```


## Recycle

`"state": "recycling"`

The image is taken from the Thng's `product`. The title from the Thng `name`, text from the Thng `description` and the button text from a custom field of `button`. You can set the link that the button will take the user to by setting a URL in the `buttonLink` custom field.

This state works in a similar way to the Offer state, including the 'i' button overlay with provenance and sustainability information.

**Example Thng**

```
{
  "customFields": {
    "actionType": "scans",
    "button": "Click for recycling instructions",
    "buttonLink": "https://my-recycling-company.com/locale-search",
    "menuLabel": "Recycling",
    "provenance01": "Fabrix Ltd|100% Cotton",
    "state": "recycling",
    "sustainability01": "mdi-heart|Care Instructions|Look after this Cube!|closed"
  },
  "name": "Cube - Recycling",
  "description": "A Cube that can be made into other Cubes, potentially.",
  "product": "UFKE9nHBBg8atKaawgVrKKbs"
}
```
