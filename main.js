const FRAME_HEIGHT = 500;
const FRAME_WIDTH = 500;
const MARGINS = {left:50, right:50, top:25, bottom:25}

const VIS_HEIGHT = FRAME_HEIGHT - MARGINS.top - MARGINS.bottom;
const VIS_WIDTH = FRAME_WIDTH - MARGINS.left - MARGINS.right;

//frame being used for sepal length vs. petal length scatterplot
const LENGTHSCATTERFRAME = d3.select("#length_scatter")
				.append("svg")
					.attr("height", FRAME_HEIGHT)
					.attr("width", FRAME_WIDTH)
					.attr("class", "frame");
/*
//frame being used for sepal width vs. petal width scatterplot
const WIDTHSCATTERFRAME = d3.select("#width_scatter")
				.append("svg")
					.attr("height", FRAME_HEIGHT)
					.attr("width", FRAME_WIDTH)
					.attr("class", "frame");
*/

//scale for x-axis of length scatterplot
const SEPAL_LENGTH_SCALE = d3.scaleLinear()
						.domain([4, 8])
						.range([0, VIS_WIDTH]);

//scale for y-axis of length scatterplot
const PETAL_LENGTH_SCALE = d3.scaleLinear()
						.domain([0, 9]) //listed in descending order to properly visualize
						.range([VIS_HEIGHT, 0]);

/*
//scale for x-axis of width scatterplot
const SEPAL_WIDTH_SCALE = d3.scaleLinear()
						.domain([2, 4])
						.range([0, VIS_WIDTH]);

//scale for y-axis of width scatterplot
const PETAL_WIDTH_SCALE = d3.scaleLinear()
						.domain([0, 3]) //listed in descending order to properly visualize
						.range([VIS_HEIGHT, 0]);

// Color scale: give me a species name, I return a color
const COLOR_SCALE = d3.scaleOrdinal()
    .domain(["setosa", "versicolor", "virginica" ])
    .range(["red", "green", "blue"]);

*/

d3.csv("data/iris.csv").then((data) => {
	//appending length points 
	LENGTHSCATTERFRAME.selectAll("circle")
			.data(data)
			.enter()
			.append("circle")
				.attr("cx", (d) => {return SEPAL_LENGTH_SCALE(d.Sepal_Length) + MARGINS.left;})
				.attr("cy", (d) => {return PETAL_LENGTH_SCALE(d.Petal_Length);})
				.attr("r", 10)
				.attr("class", "point")
				.attr("data-x", (d) => {return d.Sepal_Length;})
				.attr("data-y", (d) => {return d.Petal_Length;});
				//.style("fill",  (d) => { return COLOR_SCALE(d.Species);});
/*
	//appending width points 
	WIDTHSCATTERFRAME.selectAll("circle")
			.data(data)
			.enter()
			.append("circle")
				.attr("cx", (d) => {return SEPAL_WIDTH_SCALE(d.Sepal_Width) + MARGINS.left;})
				.attr("cy", (d) => {return PETAL_WIDTH_SCALE(d.Petal_Width);})
				.attr("r", 10)
				.attr("class", "point")
				.attr("data-x", (d) => {return d.Sepal_Width})
				.attr("data-y", (d) => {return d.Petal_Width})
				.style("fill",  (d) => {return COLOR_SCALE(d.Species)});
				*/
});