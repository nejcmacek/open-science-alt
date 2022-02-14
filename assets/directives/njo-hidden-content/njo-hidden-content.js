(function () {

	"use strict";

	angular.module("openScience.engine")
        .directive("njoHiddenContent", ["$timeout", function ($timeout) {




        	//the link function
        	function link($scope, element, attrs, controller, transcludeFn) {




        		var timeoutId,
					njoContent,
					opened,
					timeout,
					first = true;




        		//shows the hidden menu
        		function show() {
        			opened = true;
        			$scope.opened = true;
        			if (timeoutId) {
        				$timeout.cancel(timeoutId);
        			}
        			njoContent.removeClass("ng-hide");
        			element.removeClass("njo-closing");
        			element.removeClass("njo-closed");
        			element.addClass("njo-opening");
        			element.addClass("njo-opened");
        			element.css({
        				maxHeight: njoContent[0].offsetHeight + "px"
        			});
        			timeoutId = $timeout(function () {
        				element.removeClass("njo-opening");
        				element.css({
        					maxHeight: "none"
        				});
        				timeoutId = null;
        			}, timeout);
        		}


        		//hides the visible menu
        		function hide() {
        			opened = false;
        			$scope.opened = false;
        			if (timeoutId) {
        				$timeout.cancel(timeoutId);
        			}
        			element.removeClass("njo-opening");
        			element.removeClass("njo-opened");
        			element.addClass("njo-closed");
        			element.addClass("njo-closing");
        			element.css({
        				maxHeight: njoContent[0].offsetHeight + "px"
        			});
        			setTimeout(function () {
        				element.css({
        					maxHeight: 0
        				});
        				timeoutId = $timeout(function () {
        					element.removeClass("njo-closing");
        					timeoutId = null;
        				}, timeout);
        			});
        		}


        		//hides or shows the menu
        		function setVisibility(visible) {
        			visible = !!visible;
        			if (visible == opened) return;
        			if (visible) show();
        			else hide();
        		}


        		//hides or shows the menu
        		function toggle() {
        			if (opened) {
        				hide();
        			} else {
        				show();
        			}
        		}




        		//init
        		(function () {

        			njoContent = element.children().eq(0);
        			timeout = Number(attrs.timeout);
        			if (isNaN(timeout)) timeout = 500;
        			opened = $scope.opened;

        			if (opened) {
        				element.css({
        					maxHeight: "initial"
        				});
        				element.addClass("njo-opened");
        			} else {
        				element.addClass("njo-closed");
        			}

        			$scope.$watch(attrs.opened, setVisibility);

        		})();




        	}




        	return {
        		link: link,
        		restrict: "E",
        		scope: {
        			opened: "=",
        		},
        		transclude: true,
        		template: '<njo-content ng-transclude></njo-content>'
        	};




        }]);

})();