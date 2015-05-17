define(['Core', 'Spritesheet', 'tmxjs/map'], function(Core, Spritesheet, TMX) {

	tileset = new Spritesheet("assets/tileset.png", 32, 32);

	return Map = {
		addLayer : function(map, mainlayer) {
			Core.offx = (map.bounds.w)/2;
			Core.offy = (map.bounds.h)/2;

			Core.addLayer({
				id:"Map",
				opaque:true,
				draw:function(ctx, canvas) {

					var size = Core.getCanvasSize();

					for (var x=Math.floor(Core.offx-size.w/2); x<Math.ceil(Core.offx+size.w/2); x++) {
						for (var y=Math.floor(Core.offy-size.h/2); y<Math.ceil(Core.offy+size.h/2); y++) {
							var id;
							if (x >= 0 && y >= 0 && x < map.bounds.w && y < map.bounds.h) {
								var i = (y*map.bounds.w)+x;
								if (mainlayer.cells[i]) {
									id = mainlayer.cells[i].tile.id;
								} else {
									id = 0
								}
							} else {
								id = ((y == 15 || y == 16) && x < 0 ? 3 : 0)
							};
							tileset.draw(ctx, id, x, y);
						}
					}
				}
			})
		}
	}
})