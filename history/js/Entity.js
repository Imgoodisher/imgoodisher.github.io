define(['Core', 'Map', 'SimpleImage', 'Items'], function(Core, Map, Image, Items) {
	character = new Image("assets/character.png");

	var nextid = 0;

	Entity = function(spawnx, spawny, allied, onupdate, ondie){
		this.x = spawnx+0.5;
		this.y = spawny+0.5;
		this.angle = 0;
		this.allied = allied;
		this.onupdate = onupdate && onupdate.bind(this);
		this.ondie = ondie && ondie.bind(this);

		this.stats = {
			STR:1,
			AGI:1,
			DEF:1,
			INT:1,
		}
		this.health = 25;

		this.armor = null;
		this.weapon = null;

		this.id = nextid++;
		Entity.entities[this.id] = this;
	}

	Entity.prototype.getStat = function(name) {
		var stat = (this.stats[name] || 0) + (this.armor && this.armor.stats[name] ? this.armor.stats[name] : 0) + (this.weapon && this.weapon.stats[name] ? this.weapon.stats[name] : 0)
		if (name != "INT") stat *= 1+(this.getStat("INT")*0.1)
		return stat;
	}
	Entity.prototype.damage = function(amount) {
		this.health -= amount / (1 + this.getStat("DEF")*0.4);
		if (this.health <= 0) {
			if (this.ondie && this.ondie()) {
				this.health = 25;
			} else {
				this.dead = true;
				delete Entity.entities[this.id];
			}
		}
	}
	Entity.prototype.useItem = function(id) {
		item = this.items[id];
		if (!item) {console.warn("invalid item "+id); return;}
		switch(item.type) {
			case "weapon":
				this.weapon = item;
				break;
			case "armor":
				this.armor = item;
				break;
			default:
				item.use();
		}
	}


	Entity.prototype.move = function(x, y, dt) {
		if (x == this.x && y == this.y) return;

		var speed = 2+(this.getStat("AGI")*0.2);
		this.angle = Math.atan2(y-this.y, x-this.x);
		this.x += Math.cos(this.angle)*speed*dt;
		this.y += Math.sin(this.angle)*speed*dt;

		if (Math.atan2(y-this.y, x-this.x) == this.angle + Math.PI) {
			this.x = x; this.y = y;
		}
	}


	Entity.prototype.draw = function(ctx, canvas) {
		if (this.armor && this.armor.type.image) {
			this.armor.type.image.draw(ctx, this.x, this.y, this.angle)
		} else {
			character.draw(ctx, this.x, this.y, this.angle)
		}

		ctx.fillStyle = (this.allied ? "#080" : "#800");
		ctx.fillRect(this.x*32 - 12, this.y*32 - 20, 24, 2);
		ctx.fillStyle = (this.allied ? "#0f0" : "#f00");
		ctx.fillRect(this.x*32 - 12, this.y*32 - 20, 24*(this.health/25), 2);
	}
	Entity.prototype.update = function(dt) {
		this.health = Math.min(this.health+dt*(1+this.getStat("INT")/4), 25);
		if (this.onupdate) this.onupdate(dt);
	}
	

	Entity.entities = {};


	Entity.addLayer = function() {
		Core.addLayer({
			id:"Entity",
			draw:function(ctx, canvas) {
				for (var i in Entity.entities) {
					Entity.entities[i].draw(ctx, canvas);
				}
			},
			update:function(dt) {
				for (var i in Entity.entities) {
					Entity.entities[i].update(dt);
				}
			},
		})
	}

	return Entity;
})