define(['jquery', 'Core', 'Entity'], function($, Core, Entity, Tooltip) {
	var keys = {
		87:false, // w
		68:false, // a
		83:false, // s
		65:false, // d
	};
	$(window).keydown(function(e) {
		if (Core.paused) return;

		if (keys[e.which] === false) {
			keys[e.which] = true;
		}
	}).keyup(function(e) {
		if (Core.paused) return;

		if (keys[e.which] === true) {
			keys[e.which] = false;
		}
	}).click(function(e) {
		if (Core.paused) return;

		// w/2/64, (h/2-24)/32
		var canvas = Core.getCanvas();

		var itemx = canvas.width/2 - 32;
		var itemy = canvas.height - 80;

		var wx = (e.clientX - canvas.width/2)/32/Core.zoom + Core.offx;
		var wy = (e.clientY - canvas.height/2)/32/Core.zoom + Core.offy;


		if (e.clientX >= itemx && e.clientY >= itemy && e.clientX <= itemx+64 && e.clientY <= itemy+64) {
			Player.useItem(wx, wy)
		} else if (Player.entity.weapon) {
			Player.entity.weapon.use(wx, wy, Player.entity);
		}
	}).mousewheel(function(evt) {
		if (Core.paused) return;

		if (Player.items.length <= 1) return;
		Player.selectedItem += (evt.deltaY<0?1:-1);
		Player.selectedItem = Player.selectedItem.mod(Player.items.length);
	});

	return Player = {
		entity : undefined,
		items : [],
		selectedItem : 0,
		spawn : function(x, y, spawnpoints) {
			Player.entity = new Entity(x, y, true, function(dt) {
				var x = (keys[65]?-1:0)+(keys[68]?1:0);
				var y = (keys[87]?-1:0)+(keys[83]?1:0);
				this.move(this.x+x, this.y+y, dt, true);

				Core.offx = this.x;
				Core.offy = this.y;
			}, function() {
				var spawn = spawnpoints[Math.floor(Math.random()*spawnpoints.length)];
				this.x = spawn[0];
				this.y = spawn[1];
				return true;
			});
		},
		useItem : function(x, y) {
			var item = Player.items[Player.selectedItem];
			if (!item) return;
			if (item.type.type == "weapon") {
				if (Player.entity.weapon) Player.items.push(Player.entity.weapon);

				Player.entity.weapon = item;

				Player.items.splice(Player.selectedItem, 1);

			} else if (item.type.type == "armor") {
				if (Player.entity.armor) Player.items.push(Player.entity.armor);

				Player.entity.armor = item;

				Player.items.splice(Player.selectedItem, 1);

			} else {
				item.use(x, y, Player.entity);
			}
		}
	}
})