var dummyText = "Lorem ipsum dolor sit amet, vestibulum penatibus fermentum metus. Proin nibh magna. Ante purus purus quam mauris, varius rutrum mattis urna sed lacus luctus, integer orci sodales, urna eros tellus est. Laoreet non et ut eget ornare eget, fermentum molestie, wisi ipsum, netus eros eu vestibulum sed aliquet imperdiet, erat quisque sit ultrices. Nec dolor diam cubilia";

var galleryTemplate = '<div class="flickrGalleryItem galleryItem{{gallery-id}}" rel="{{gallery-id}}" title="{{description}}">';
	galleryTemplate += '<div class="menuIcon"></div>';
	galleryTemplate += '<div class="menuText">{{name}}</div>';
	galleryTemplate += '<div class="menuOptions"></div>';
	galleryTemplate += '</div>'; 

var galleryPhotoTile = '<div class="galleryPhotoTileHolder left-float-cls" rel="{{photo-id}}">';
	galleryPhotoTile += '<img src="{{photo-src}}" />';
	galleryPhotoTile += '</div>';
	
var galleryPhotoDetailViewTemplate = '<div class="col-md-8 gallaryLargePhotoHolder">';
	galleryPhotoDetailViewTemplate += '<img class="full-content-cls white-background-common" src="{{photo-src}}"  /></div>';
	galleryPhotoDetailViewTemplate += '<div class="col-md-4 gallaryPhotoDetailHolder">';
	galleryPhotoDetailViewTemplate += '<div class= "cold-md-12"> <div class="backToGallery right-float-cls">&nbsp; &lt; &nbsp; </div></div>';
	galleryPhotoDetailViewTemplate += '<div class= "cold-md-12 clear-both-cls"><div class="galleryPhotoDescription">' + dummyText + '</div></div>';
	galleryPhotoDetailViewTemplate += '</div>';
	
var galleryContentStatusMessage = '<div class="status-msg-cls bold-class">{{message}}</div>';	


var $flickerHolderElem = ''; 
var selectedGalleryId = '';
var galleryPhotosModelAssoc = {};
							
$(document).ready(function(){
	
	$flickerHolderElem = $('#flickrContent');
	
	getMyFlickrGalleries();
	
	handlePageFluidity();
	
	$(window).resize(function() {
		handlePageFluidity();
	});
});

function getMyFlickrGalleries() {
	$flickerHolderElem.find('.flickrSideMenu')
		.empty().html('<img class="loaderCommonCls" src="loading-animated-image.gif" />');
	FlickrAPI.getMyGalleries({
		"successCallback": renderFlickrGalleries,
		"errorCallback": noGalleriesFound
	});
};

function noGalleriesFound() {
	alert('No Galleries Found');
}

function renderFlickrGalleries(data) {
	var myGalleries = data.galleries.gallery;
	var totalGalleries = myGalleries.length;
	
	if(totalGalleries) {
		
		//Selecting first gallery by default
		selectedGalleryId = myGalleries[0]['id'];
		
		//Erase any previous content
		var $galleryMenuHolderElem = $flickerHolderElem.find('#flickrSideMenu').empty();
		
		for (var i = 0; i < totalGalleries; i++) {
			var curGallery = myGalleries[i];
			
			var galleryObj = {
				'gallery-id': curGallery['id'],
				'name': curGallery['title']['_content'],
				'gallery-url': curGallery['url'],
				'description': curGallery['description']['_content']
			};
			
			$galleryMenuHolderElem.append(Mustache.render(galleryTemplate, galleryObj));
		}
		
		$galleryMenuHolderElem.find('.galleryItem' + selectedGalleryId).addClass('activeGallery');
		$flickerHolderElem.find('.flickrGalleryTitle').html(myGalleries[0]['title']['_content']);
		
		registerFlickrGalleryEvents();
		
		//Getting first gallery photos on page load
		getSelectedGalleryContent();	
	} else {
		//Show no galleries found message here....
	}
	
} 

function registerFlickrGalleryEvents() {
	var $menuItemCommon = $flickerHolderElem.find('.flickrGalleryItem');
	$menuItemCommon.off('click').on('click', function() {
		var curMenuId = $(this).attr('rel');
		
		if(selectedGalleryId !== curMenuId) {
			selectedGalleryId = curMenuId;
			$menuItemCommon.removeClass('activeGallery');
			$(this).addClass('activeGallery');
			
			$flickerHolderElem.find('.flickrGalleryTitle').html($(this).html());
			
			$flickerHolderElem.find('.flickrPhotoDetailedView').hide();
			
			getSelectedGalleryContent();
		}
	});
};

function getSelectedGalleryContent() {
	$flickerHolderElem.find('.flickrGalleryPhotosHolder')
		.empty().html('<img class="loaderCommonCls" src="loading-animated-image.gif" />');
	FlickrAPI.getGalleryPhotos(selectedGalleryId, {
		"successCallback": renderGalleryPhotos,
		"errorCallback": noGalleryPhotosFound
	});	
};

function noGalleryPhotosFound() {
	
};

function renderGalleryPhotos(data) {
	
	console.log('Gallery photos are successfully fetched');
	var galleryPhotosModel = data.photos.photo;
	
	galleryPhotosModelAssoc = {};
	
	//Erase any previous content
	var $galleryPhotosHolderElem = $flickerHolderElem.find('.flickrGalleryPhotosHolder').empty();
	if(galleryPhotosModel instanceof Array) {
		var galleryPhotosLen = galleryPhotosModel.length;
		for (var i = 0; i < galleryPhotosLen; i++) {
			var curGalleryPhoto = galleryPhotosModel[i];
			var curPhotoObj = {
				'photo-id': curGalleryPhoto['id'],
				'photo-src': Flickr.buildThumbnailUrl(curGalleryPhoto)
			};
			
			galleryPhotosModelAssoc[curGalleryPhoto['id']] = curGalleryPhoto;
			
			$galleryPhotosHolderElem.append(Mustache.render(galleryPhotoTile, curPhotoObj));
		}
		
		//Register details toggle and tile click events
		registerGalleryPhotoEvents();
	} else {
		$galleryPhotosHolderElem.html(Mustache.render(galleryContentStatusMessage, {'message': 'No Data Sources found'}));
	}
};

function registerGalleryPhotoEvents() {
	var $galleryPhotoTileHolderElem = $flickerHolderElem.find('.galleryPhotoTileHolder');
	
	$galleryPhotoTileHolderElem.off('click').on('click', function() {
		
		var selectedPhotoId = $(this).attr('rel');
		
		var selectedPhotoModel = galleryPhotosModelAssoc[selectedPhotoId];
		
		var photoDetailModel = {
				'photo-id': selectedPhotoId,
				'photo-src': Flickr.buildPhotoLargeUrl(selectedPhotoModel)	
			};
		
		$flickerHolderElem.find('.flickrPhotoDetailedView').empty().show()
					.html(Mustache.render(galleryPhotoDetailViewTemplate, photoDetailModel));
		
		registerBackToGalleryEvent();
		
	});
};

function registerBackToGalleryEvent() {
	
	$flickerHolderElem.find('.flickrPhotoDetailedView .backToGallery').off('click').on('click', function() {
		$(this).closest('.flickrPhotoDetailedView').hide();		
	});	
}

function galleryPhotosFetchFailed(data) {
	console.log('Data Sources fetch  failed');
};

function handlePageFluidity() {
	var documentObj = $(document);
	
	//64 + 40 + (10+15)*2 + 20
	var availableH = documentObj.height() - 174;
	//30 + 60 + flickrSideMenuHolder.width()
	var menuHolderElem = $flickerHolderElem.find("#flickrSideMenuHolder");
	var menuW =  (menuHolderElem.width()) ? menuHolderElem.width() : 230;
	var availableW = documentObj.width() - menuW - 90;
	
	var dimentionObj = {
			'width': availableW,
			'height': availableH
		};
	
	//Set the photo content and detailed photo content holder height and width
	$flickerHolderElem.find('#flickrContentWrapper').css(dimentionObj);
	
	dimentionObj['height'] = dimentionObj['height'] + 40;
	$flickerHolderElem.find('.flickrPhotoDetailedView').css(dimentionObj);
	
	dimentionObj['height'] = dimentionObj['height'] - 50;
	$flickerHolderElem.find('.flickrSideMenuHolder').height(dimentionObj['height']);  
};





