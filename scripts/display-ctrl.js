(function () {

	"use strict";

	angular.module("openScience")
		.controller("displayCtrl", ["$scope", "itemManager", "$timeout", function ($scope, manager, $timeout) {




			//setup - general
			var timeoutDelay = 500;
			var inputFieldsDefaultOperator = 1;


			//setup - $scope (variables)
			$scope.prDark = "#19578F";
			$scope.prLight = "#2c77Ba";
			$scope.timeoutPromise = null;
			$scope.filterOperatorExpanded = false;
			$scope.$on("$destroy", manager.abort);
			$scope.perPage = 10;
			$scope.retr;
			$scope.pgn;
			$scope.tabsSelected;
			$scope.inputFormSimple;
			$scope.inputFormComplex;
			$scope.inputSimple = ""; //init the value
			$scope.inputFields = [
				{
					operator: inputFieldsDefaultOperator,
					input: "",
					type: 0
				}
			];
			$scope.inputTypes = [
				{ id: 0, name: "Karkoli" },
				{ id: 10, name: "Polno besedilo" },
				{ id: 11, name: "Naslov" },
				{ id: 12, name: "Avtor" },
				{ id: 13, name: "Opis" },
				{ id: 14, name: "Ključne besede" },
				{ id: 15, name: "Leto" }
				//{ id: 20, name: "Vrsta gradiva" },
				//{ id: 21, name: "Jezik" },
			];
			$scope.inputOperators = [
				{ id: 0, name: "ALI" },
				{ id: 1, name: "IN" },
				{ id: 2, name: "NE" }
			];
			$scope.inputLang = "-1";
			$scope.inputSort = -1;
			$scope.inputError = false;
			$scope.manager = manager;
			$scope.page = 0;


			//setup - $scope (functions)
			$scope.inputAdd = inputAdd;
			$scope.inputRemove = inputRemove;
			$scope.inputSubmitSimple = sendSimple;
			$scope.inputSubmitComplex = sendComplex;
			$scope.inputChangeSimple = inputChangeSimple;
			$scope.inputChangeComplex = inputChangeComplex;
			$scope.updateFilter = updateFilter;
			$scope.filterSetOperator = filterSetOperator;
			$scope.refreshRetriever = refreshRetriever;
			$scope.getAuthorLink = getAuthorLink;
			$scope.getKeywordLink = getKeywordLink;
			$scope.searchAuthor = searchAuthor;
			$scope.searchKeyword = searchKeyword;


			//setup - manager
			manager.setOnForegroundRetrieverChange(managerOnForegroundRetrieverChangeHandler);
			manager.setOnPopStateChange(setInputStateFields);




			//the logic behind changing foreground retrievers
			function managerOnForegroundRetrieverChangeHandler() {
				var retr = manager.retrievers.foreground;
				$scope.retr = retr;
				$scope.pgn = retr ? retr.pagination : null;
			}


			//the logic behind navigating backwards/forwards through history and settings appropriate input fields
			function setInputStateFields(state) {
				if (!state) {
					$scope.inputSimple = "";
					$scope.inputFields = [{
						operator: inputFieldsDefaultOperator,
						input: "",
						type: 0
					}];
					$scope.inputLang = "-1";
					$scope.inputSort = "-1";
					$scope.tabsSelected = 0;
					manager.clear();
					return;
				}

				if (state.simple) {
					$scope.inputSimple = state.entry.query;
					$scope.tabsSelected = 0;
				} else {
					var newInputFields = [];
					var hasLang = false,
						hasSort = false;
					for (var i = 0; i < state.entries.length; i++) {
						var e = state.entries[i];
						if (e.what == 20) { //sort
							if (e.operator == 1 || e.operator == 0) {
								$scope.inputSort = e.query;
								hasSort = true;
							}
						} else if (e.what == 21) {
							if (e.operator == 1 || e.operator == 0) {
								$scope.inputLang = e.query;
								hasLang = true;
							}
						} else {
							newInputFields.push({
								operator: e.operator,
								input: e.query,
								type: e.what
							});
						}
					}
					if (newInputFields.length == 0) {
						newInputFields = [{
							operator: inputFieldsDefaultOperator,
							input: "",
							type: 0
						}];
					}
					if (!hasLang) $scope.inputLang = "-1";
					if (!hasSort) $scope.inputSort = "-1";
					$scope.inputFields = newInputFields;
					$scope.tabsSelected = 1;
				}
			}


			//creates a search query for given author and pulls the trigger (begins the search)
			function searchAuthor(author, $event) {
				if ($event && $event.preventDefault)
					$event.preventDefault();
				$scope.inputFields = [{
					operator: 1,
					input: author,
					type: 12
				}];
				$scope.inputLang = "-1";
				$scope.inputSort = "-1";
				$scope.tabsSelected = 1;
				sendComplex(true);
			}


			//creates a search query for given keyword and pulls the trigger (begins the search)
			function searchKeyword(keyword, $event) {
				if ($event && $event.preventDefault)
					$event.preventDefault();
				$scope.inputFields = [{
					operator: 1,
					input: keyword,
					type: 14
				}];
				$scope.inputLang = "-1";
				$scope.inputSort = "-1";
				$scope.tabsSelected = 1;
				sendComplex(true);
			}


			//parses a link to a keyword search from given keyword
			function getKeywordLink(keyword) {
				return "?q=" + encodeURIComponent("1:14:" + keyword);
			}


			//parses a link to author search from given author name
			function getAuthorLink(author) {
				return "?q=" + encodeURIComponent("1:12:" + author);
			}


			//refreshes (updates) retriever's filter
			function updateFilter() {
				$scope.retr.updateFilter();
			}


			//refreshes retriever (pages)
			function refreshRetriever() {
				var retr = $scope.retr;
				if (!retr) return;
				var pp = $scope.perPage;
				if (typeof pp !== "number") return; //may be undefined or null
				if (pp < 5) pp = 5;
				if (pp > 100) pp = 100;
				if (retr.config.perPage == pp) return;
				retr.config.perPage = pp;
				$scope.retr.refresh();
			}


			//the logic behind changing advanced filter's options
			function filterSetOperator(option, operator) {
				if (!$scope.retr) return;
				var t;
				var f = $scope.retr.filter;
				switch (option) {
					case 0:
						t = f.keywords;
						break;
					case 1:
						t = f.year;
						break;
					case 2:
						t = f.authors;
						break;
					case 3:
						t = f.repository;
						break;
					case 4:
						t = f.typology;
						break;
					case 5:
						t = f.lang;
						break;
				}
				for (var i = 0; i < t.length; i++) {
					t[i].operator = operator;
				}
				$scope.retr.updateFilter();
			}


			//implements simple input change logic
			function inputChangeSimple() {
				if (!validateSimpleInput()) return;
				startSmartPreloadCountdown(false);
			}


			//implements complex input change logic
			function inputChangeComplex(setInputError) {
				if (!validateComplexInput(setInputError !== false)) return;
				startSmartPreloadCountdown(true);
			}


			//starts smart query preload (starts background retriever)
			function startSmartPreloadCountdown(isComplex) {
				cancelSmartPreloadCountdown();
				$scope.timeoutPromise = $timeout(function () {
					$scope.timeoutPromise = null;
					if (isComplex)
						sendComplex(false);
					else
						sendSimple(false);
				}, timeoutDelay);
			}


			//canceles smart query preload
			function cancelSmartPreloadCountdown() {
				if ($scope.timeoutPromise)
					$timeout.cancel($scope.timeoutPromise);
			}


			//adds a filter to complex filters form
			function inputAdd() {
				$scope.inputFields.push({
					operator: inputFieldsDefaultOperator,
					input: "",
					type: 0
				});
			}


			//removes a filter from complex filters form
			function inputRemove(index) {
				$scope.inputFields.splice(index, 1);
			}


			//simplex form submit logic
			function sendSimple(forceForeground) {
				if (!validateSimpleInput()) return; //error

				cancelSmartPreloadCountdown();
				manager.start($scope.inputSimple, null, null, !!forceForeground, true);
			}


			//complex form submit logic
			function sendComplex(forceForeground) {
				if (!validateComplexInput(true)) return;

				cancelSmartPreloadCountdown();
				manager.start($scope.inputFields, $scope.inputLang, $scope.inputSort, !!forceForeground, true);
			}


			//check is simple input is valid
			function validateSimpleInput() {
				return !$scope.inputFormSimple.$invalid;
			}


			//checks if complex form is valid and optionally sets $scope.inputError if any of the fields is empty
			function validateComplexInput(setInputError) {
				if ($scope.inputFormComplex.$invalid) return false;

				var fields = $scope.inputFields;
				var empty = true;
				for (var i = 0; i < fields.length; i++) {
					if (fields[i].input) {
						empty = false;
						break;
					}
				}
				//check if language or sort (type) have been set
				if (empty) {
					if ($scope.inputLang != "-1") {
						empty = false;
					} else if ($scope.inputSort != -1) {
						empty = false;
					}
				}

				if (setInputError)
					$scope.inputError = empty;
				return !empty; //error or no error?
			}


			//initialization logic
			function init() {
				if (!location.search) return;
				var allq = location.search.substr(1).split("&");
				for (var i = 0; i < allq.length; i++) {
					var q = allq[i];
					var inx = q.indexOf("=");
					if (inx < 0) continue; //error
					var name = q.substr(0, inx);
					var val = q.substr(inx + 1);
					var dval = decodeURIComponent(val);
					if (name != "q" || !val) continue;
					var input = manager.getInput(dval);
					if (!input) continue; //perhaps there's another valid parameter
					setInputStateFields(input);
					manager.startQuery(dval, true, false);
					break;
				}
			}




			init(); //initialize the component




		}]);

})();