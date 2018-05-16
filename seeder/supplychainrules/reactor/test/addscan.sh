#!/bin/bash

curl -X POST -H "Content-Type: application/json" -H "Accept: application/json" -H "Authorization: OHxl04ivIxoolIT1pUbclsTYieIlv9UyD9t9382Cs5FDxM6ijqphp7eMsCKqlZdkaGlQxUDNEV27ccN9" -H "Cache-Control: no-cache" -H "Postman-Token: 77e46bc3-d22b-19d0-0b44-c457498564c3" -d '{
"type" : "scans",
"customFields" : {
	"userInput" : "When I scanned the code I expected a shirt but got sneakers"
},
"tags" : ["Test Counterfeit"]
}

	' "https://api-eu.evrythng.com/thngs/UFsdCgrMBD8w9KwRaXEfenVc/actions/scans?project=UF8ACDypVg8aQ5waakBDWBqp"
