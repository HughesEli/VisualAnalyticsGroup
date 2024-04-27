// Function to create a pie chart
function createPieChart(width, height) {
    // Define size parameters for the chart
    const size = {
        width: width,
        height: height,
        margin: 80,
        padding: 10
    };

    // Select the SVG element where the pie chart will be rendered
    const svg = d3.select('#piechart-svg');

    // Load data from CSV file
    d3.csv("injuries_2010-2020.csv").then(function(data) {
        console.log(data); // Log the loaded data to check if it's correct

        // Define categories for different types of injuries
        const categories = {
            "ankle": "Ankle Injury",
            "back": "Back Injury",
            "knee": "Knee Injury",
            "strain": "Muscle Strain",
            "hip": "Hip Injury"
            // Add more here if needed (these are the 5 the Tableau visualization had)
        };

        // Categorize the injury types and count occurrences
        const categoryCounts = {};
        data.forEach(function(d) {
            for (const keyword in categories) {
                if (d.Notes.toLowerCase().includes(keyword)) {
                    const category = categories[keyword];
                    categoryCounts[category] = (categoryCounts[category] || 0) + 1;
                }
            }
        });

        console.log(categoryCounts); // Check category counts

        // Convert category counts to an array of objects
        const injuryCounts = Object.entries(categoryCounts).map(([category, count]) => ({ category, count }));

        // Create a pie layout
        const pie = d3.pie()
            .value(d => d.count)
            .sort(null);

        // Define the arc for the pie chart
        const arc = d3.arc()
            .innerRadius(0)
            .outerRadius(Math.min(size.width, size.height) / 2 - size.margin);

        // Generate arcs based on the pie layout
        const arcs = pie(injuryCounts);

        // Define color scale for the categories
        const colorScale = d3.scaleOrdinal()
            .domain(injuryCounts.map(d => d.category))
            .range(d3.schemeCategory10);

        // Render pie chart paths
        svg.selectAll("path")
            .data(arcs)
            .enter().append("path")
            .attr("d", arc)
            .attr("fill", d => colorScale(d.data.category))
            .attr("transform", `translate(${size.width / 2}, ${size.height / 2})`)
            .on("mouseover", function(event, d) {
                // Show tooltip on mouseover
                const tooltip = svg.append("text")
                    .attr("class", "tooltip")
                    .attr("x", size.width / 2)
                    .attr("y", size.height - 50)
                    .attr("text-anchor", "middle")
                    .text(`${d.data.category}: ${d.data.count}`)
                    .style("font-weight", "bold");
            })
            .on("mouseout", function(event, d) {
                // Remove tooltip on mouseout
                svg.select(".tooltip").remove();
            });

        // Add a title for the pie chart
        svg.append("text")
            .attr("x", size.width / 2)
            .attr("y", size.height / 7)
            .attr("text-anchor", "middle")
            .text("Most Prevalent Injuries");

    }).catch(function(error) {
        console.error("Error loading data:", error);
    });
}
