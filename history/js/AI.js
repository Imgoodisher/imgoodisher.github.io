define(['ClickableItem'], function(ClickableItem) {
	function findTarget(ai) {
		var mindist = 48;
		var minentity;
		for (i in Entity.entities) {
			var e = Entity.entities[i];

			if (e.allied == ai.entity.allied) continue;

			var d = dist(ai.entity.x, ai.entity.y, e.x, e.y)
			if (d < mindist) {
				mindist = d;
				minentity = e;
			}
		}
		ai.target = minentity;
	}

	return AI = {
		Ranged : function(spawnx, spawny, allied, ondie) {
			this.target = null;

			var ai = this;
			this.entity = new Entity(spawnx, spawny, allied, function(dt) {
				if (ai.target && ai.target.dead) delete ai.target;
				if (!ai.target) {
					findTarget(ai);
					if (!ai.target) return;
				}

				var d = dist(this.x, this.y, ai.target.x, ai.target.y)

				if (d < 0.5) {
					var a = Math.atan2(this.y-ai.target.y, this.x-ai.target.x);
					this.move(this.x+Math.cos(a), this.y+Math.sin(a), dt);
					this.weapon.use(ai.target.x, ai.target.y, this);
				} else if (d < 8) {
					this.weapon.use(ai.target.x, ai.target.y, this);
				} else {
					this.move(ai.target.x, ai.target.y, dt);
				}
			}, function() {
				var r = Math.random()*25
				if (r < 1 && this.weapon) new ClickableItem(this.weapon, this.x, this.y);
				else if (r < 2 && this.armor) new ClickableItem(this.armor, this.x, this.y);
				if (ondie) ondie();
			});
			this.entity.weapon = new Item(Item.items.bow, true);
			if (Math.random()*3<1) this.entity.armor = new Item(Item.items.platearmor, true);
		},
		Melee : function(spawnx, spawny, allied, ondie) {
			this.target = null;

			var ai = this;
			this.entity = new Entity(spawnx, spawny, allied, function(dt) {
				if (ai.target && ai.target.dead) delete ai.target;
				if (!ai.target) {
					findTarget(ai);
					if (!ai.target) return;
				}

				var d = dist(this.x, this.y, ai.target.x, ai.target.y);

				if (d < 0.5) {
					var a = Math.atan2(this.y-ai.target.y, this.x-ai.target.x);
					this.move(this.x+Math.cos(a), this.y+Math.sin(a), dt);
					this.weapon.use(ai.target.x, ai.target.y, this);
				} else if (d < 1) {
					this.weapon.use(ai.target.x, ai.target.y, this);
				} else {
					this.move(ai.target.x, ai.target.y, dt);
				}
			}, function() {
				var r = Math.random()*25
				if (r < 1) new ClickableItem(this.weapon, this.x, this.y);
				else if (r < 2) new ClickableItem(this.armor, this.x, this.y);
				if (ondie) ondie();
			})
			this.entity.weapon = new Item(Item.items.sword, true);
			if (Math.random()*3<1) this.entity.armor = new Item(Item.items.platearmor, true);
		},
	}
});