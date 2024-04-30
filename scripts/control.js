new (class Control {
	constructor() {
		const root = d3.select('body').append('div')
		.style('width', '96vw')
		.style('height', '60vw')

		this.viewA = new ViewA(this, root);
		this.viewB = new ViewB(this, root);
		this.viewC = new ViewC(this, root);
	}

	Test(str) {
		console.log(str);
	}

	Click(msg) {
		this.viewA.Method(msg);
		this.viewB.Method(msg);
		this.viewC.Method(msg);
	}
})()

