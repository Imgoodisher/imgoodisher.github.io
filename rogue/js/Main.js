requirejs.config({
	baseURL: "js",
	paths: {
		jquery: "../lib/jquery"
	}
})

requirejs(["Unicode", "TextArea", "Map"], function(_U, _TextArea, _Map) {
	U = _U;
	TextArea = _TextArea;
	Map = _Map;

	a = new Map();
	a.area.setChar(0, 0, U.box.s.n.s.n);
	a.area.setChar(0, 1, U.box.s.d.s.n);
	a.area.setChar(0, 2, U.box.s.n.s.n);
	a.area.setChar(0, 3, U.box.s.n.s.n);
	a.area.setChar(1, 1, U.box.n.d.n.d);
	a.area.setChar(2, 1, U.box.n.d.n.d);
	a.area.setChar(5, 5, U.block.full);

	vibrate = function() {
		var angle = 0.02;
		function vibrate_step() {
			a.area.rotate(angle)
			angle *= -0.9

			if (Math.abs(angle) < 0.001) {
				a.area.rotate(0);
			} else {
				setTimeout(vibrate_step, 50)
			}
		}
		setTimeout(vibrate_step, 50)
	}

	vibrate2 = function(maxpower, duration) {
		var pos = a.area.getPos();
		var start = Date.now();
		function vibrate_step() {
			power = maxpower * (1-(Date.now()-start)/duration);
			a.area.translate(
				pos.x + Math.cos(Math.random()*2*Math.PI)*power,
				pos.y + Math.sin(Math.random()*2*Math.PI)*power
			)

			if (Date.now() >= start+duration) {
				a.area.translate(pos.x, pos.y)
			} else {
				setTimeout(vibrate_step, 50);
			}
		}
		setTimeout(vibrate_step, 50);
	}
});