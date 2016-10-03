(function(document, window) {
   'use strict';

   function buildUrl(url, parameters) {
      var queryString = '';

      for(var key in parameters) {
         if (parameters.hasOwnProperty(key)) {
            queryString += encodeURIComponent(key) + '=' + encodeURIComponent(parameters[key]) + '&';
         }
      }

      if (queryString.lastIndexOf('&') === queryString.length - 1){
         queryString = queryString.substring(0, queryString.length - 1);
      }

      return url + '?' + queryString;
   }

   function extend(object) {
      for(var i = 1; i < arguments.length; i++) {
          for(var key in arguments[i]) {
             if (arguments[i].hasOwnProperty(key)) {
                object[key] = arguments[i][key];
             }
          }
      }

      return object;
   }

   function buildThumbnailUrl(photo) {
      return 'https://farm' + photo.farm + '.staticflickr.com/' + photo.server +
      '/' + photo.id + '_' + photo.secret + '_q.jpg';
   }

   function buildPhotoUrl(photo) {
      return 'https://farm' + photo.farm + '.staticflickr.com/' + photo.server +
             '/' + photo.id + '_' + photo.secret + '.jpg';
   }

   function buildPhotoLargeUrl(photo) {
      return 'https://farm' + photo.farm + '.staticflickr.com/' + photo.server +
      '/' + photo.id + '_' + photo.secret + '_b.jpg';
   }
   
   window.Utility = {
      buildUrl: buildUrl,
      extend: extend
   };
   
   window.Flickr = Utility.extend(window.Flickr || {}, {
      buildThumbnailUrl: buildThumbnailUrl,
      buildPhotoUrl: buildPhotoUrl,
      buildPhotoLargeUrl: buildPhotoLargeUrl
   });
   
})(document, window);