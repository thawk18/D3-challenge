// @TODO: YOUR CODE HERE!

// Create Scatter plots pulling D3 Data 
// SVG size
let svg_width = 1000;
let svg_height = 600;

// define screen margins
let margin = {
  top: 50, 
  right: 50, 
  bottom: 150,
  left: 100
};

// total chart height and width
let width = svg_width - margin.right - margin.left;
let height = svg_height - margin.top - margin.bottom;

// link graph to html
let chart = d3.select('#scatter')
  .append('div')
  .classed('chart', true);

//add svg features to the chart 
let svg = chart.append('svg')
  .attr('width', svg_width)
  .attr('height', svg_height);

//add svg group
let chart_group = svg.append('g')
  .attr('transform', `translate(${margin.left}, ${margin.top})`);

//static graph axis
let option_x = 'poverty';
let option_y = 'healthcare';

//updates the x value with click
function xScale(census_data, option_x) {
    //scales
    let xLinearScale = d3.scaleLinear()
      .domain([d3.min(census_data, d => d[option_x]) * 0.8,
        d3.max(census_data, d => d[option_x]) * 1.2])
      .range([0, width]);

    return xLinearScale;
}
//updates the y value with click
function yScale(census_data, option_y) {
  //scales
  let yLinearScale = d3.scaleLinear()
    .domain([d3.min(census_data, d => d[option_y]) * 0.8,
      d3.max(census_data, d => d[option_y]) * 1.2])
    .range([height, 0]);

  return yLinearScale;
}
//updates the x axis with click
function renderXAxis(newXScale, xAxis) {
  let bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(3000)
    .call(bottomAxis);

  return xAxis;
}

//updates the y axis with click
function renderYAxis(newYScale, yAxis) {
  var leftAxis = d3.axisLeft(newYScale);

  yAxis.transition()
    .duration(3000)
    .call(leftAxis);

  return yAxis;
}

//updates circles 
function renderCircles(circlesGroup, newXScale, option_x, newYScale, option_y) {

    circlesGroup.transition()
      .duration(3000)
      .attr('cx', data => newXScale(data[option_x]))
      .attr('cy', data => newYScale(data[option_y]))

    return circlesGroup;
}

//updates state labels
function renderText(textGroup, newXScale, option_x, newYScale, option_y) {

    textGroup.transition()
      .duration(3000)
      .attr('x', d => newXScale(d[option_x]))
      .attr('y', d => newYScale(d[option_y]));

    return textGroup
}
//re-style X
function styleX(value, option_x) {

    if (option_x === 'poverty') {
        return `${value}%`;
    }
    else if (option_x === 'income') {
        return `${value}`;
    }
    else {
      return `${value}`;
    }
}

//updates circle group
function updateToolTip(option_x, option_y, circlesGroup) {
//x
    if (option_x === 'poverty') {
      var xLabel = 'Poverty:';
    }
    else if (option_x === 'income'){
      var xLabel = 'Median Income:';
    }
    else {
      var xLabel = 'Age:';
    }
//y
  if (option_y ==='healthcare') {
    var yLabel = "No Healthcare:"
  }
  else if(option_y === 'obesity') {
    var yLabel = 'Obesity:';
  }
  else{
    var yLabel = 'Smokers:';
  }

  //tooltip
  var toolTip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-8, 0])
    .html(function(d) {
        return (`${d.state}<br>${xLabel} ${styleX(d[option_x], option_x)}<br>${yLabel} ${d[option_y]}%`);
  });

  circlesGroup.call(toolTip);

  //turn on and off labels with mouse over and out
  circlesGroup.on('mouseover', toolTip.show)
    .on('mouseout', toolTip.hide);

    return circlesGroup;
}
//get data from csv
d3.csv('./assets/data/data.csv').then(function(census_data) {

    console.log(census_data);
    
    //alocate data in the respective variables
    census_data.forEach(function(data){
        data.obesity = +data.obesity;
        data.income = +data.income;
        data.smokes = +data.smokes;
        data.age = +data.age;
        data.healthcare = +data.healthcare;
        data.poverty = +data.poverty;
    });

    //define linear scales
    var xLinearScale = xScale(census_data, option_x);
    var yLinearScale = yScale(census_data, option_y);

    //define x axis
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    //append X
    var xAxis = chart_group.append('g')
      .classed('x-axis', true)
      .attr('transform', `translate(0, ${height})`)
      .call(bottomAxis);

    //append Y
    var yAxis = chart_group.append('g')
      .classed('y-axis', true)
      //.attr
      .call(leftAxis);
    
    //append Circles
    var circlesGroup = chart_group.selectAll('circle')
      .data(census_data)
      .enter()
      .append('circle')
      .classed('stateCircle', true)
      .attr('cx', d => xLinearScale(d[option_x]))
      .attr('cy', d => yLinearScale(d[option_y]))
      .attr('r', 14)
      .attr('opacity', '.9');

    //append Initial Text
    var textGroup = chart_group.selectAll('.stateText')
      .data(census_data)
      .enter()
      .append('text')
      .classed('stateText', true)
      .attr('x', d => xLinearScale(d[option_x]))
      .attr('y', d => yLinearScale(d[option_y]))
      .attr('dy', 3)
      .attr('font-size', '10px')
      .text(function(d){return d.abbr});

    //create a group for the x axis labels and place it in the bottom center
    var xLabelsGroup = chart_group.append('g')
      .attr('transform', `translate(${width / 2}, ${height + 10 + margin.top})`);

    //style labels
    var povertyLabel = xLabelsGroup.append('text')
      .classed('aText', true)
      .classed('active', true)
      .attr('x', 0)
      .attr('y', 20)
      .attr('value', 'poverty')
      .text('In Poverty (%)');
      
    var ageLabel = xLabelsGroup.append('text')
      .classed('aText', true)
      .classed('inactive', true)
      .attr('x', 0)
      .attr('y', 40)
      .attr('value', 'age')
      .text('Age (Median)');  

    var incomeLabel = xLabelsGroup.append('text')
      .classed('aText', true)
      .classed('inactive', true)
      .attr('x', 0)
      .attr('y', 60)
      .attr('value', 'income')
      .text('Household Income (Median)')

    //create a group for Y labels and place them in the left center
    var yLabelsGroup = chart_group.append('g')
      .attr('transform', `translate(${0 - margin.left/4}, ${height/2})`);

    //style labels
    var healthcareLabel = yLabelsGroup.append('text')
      .classed('aText', true)
      .classed('active', true)
      .attr('x', 0)
      .attr('y', 0 - 20)
      .attr('dy', '1em')
      .attr('transform', 'rotate(-90)')
      .attr('value', 'healthcare')
      .text('No Healthcare (%)');
    
    var smokesLabel = yLabelsGroup.append('text')
      .classed('aText', true)
      .classed('inactive', true)
      .attr('x', 0)
      .attr('y', 0 - 40)
      .attr('dy', '1em')
      .attr('transform', 'rotate(-90)')
      .attr('value', 'smokes')
      .text('Smoking (%)');
    
    var obesityLabel = yLabelsGroup.append('text')
      .classed('aText', true)
      .classed('inactive', true)
      .attr('x', 0)
      .attr('y', 0 - 60)
      .attr('dy', '1em')
      .attr('transform', 'rotate(-90)')
      .attr('value', 'obesity')
      .text('Obesity (%)');
    
    //update the toolTip
    var circlesGroup = updateToolTip(option_x, option_y, circlesGroup);

    //x axis labels update
    xLabelsGroup.selectAll('text')
      .on('click', function() {
        var value = d3.select(this).attr('value');

        if (value != option_x) {

          //replace x with chosen value and update
          option_x = value; 
          xLinearScale = xScale(census_data, option_x); 
          xAxis = renderXAxis(xLinearScale, xAxis);

          //upate circles, text and tooltip
          circlesGroup = renderCircles(circlesGroup, xLinearScale, option_x, yLinearScale, option_y);
          textGroup = renderText(textGroup, xLinearScale, option_x, yLinearScale, option_y);
          circlesGroup = updateToolTip(option_x, option_y, circlesGroup);

          //activate classes for respective option
          if (option_x === 'poverty') {
            povertyLabel.classed('active', true).classed('inactive', false);
            ageLabel.classed('active', false).classed('inactive', true);
            incomeLabel.classed('active', false).classed('inactive', true);
          }
          else if (option_x === 'age') {
            povertyLabel.classed('active', false).classed('inactive', true);
            ageLabel.classed('active', true).classed('inactive', false);
            incomeLabel.classed('active', false).classed('inactive', true);
          }
          else {
            povertyLabel.classed('active', false).classed('inactive', true);
            ageLabel.classed('active', false).classed('inactive', true);
            incomeLabel.classed('active', true).classed('inactive', false);
          }
        }
      });
    //y axis labels update
    yLabelsGroup.selectAll('text')
      .on('click', function() {
        var value = d3.select(this).attr('value');

        if(value !=option_y) {
            //replace y with chosen value and update  
            option_y = value;
            yLinearScale = yScale(census_data, option_y);
            yAxis = renderYAxis(yLinearScale, yAxis);

            //upate circles, text and tooltip
            circlesGroup = renderCircles(circlesGroup, xLinearScale, option_x, yLinearScale, option_y);
            textGroup = renderText(textGroup, xLinearScale, option_x, yLinearScale, option_y);
            circlesGroup = updateToolTip(option_x, option_y, circlesGroup);

            //activate classes for respective option
            if (option_y === 'obesity') {
              obesityLabel.classed('active', true).classed('inactive', false);
              smokesLabel.classed('active', false).classed('inactive', true);
              healthcareLabel.classed('active', false).classed('inactive', true);
            }
            else if (option_y === 'smokes') {
              obesityLabel.classed('active', false).classed('inactive', true);
              smokesLabel.classed('active', true).classed('inactive', false);
              healthcareLabel.classed('active', false).classed('inactive', true);
            }
            else {
              obesityLabel.classed('active', false).classed('inactive', true);
              smokesLabel.classed('active', false).classed('inactive', true);
              healthcareLabel.classed('active', true).classed('inactive', false);
            }
          }
        });
});