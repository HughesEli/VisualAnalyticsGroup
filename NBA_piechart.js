import * as d3 from 'd3';

function createPieChart(width, height) {
    const size = {
        width: width,
        height: height,
        margin: 80,
        padding: 10
    };
    const svg = d3.select('#piechart-svg');

    d3.csv("injuries_2010-2020.csv").then(function(data) {
        console.log(data); // Log the loaded data to check if it's correct

        const injuryCounts = d3.group()
            .key(d => d.Relinquished)
            .rollup(v => v.length)
            .entries(data);

        console.log(injuryCounts); // Log the aggregated data

        const pie = d3.pie()
            .value(d => d.value)
            .sort(null);

        const arc = d3.arc()
            .innerRadius(0)
            .outerRadius(Math.min(size.width, size.height) / 2 - size.margin);

        const arcs = pie(injuryCounts);

        const colorScale = d3.scaleOrdinal()
            .domain(injuryCounts.map(d => d.key))
            .range(d3.schemeCategory10);

        svg.selectAll("path")
            .data(arcs)
            .enter().append("path")
            .attr("d", arc)
            .attr("fill", d => colorScale(d.data.key))
            .attr("transform", `translate(${size.width / 2}, ${size.height / 2})`);

        const labelArc = d3.arc()
            .outerRadius(Math.min(size.width, size.height) / 2 - size.margin)
            .innerRadius(0);

        svg.selectAll("text")
            .data(arcs)
            .enter().append("text")
            .attr("transform", d => `translate(${labelArc.centroid(d)})`)
            .attr("dy", "0.35em")
            .text(d => d.data.key);

        svg.append("text")
            .attr("x", size.width / 2)
            .attr("y", size.height - 45)
            .attr("text-anchor", "middle")
            .text("Most Prevalent Injuries");

    }).catch(function(error) {
        console.error("Error loading data:", error);
    });
}
