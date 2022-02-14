(function () {

	"use strict";

	angular.module("openScience.engine")
        .factory("itemRetriever", ["$http", "$q", "dataDownloader", function ($http, $q, dataDownloader) {




        	var itemRetriever = (function () {




        		function itemRetriever($http, $q, dataDownloader, config, query, existingFilter, isForeground) {


        			this.$http = $http;
        			this.$q = $q;
        			this.dataDownloader = dataDownloader;
        			this.config = config;
        			this.query = query;
        			this.existingFilter = existingFilter;
        			this.isForeground = isForeground;
        			this.items; // = [];
        			this.canceler;
        			this.filter;
        			this.filterCounter;
        			this.filtered; // = [];
        			this.downloader;
        			this.pagination = {
        				pages: [], // = {
        				//	items: [],
        				//	downloading: false,
        				//	downloaded: false,
        				//	error: false,
        				//	aborted: false
        				//}
        				current: -1,
        				max: -1,
        				any: false,
        				allDownloaded: false
        			};
        			this.status = {
        				running: false,
        				finished: false,
        				aborted: false,
        				error: null,
        				updatingFilter: false
        			};
        			this.preloadCount = 0;
        			this.preloadHash = 0;
        			this.rejectWorker = null;


        		}




        		//maps JSON retrieved data to a nicer form and returns it
        		itemRetriever.prototype.mapData = function (data) {
        			var useAlt = this.config.useAlt;
        			var mapped = [];
        			angular.forEach(data, function (item) {
        				var ret = {
        					id: item.ID,
        					bm25: item.BM25,
        					keywords: (useAlt ? item.KljucneBesedeAlt : item.KljucneBesede),
        					authors: item.Avtorji,
        					year: item.LetoIzida,
        					repository: (useAlt ? item.IRIDAlt : item.IRID),
        					typology: (useAlt ? item.TipologijaAlt : item.Tipologija),
        					lang: (useAlt ? item.JezikAlt : item.Jezik),
        					details: null
        				};
        				this.push(ret);
        			}, mapped);
        			return mapped;
        		};


        		//Sorts the source
        		itemRetriever.prototype.sort = function () {
        			this.items.sort(function (a, b) {
        				return b.bm25 - a.bm25;
        			});
        		};


        		//sends data request ti qUrl, sets itemsPromise and returns it
        		itemRetriever.prototype.getItems = function () {
        			var c = this.$q.defer();
        			this.canceler = c;
        			return this.$http.get(this.config.qUrl + encodeURIComponent(this.query), { timeout: c.promise });
        		};


        		//retrieves and sets items; returns a promise
        		itemRetriever.prototype.setItems = function () {
        			var that = this;
        			return this.$q(function (resolve, reject) {
        				that.getItems().then(function (result) {
        					//resolve
        					that.canceler = null;
        					if (typeof result.data !== "object") {
        						reject("Recieved " + (typeof result.data) + " instead of a JSON object.");
        						return;
        					}
        					that.items = that.mapData(result.data);
        					resolve();
        				}, function (error) {
        					//reject
        					that.canceler = null;
        					reject(error);
        				});
        			});
        		};


        		//Creates filter to match source
        		itemRetriever.prototype.setFilter = function () {
        			var f = {
        				keywords: [],
        				authors: [],
        				year: [],
        				repository: [],
        				typology: [],
        				lang: []
        			};
        			angular.forEach(this.items, function (set) {
        				for (var i = 0; i < set.keywords.length; i++) {
        					var value = set.keywords[i];
        					if (set.keywords.indexOf(value) < i) continue;
        					this.incr(f.keywords, value);
        				}
        				for (var i = 0; i < set.authors.length; i++) {
        					var value = set.authors[i];
        					if (set.authors.indexOf(value) < i) continue;
        					this.incr(f.authors, set.authors[i]);
        				}
        				this.incr(f.year, set.year);
        				this.incr(f.repository, set.repository);
        				this.incr(f.typology, set.typology);
        				this.incr(f.lang, set.lang);
        			}, this);
        			this.filter = f;
        		};


        		//private; increments counter in a fitler
        		itemRetriever.prototype.incr = function (arr, value) {
        			if (!value) return; //invalid value
        			for (var i = 0; i < arr.length; i++) {
        				var item = arr[i];
        				if (item.value == value) {
        					item.count++;
        					return;
        				}
        			}
        			arr.push({ value: value, count: 1, operator: this.config.defaultFilterOperator });
        		};


        		//resets filter
        		itemRetriever.prototype.resetFilter = function () {
        			if (!this.status.finished) return;
        			angular.forEach(this.filter, function (value) {
        				for (var i = 0; i < value.length; i++) {
        					var field = value[i];
        					field.selected = false;
        					field.operator = this.config.defaultFilterOperator;
        				}
        			}, this);
        			this.applyFilter();
        			this.setPages();
        			this.preloadPage(0);
        		};


        		//returns an array of fileterd items
        		itemRetriever.prototype.applyFilter = function () {
        			var r = [];
        			var ffields = [
						this.filter.keywords,
						this.filter.authors,
						this.filter.lang,
						this.filter.year,
						this.filter.repository,
						this.filter.typology
        			];
        			var l = ffields.length;
        			//check if any filter is selected
        			//var anySelected = false;
        			//for (var i = 0; i < l; i++) {
        			//	var ffield = ffields[i];
        			//	for (var j = 0; j < ffield.length; j++) {
        			//		if (ffield[j].selected) {
        			//			anySelected = true;
        			//			break;
        			//		}
        			//	}
        			//	if (anySelected) break;
        			//}
        			//if (!anySelected) {
        			//	this.filtered = this.items;
        			//	return;
        			//}

        			//reset count
        			for (var i = 0; i < l; i++) {
        				var ffield = ffields[i];
        				for (var j = 0; j < ffield.length; j++) {
        					ffield[j].count = 0;
        				}
        			}
        			//filter
        			for (var i = 0; i < this.items.length; i++) {
        				var item = this.items[i];
        				var itemFields = [
							item.keywords,
							item.authors,
							item.lang,
							item.year,
							item.repository,
							item.typology
        				];
        				if (this.compliesWithFilter(ffields, itemFields)) {
        					r.push(item);
        				}
        			} //for in source
        			this.setFilterCounter();
        			this.filtered = r;
        		};


        		//returns a promise of 
        		itemRetriever.prototype.applyFilterAsync = function () {
        			if (typeof Worker == "undefined") {
        				this.applyFilter();
        				return null;
        			}
        			if (this.rejectWorker) this.rejectWorker();
        			var that = this;
        			return $q(function (resolve, reject) {
        				var w = new Worker("scripts/filter-apply.js");
        				that.rejectWorker = function () {
        					w.terminate();
        					that.rejectWorker = null;
        				};
        				w.onmessage = function (e) {
        					var ids = e.data.filteredIds;
        					that.filtered = that.items.filter(function (item) {
        						return ids.indexOf(item.id) >= 0;
        					});
        					that.filter = e.data.filter;
        					that.setFilterCounter();
        					w.terminate();
        					resolve();
        				};
        				w.postMessage({
        					filter: that.filter,
        					items: that.items,
        				});
        			});
        		};


        		//checks whether given item's fields comply with filter fields
        		itemRetriever.prototype.compliesWithFilter = function (ffields, itemFields) {
        			var any = false; //whether or not item matches at least one of the filters (AND or OR operators only)
        			var hasOr = false; //whether or not any of the filters contains an OR operator
        			for (var x = 0; x < ffields.length; x++) {
        				var ffield = ffields[x];
        				var ifield = itemFields[x];
        				for (var i = 0; i < ffield.length; i++) {
        					var ffitem = ffield[i];

        					var complies = this.compliesWithFilterItem(ffitem, ifield);
        					ffitem.complies = complies;
        					if (ffitem.selected) {
        						hasOr = hasOr || (ffitem.operator == 0);
        						if (!complies && ffitem.operator != 0) {
        							//decrement count
        							for (var xx = 0; xx < x; xx++) {
        								var dcrFfield = ffields[xx];
        								for (var ii = 0; ii < dcrFfield.length; ii++) {
        									var dcrFfitem = dcrFfield[ii];
        									if (dcrFfitem.complies)
        										dcrFfitem.count--;
        								}
        							}
        							for (var ii = 0; ii < i; ii++) {
        								var dcrFfitem = ffield[ii];
        								if (dcrFfitem.complies)
        									dcrFfitem.count--;
        							}
        							return false;
        						}
        						if (complies && ffitem.operator != 2) {
        							any = true;
        						}
        					} else {
        						var complies = this.compliesWithFilterItem(ffitem, ifield);
        					}
        					if (complies) {
        						ffitem.count++;
        					}

        				} //for in ffield
        			} //for in ffields
        			//so far, the item has not been excluded
        			return hasOr ? any : true;
        		};


        		//checks whether given item' fields compliy with filter field
        		itemRetriever.prototype.compliesWithFilterItem = function (ffitem, ifield) {
        			var ffvalue = ffitem.value;
        			if (Array.isArray(ifield)) {
        				if (ffitem.operator == 1) {
        					for (var j = 0; j < ifield.length; j++) {
        						var iitem = ifield[j];
        						if (iitem == ffvalue) {
        							return true;
        						}
        					}
        					return false;
        				} else if (ffitem.operator == 2) {
        					for (var j = 0; j < ifield.length; j++) {
        						var iitem = ifield[j];
        						if (iitem == ffvalue)
        							return false;
        					}
        					return true;
        				} else {
        					for (var j = 0; j < ifield.length; j++) {
        						var iitem = ifield[j];
        						if (iitem == ffvalue) {
        							return true;
        						}
        					}
        					return false;
        				} //operator switch
        			} else {
        				if (ffitem.operator == 1) {
        					return ffvalue == ifield;
        				} else if (ffitem.operator == 2) {
        					return ffvalue != ifield;
        				} else {
        					if (ffvalue == ifield)
        						return true;
        					return false;
        				} //operator switch
        			} //if(!Array.isArray(ifield))
        		};


        		//sets filter counter based on existing filter
        		itemRetriever.prototype.setFilterCounter = function () {
        			this.filterCounter = {
        				keywords: this.trimFilterField(this.filter.keywords),
        				authors: this.trimFilterField(this.filter.authors),
        				lang: this.trimFilterField(this.filter.lang),
        				year: this.trimFilterField(this.filter.year),
        				repository: this.trimFilterField(this.filter.repository),
        				typology: this.trimFilterField(this.filter.typology),
        			};
        		};


        		//sorts and trims filter filed array
        		itemRetriever.prototype.trimFilterField = function (arr) {
        			arr.sort(function (a, b) {
        				if (a.selected && !b.selected) return -1;
        				if (!a.selected && b.selected) return 1;
        				var diff = b.count - a.count;
        				if (a.operator == 2 && b.operator == 2)
        					diff = -diff;
        				if (diff != 0) return diff;
        				if (typeof a.value == "number") //value is either number or string
        					return b.value - a.value;
        				else
        					return a.value.localeCompare(b.value);
        			});
        			var mfi = this.config.maxFilterItems;
        			var l = arr.length;
        			var nl = Math.ceil(Math.sqrt(l));
        			if (nl > mfi) nl = mfi;
        			if (nl > l) nl = l;
        			var anyCount = 0;
        			for (var i = 0; i < nl; i++) {
        				if (arr[i].count > 0)
        					anyCount++;
        			}
        			if (nl > anyCount) nl = anyCount;
        			return arr.slice(0, nl);
        		};


        		//copies all matching filter settings from a to b
        		itemRetriever.prototype.mergeFilters = function (a, b) {
        			this.mergeFilterFields(a.keywords, b.keywords);
        			this.mergeFilterFields(a.authors, b.authors);
        			this.mergeFilterFields(a.year, b.year);
        			this.mergeFilterFields(a.repository, b.repository);
        			this.mergeFilterFields(a.typology, b.typology);
        			this.mergeFilterFields(a.lang, b.lang);
        		};


        		//copies all matching filter field settings from a to b
        		itemRetriever.prototype.mergeFilterFields = function (a, b) {
        			for (var i = 0; i < a.length; i++) {
        				var aField = a[i];
        				for (var j = 0; j < b.length; j++) {
        					var bField = b[j];
        					if (aField.value === bField.value) {
        						aField.operator = bField.operator;
        						aField.selected = bField.selected;
        						break;
        					}
        				}
        			}
        		};


        		//updates the filter and paging
        		itemRetriever.prototype.updateFilter = function () {
        			if (!this.status.finished) return null;
        			this.status.updatingFilter = true;
        			var promise = this.applyFilterAsync();
        			if (promise) {
        				var that = this;
        				promise.then(function () {
        					that.setPages();
        					that.status.updatingFilter = false;
        					that.preloadPage(0);
        				}, function () {
        					that.status.updatingFilter = false;
        					that.preloadPage(0);
        				});
        			} else { //no async support
        				this.setPages();
        				this.status.updatingFilter = false;
        				this.preloadPage(0);
        			}
        			return promise;
        		};


        		//distributes items into pages
        		itemRetriever.prototype.setPages = function () {
        			//if (this.downloader) this.downloader.abort(); //no need to abort downloader... let it load until another download will start
        			this.preloadCount = 0;
        			var pgn = this.pagination;
        			if (!pgn.to) {
        				var that = this;
        				pgn.toLast = function () {
        					that.preloadPage(this.max, true);
        					this.current = this.max;
        				};
        				pgn.toFirst = function () {
        					that.preloadPage(0, true);
        					this.current = 0;
        				};
        				pgn.toNext = function () {
        					if (this.current < this.max) {
        						that.preloadPage(this.current + 1, true);
        						this.current += 1;
        					}
        				};
        				pgn.toPrevious = function () {
        					if (this.current > 0)
        						that.preloadPage(--this.current, true);
        				};
        				pgn.to = function (index) {
        					if (index > this.max || index < 0) return;
        					that.preloadPage(index, true);
        					this.current = index;
        				};
        				pgn.retry = function () {
        					that.preloadPage(this.current);
        				};
        			}
        			if (this.filtered.length == 0) {
        				pgn.any = false;
        				pgn.allDownloaded = true;
        				pgn.max = -1;
        				pgn.current = -1;
        				pgn.pages = [];
        				return;
        			}
        			var pp = this.config.perPage;
        			var l = (this.filtered.length / pp);
        			var p = [];
        			for (var i = 0; i < l; i++) {
        				var start = i * pp;
        				var end = start + pp;
        				if (end >= this.filtered.length)
        					end = this.filtered.length;
        				var arr = this.filtered.slice(start, end);
        				p.push({
        					items: arr,
        					downloading: false,
        					downloaded: false,
        					//they won't be downloaded again since dataDownloader keeps track of all items that have already been downloaded
        					error: false,
        					aborted: false
        				});
        			}
        			pgn.any = true;
        			pgn.allDownloaded = false;
        			pgn.max = p.length - 1;
        			pgn.pages = p;
        			pgn.current = 0;
        		};


        		//maps JSON retrieved set of details (data) to an exiting item
        		itemRetriever.prototype.itemDetailMapper = function (item, data, reference) {
        			var d = data[0];
        			var tl = reference.config.truncateLength;
        			item.details = {
        				title: d.Title,
        				url: d.url,
        				org: d.Organization,
        				loc: d.Location,
        				description: (d.Abstract.length > tl ? d.Abstract.substr(0, tl) + "..." : d.Abstract)
        			};
        		};


        		//sends detail requests to idUrl, sets detailsPromise to their merged promise and returns it
        		itemRetriever.prototype.itemUrlRetriever = function (item, reference) {
        			return reference.config.idUrl + item.id;
        		};


        		//starts data download and chained processes (eg. details download); returns a promise or null
        		itemRetriever.prototype.startDownload = function () {
        			if (this.status.running) return null;
        			if (this.status.finished) {
        				this.preloadPage(this.pagination.current);
        				return null;
        			}
        			this.status.running = true;
        			this.status.error = false;
        			this.status.aborted = false;
        			var that = this;
        			return this.$q(function (resolve, reject) {
        				that.setItems().then(function () {
        					var error = false;
        					try {
        						that.sort();
        						var referenceProvider = function () { return that; };
        						that.downloader = that.dataDownloader(that.items, that.itemUrlRetriever, that.itemDetailMapper, referenceProvider);
        						if (that.items.length > 0 && (that.isForeground ? that.config.maxPreloadCountForeground : that.config.maxPreloadCountBackground) > 0) {
        							var its = that.items.slice(0, that.config.perPage)
        							that.downloader.downloadItems(its); //start preload... the faster the better
        						}
        						that.setFilter();
        						if (that.existingFilter) {
        							that.mergeFilters(that.filter, that.existingFilter);
        							that.existingFilter = null;
        						}
        						that.applyFilter();
        						that.setPages();
        						that.status.finished = true;
        						that.status.running = false;
        						that.preloadPage(0); //no harm will be done if no items were found
        					} catch (err) {
        						console.error("An error has occurred while processing downloaded data. Error details: " + err);
        						that.status.error = err || true;
        						that.status.running = false;
        						that.status.finished = false;
        						error = true;
        						reject(err);
        					}
        					if (!error)
        						resolve(); //don't move this into the try block... we don't want to catch exception here
        				}, function (error) {
        					that.status.error = error || true;
        					that.status.running = false;
        					resolve();
        					console.error("Either an error has occurred while retrieving items or the process has been aborted. Retrieval url: " + that.config.qUrl + encodeURIComponent(that.query) + ". Error details: ", error);
        					reject(error);
        				});
        			});
        		};


        		//aborts any pending requests/promises
        		itemRetriever.prototype.abort = function (message) {
        			if (this.status.running) {
        				this.status.running = false;
        				this.status.aborted = true;
        			}
        			if (this.canceler) {
        				this.canceler.resolve(message);
        				this.canceler = null;
        			}
        			if (this.downloader)
        				this.downloader.abort("itemRetriever.abort");
        			this.preloadCount = 0;
        			if (this.rejectWorker) this.rejectWorker();
        		};


        		//starts the preload of a page
        		itemRetriever.prototype.preloadPage = function (index) {
        			this.preloadHash++;
        			this.preloadCount = 0;
        			this.preloadPageInternal(index, this.preloadHash);
        		};


        		//handles internal (pre)loading of a page
        		itemRetriever.prototype.preloadPageInternal = function (index, hash) {
        			if (hash != this.preloadHash) return;
        			var pagination = this.pagination;
        			if (!pagination.any || pagination.allDownloaded) return;

        			if (index < 0) index = 0;

        			var max = this.isForeground ? this.config.maxPreloadCountForeground : this.config.maxPreloadCountBackground;
        			if (this.isForeground && max < 1) max = 1;

        			for (var i = index; i <= pagination.max; i++) {
        				if (this.preloadCount >= max) return;
        				var pg = pagination.pages[i];
        				if (pg.downloading) return;
        				this.preloadCount++;
        				if (!pg.downloaded) {
        					this.startPageDownload(pg, i, hash);
        					return;
        				}
        			}

        			if (index > pagination.max) index = pagination.max;
        			for (var j = index - 1; j >= 0; j--) {
        				if (this.preloadCount >= max) return;
        				var pg = pagination.pages[j];
        				if (pg.downloading) return;
        				this.preloadCount++;
        				if (!pg.downloaded) {
        					this.startPageDownload(pg, j, hash);
        					return;
        				}
        			}

        			pagination.allDownloaded = true; //Cave Johnson, we're done here.
        		};


        		//starts download of items in a page and adds appropriate handlers
        		itemRetriever.prototype.startPageDownload = function (page, index, hash) {
        			//yes, i could use a loop to find the index of the page, but specifying it makes the process less inconvenient & faster
        			if (page.downloading || page.downloaded) return;

        			var its = page.items;
        			//var promise = this.downloader.download(function (item) { //for async filter loading reasons (it copies the object)
        			//	var id = item.id;
        			//	for (var i = 0; i < its.length; i++) {
        			//		if (item.id == its[i].id)
        			//			return true;
        			//	}
        			//	return false;
        			//});
        			page.error = false;
        			page.aborted = false;
        			page.downloading = true;
        			var promise = this.downloader.downloadItems(page.items); //this does not work with async filter loading because async creates copies of objects
        			if (promise) {
        				this.handlePageLoad(page, promise, index, hash);
        			} else {
        				//downloader.downloadItems returns null if all the items have already been downloaded
        				page.downloading = false;
        				page.downloaded = true;
        				this.preloadPageInternal(index + 1, hash); //smart preload
        			}
        		};


        		//handles the end of downloading a page: successful or bitter
        		itemRetriever.prototype.handlePageLoad = function (page, promise, previousIndex, hash) {
        			var that = this;
        			promise.then(function (resolve) {
        				page.downloaded = true;
        				page.downloading = false;
        				that.preloadPageInternal(previousIndex + 1, hash); //smart preload
        			}, function (reject) {
        				if (reject === "itemRetriever.abort") {
        					page.aborted = true;
        					page.error = true;
        				} else {
        					page.error = reject || true;
        				}
        				page.downloading = false;
        				//don't load any further data, perhaps there are internet conectivity problems... If so, the page will load will load when selected
        			});
        		};


        		//refresh pages and filter
        		itemRetriever.prototype.refresh = function () {
        			if (!this.status.finished) return;
        			this.setPages();
        			this.preloadPage(0);
        		};


        		//start new download (or retry)
        		itemRetriever.prototype.start = itemRetriever.prototype.startDownload;


        		//retry or start download
        		itemRetriever.prototype.retry = itemRetriever.prototype.startDownload;




        		return itemRetriever;




        	})();




        	return function (config, query, existingFilter, isForeground) {
        		return new itemRetriever($http, $q, dataDownloader, config, query, existingFilter, isForeground);
        	};




        }]);

})();