function createBarChart(width, height) {
    const size = {
        width: width,
        height: height,
        margin: { top: 50, right: 50, bottom: 50, left: 50 },
        padding: 10
    };
    const svg = d3.select('#barchart-svg');

    // Create tooltip div
	const tooltip = d3.select("body").append("div")
		.attr("class", "tooltip")
		.style("opacity", 0);

    // Apply tooltip CSS
    const style = document.createElement('style');
    style.innerHTML = tooltipCSS;
    document.getElementsByTagName('head')[0].appendChild(style);

    d3.csv("injuries_2010-2020.csv").then(function(data) {
        const outForSeasonInjuries = data.filter(d => d.Notes.includes("out for season"));

        const outForSeasonByYear = d3.rollup(outForSeasonInjuries, v => v.length, d => new Date(d.Date).getFullYear());
        const aggregatedData = Array.from(outForSeasonByYear, ([year, count]) => ({ year: +year, count }));

        const xScale = d3.scaleBand()
            .domain(aggregatedData.map(d => d.year))
            .range([size.margin.left, size.width - size.margin.right])
            .padding(0.1);

        const yScale = d3.scaleLinear()
            .domain([0, d3.max(aggregatedData, d => d.count)])
            .nice()
            .range([size.height - size.margin.bottom, size.margin.top]);

        svg.selectAll("rect")
            .data(aggregatedData)
            .join("rect")
            .attr("x", d => xScale(d.year))
            .attr("y", d => yScale(d.count))
            .attr("width", xScale.bandwidth())
            .attr("height", d => size.height - size.margin.bottom - yScale(d.count))
            .attr("fill", "steelblue")
            // Add tooltip functionality
            .on("mouseover", function(event, d) {
                tooltip.transition()
                    .duration(200)
                    .style("opacity", .9);
                tooltip.html("Year: " + d.year + "<br/>" + "# of Season Ending Injuries: " + d.count)
                    .style("left", (event.pageX) + "px")
                    .style("top", (event.pageY - 28) + "px");
            })
            .on("mouseout", function(d) {
                tooltip.transition()
                    .duration(500)
                    .style("opacity", 0);
            });

        svg.append("g")
            .attr("transform", `translate(0, ${size.height - size.margin.bottom})`)
            .call(d3.axisBottom(xScale))
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-0.8em")
            .attr("dy", "-0.5em")
            .attr("transform", "rotate(-45)");

        svg.append("g")
            .attr("transform", `translate(${size.margin.left}, 0)`)
            .call(d3.axisLeft(yScale).ticks(5));

        // labels 
        svg.append("text")
            .attr("x", size.width / 2)
            .attr("y", size.height - 10)
            .attr("text-anchor", "middle")
            .text("Year");

        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("x", -size.height / 2)
            .attr("y", 15)
            .attr("text-anchor", "middle")
            .text("Number of Season Ending Injuries");

        svg.append("text")
            .attr("x", size.width / 3.2)
            .attr("y", size.margin.top - 10)
            .attr("text-anchor", "middle")
            .attr("font-size", "25")
            .text("Season Ending Injuries by Year");

    }).catch(function(error) {
        console.error("Error loading data:", error);
    });
}
