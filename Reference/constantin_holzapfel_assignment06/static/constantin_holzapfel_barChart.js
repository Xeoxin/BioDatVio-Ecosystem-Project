//Assignment06 by Constantin Holzapfel 3.12.18

//constants
var bars=NaN;
var returnDictionary = {};
var width = 850, height = 500;
var margin={'left':100,'top':100,'right':100,'bottom':100};
var data_min=1;
var data_max=100;
var data_range=10;
var chart_width=width-margin['left']-margin['right']
var bar_max_height=height-margin['bottom'];
var bar_width=(chart_width/data_range)/2;
var bar_height=function(d){return (d*(bar_max_height/data_max));};
var bar_y=function(d){return bar_max_height-bar_height(d);};
var bar_spacing=(chart_width/data_range);
var bar_text=function(d){return d;};
var text_y=bar_max_height+20;
var bar_text_x=function(d,i) { return i*bar_spacing+margin['left'];};
var animation_duration=1000;

function getRandomIntInclusive(min, max) {
		min = Math.ceil(min);
 		max = Math.floor(max);
 		return Math.floor(Math.random() * (max - min + 1)) + min;
		};

function createRandomIntList(min, max, range){
		var randomList=[];
		for(var i=0;i<range;i++){
			randomList.push(getRandomIntInclusive(min, max));
		}
		return randomList;
		}

function addClick(){
        bars.on('click', returnDictionary["update"]);
    };

function barChart (dataset) {
	returnDictionary = {};
	returnDictionary["init"] = function() {

		var svg = d3.select("#content").append("svg")
    	.attr("width", width)
    	.attr("height", height);

		bars = svg.selectAll('.bar')
 		.data(dataset)
 		.enter()
		.append("rect")
 		.attr("x", bar_text_x)
 		.attr("y", bar_y)
 		.attr("width", bar_width )
 		.attr("height", bar_height);
 
		test= svg.selectAll('.text')
 		.data(dataset)
 		.enter()
 		.append('text')
 		.text(bar_text)
 		.attr("x", bar_text_x)
 		.attr("y", text_y);
 	
 		addClick();
 		
 	};
 	
 	returnDictionary['update']=function(){
		newData = createRandomIntList(data_min,data_max,data_range);
		bars.data(newData)
				.transition()
				.duration(animation_duration)
		.attr("x", bar_text_x)
		.attr("y", bar_y)
		.attr("width", bar_width)
 		.attr("height", bar_height);

 		test.data(newData)
 			.transition()
 			.duration(animation_duration)
 			.text(bar_text)
 			.attr("x", bar_text_x)
 			.attr("y", text_y);
 		};

	return returnDictionary;
}