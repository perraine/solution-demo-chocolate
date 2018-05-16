#!/bin/bash

curl -X POST -H "Content-Type: application/json" -H "Accept: application/json" -H "Authorization: OHxl04ivIxoolIT1pUbclsTYieIlv9UyD9t9382Cs5FDxM6ijqphp7eMsCKqlZdkaGlQxUDNEV27ccN9" -H "Cache-Control: no-cache" -d '{
"type" : "_CounterfeitScanningTwoFactorCheck",
"customFields" : {
	"userInput" : "When I scanned the code I expected a red shirt",
	"color" : "blue"
},
"tags" : ["Consumer Scan"]
}

	' "https://api-eu.evrythng.com/thngs/Uk8dncGaeMPN9NRwahcyKc3r/actions/_CounterfeitScanningTwoFactorCheck?project=UF8ACDypVg8aQ5waakBDWBqp"
