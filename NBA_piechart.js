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

        const categories = {
            "ankle": "Ankle Injury",
            "back": "Back Injury",
            "knee": "Knee Injury",
            "strain": "Muscle Strain",
            "hip": "Hip Injury"
            // Add more here if needed (these are the 5 the Tableau visualization had)
        };

        // go through the data and catergorize the injury types
        const categoryCounts = {};
        data.forEach(function(d) {
            for (const keyword in categories) {
                if (d.Notes.toLowerCase().includes(keyword)) {
                    const category = categories[keyword];
                    // the || 0 sets it to 0 if it doesn't exist yet, everything will be NaN otherwise
                    categoryCounts[category] = (categoryCounts[category] || 0) + 1;
                }
            }
        });

        console.log(categoryCounts); // Check category counts

        /*
        const injuryCounts = d3.group()
            .key(d => d.Relinquished)
            .rollup(v => v.length)
            .entries(data);

        console.log(injuryCounts); // Log the aggregated data
        */

        // set injuryCounts to be based off of categoryCounts
        const injuryCounts = Object.entries(categoryCounts).map(([category, count]) => ({ category, count }));

        // changed d.value to d.count
        const pie = d3.pie()
            .value(d => d.count)
            .sort(null);

        const arc = d3.arc()
            .innerRadius(0)
            .outerRadius(Math.min(size.width, size.height) / 2 - size.margin);

        const arcs = pie(injuryCounts);

        // changed d.key to d.category
        const colorScale = d3.scaleOrdinal()
            .domain(injuryCounts.map(d => d.category))
            .range(d3.schemeCategory10);

        svg.selectAll("path")
            .data(arcs)
            .enter().append("path")
            .attr("d", arc)
            // changed d.data.key to d.data.category
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
