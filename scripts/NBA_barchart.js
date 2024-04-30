// Function to create a bar chart
function createBarChart(width, height) {
    // Define the size of the chart and margins
    const size = {
        width: width,
        height: height,
        margin: { top: 50, right: 50, bottom: 50, left: 50 },
        padding: 10
    };
    
    // Select the SVG element to draw the chart
    const svg = d3.select('#barchart-svg');

    // Load data from CSV file
    d3.csv("injuries_2010-2020.csv").then(function(data) {
        // Filter data for injuries that resulted in being out for the season
        const outForSeasonInjuries = data.filter(d => d.Notes.includes("out for season"));

        // Aggregate the count of injuries by year
        const outForSeasonByYear = d3.rollup(outForSeasonInjuries, v => v.length, d => new Date(d.Date).getFullYear());
        const aggregatedData = Array.from(outForSeasonByYear, ([year, count]) => ({ year: +year, count }));

        // Create x and y scales
        const xScale = d3.scaleBand()
            .domain(aggregatedData.map(d => d.year))
            .range([size.margin.left, size.width - size.margin.right])
            .padding(0.1);

        const yScale = d3.scaleLinear()
            .domain([0, d3.max(aggregatedData, d => d.count)])
            .nice()
			.range([size.height - size.margin.bottom, size.margin.top]);
		
		let boolPieChart = false;

        // Draw bars
        svg.selectAll("rect")
            .data(aggregatedData)
            .join("rect")
            .attr("x", d => xScale(d.year))
            .attr("y", d => yScale(d.count))
            .attr("width", xScale.bandwidth())
            .attr("height", d => size.height - size.margin.bottom - yScale(d.count))
			.attr("fill", "steelblue")
			.on("click", function (event, d) {
				if (!boolPieChart)
				{
					d3.select(this).attr("fill", "red");
					removePieChart();
					// Code a way to send the year to the piechart
					createPieChart(700, 500, d.year);
					boolPieChart = true;
				}
				else
				{
					d3.select(this).attr("fill", "steelblue");
					removePieChart();
					createPieChart(700, 500, 0);
					boolPieChart = false;	
				}
			})
            .on("mouseover", function(event, d) {
                // Show tooltip on mouseover
                const tooltip = svg.append("text")
                    .attr("class", "tooltip")
                    .attr("x", xScale(d.year) + xScale.bandwidth() / 2)
                    .attr("y", yScale(d.count) - 5)
                    .attr("text-anchor", "middle")
                    .text(d.count)
                    .style("font-weight", "bold");
            })
            .on("mouseout", function(event, d) {
                // Remove tooltip on mouseout
				svg.select(".tooltip").remove();
            });

        // Draw x-axis
        svg.append("g")
            .attr("transform", `translate(0, ${size.height - size.margin.bottom})`)
            .call(d3.axisBottom(xScale))
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-0.8em")
            .attr("dy", "-0.5em")
            .attr("transform", "rotate(-45)");

        // Draw y-axis
        svg.append("g")
            .attr("transform", `translate(${size.margin.left}, 0)`)
            .call(d3.axisLeft(yScale).ticks(5));

        // Add x-axis label
        svg.append("text")
            .attr("x", size.width / 2)
            .attr("y", size.height - 10)
            .attr("text-anchor", "middle")
            .text("Year");

        // Add y-axis label
        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("x", -size.height / 2)
            .attr("y", 15)
            .attr("text-anchor", "middle")
            .text("Number of Season Ending Injuries");

        // Add chart title
        svg.append("text")
            .attr("x", size.width / 3.2)
            .attr("y", size.margin.top - 10)
            .attr("text-anchor", "middle")
            .attr("font-size", "25")
            .text("Season Ending Injuries by Year");

    }).catch(function(error) {
        // Handle errors in data loading
        console.error("Error loading data:", error);
    });
}
