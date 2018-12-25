//Assignment06 by Constantin Holzapfel 3.12.18

//bubble chart constants
var margin = {top: 10, right: 150, bottom: 50, left: 50};
var svg_width= 1400;
var svg_height= 600;
var chart_width=svg_width-margin['right']-margin['left'];
var chart_height=svg_height-margin['top']-margin['bottom'];
var bubbleMaxSize=40;
var data_padding=0.2;
var key_column_num='country';
var value_column_num='2018';
var key_column_cat='name';
var value_column_cat='four_regions';
var x_axis_label='income per person (GDP/capita, PPP$ inflation-adjusted)';
var y_axis_label='life expectancy (years)';
var bluishGreen='#009e73';
var blue='#0072b2';
var vermillion='#d55e00';
var reddishPurple='#cc79a7';
var color_map=[vermillion,blue,bluishGreen,reddishPurple];

var bubbles=NaN;
var legend=NaN;
var legend_labels=NaN;
var svg=NaN;
var g_numBubbleData=NaN;

//creates total population data for a single bubble, that was clicked on.
function onClick(){
	d3.select(this)
		.style('opacity', 1);

		svg.append('text')
		.attr("class", "bubble_label")
		.text('total population: '+g_numBubbleData[d3.select(this).attr('id')])
		.attr('x', (svg_width/2.5))
		.attr('y', 100)
		.attr('stroke-width', 1)
		.attr('id', 'populationLabel');
}

//adding click eventlistener
function addClick(){
	bubbles.on('click', returnDict['onClick'])
}

//changes opacity and creates bubble label on a mouseover event.
function mouseOver(){d3.select(this)
						.style('opacity', 1);

						svg.append('text')
						.attr("class", "bubble_label")
						.text(d3.select(this).attr('id'))
						.attr('x', d3.select(this).attr('cx'))
						.attr('y', d3.select(this).attr('cy'))
						.attr('stroke-width', 1)
						.attr('id', 'circleLabel');}

//adds mouseover eventlistener
function addMouseOver(){
	bubbles.on('mouseover', returnDict['mouseOver']);
										
}

//sets opacity of bubble 0.5 and removes bubble labels by mouseout event.
function mouseOut(){d3.select(this)
						.style('opacity', 0.5);

						document.getElementById('circleLabel').remove();
						if(document.getElementById('populationLabel')!=null){document.getElementById('populationLabel').remove();}
						
						}

//adds mouseout eventlistener
function addMouseOut(){
	bubbles.on('mouseout', returnDict['mouseOut']);
}

//creates a dictionary in an init-update pattern. The update function was seperated into subtasks. 
function bubbleChart(dataset){
	returnDict={};
	returnDict['init']=analyze;
	returnDict['onClick']=onClick;
	returnDict['mouseOver']=mouseOver;
	returnDict['mouseOut']=mouseOut;

	return returnDict;
}

//filters data und executes drawBubblechart(), that creates the bubble chart
function analyze(error, life_expectancy, income, population, geographies) {
  	if(error) { console.log(error); }

	drawBubblechart(svg_width,
					svg_height,
					margin,
					filterZero(extractData(income,key_column_num,value_column_num)),
					filterZero(extractData(life_expectancy,key_column_num,value_column_num)),
					extractData(population,key_column_num,value_column_num),
					extractData(geographies,key_column_cat,value_column_cat));
}

//creates scales from data und draws the svg
function drawBubblechart(width, height, margin, numxData, numyData, numBubbleData, catData){
	

	svg=d3.select('#content').append('svg');
	svg.attr('width',width).attr('height',height);

	xScale=logScale(numxData,0,chart_width,bubbleMaxSize);
	yScale=linearScale(numyData,chart_height,0,bubbleMaxSize);
	bubbleScale=sqrtScale(numBubbleData,bubbleMaxSize);
	catScale=ordinalScale(createSet(Object.values(catData)), color_map);

	drawXaxis(svg,chart_width,chart_height,margin,xScale,x_axis_label);
	drawYaxis(svg,chart_width,chart_height,margin,yScale, y_axis_label);
	drawBubbles(svg, margin, numxData, numyData, numBubbleData, catData, xScale, yScale, bubbleScale, catScale);
}

//returns a new object without zero values.
function filterZero(data){
	new_Obj={};
	Object.keys(data).forEach(function(key){if(data[key]>0){new_Obj[key]=data[key];}});
	return new_Obj;
}

//returns a new array with a set from the input
function createSet(arr){
	var new_arr=[]
	arr.forEach(function(value){
		if(!new_arr.includes(value)){
			new_arr.push(value);
		}
	});
	return new_arr; 
}

//returns a linear scale from input
function linearScale(data, start, end, max_area){
	return d3.scaleLinear().domain([getMin(data)-data_padding*getMin(data), getMax(data)+data_padding*getMax(data)]).range([start, end]);
}

//returns logarithmic scale from input, because a linear scale led to overlapping bubbles and scaling issues
function logScale(data, start, end, max_area){
	return d3.scaleLog().domain([getMin(data)-data_padding*getMin(data), getMax(data)+data_padding*getMax(data)]).range([start, end]);
}

//returns squared scale from input
function sqrtScale(data, max_area){
	return d3.scaleSqrt().domain([getMin(data), getMax(data)]).range([3, max_area]);
}

//returns ordinal scale from input
function ordinalScale(input, output){
	return d3.scaleOrdinal().domain(input).range(output);
}

//returns a new js object from the csv input with input columns as key-value pairs per row
function extractData(data, key, value){
	var new_obj={};

	for(var i=0;i<data.length;i++){
		if(isNaN(data[i][value])){
			if (isNaN(parseFloat(data[i][value].replace(',','.')))){
				new_obj[data[i][key]]=data[i][value];
			}
			else{
				new_obj[data[i][key]]=parseFloat(data[i][value].replace(',','.'));
			}
		}
		else{
			new_obj[data[i][key]]=+data[i][value];
		}
	}

	return new_obj;
}

//gets the maximum value from data
function getMax(data){
	return d3.max(Object.values(data));
}

//gets the minimum value from data
function getMin(data){
	return d3.min(Object.values(data));
}

//draws the X axis with label on the svg
function drawXaxis(svg,width,height,margin,xScale,label){
	
	svg.append("g")
		.attr("class", "axis")
		.attr("transform", "translate("+ margin['left'] +"," + (height+margin['top']) + ")")
		.call(d3.axisBottom(xScale).ticks(20, ".1s")
			);

	svg.append("text") 
		.attr("class", "axis_label")            
      	.attr("transform",
            "translate(" + ((width/2)+margin['left']) + " ," + 
                           (height+margin['top']+0.75*margin['bottom']) + ")")
      	.text(label);
}

//draws the Y axis with label on the svg
function drawYaxis(svg,width,height,margin,yScale,label){
	
	svg.append("g")
		.attr("class", "axis")
		.attr("transform", "translate("+ margin['left'] +"," + margin['top'] + ")")
		.call(d3.axisLeft(yScale));

     svg.append('g')
    .attr('transform', 'translate(' + (margin['left']/2.5) + ', ' + (margin['top']+(height/2)) + ')')
    .append('text')
    .attr("class", "axis_label")
    .attr('transform', 'rotate(-90)')
    .text(label);
}

//draws the bubbles on the svg and cappends the event listeners on them.
function drawBubbles(svg, margin, numxData, numyData, numBubbleData, catData, xScale, yScale, bubbleScale, catScale){

	g_numBubbleData=numBubbleData;

	keys=[];
	Object.keys(numBubbleData).forEach(function(key){if (Object.keys(numxData).includes(key)&&
														Object.keys(numyData).includes(key)&&
														Object.keys(catData).includes(key))
														{keys.push(key);}});

	keys.sort(function(x,y){return d3.descending(numBubbleData[x],numBubbleData[y]);});

	bubbles=svg.selectAll(".circle")
		.data(keys)
		.enter()
		.append("circle")
		.attr("cx", function(key){return margin['left']+xScale(numxData[key]);})
		.attr("cy", function(key){return margin['top']+yScale(numyData[key]);})
		.attr("r", function(key){return bubbleScale(numBubbleData[key]);})
		.attr('id',function(key){return key;})
		.style("fill", function(key){return catScale(catData[key]);})
		.style('stroke-width', 1)
		.style('opacity',0.5);


	legend=svg.selectAll('rect')
      .data(createSet(Object.values(catData)))
      .enter()
      .append("rect")
      .attr("transform", function(d,i){return 'translate('+(chart_width+margin['left'])+','+(margin['top']+i*20)+')';})
      .attr("width", 10)
      .attr("height", 10)
      .style("fill", function(d) {return catScale(d);})
      .style('opacity',0.5);

    legend_labels=svg.selectAll('.legend')
    	.data(createSet(Object.values(catData)))
    	.enter().append("text")
    	.attr("class", "legend_label")
    	.text(function(d){return d;})
      	.attr("transform", function(d,i){return 'translate('+(chart_width+margin['left']+15)+','+(margin['top']+i*20+10)+')';})
	  	.attr('stroke-width', 1)

	addClick();
	addMouseOver();
	addMouseOut();
}