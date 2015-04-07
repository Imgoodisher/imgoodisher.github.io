define(["jquery", "TextArea"], function($, TextArea) {

	function Map() {
		this.area = new TextArea(Math.floor(window.innerWidth/9), Math.floor(window.innerHeight/19))
	
		var map = this;
		$(window).resize(function() {
			map.area.translate(
				window.innerWidth/2 - Math.floor(window.innerWidth/9)*4.5,
				window.innerHeight/2 - Math.floor(window.innerHeight/19)*9.5
			)
		}).resize();

	}

	return Map

})