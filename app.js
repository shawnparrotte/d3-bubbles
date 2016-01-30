var url = "https://gist.githubusercontent.com/d3byex/30231953acaa9433a46f/raw/6c7eb1c562de92bdf8d0cd99c6912048161c187e/fert_pop_exp.csv";

d3.csv( url, function( rawData ) {

    //*** CONVERT DATA ***//

    var data = rawData.map( function( d ) {

        //data contains an array of objects
        return { CountryCode : d.CountryCode,
                 CountryName : d.CountryName,
                     LifeExp : +d.LifeExp,
                    FertRate : +d.FertRate,
                  Population : +d.Population,
                      Region : d.Region };

    }); // end map function

    //*** CREATE GRAPH DIMENTIONS ***//

    var graphHeight = 400, graphWidth = 500;

    var axisPadding = 7;

    var margin = { left : 50,
                  right : 20,
                    top : 20,
                 bottom : 20 };

    var totalHeight = graphHeight + margin.top + margin.bottom,
        totalWidth = graphWidth + margin.left + margin.right;

    var minBubbleRadius = 5, maxBubbleRadius = 50;

    //*** PARSE DATA ***//

    var lifeExpectancy = data.map( function( d ){ return d.LifeExp; }),  // x-axis
        fertilityRate = data.map( function( d ){ return d.FertRate; }),  // y-axis
        population = data.map( function( d ){ return d.Population; }),   // bubble
        region = data.map( function( d ){ return d.Region; });           // colors

    //*** CREATE SCALES ***//

    var xScale = d3.scale.linear()
                         .domain( d3.extent( lifeExpectancy ) )
                         .range( [0, graphWidth] );

    var yScale = d3.scale.linear()
                         .domain( [ d3.max( fertilityRate ), 0] )
                         .range( [0, graphHeight] );

    var bScale = d3.scale.linear()
                         .domain( d3.extent( population ) )
                         .range( [minBubbleRadius, maxBubbleRadius] );

    var cScale = d3.scale.ordinal()
                         .domain( region )
                         .range( d3.scale.category10().range() );

    //*** BUILD GRAPH ELEMENTS ***//

    var svg = d3.selectAll( 'body' )
                .append( 'svg' )
                .attr({
                    width : totalWidth,
                    height : totalHeight
                })
                .append( 'g' )

    // xAxis

    var xAxis = d3.svg.axis().scale( xScale ).orient( 'bottom' ),

        xAxisNodes = svg.append( 'g' )
                        .attr({
                            'transform' : 'translate(' + (margin.left - axisPadding) + ',' + (graphHeight + margin.bottom - axisPadding) + ')'
                        })
                        .call( xAxis );

    styleNodes(xAxisNodes);

    // yAxis

    var yAxis = d3.svg.axis().scale( yScale ).orient( 'left' ),

        yAxisNodes = svg.append( 'g' )
                        .attr({
                            'transform' : 'translate(' + (margin.left - axisPadding) + ',' + (margin.top - axisPadding) + ')'
                        })
                        .call( yAxis );

    styleNodes(yAxisNodes);

    // bubbles

    svg.append( 'g' )
       .attr({
           'transform' : 'translate(' + margin.left + ',' + margin.top + ')'
       })
       .selectAll( 'circle' )
       .data( data )
       .enter()
       .append( 'circle' )
       .each( function( d ){
           d3.select(this)
             .attr({ cx : xScale( d.LifeExp ),
                     cy : yScale( d.FertRate ),
                      r : bScale( d.Population ),
                   fill : cScale( d.Region ),
                 stroke : cScale( d.Region ),
         'fill-opacity' : 0.5 })
     });

     function styleNodes( axisNodes ) {

         axisNodes.selectAll( '.domain' )
                  .attr({ fill : "none",
                "stroke-width" : 1,
                        stroke : "black" });

         axisNodes.selectAll( '.tick line' )
                  .attr({ fill : "none",
                "stroke-width" : 1,
                        stroke : "black" });

     }

});
