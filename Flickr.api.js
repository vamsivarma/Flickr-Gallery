(function(document, window) {
	'use strict';

	var apiURL = 'https://api.flickr.com/services/rest/';
	
	var flickrAPIMeta = {
			"api_key" : '', //Your flickr API key
			"format" : 'json',
			"nojsoncallback" : 1,
			"page" : 1,
			"user_id" : '' //Your flikr user id		
		};

	function getMyGalleries(callbacks) {
		var requestParameters = Utility.extend(flickrAPIMeta, {
			"method" : 'flickr.galleries.getList'
		});
		
		invokeFlickrService(requestParameters, callbacks);
	}

	function getGalleryPhotos(selectedGalleryId, callbacks) {
		var requestParameters = Utility.extend(flickrAPIMeta, {
			"method" : 'flickr.galleries.getPhotos',
			"gallery_id" : selectedGalleryId
		});
		
		invokeFlickrService(requestParameters, callbacks);
	}
	
	function invokeFlickrService(parameters, callbacks) {

		$.ajax({
			url : Utility.buildUrl(apiURL, parameters),
			error : function() {
				callbacks.errorCallback();
			},
    		jsonp: false,
			success : function(data) {
				callbacks.successCallback(data);
			},
			type : 'GET'
		}); 
	}

	window.FlickrAPI = Utility.extend(window.FlickrAPI || {}, {
		getMyGalleries : getMyGalleries,
		getGalleryPhotos : getGalleryPhotos
	});

})(document, window); 