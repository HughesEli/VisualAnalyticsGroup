function createTreeMap(width, height) {
    const size = {
        width: width,
        height: height,
        margin: 20
    };

    const svg = d3.select('#treemap-svg');

    d3.csv("injuries_2010-2020.csv").then(function(data) {
        const nestedData = d3.nest()
            .key(d => d.Team)
            .entries(data);

        const root = {
            name: "NBA Injuries",
            children: nestedData.map(d => ({
                name: d.key,
                children: d.values.map(injury => ({
                    date: injury.Date,
                    acquired: injury.Acquired,
                    relinquished: injury.Relinquished,
                    notes: injury.Notes
                }))
            }))
        };

        const treemap = d3.treemap()
            .size([size.width, size.height])
            .padding(1)
            .round(true);


        const treemapData = treemap(d3.hierarchy(root).sum(d => d.children.length));

    
        const color = d3.scaleOrdinal(d3.schemeCategory10);

        
        const cells = svg.selectAll("g")
            .data(treemapData.leaves())
            .enter().append("g")
            .attr("transform", d => `translate(${d.x0},${d.y0})`);

        cells.append("rect")
            .attr("width", d => d.x1 - d.x0)
            .attr("height", d => d.y1 - d.y0)
            .attr("fill", d => color(d.parent.data.name))
            .attr("stroke", "white");

        cells.append("text")
            .attr("x", 5)
            .attr("y", 15)
            .attr("font-size", "12px")
            .attr("fill", "black")
            .text(d => d.data.relinquished);

        svg.append("text")
            .attr("x", (size.width / 2))
            .attr("y", size.margin)
            .attr("text-anchor", "middle")
            .style("font-size", "16px")
            .text("Treemap");

    }).catch(function(error) {
        console.error("Error loading data:", error);
    });
}
