define(['SimpleImage', 'GameObject'], function(Image, GameObject) {
	Item = function(type, modify) {
		this.stats = {STR:0, AGI:0, DEF:0, INT:0}
		this.name = type.name;
		this.type = type;
		this.lastuse = 0;

		for (i in type.stats) {
			this.stats[i] += type.stats[i];
		}

		if (modify) {
			var modifier;
			if (typeof modify == "number") {
				modifier = Item.modifiers[modify]
			} else {
				modifier = Item.modifiers[Math.floor(Math.random()*Item.modifiers.length)];
			}
			this.name = modifier.name.replace("$", this.name);
			for (i in modifier.stats) {
				this.stats[i] += modifier.stats[i];
			} 
		}
	}
	Item.prototype.use = function(x, y, entity) {
		if (this.type.use) {
			var now = Date.now();
			if (now-this.lastuse > this.type.cd) {
				this.lastuse = now;
				this.type.use.call(this, x, y, entity);
			}
		}
	}



	function useSword(x, y, entity) {
		var damage = entity.getStat("STR");
		var a = entity.angle = Math.atan2(y-entity.y, x-entity.x);

		var sx = entity.x + Math.cos(a)*0.65;
		var sy = entity.y + Math.sin(a)*0.65;

		for (var i in Entity.entities) {
			var e = Entity.entities[i];
			if (e.allied != entity.allied && Math.sqrt( Math.pow(e.x-sx, 2) + Math.pow(e.y-sy, 2) ) < 0.75) {
				e.damage(damage);
			}
		}

		new GameObject(this.type.image, sx, sy, a, 0.5, function(dt) {
			this.x = entity.x + Math.cos(a)*0.65;
			this.y = entity.y + Math.sin(a)*0.65;
		});
	}
	function useBow(x, y, entity) {
		var damage = entity.getStat("AGI")*0.75 + entity.getStat("STR")*0.2;
		var a = entity.angle = Math.atan2(y-entity.y, x-entity.x);

		var spread = 0.4/entity.getStat("AGI");
		a += Math.random()*spread - spread/2;

		new GameObject(this.type.image, entity.x + Math.cos(a)*0.3, entity.y + Math.sin(a)*0.3, a, 0.75, function(dt) {
			this.x = entity.x + Math.cos(a)*0.3;
			this.y = entity.y + Math.sin(a)*0.3;
		});

		new GameObject(this.type.altimg, entity.x + Math.cos(a)*0.35, entity.y + Math.sin(a)*0.35, a, 3, function(dt) {
			this.x += Math.cos(a)*dt*8;
			this.y += Math.sin(a)*dt*8;

			for (var i in Entity.entities) {
				var e = Entity.entities[i];
				if (e.allied != entity.allied && Math.sqrt( Math.pow(e.x-this.x, 2) + Math.pow(e.y-this.y, 2) ) < 0.3) {
					e.damage(damage);
					this.kill();
					return;
				}
			}
		});
	}



	Item.items = {
		sword:{
			name : "Sword",
			type : "weapon",
			stats : {
				STR : 6,
				DEF : 4,
			},
			cd : 500,
			image : new Image('assets/weapon/sword.png'),
			use : useSword,
		},
		bow:{
			name : "Bow",
			type : "weapon",
			stats : {
				AGI : 6,
				STR : 2,
			},
			cd : 750,
			image : new Image('assets/weapon/bow.png'),
			altimg : new Image('assets/weapon/arrow.png'),
			use : useBow,
		},
		platearmor:{
			name : "Plate Armor",
			type : "armor",
			stats : {
				DEF : 4,
			},
			image : new Image('assets/armor/plate.png'),
			icon : new Image('assets/icon/platearmor.png'),
		}
	};

	Item.modifiers = [
		{ // Chance of no modifier even if set to modify
			name : "$",
			stats : {},
		},
		{
			name : "Strong $",
			stats : {
				STR : 1,
			}
		},
		{
			name : "Agile $",
			stats : {
				AGI : 1,
			}
		},
		{
			name : "Fortified $",
			stats : {
				DEF : 1,
			}
		},
		{
			name : "Intelligent $",
			stats : {
				INT : 1,
			}
		},
		{
			name : "$ of the Marksman",
			stats : {
				AGI : 2,
				STR : 1,
			}
		},
		{
			name : "$ of the Warrior",
			stats : {
				STR : 2,
				DEF : 1,
			}
		}
	]

	return Item
})