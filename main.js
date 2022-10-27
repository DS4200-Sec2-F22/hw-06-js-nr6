const FRAME_HEIGHT = 450;
const FRAME_WIDTH = 450;
const MARGINS = {left:50, right:50, top:25, bottom:25}

const VIS_HEIGHT = FRAME_HEIGHT - MARGINS.top - MARGINS.bottom;
const VIS_WIDTH = FRAME_WIDTH - MARGINS.left - MARGINS.right;

const SETOSA_COLOR = "red";
const VERSICOLOR_COLOR = "green";
const VIRGINICA_COLOR = "blue";


//frame being used for sepal length vs. petal length scatterplot
const LENGTHSCATTERFRAME = d3.select("#length_scatter")
				.append("svg")
					.attr("height", FRAME_HEIGHT)
					.attr("width", FRAME_WIDTH)
					.attr("class", "frame");

//frame being used for sepal width vs. petal width scatterplot
const WIDTHSCATTERFRAME = d3.select("#width_scatter")
				.append("svg")
					.attr("height", FRAME_HEIGHT)
					.attr("width", FRAME_WIDTH)
					.attr("class", "frame");

//frame being used for species bar plot
const BARFRAME = d3.select("#bar_vis")
				.append("svg")
					.attr("height", FRAME_HEIGHT)
					.attr("width", FRAME_WIDTH)
					.attr("class", "frame");


//scale for x-axis of length scatterplot
const SEPAL_LENGTH_SCALE = d3.scaleLinear()
						.domain([4, 8])
						.range([0, VIS_WIDTH]);

//scale for y-axis of length scatterplot
const PETAL_LENGTH_SCALE = d3.scaleLinear()
						.domain([0, 8.2]) //listed in descending order to properly visualize
						.range([VIS_HEIGHT, 0]);


//scale for x-axis of width scatterplot
const SEPAL_WIDTH_SCALE = d3.scaleLinear()
						.domain([1.5, 4.5])
						.range([0, VIS_WIDTH]);

//scale for y-axis of width scatterplot
const PETAL_WIDTH_SCALE = d3.scaleLinear()
						.domain([0, 3.2]) //listed in descending order to properly visualize
						.range([VIS_HEIGHT, 0]);


// Color scale: give me a species name, I return a color
const COLOR_SCALE = d3.scaleOrdinal()
    .domain(["setosa", "versicolor", "virginica" ])
    .range([SETOSA_COLOR, VERSICOLOR_COLOR, VIRGINICA_COLOR]);



//x-scale for bar chart
const X_SCALE_BAR = d3.scaleBand()
  .domain(["setosa", "versicolor", "virginica"])
  .range([0, (VIS_WIDTH)])

//y-scale for bar chart
const Y_SCALE_BAR = d3.scaleLinear()
		.domain([0, 59])
	    .range([0, VIS_HEIGHT]);

//scale for bar chart y-axis
const Y_SCALE_BAR_AXIS = d3.scaleLinear()
		.domain([0, 59])
	    .range([VIS_HEIGHT, 0]);

const BAR_WIDTH = VIS_WIDTH / 4

d3.csv("data/iris.csv").then((data) => {
	//appending length points 
	let lengthscatter = LENGTHSCATTERFRAME.selectAll("circle")
			.data(data)
			.enter()
			.append("circle")
				.attr("cx", (d) => {return SEPAL_LENGTH_SCALE(d.Sepal_Length) + MARGINS.left;})
				.attr("cy", (d) => {return PETAL_LENGTH_SCALE(d.Petal_Length);})
				.attr("r", 5)
				.attr("class", "point")
				.attr("data-x", (d) => {return d.Sepal_Length;})
				.attr("data-y", (d) => {return d.Petal_Length;})
				.style("fill",  (d) => { return COLOR_SCALE(d.Species);})
				.style("opacity", 0.5);

	//visualizing x axis for length scatterplot
	LENGTHSCATTERFRAME.append("g")
			.attr("transform", "translate(" + MARGINS.left + "," + (VIS_HEIGHT) + ")")
			.call(d3.axisBottom(SEPAL_LENGTH_SCALE).ticks(9))
			.attr("font-size", "20px");

	//visualizing y axis for length scatterplot
	LENGTHSCATTERFRAME.append("g")
			.attr("transform", "translate(" + MARGINS.left + "," + 0 + ")")
			.call(d3.axisLeft(PETAL_LENGTH_SCALE).ticks(7))
			.attr("font-size", "20px");

	//appending width points 
	let widthscatter = WIDTHSCATTERFRAME.selectAll("circle")
			.data(data)
			.enter()
			.append("circle")
				.attr("cx", (d) => {return SEPAL_WIDTH_SCALE(d.Sepal_Width) + MARGINS.left;})
				.attr("cy", (d) => {return PETAL_WIDTH_SCALE(d.Petal_Width);})
				.attr("r", 5)
				.attr("class", "point")
				.attr("data-x", (d) => {return d.Sepal_Width})
				.attr("data-y", (d) => {return d.Petal_Width})
				.style("fill",  (d) => {return COLOR_SCALE(d.Species)})
				.style("opacity", 0.5);
	
	//visualizing x axis for width scatterplot
	WIDTHSCATTERFRAME.append("g")
			.attr("transform", "translate(" + MARGINS.left + "," + (VIS_HEIGHT) + ")")
			.call(d3.axisBottom(SEPAL_WIDTH_SCALE).ticks(9))
			.attr("font-size", "20px");

	//visualizing y axis for width scatterplot
	WIDTHSCATTERFRAME.append("g")
			.attr("transform", "translate(" + MARGINS.left + "," + 0 + ")")
			.call(d3.axisLeft(PETAL_WIDTH_SCALE).ticks(7))
			.attr("font-size", "20px");


	//add brushing
	WIDTHSCATTERFRAME.call( d3.brush()                 // Add the brush feature using the d3.brush function
	      .extent( [ [0,0], [FRAME_WIDTH,FRAME_HEIGHT] ] ) // initialise the brush area: start at 0,0 and finishes at width,height: it means I select the whole graph area
	      .on("start brush", updateChart) // Each time the brush selection changes, trigger the 'updateChart' function
	    )

	  // Function that is triggered when brushing is performed
	  function updateChart() {
	    extent = d3.brushSelection(this);
	    console.log(extent);
	    lengthscatter.classed("selected", (d) => {
	    	return isBrushed(extent, SEPAL_WIDTH_SCALE(d.Sepal_Width) + MARGINS.left, PETAL_WIDTH_SCALE(d.Petal_Width)); } )
	    widthscatter.classed("selected", (d) => {
	    	return isBrushed(extent, SEPAL_WIDTH_SCALE(d.Sepal_Width) + MARGINS.left, PETAL_WIDTH_SCALE(d.Petal_Width)); } )
	    
	  }

	   // A function that return TRUE or FALSE according if a dot is in the selection or not
	  function isBrushed(brush_coords, cx, cy) {
	       var x0 = brush_coords[0][0],
	           x1 = brush_coords[1][0],
	           y0 = brush_coords[0][1],
	           y1 = brush_coords[1][1];
	      return x0 <= cx && cx <= x1 && y0 <= cy && cy <= y1;    // This return TRUE or FALSE depending on if the points is in the selected area
	  }

	let setosa_count = 0;
	let versicolor_count = 0;
	let virginica_count = 0;

	for (d of data) {
		switch (d.Species) {
			case "setosa":
				setosa_count++;
				break;
			case "versicolor":
				versicolor_count++;
				break;
			case "virginica":
				virginica_count++;
				break;
		}
	}
	console.log(setosa_count);
	console.log(versicolor_count);
	console.log(virginica_count);


	BARFRAME.append("rect")
                .attr("x", MARGINS.left*1.4)
                .attr("y", FRAME_HEIGHT - MARGINS.bottom*2 - Y_SCALE_BAR(setosa_count))
                .attr("width", BAR_WIDTH)
                .attr("height", Y_SCALE_BAR(setosa_count))
                .attr("class", "bar")
                .style("fill", SETOSA_COLOR)
                .style("opacity", 0.5);
	BARFRAME.append("rect")
                .attr("x", 1.25 * BAR_WIDTH + MARGINS.left*1.5)
                .attr("y", FRAME_HEIGHT - MARGINS.bottom*2 - Y_SCALE_BAR(versicolor_count))
                .attr("width", BAR_WIDTH)
                .attr("height", Y_SCALE_BAR(versicolor_count))
                .attr("class", "bar")
                .style("fill", VERSICOLOR_COLOR)
                .style("opacity", 0.5);
	BARFRAME.append("rect")
                .attr("x", 2.5 * BAR_WIDTH + MARGINS.left*1.6)
                .attr("y", FRAME_HEIGHT - MARGINS.bottom*2 - Y_SCALE_BAR(virginica_count))
                .attr("width", BAR_WIDTH)
                .attr("height", Y_SCALE_BAR(virginica_count))
                .attr("class", "bar")
                .style("fill", VIRGINICA_COLOR)
                .style("opacity", 0.5);

    //adding x-axis
    BARFRAME.append("g")
        .attr("transform", 
              "translate(" + MARGINS.left + "," + VIS_HEIGHT + ")")
        .call(d3.axisBottom(X_SCALE_BAR).ticks(7))
            .attr("font-size", "20px");

    //adding y-axis
    BARFRAME.append("g")
    	.attr("transform",
    			"translate(" + MARGINS.left + "," + "0" + ")")
    	.call(d3.axisLeft(Y_SCALE_BAR_AXIS).ticks(10))
            .attr("font-size", "20px");
			
});



