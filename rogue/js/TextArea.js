define(["jquery"], function($) {

	function TextArea(w, h) {
		this.el = $("<div>");

		this.el.addClass("textarea");

		for (y=0; y<h; y++) {
			var div = $("<div>")
			this.el.append(div)
			for (x=0; x<w; x++) {
				div.append($("<span>"))
			}
		}

		$(document.body).append(this.el);
	}

	TextArea.prototype.setChar = function(x, y, c) {
		this.el.children().eq(y).children().eq(x).text(c.substr(0, 1));
	}

	TextArea.prototype.setColor = function(x, y, col) {
		this.el.children().eq(y).children().eq(x).css("color", col);
	}

	TextArea.prototype.rotate = function(angle) {
		var transform = "rotate("+angle+"rad)";
		this.el.css({
			"-webkit-transform": transform,
			"-moz-transform": transform,
			"-ms-transform": transform,
			"transform": transform,
		});
	}

	TextArea.prototype.translate = function(x, y) {
		this.el.css("left", x);
		this.el.css("top", y);
	}

	TextArea.prototype.getPos = function() {
		return {
			x: parseFloat(this.el.css("left")),
			y: parseFloat(this.el.css("top"))
		}
	}

	TextArea.prototype.destroy = function() {
		document.body.removeChild(this.el)
	}

	return TextArea;
});