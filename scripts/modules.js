(function () {

	"use strict";




	angular.module("openScience.engine", []);




	angular.module("openScience", ["openScience.engine", "ngMaterial", "ngMessages"])
		.config(["$mdThemingProvider", function ($mdThemingProvider) {


			$mdThemingProvider.definePalette("openSciencePrimaryPelette", {
				"50": "2c77Ba",
				"100": "2c77Ba",
				"200": "2c77Ba",
				"300": "2c77Ba",
				"400": "2c77Ba",
				"500": "19578f", //tabs
				"600": "2c77Ba",
				"700": "2c77Ba",
				"800": "e1e1e1", //selected tabs, buttons
				"900": "555555", //text button
				"A100": "ff8a80",
				"A200": "ff5252",
				"A400": "ff1744",
				"A700": "d50000",
				"contrastDefaultColor": "light",
				"contrastDarkColors": ["50", "100", "200", "300", "400", "A100"],
				"contrastLightColors": ["e16a49"]
			});


			$mdThemingProvider.definePalette("openScienceAccentPelette", {
				"50": "e16a49",
				"100": "e16a49",
				"200": "e16a49",
				"300": "e16a49",
				"400": "e16a49",
				"500": "e16a49",
				"600": "e16a49",
				"700": "e16a49",
				"800": "e16a49",
				"900": "e16a49",
				"A100": "e16a49",
				"A200": "e16a49",
				"A400": "e16a49",
				"A700": "e16a49",
				"contrastDefaultColor": "dark",
				"contrastDarkColors": ["50", "100", "200", "300", "400", , "500", "600", "700", "800", "900", "A100", "A200", "A400", "A700"],
				"contrastLightColors": ["2c77Ba", "19578f"]
			});


			$mdThemingProvider.theme("default")
			  .primaryPalette("openSciencePrimaryPelette")
				.accentPalette("openScienceAccentPelette");


		}]);




})();