d3.csv("injuries_2010-2020.csv").then(_data => {
    console.log(_data)
    // process data
    const data = {
        name: 'NBA_injuries',
        children: Array.from(new Set(_data.map(d => d.Date.split('-')[0]))).map(year => ({
            name: year,
            children: Array.from(new Set(_data.map(d => d.Team))).map(team => ({
                name: team,
                value: _data.filter(d => d.Date.split('-')[0] === year && d.Team === team).length
            })).filter(d => d.value > 0)
        }))
    };
    console.log(data);

    // general settings
    const width = document.querySelector('.right-column').clientWidth;
    const height = document.querySelector('.right-column').clientHeight;
    const color = d3.scaleOrdinal(data.children.map(d => d.name), d3.schemePaired);

    // prepare d3 treemap data structure
    const root = d3.treemap()
        .size([width, height])
        .padding(1)(d3.hierarchy(data)
            .sum(d => d.value)
            .sort((a, b) => b.value - a.value));

    // create SVG container
    const svg = d3.select('#treemap-container').append('svg')
        .attr('viewBox', `0 0 ${width} ${height}`);

    // create a container for each leaf node as the cell, here the variable leaf refer to each cell
    const leaf = svg.selectAll('g')
        .data(root.leaves())
        .join('g')
        .attr('transform', d => `translate(${d.x0},${d.y0})`)
        .on("mouseover", function(event, d) {
            // Show tooltip on mouseover
            const tooltip = svg.append("text")
                .attr("class", "tooltip")
                .attr("x", 5)
                .attr("y", 10)
                .attr("text-anchor", "left")
                .text(`${d.data.name} - Injury Count: ${d.value}`)
                .style("font-weight", "bold");
        })
        .on("mouseout", function(event, d) {
            // Remove tooltip on mouseout
            svg.select(".tooltip").remove();
        });

    // add a colored rectangle to each cell
    leaf.append('rect')
        .attr("width", d => d.x1 - d.x0)
        .attr("height", d => d.y1 - d.y0)
        .attr('fill', d => {
            while (d.depth > 1) d = d.parent;
            return color(d.data.name);
        })
        .attr('fill-opacity', 0.6);
});
