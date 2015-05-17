define([], function() {
	SimpleImage = function(url) {
		var img = this;

		this.image = new Image();
		this.image.src = url;
		this.loaded = false;
		this.image.onload = function() {
			img.loaded = true;
			img.width = this.width;
			img.height = this.height;
		}
	}
	SimpleImage.prototype.draw = function(ctx, x, y, r) {
		x *= 32;
		y *= 32;
		if (this.loaded) {
			ctx.save();
			ctx.translate(x, y);
			if (r) {
				ctx.rotate(r);
			}
			ctx.drawImage(this.image, -this.width/2, -this.height/2)
			ctx.restore();
		}
	}

	return SimpleImage;
})