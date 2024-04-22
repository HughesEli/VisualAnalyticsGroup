
function createLineGraph(width, height) {
    const size = {
        width: width,
        height: height,
        margin: 80,
        padding: 10
    };
    const svg = d3.select('#linegraph-svg');

    d3.csv("injuries_2010-2020.csv").then(function(data) {
        const injuriesByYear = d3.rollup(data, v => v.length, d => new Date(d.Date).getFullYear());
        const aggregatedData = Array.from(injuriesByYear, ([year, count]) => ({ year: +year, count }));

        const xScale = d3.scaleLinear()
            .domain(d3.extent(aggregatedData, d => d.year))
            .range([size.margin, size.width - size.margin]);

        const yScale = d3.scaleLinear()
            .domain([0, d3.max(aggregatedData, d => d.count)])
            .range([size.height - size.margin, size.margin]);

        const line = d3.line()
            .x(d => xScale(d.year))
            .y(d => yScale(d.count));

        svg.append("path")
            .datum(aggregatedData)
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-width", 2)
            .attr("d", line);

        svg.append("g")
            .attr("transform", `translate(0, ${size.height - size.margin})`)
            .call(d3.axisBottom(xScale).ticks(10).tickFormat(d3.format("d")));

        svg.append("g")
            .attr("transform", `translate(${size.margin}, 0)`)
            .call(d3.axisLeft(yScale));

        // labels 
        svg.append("text")
            .attr("x", size.width / 2)
            .attr("y", size.height - 45)
            .attr("text-anchor", "middle")
            .text("Year");

        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("x", -size.height / 2)
            .attr("y", 35)
            .attr("text-anchor", "middle")
            .text("Number of Injuries");

        svg.append("text")
            .attr("x", size.margin + 10)
            .attr("y", size.margin - 10)
            .attr("text-anchor", "start")
            .attr("font-size", "25")
            .text("NBA Player Injuries");

    }).catch(function(error) {
        console.error("Error loading data:", error);
    });
}
