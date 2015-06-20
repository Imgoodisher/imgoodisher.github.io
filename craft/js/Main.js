requirejs.config({
	baseURL: "js",
	paths: {
		jquery: "../lib/jquery",
		lib_svg: "../lib/svg.min"
	}
})

requirejs(["NodeType"], function(createNodeType) {

	noop_node = createNodeType({
		speed : 1,
		numOutputs : 1,
		process : function() {
			this.inputBuffer.transferTo(this.outputBuffers[0]);
		}
	});

	$(function() {

		n1 = new noop_node();
		n2 = new noop_node();

		n1.svg.move(20, 20);
		n2.svg.move(300, 200);

		n1.connect(0, n2);
		
	})


});