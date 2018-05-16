function locationContextText(locationCity, locationRegion) {

	if(locationCity || locationRegion) {

	    if(locationCity) {
	        $('.locationCTA .contextTown').html('' + locationCity + ',');
	    }

	    if(locationRegion) {
	        $('.locationCTA .contextRegion').html(locationRegion);
	    }

	}

}