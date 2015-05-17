define(['Core'], function(Core) {
	var lastid = 0;
	GameObject = function(img, x, y, r, life, update) {
		this.img = img;
		this.x = x;
		this.y = y;
		this.r = r;
		this.onupdate = update;
		this.id = lastid++;
		this.life = life;
		GameObject.objects[this.id] = this;
	}
	GameObject.prototype.draw = function(ctx, canvas) {
		this.img.draw(ctx, this.x, this.y, this.r||0);
	}
	GameObject.prototype.update = function(dt) {
		if (this.life) {
			this.life -= dt;
			if (this.life <= 0) {
				this.kill();
			} else if (this.onupdate) {
				this.onupdate(dt);
			}
		} else if (this.onupdate) {
			this.onupdate(dt);
		}
	}
	GameObject.prototype.kill = function() {
		delete GameObject.objects[this.id];
	}

	GameObject.objects = {};
	GameObject.draw = function(ctx, canvas) {
		for (var i in GameObject.objects) {
			GameObject.objects[i].draw(ctx, canvas);
		}
	}
	GameObject.update = function(dt) {
		for (var i in GameObject.objects) {
			if (GameObject.objects[i].update) GameObject.objects[i].update(dt);
		}
	}

	GameObject.addLayer = function() {
		Core.addLayer({
			id:"GameObject",
			draw:GameObject.draw,
			update:GameObject.update,
		})
	}

	return GameObject;
})