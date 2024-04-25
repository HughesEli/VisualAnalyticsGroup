function createPieChart(width, height) {
    const size = {
        width: width,
        height: height,
        margin: 80,
        padding: 10
    };
    const svg = d3.select('#piechart-svg');

    d3.csv("injuries_2010-2020.csv").then(function(data) {
        const pie = d3.pie()
            .value(d => d.value)
            .sort(null);

        const arc = d3.arc()
            .innerRadius(0)
            .outerRadius(Math.min(size.width, size.height) / 2 - size.margin);

        const arcs = pie(data);

        const colorScale = d3.scaleOrdinal()
            .domain(data.map(d => d.category))
            .range(d3.schemeCategory10);

        svg.selectAll("path")
            .data(arcs)
            .enter().append("path")
            .attr("d", arc)
            .attr("fill", d => colorScale(d.data.category))
            .attr("transform", `translate(${size.width / 2}, ${size.height / 2})`);

    
        const labelArc = d3.arc()
            .outerRadius(Math.min(size.width, size.height) / 2 - size.margin)
            .innerRadius(0);

        svg.selectAll("text")
            .data(arcs)
            .enter().append("text")
            .attr("transform", d => `translate(${labelArc.centroid(d)})`)
            .attr("dy", "0.35em")
            .text(d => d.data.category);

        svg.append("text")
            .attr("x", size.width / 2)
            .attr("y", size.height - 45)
            .attr("text-anchor", "middle")
            .text("Most Prevalent Injuries");

    }).catch(function(error) {
        console.error("Error loading data:", error);
    });
}
