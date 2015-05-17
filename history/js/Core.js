define(['jquery'], function($) {

	//var canvas, ctx;
	var layers = [];
	var lastUpdate = Date.now();

	$(window).resize(function() {
		if (canvas) {
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;
		}
	});


	return Core = {
		offx : 0,
		offy : 0,
		zoom : 2,
		paused : false,

		bindCanvas : function(_c) {
			if (!_c instanceof HTMLCanvasElement) {
				throw new Error("Attempt to bind Core canvas to non-canvas object");
			}

			canvas = _c;
			ctx = _c.getContext("2d");

			$(window).resize();
		},

		getLayers : function() {
			return layers;
		},

		getCanvas : function() {
			return canvas;
		},

		getContext : function() {
			return ctx;
		},

		getCanvasSize : function() {
			return {
				w : canvas.width / Core.zoom / 32,
				h : canvas.height / Core.zoom / 32,
			}
		},

		pause : function() {
			this.paused = true;
		},
		unpause : function() {
			this.paused = false;
		},

		addLayer : function(options) {
			var layer = {}
			
			if (options.id) layer.id = options.id;

			if (options.draw) layer.draw = options.draw;
			if (options.update) layer.update = options.update;

			options.opaque = options.opaque || false;

			layers.push(layer);
		},

		removeLayer : function(id) {
			for (var i=layers.length-1; i>=0; i--) {
				if (layers[i].id == id) {
					layers.splice(i, 1);
					return;
				}
			}
		},

		draw : function() {
			ctx.imageSmoothingEnabled = false;
			ctx.mozImageSmoothingEnabled = false;
			ctx.webkitImageSmoothingEnabled = false;

			ctx.setTransform(Core.zoom, 0, 0, Core.zoom, (canvas.width/2 - Core.offx*32*Core.zoom), (canvas.height/2 - Core.offy*32*Core.zoom));

			if (ctx && canvas) {
				ctx.clearRect(0, 0, canvas.width, canvas.height);

				if (layers.length > 0) {
					var bottom;
					for (bottom=layers.length-1; bottom>0; bottom--) {
						if (layers[bottom].opaque) break;
					}
					for (var i=bottom; i<layers.length; i++) {
						if (layers[i].draw) layers[i].draw(ctx, canvas);
					}
				}
			} else {
				console.warn("No canvas");
			}
		},

		update : function() {
			var now = Date.now();
			var dt = Math.min((now-lastUpdate)/1000, 1);
			lastUpdate = now;

			if (this.paused) return;

			for (var i=layers.length-1; i>=0; i--) {
				if (layers[i].update) layers[i].update(dt);
				if (layers[i].opaque) break;
			}
		}
	};
})