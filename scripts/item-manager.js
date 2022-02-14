(function () {

	"use strict";

	angular.module("openScience.engine")
        .service("itemManager", ["$http", "$q", "itemRetriever", function ($http, $q, itemRetriever) {




        	var config = {
        		qUrl: "http://openscience.si/NaprednoIskanjeJson.aspx?&q=",
        		idUrl: "http://openscience.si/NaprednoIskanjeJsonZapis.aspx?id=",
        		useAlt: false,
        		defaultFilterOperator: 1,
        		perPage: 10,
        		truncateLength: 256,
        		maxFilterItems: 8,
        		maxPreloadCountForeground: 3,
        		maxPreloadCountBackground: 1
        	};
        	var retrievers = {
        		foreground: null,
        		background: null,
        	};
        	var onForegroundRetrieverChange;
        	var onPopStateChange;




        	//compiles the request url
        	var compileUrlQuery = function (input, lang, sort) {
        		var url;
        		if (typeof (input) == "string") {
        			//simple input
        			return "1:0:" + input;
        		} else {
        			//complex input
        			url = "";
        			angular.forEach(input, function (value) {
        				if (!value.input) return;
        				var s = value.operator + ":" + value.type + ":" + value.input;
        				if (url) url += ";" + s;
        				else url = s;
        			});
        		}

        		if (lang !== undefined && lang != "-1") {
        			if (url) url += ";";
        			url += "1:21:" + lang;
        		}

        		if (sort !== undefined && sort != "-1") {
        			if (url) url += ";";
        			url += "1:20:" + sort;
        		};

        		if (!url) throw "Invalid input."; //error

        		return url;
        	};


        	//creates itemRetriever based on given urlQuery
        	var createRetriever = function (query, isForeground, logHistoryState) {
        		var filter =
					retrievers.foreground
						? retrievers.foreground.filter
						: (retrievers.background
							? retrievers.background.filter
							: null
						);
        		return itemRetriever(config, query, filter, !!isForeground);
        	};


        	//starts loading results from given query and optionally sets it as a foreground process
        	var start = function (query, forceForeground, logHistoryState) {
        		var fg = retrievers.foreground;
        		var bg = retrievers.background;

        		if (fg && fg.query == query) {
        			runRetriever(fg); //retry in case of an error/abort
        			return;
        		}

        		if (forceForeground) {
        			if (logHistoryState)
        				pushHistoryState(query);

        			//check for reassignment
        			if (bg && bg.query == query) {
        				//check for disposal
        				retrievers.foreground = bg;
        				retrievers.background = null;
        				disposeRetriever(fg);
        				bg.isForeground = true;
        				runRetriever(bg); //if aborted or error
        				notifyForegroundRetrieverChange();
        				return;
        			}
        			//dispose background retriever, create new foreground retriever and check for disposal
        			disposeRetriever(bg);
        			retrievers.background = null;
        			var ret = createRetriever(query, true);
        			retrievers.foreground = ret;
        			disposeRetriever(fg);
        			runRetriever(ret);
        			notifyForegroundRetrieverChange();
        		} else {
        			//check if equal
        			if (bg && bg.query == query) return; //don't retry() if faulted

        			//create new and check for disposal
        			var ret = createRetriever(query, false);
        			retrievers.background = ret;
        			disposeRetriever(bg);
        			runRetriever(ret);
        		}
        	};


        	//starts or retries data collection on a retrievr; adds appropriate handlers
        	var runRetriever = function (retriever) {
        		var q = retriever.start();
        	};


        	//gets rid of a retriever in a friendly manner
        	var disposeRetriever = function (retriever) {
        		if (retriever) retriever.abort("itemManager.abort");
        	};


        	//changes the amount of items per page
        	var changePageSize = function (size) {
        		if (size <= 0) throw "We can't display an infinite or negative amount of pages, you know...";
        		config.perPage = size;
        		if (retrievers.foreground) retrievers.foreground.updatePages();
        		if (retrievers.background) retrievers.background.updatePages();
        	};


        	//adds a history state based on the given query
        	var pushHistoryState = function (query) {
        		history.pushState({ query: query }, document.title, "?q=" + query);
        	};


        	//raises the onForegroundRetrieverChange event
        	var notifyForegroundRetrieverChange = function () {
        		if (onForegroundRetrieverChange) {
        			onForegroundRetrieverChange();
        		}
        	};


        	//aborts all pending operations
        	var abort = function () {
        		if (retrievers.foreground) retrievers.foreground.abort();
        		if (retrievers.background) retrievers.background.abort();
        	};


        	//initialization function
        	var init = function () {
        		addEventListener("popstate", function (e) {
        			if (!e.state || !e.state.query) {
        				onPopStateChange(null);
        			} else {
        				start(e.state.query, true);
        				var q = e.state.query;
        				if (onPopStateChange)
        					onPopStateChange(getInput(q));
        			}
        		});
        	};


        	//parses input fields' values based from given query
        	var getInput = function (query) {
        		if (!query) return null;
        		var qentries = query.split(";");
        		var entries = [];
        		for (var i = 0; i < qentries.length; i++) {
        			var e = qentries[i];
        			if (e.length == 0) continue; //empty
        			var parts = e.split(":");
        			if (parts.length != 3 || !parts[0] || !parts[1] || !parts[2]) continue; //invalid format
        			var n1 = Number(parts[0]),
						n2 = Number(parts[1]);
        			if (isNaN(n1) || isNaN(n2)) continue;
        			entries.push({
        				operator: n1,
        				what: n2,
        				query: parts[2]
        			});
        		}
        		if (entries.length == 0) return null;
        		var entry = entries[0];
        		var simple = false;
        		if (entries.length == 1) {
        			simple = ((entry.operator == 0 || entry.operator == 1) && entry.what == 0);
        		}
        		return {
        			simple: simple,
        			entry: entry,
        			entries: entries
        		};
        	};


        	//clears any cache and removes retrievers
        	var clear = function () {
        		abort();
        		this.retrievers.foreground = null;
        		this.retrievers.background = null;
        		notifyForegroundRetrieverChange();
        	}




        	init(); //initialize component




        	return {
        		retrievers: retrievers,
        		start: function (input, lang, sort, forceForeground, logHistoryState) {
        			start(compileUrlQuery(input, lang, sort), forceForeground, logHistoryState);
        		},
        		startQuery: start,
        		changePageSize: changePageSize,
        		abort: abort,
        		setOnForegroundRetrieverChange: function (handler) {
        			if (handler && typeof (handler) != "function") return;
        			onForegroundRetrieverChange = handler;
        		},
        		setOnPopStateChange: function (handler) {
        			if (handler && typeof (handler) != "function") return;
        			onPopStateChange = handler;
        		},
        		getInput: getInput,
        		clear: clear
        	};




        }]);

})();