define(['jquery', 'Core', 'GameObject', 'Player', 'Tooltip'], function($, Core, GameObject, Player, TooltipArea) {

	$(window).click(function(e) {
		if (Core.paused) return;

		var canvas = Core.getCanvas();

		var wx = (e.clientX - canvas.width/2)/32/Core.zoom + Core.offx;
		var wy = (e.clientY - canvas.height/2)/32/Core.zoom + Core.offy;

		if (dist(wx, wy, Player.entity.x, Player.entity.y) <= 3) {
			var mindist = 1;
			var minindex;
			for (i in ClickableItem.items) {
				var item = ClickableItem.items[i];
				var d = dist(item.object.x, item.object.y, wx, wy);
				if (d < mindist) {
					mindist = d;
					minindex = i;
				};
			}
			if (minindex) {
				Player.items.push(ClickableItem.items[minindex].item);
				ClickableItem.items[minindex].object.kill();
				ClickableItem.items[minindex].tooltip.remove();
				delete ClickableItem.items[minindex];
			}
		}
	})

	var unknownicon = new Image('assets/icon/unknown.png');

	var lastid = 0;
	ClickableItem = function(item, x, y) {
		if (!item) return;
		this.item = item;
		this.tooltip = new TooltipArea(TooltipArea.createItemText(this.item));
		var i = this;
		this.object = new GameObject(item.type.icon || item.type.image || unknownicon, x, y, 0, 2*60, function(dt) {
			//(canvas.width/2 - Core.offx*32*Core.zoom)/32, (canvas.height/2 - Core.offy*32*Core.zoom)/32
			var canvas = Core.getCanvas();
			i.tooltip.resize(canvas.width/2 - (Core.offx - x)*64 - 32, canvas.height/2 - (Core.offy - y)*64 - 32, 64, 64)
		});
		this.id = lastid++;
		ClickableItem.items[this.id] = this;
	}
	ClickableItem.items = {};

	return ClickableItem;
})