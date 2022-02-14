(function () {
	"use strict";

	angular.module("openScience.engine")
        .factory("dataDownloader", ["$http", "$q", function ($http, $q) {




        	var dataDownloader = (function () {




        		//manages downloading of items
        		//	#items = [] //an array of items
        		//	#urlRetriever = (item, reference) => string //should provide the url of the item associated data
        		//	#dataMapper = (item, data, reference) => void //should handle the logic after data has been downloaded
        		//	#referenceProvider = null | () => Object //(optional) when called, should provide a reference to include when calling urlRetriever and dataMapper
        		function dataDownloader($http, $q, items, urlRetriever, dataMapper, referenceProvider) {


        			this.urlRetriever = urlRetriever;
        			this.dataMapper = dataMapper;
        			this.referenceProvider = referenceProvider;
        			this.$http = $http;
        			this.$q = $q;
        			this.data = items.map(function (item) {
        				return {
        					downloaded: false,
        					downloading: false,
        					cancelToken: null,
        					item: item,
        					hash: -1 //identification reasons
        				};
        			});
        			this.downloadingCount = 0;
        			this.downloadedCount = 0;
        			this.downloading = false;
        			this.hash = -1;
        			this.deferred = null;


        		}




        		//starts download
        		//	#selector = item => downloadThisItem: bool //whether or not to download given item (item is as provided in the constructor)
        		//	#return: promise|null //null if all items have already been downloaded or a promise instead
        		dataDownloader.prototype.download = function (selector) {
        			this.sendAbort(); //cancel pending download
        			this.hash++;
        			this.downloading = true;
        			this.downloadingCount = 0;
        			this.downloadedCount = 0;
        			this.deferred = this.$q.defer();
        			angular.forEach(this.data, function (item) {
        				//var item = this.data[i];
        				if (item.downloaded) return;
        				if (selector(item.item)) {
        					this.downloadingCount++; //increase even if  already downloading
        					item.hash = this.hash;
        					if (!item.downloading) {
        						var ct = this.$q.defer();
        						item.cancelToken = ct;
        						item.downloading = true;
        						var that = this;
        						var url = this.urlRetriever(item.item, this.referenceProvider ? this.referenceProvider() : null)
        						this.$http.get(url, { timeout: ct.promise })
									.then(function (result) {
										that.ajaxFinished(item, true, result);
									}, function (error) {
										that.ajaxFinished(item, false, error);
									});
        					}
        				} else if (item.downloading) {
        					item.cancelToken.resolve("Aborting ...");
        				}
        			}, this);
        			if (this.downloadingCount == 0) {
        				this.deferred = null;
        				this.downloading = false;
        				return null;
        			} else return this.deferred.promise;
        		};


        		//starts download of given items
        		//	#return: promise|null //null if all items have already been downloaded or a promise instead
        		dataDownloader.prototype.downloadItems = function (items) {
        			return this.download(function (item) {
        				return items.indexOf(item) >= 0;
        			});
        		};


        		//notifies deferred about an unsuccessful end
        		dataDownloader.prototype.sendAbort = function (message) {
        			this.downloading = false;
        			if (this.deferred) {
        				this.deferred.reject(message || "Aborting...");
        				this.deferred = null;
        			}
        		};


        		//notifies deferred about a successful end
        		dataDownloader.prototype.sendFinished = function () {
        			this.downloading = false;
        			if (this.deferred) {
        				this.deferred.resolve();
        				this.deferred = null;
        			}
        		};


        		//aborts the whole process of downloading
        		dataDownloader.prototype.abort = function (message) {
        			this.sendAbort(message);
        			for (var i = 0; i < this.data.length; i++) {
        				var item = this.data[i];
        				if (item.downloading) {
        					item.cancelToken.resolve();
        				}
        			}
        		};


        		//handles logic on item download finish
        		dataDownloader.prototype.ajaxFinished = function (item, successful, result) {
        			var that = this; //TODO remove
        			item.downloading = false;
        			item.cancelToken = null;
        			if (successful) {
        				item.downloaded = true;
        				this.dataMapper(item.item, result.data, this.referenceProvider ? this.referenceProvider() : null);
        			}
        			if (!this.downloading || item.hash != this.hash) return; //we're late
        			this.downloadedCount++;
        			if (successful) {
        				if (this.downloadedCount == this.downloadingCount) {
        					this.sendFinished();
        					//finished
        				} else {
        					this.deferred.notify({
        						count: this.downloadedCount,
        						max: this.downloadingCount
        					});
        				}
        			} else {
        				this.sendAbort(result);
        				//do not cancel other pending requests ...
        			}
        		};




        		return dataDownloader;




        	})($http, $q);




        	return function (items, urlRetriever, dataMapper, referenceProvider) {
        		return new dataDownloader($http, $q, items, urlRetriever, dataMapper, referenceProvider);
        	};




        }]);

})();