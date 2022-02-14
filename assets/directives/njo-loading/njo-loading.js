(function () {

	"use strict";

	angular.module("openScience.engine")
        .directive("njoLoading", function repeat_identifier($window) {




        	return {
        		restrict: "E",
        		template: '<div class="loading-1"></div><div class="loading-2"></div>'
        	};




        });

})();