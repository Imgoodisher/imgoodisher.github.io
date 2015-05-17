define(['jquery', 'Core', 'SimpleImage', 'Player', 'Tooltip', 'js/lib/jquery.mousewheel.min.js'], function($, Core, Image, Player, TooltipArea) {
	Number.prototype.mod = function(n) {
		return ((this%n)+n)%n;
	}

	tooltip_inv = new TooltipArea(function() {
		var item = Player.items[Player.selectedItem];
		if (item) {
			var compitem = (item.type.type == "weapon" ? Player.entity.weapon : (item.type.type == "armor" ? Player.entity.armor : null));
			return TooltipArea.createItemText(item, compitem);
		} else {
			return false;
		}
	})
	tooltip_weapon = new TooltipArea(function() {
		if (Player.entity.weapon) return TooltipArea.createItemText(Player.entity.weapon);
		else return false;
	})
	tooltip_armor = new TooltipArea(function() {
		if (Player.entity.armor) return TooltipArea.createItemText(Player.entity.armor);
		else return false;
	})

	$(tooltip_inv.element).mousewheel(function() {
		setTimeout(tooltip_inv.refreshText.bind(tooltip_inv),0);
	}).click(function() {
		setTimeout(tooltip_inv.refreshText.bind(tooltip_inv),0);
	})

	var background = new Image('assets/icon/background.png');
	var unknownicon = new Image('assets/icon/unknown.png');
	return Gui = {
		addLayer : function() {
			Core.addLayer({
				id:"Gui",
				draw:function(ctx, canvas) {
					ctx.save();

					ctx.setTransform(2, 0, 0, 2, 0, 0);
					var w = canvas.width / 2;
					var h = canvas.height / 2;

					background.draw(ctx, w/64, (h-24)/32);

					tooltip_inv.resize(canvas.width/2 - 32, canvas.height - 80, 64, 64);
					tooltip_weapon.resize(canvas.width/2 - 80, canvas.height - 160, 64, 64);
					tooltip_armor.resize(canvas.width/2 + 16, canvas.height - 160, 64, 64);

					if (Player.items.length != 0) {
						if (!Player.items[Player.selectedItem]) Player.selectedItem%=Player.items.length;
						var item = Player.items[Player.selectedItem];
						var img = (item.type.icon || item.type.image || unknownicon)
						img.draw(ctx, w/64, (h-24)/32)

						if (Player.items.length != 1) {
							var nextitem = Player.items[(Player.selectedItem+1).mod(Player.items.length)];
							var nextimg = (nextitem.type.icon || nextitem.type.image || unknownicon);
							nextimg.draw(ctx, (w/2+48)/32, (h-24)/32)

							var previtem = Player.items[(Player.selectedItem-1).mod(Player.items.length)];
							var previmg = (previtem.type.icon || previtem.type.image || unknownicon);
							previmg.draw(ctx, (w/2-48)/32, (h-24)/32)
						}
					}

					background.draw(ctx, (w/2-24)/32, (h-64)/32);
					if (Player.entity.weapon) {
						var item = Player.entity.weapon;
						var img = (item.type.icon || item.type.image || unknownicon);
						img.draw(ctx, (w/2-24)/32, (h-64)/32)
					}

					background.draw(ctx, (w/2+24)/32, (h-64)/32);
					if (Player.entity.armor) {
						var item = Player.entity.armor;
						var img = (item.type.icon || item.type.image || unknownicon);
						img.draw(ctx, (w/2+24)/32, (h-64)/32)
					}

					ctx.restore();
				}
			})
		}
	}
})