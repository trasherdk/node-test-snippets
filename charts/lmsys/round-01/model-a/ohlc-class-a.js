class OHLCChart {
	constructor (selector, data) {
		this.selector = selector; // The CSS selector for the element where the chart will be rendered
		this.data = data; // The data to be plotted
		this.margin = { top: 20, right: 20, bottom: 30, left: 50 };
		this.width = 960 - this.margin.left - this.margin.right;
		this.height = 500 - this.margin.top - this.margin.bottom;
		this.initChart();
	}

	initChart () {
		const x = techan.scale.financetime()
			.range([0, this.width]);

		const y = d3.scaleLinear()
			.range([this.height, 0]);

		const ohlc = techan.plot.ohlc()
			.xScale(x)
			.yScale(y);

		const svg = d3.select(this.selector).append("svg")
			.attr("width", this.width + this.margin.left + this.margin.right)
			.attr("height", this.height + this.margin.top + this.margin.bottom)
			.append("g")
			.attr("transform", `translate(${this.margin.left},${this.margin.top})`);

		const data = this.data.map(d => {
			console.log(JSON.stringify(d));
			return {
				date: new Date(d.time * 1000),
				open: +d.open,
				high: +d.high,
				low: +d.low,
				close: +d.close
			};
		});

		x.domain(data.map(d => d.date));
		y.domain(techan.scale.plot.ohlc(data, ohlc.accessor()).domain());

		svg.append("g")
			.datum(data)
			.attr("class", "ohlc")
			.call(ohlc);
	}
}


const fetchData = async () => {
	const Data = await fetch("https://min-api.cryptocompare.com/data/histominute?fsym=XMR&tsym=EUR&aggregate=10&e=Kraken&extraParams=test-app-v1.0")
		.then(response => response.json())
		.then(data => data.Data);

	return Data;
}
// const chart = new OHLCChart("#chart", ohlcData);
