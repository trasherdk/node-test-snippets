class OHLCChart {
	constructor (selector) {
		this.selector = selector;
		this.margin = { top: 20, right: 20, bottom: 30, left: 50 };
		this.width = document.querySelector(selector).clientWidth - this.margin.left - this.margin.right;
		this.height = document.querySelector(selector).clientHeight - this.margin.top - this.margin.bottom;

		this.svg = d3.select(selector).append("svg")
			.attr("width", this.width + this.margin.left + this.margin.right)
			.attr("height", this.height + this.margin.top + this.margin.bottom)
			.append("g")
			.attr("transform", `translate(${this.margin.left},${this.margin.top})`);

		this.x = d3.scaleTime().range([0, this.width]);
		this.y = d3.scaleLinear().range([this.height, 0]);

		this.ohlc = techan.plot.ohlc()
			.xScale(this.x)
			.yScale(this.y);

		this.xAxis = d3.axisBottom(this.x);
		this.yAxis = d3.axisLeft(this.y);
	}

	setData (data) {
		// Parse dates and numbers. We assume data is an array of { date, open, high, low, close }.
		const parseDate = d3.timeParse("%d-%b-%y");
		data.forEach(d => {
			d.date = parseDate(d.date);
			d.open = +d.open;
			d.high = +d.high;
			d.low = +d.low;
			d.close = +d.close;
		});

		// Set the scale domains
		this.x.domain(d3.extent(data, d => d.date));
		this.y.domain([d3.min(data, d => d.low), d3.max(data, d => d.high)]);

		// Add the OHLC elements
		this.svg.selectAll("g.ohlc").data([data]).enter()
			.append("g")
			.attr("class", "ohlc")
			.call(this.ohlc);

		// Add the X-axis
		this.svg.append("g")
			.attr("class", "axis axis--x")
			.attr("transform", `translate(0,${this.height})`)
			.call(this.xAxis);

		// Add the Y-axis
		this.svg.append("g")
			.attr("class", "axis axis--y")
			.call(this.yAxis);
	}
}

// Usage example
const chart = new OHLCChart("#chart");
const sampleData = [
	{ date: "24-Apr-07", open: 93.24, high: 95.35, low: 93.23, close: 95.00 },
	// ... more data points
];

chart.setData(sampleData);
