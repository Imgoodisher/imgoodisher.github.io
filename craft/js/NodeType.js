define(["jquery", "SVG", "Container"], function($, svg, Container) {

	function createNodeType(opt) {
		Node = function() {
			this.speed = opt.speed || 1000;
			this.lastProcess = Date.now();

			this.inputBuffer = new Container();
			this.outputBuffers = [];
			this.inputs = [];
			this.connections = [];

			for (var i=0; i<opt.numOutputs; i++) {
				this.outputBuffers.push(new Container());
			}


			this.svg = svg.group().addClass("node");

			this.svg.rect(100, 50*Math.max(1, this.outputBuffers.length)).radius(5).addClass("nodeBody").x(10);
			
			for (var i=0; i<opt.numOutputs; i++) {
				this.svg.path("").addClass("connection");
				this.svg.rect(10, 10).addClass("nodeOutput").move(110, 20 + i*50);
			}			
			this.svg.rect(10, 10).addClass("nodeInput").y(20);

			if (opt.createElement) opt.createElement(this.svg);
		}
		Node.prototype = {
			process : function(dt) {
				var processTimes = Math.floor((Date.now()-this.lastProcess)/this.speed);
				if (processTimes > 0) opt.process.call(this, processTimes);
			},
			transfer : function() {
				for (i=0; i<this.outputBuffers.length; i++) {
					if (this.connections[i]) {
						this.outputBuffers[i].transferTo(this.connections[i].inputBuffer);
					}
				}
			}.
			connect : function(output, node) {
				this.connections[output] = node;
				node.inputs.push([this, output]);
				this.updateOutputPath(output);
			},
			disconnect : function(output) {
				var node = this.connections[output];
				// remove this node from the list of the connected node's inputs
				for (var i=0; i<node.inputs.length; i++) {
					if (node.inputs[i][0] == this && node.inputs[i][1] == output) {
						node.inputs.splice(i, 1);
					}
				}
				// remove the connected node from this node's outputs
				delete this.connections[output];
				this.updateOutputPath(output);
			},
			updateOutputPath : function(output) {
				var node = this.connections[output];

				var path = $(this.svg.node).children(".connection")[output].instance;
				if (!node) {
					path.plot("");
					return;
				}

				var con1 = $(this.svg.node).children(".nodeOutput")[output].instance,
					con2 = $(node.svg.node).children(".nodeInput")[0].instance;

				var x1 = con1.x() + 5,
					y1 = con1.y() + 5,
					x2 = node.svg.x() + con2.x() + 5 - this.svg.x(),
					y2 = node.svg.y() + con2.y() + 5 - this.svg.y();

				path.plot("M "+x1+" "+y1+" C "+(x1+(x2-x1)/2)+" "+y1+" "+(x1+(x2-x1)/2)+" "+y2+" "+x2+" "+y2);
			},
			move : function(x, y) {
				this.svg.move(x, y);
				for (var i=0; i<this.outputBuffers.length; i++) {
					this.updateOutputPath(i);
				}
				for (var i=0; i<this.inputs.length; i++) {
					this.inputs[i][0].updateOutputPath(this.inputs[i][1]);
				}
			}
		}

		return Node;
	}

	return createNodeType;

});