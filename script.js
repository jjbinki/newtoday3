const rawData = [
    { date: '07 Jun 2024', amount: 30.43 },
    { date: '03 Jun 2024', amount: 27.34 },
    { date: '01 Jun 2024', amount: 12.99 },
    { date: '31 May 2024', amount: 18.65 },
    { date: '30 May 2024', amount: 151.78 },
    { date: '29 May 2024', amount: 25.27 },
    { date: '27 May 2024', amount: 13.03 },
    { date: '26 May 2024', amount: 70.9 },
    { date: '25 May 2024', amount: 64.51 },
    { date: '24 May 2024', amount: 94.53 },
    { date: '23 May 2024', amount: 33.89 },
    { date: '22 May 2024', amount: 9.87 },
    { date: '21 May 2024', amount: 13.5 },
    { date: '18 May 2024', amount: 36.96 },
    { date: '17 May 2024', amount: 48.38 },
    { date: '16 May 2024', amount: 225.09 },
    { date: '15 May 2024', amount: 9.99 },
    { date: '14 May 2024', amount: 144.67 },
    { date: '13 May 2024', amount: 29.68 },
    { date: '12 May 2024', amount: 13.98 },
    { date: '11 May 2024', amount: 9.8 },
    { date: '10 May 2024', amount: 527.65 },
    { date: '08 May 2024', amount: 11.42 },
    { date: '07 May 2024', amount: 58.89 },
    { date: '06 May 2024', amount: 194.48 },
    { date: '05 May 2024', amount: 10.74 },
    { date: '04 May 2024', amount: 81.6 },
    { date: '03 May 2024', amount: 51.11 },
    { date: '02 May 2024', amount: 28.02 },
    { date: '01 May 2024', amount: 136.23 },
    { date: '30 Apr 2024', amount: 139.5 },
    { date: '29 Apr 2024', amount: 44.55 },
    { date: '27 Apr 2024', amount: 18.74 },
    { date: '26 Apr 2024', amount: 81.65 },
    { date: '25 Apr 2024', amount: 45.19 },
    { date: '24 Apr 2024', amount: 86.55 },
    { date: '23 Apr 2024', amount: 19.75 },
    { date: '22 Apr 2024', amount: 44.82 },
    { date: '21 Apr 2024', amount: 7.82 },
    { date: '20 Apr 2024', amount: 112.74 },
    { date: '19 Apr 2024', amount: 59.07 },
    { date: '18 Apr 2024', amount: 92.12 },
    { date: '17 Apr 2024', amount: 69.37 },
    { date: '16 Apr 2024', amount: 12.86 },
    { date: '14 Apr 2024', amount: 81.01 },
    { date: '13 Apr 2024', amount: 9.99 },
    { date: '12 Apr 2024', amount: 27.67 },
    { date: '11 Apr 2024', amount: 43.64 },
    { date: '10 Apr 2024', amount: 55.59 },
    { date: '09 Apr 2024', amount: 37.29 },
    { date: '08 Apr 2024', amount: 71.01 },
    { date: '07 Apr 2024', amount: 37.12 },
    { date: '06 Apr 2024', amount: 113.74 },
    { date: '05 Apr 2024', amount: 45.36 },
    { date: '03 Apr 2024', amount: 2.76 },
    { date: '02 Apr 2024', amount: 67.71 },
    { date: '01 Apr 2024', amount: 69.44 },
    { date: '31 Mar 2024', amount: 109.06 },
    { date: '30 Mar 2024', amount: 14.91 },
    { date: '29 Mar 2024', amount: 38.62 },
    { date: '28 Mar 2024', amount: 573.17 },
    { date: '27 Mar 2024', amount: 105.37 },
    { date: '26 Mar 2024', amount: 14.95 },
    { date: '25 Mar 2024', amount: 53.1 }
];

// Parse the dates and sort the data
const data = rawData.map(d => ({
    ...d,
    date: new Date(d.date)
})).sort((a, b) => a.date - b.date);

// Set up the chart dimensions
const margin = {top: 20, right: 30, bottom: 100, left: 60};
const width = 1100 - margin.left - margin.right;
const height = 500 - margin.top - margin.bottom;

// Create the SVG element
const svg = d3.select("#chart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

// Set up scales
const x = d3.scaleBand()
    .range([0, width])
    .padding(0.1);

const y = d3.scaleLinear()
    .range([height, 0]);

// Set the domains
x.domain(data.map(d => d.date));
y.domain([0, d3.max(data, d => d.amount)]);

// Add the x-axis
svg.append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x)
        .tickFormat(d => d3.timeFormat("%d %b")(d)))
    .selectAll("text")
    .style("text-anchor", "end")
    .attr("dx", "-.8em")
    .attr("dy", ".15em")
    .attr("transform", "rotate(-65)");

// Add the y-axis
svg.append("g")
    .call(d3.axisLeft(y));

// Create the bars
svg.selectAll(".bar")
    .data(data)
    .enter().append("rect")
    .attr("class", "bar")
    .attr("x", d => x(d.date))
    .attr("width", x.bandwidth())
    .attr("y", d => y(d.amount))
    .attr("height", d => height - y(d.amount));

// Add tooltip
const tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

svg.selectAll(".bar")
    .on("mouseover", function(event, d) {
        tooltip.transition()
            .duration(200)
            .style("opacity", .9);
        tooltip.html(`Date: ${d3.timeFormat("%B %d, %Y")(d.date)}<br/>Amount: $${d.amount.toFixed(2)}`)
            .style("left", (event.pageX) + "px")
            .style("top", (event.pageY - 28) + "px");
    })
    .on("mouseout", function(d) {
        tooltip.transition()
            .duration(500)
            .style("opacity", 0);
    });

// Set the chart title
const startDate = data[0].date;
const endDate = data[data.length - 1].date;
const formatMonth = d3.timeFormat("%B");
const title = `Daily Spending: ${formatMonth(startDate)} - ${formatMonth(endDate)} ${endDate.getFullYear()}`;
d3.select("#chart-title").text(title);