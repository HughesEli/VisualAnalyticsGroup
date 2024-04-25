// Load data and create tree map
d3.csv("injuries_2010-2020.csv").then(function(data) {
    // Process data and create tree map
    const teamsByYear = {};

    data.forEach(function(d) {
        const year = new Date(d.Date).getFullYear();

        if (!teamsByYear[year]) {
            teamsByYear[year] = {};
        }
        if (!teamsByYear[year][d.Team]) {
            teamsByYear[year][d.Team] = 0;
        }
        teamsByYear[year][d.Team]++;
    });

    // Convert teamsByYear object into array of objects
    const teamYearCounts = Object.entries(teamsByYear).map(([year, teams]) => ({
        year: year,
        children: Object.entries(teams).map(([team, count]) => ({ team, count }))
    }));

    // Filter out any years with no data
    const filteredTeamYearCounts = teamYearCounts.filter(d => d.children.length > 0);

    // Create hierarchical data structure required for tree map
    const root = d3.hierarchy({ children: filteredTeamYearCounts })
        .sum(function(d) {
            if (d.children) {
                return d3.sum(d.children, c => c.count || 0);
            } else {
                return 0; // Return 0 if there are no children
            }
        });

    // Get the dimensions of the right column div
    const rightColumnWidth = document.querySelector('.right-column').clientWidth;
    const rightColumnHeight = document.querySelector('.right-column').clientHeight;

    // Create treemap layout
    const treemap = d3.treemap()
        .size([rightColumnWidth, rightColumnHeight]) // Adjust size to fit within the right column
        .padding(1);

    // Generate treemap nodes
    const nodes = treemap(root).leaves();

    // Create color scale
    const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

    // Append rectangles for each leaf node
    d3.select('#treemap-container').selectAll(".treemap-rect")
        .data(nodes)
        .enter().append("div")
        .attr("class", "treemap-rect")
        .style("left", d => d.x0 + "px")
        .style("top", d => d.y0 + "px")
        .style("width", d => Math.max(0, d.x1 - d.x0 - 1) + "px")
        .style("height", d => Math.max(0, d.y1 - d.y0 - 1) + "px")
        .style("background-color", d => colorScale(d.data.year));

}).catch(function(error) {
    console.error("Error loading data:", error);
});
