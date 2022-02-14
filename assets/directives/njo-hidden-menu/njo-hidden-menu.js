(function () {

	"use strict";

	angular.module("openScience.engine")
        .directive("njoHiddenMenu", function repeat_identifier($window) {




        	//the link function
        	function link($scope, element, attrs, controller, transcludeFn) {




        		var location,
					njoContent,
					njoBody,
					visible;




        		//shows the hidden content
        		function show() {
        			visible = true;
        			$scope.visible = true;
        			element.addClass("njo-visible");
        			element.removeClass("njo-hidden");
        			njoContent.css({
        				marginTop: 0,
        				marginBottom: 0,
        				marginLeft: 0,
        				marginRight: 0
        			});

        		}


        		//hides the visible content
        		function hide() {
        			visible = false;
        			$scope.visible = false;
        			element.addClass("njo-hidden");
        			element.removeClass("njo-visible");
        			switch (location) {
        				case "top":
        					njoContent.css({
        						marginTop: "-" + njoBody.offsetHeight + "px"
        					});
        					break;
        				case "bottom":
        					njoContent.css({
        						marginBottom: "-" + njoBody.offsetHeight + "px"
        					})
        					break;
        				case "right":
        					njoContent.css({
        						marginRight: "-" + njoBody.offsetWidth + "px"
        					});
        					break;
        				case "left":
        					njoContent.css({
        						marginLeft: "-" + njoBody.offsetWidth + "px"
        					});
        					break;
        			}
        		}


        		//shows or hides the content
        		function setVisibility(visible) {
        			var v = !!visible;
        			if (v == $scope.visible) return;
        			if (v) show();
        			else hide();
        		}


        		//shows or hides the content
        		function toggle() {
        			if ($scope.visible) {
        				hide();
        			} else {
        				show();
        			}
        		}




        		//init
        		(function () {

        			location = attrs.njoPosition;

        			switch (location) {
        				case undefined:
        				case "top":
        					$scope.icon = "keyboard_arrow_down";
        					break;
        				case "bottom":
        					$scope.icon = "keyboard_arrow_up";
        					break;
        				case "right":
        					$scope.icon = "keyboard_arrow_left";
        					break;
        				case "left":
        					$scope.icon = "keyboard_arrow_right";
        					break;
        				default:
        					throw "Invalid location attribute specified in a njoHiddenMenu directive. Please specify a njoPosition attribute.";
        			}

        			njoContent = element.children().eq(0).children().eq(0);
        			njoBody = element[0].children[0].children[0];
        			visible = !!$scope.visible;
        			$scope.toggle = toggle;
        			$scope.njoHiddemMenuBg = {
        				background: $scope.bgColor
        			};

        			element.addClass("njo-" + location);
        			element.addClass($scope.visible ? "njo-visible" : "njo-hidden");

        			if (!visible) {
        				element.addClass("njo-preparation");
        				hide();
        				setTimeout(function () { //add class in async mode to prevent animation (bug workaround)
        					element.removeClass("njo-preparation");
        				});
        			}

        			$scope.$watch(attrs.visible, setVisibility);

        		})();




        	}




        	return {
        		link: link,
        		restrict: "E",
        		scope: {
        			visible: "=",
        			bgColor: "=color"
        		},
        		transclude: true,
        		template: '<njo-content><njo-body ng-transclude class="njo-body" ng-style="njoHiddemMenuBg"></njo-body><njo-label ng-click="toggle()"  ng-style="njoHiddemMenuBg"><md-icon>{{icon}}</md-icon></njo-label></njo-content>'
        	};




        });

})();