define(['jquery'], function($) {
	var canvas = $("<canvas>")[0];
	var ctx = canvas.getContext("2d");

	Spritesheet = function(src, tilew, tileh) {
		var sheet = this;

		this.tiles = [];

		this.loaded = false;

		this.image = new Image();
		this.image.src = src;
		this.image.onload = function() {
			canvas.width = this.width;
			canvas.height = this.height;

			ctx.imageSmoothingEnabled = false;
			ctx.mozImageSmoothingEnabled = false;
			ctx.webkitImageSmoothingEnabled = false;

			ctx.drawImage(this, 0, 0);

			var w = Math.floor(this.width/tilew);
			var h = Math.floor(this.height/tileh);

			for (var y = 0; y < h; y++) {
				for (var x = 0; x < w; x++) {
					var ctx2 = $("<canvas>", {width:tilew, height:tileh})[0].getContext("2d");
					ctx2.putImageData(ctx.getImageData(x*tilew, y*tileh, tilew, tileh), 0, 0);
					sheet.tiles[y*w + x] = ctx2.canvas;
				}
			}

			sheet.loaded = true;
		}
	}
	Spritesheet.prototype.draw = function(ctx, id, x, y) {
		if (this.loaded) {
			if (!this.tiles[id]) {console.warn("No tile with id "+id); return;}
			ctx.drawImage(this.tiles[id], x*32, y*32);
		}
	}

	return Spritesheet;
})