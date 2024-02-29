import { useState, useContext, useEffect, useMemo } from 'react';
import { GlobalStoreContext } from '../../store'
import * as d3 from "d3";

export default function Histogram(){
    const { store } = useContext(GlobalStoreContext);
    const isVert = store.vert;
    const variable = store.selectedX;
    let data =[];
    let max = 0;
    for(let i=0; i<store.data.length; i++){
        if(parseFloat(store.data[i][variable]) > max) max = parseFloat(store.data[i][variable]);
        data.push({
            // prop: variable,
            val:store.data[i][variable]
        })
        // data.push(parseFloat(store.data[i][variable]))
    }

    redraw();
    function redraw(){
        d3.select("#DataViz").selectAll("svg").remove();

        if(isVert){
            var margin = {top: 40, right: 30, bottom: 50, left: 80},
            width = document.getElementById("DataViz").offsetWidth - margin.left - margin.right,
            height = document.getElementById("DataViz").offsetHeight - margin.top - margin.bottom;
    
            var svg = d3.select("#DataViz")
                .append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                .append("g")
                    .attr("transform",
                        "translate(" + margin.left + "," + margin.top + ")");
            svg.append("text")
                .attr("x", (width/2))
                .style("text-anchor", "middle")
                .text(variable + " Histogram");

            let x = d3.scaleLinear()
                .domain([0, max+1]) 
                .range([0, width]);
            svg.append("g")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(x));
            svg.append("text")
                .attr("x", (width/2))
                .attr("y", height+40)
                .style("text-anchor", "middle")
                .text(variable);
    
            let histogram = d3.histogram()
                .value(function(d){return d.val})
                .domain([0, max])
                .thresholds(x.ticks(20));
    
            let bins = histogram(data);
    
            let y = d3.scaleLinear()
                .range([height, 0])
                .domain([0, d3.max(bins, function(d) { return d.length; })]); 
            svg.append("g")
                .call(d3.axisLeft(y));
            svg.append("text")
                .attr("transform", "rotate(-90)")
                .attr("x", -(height/2))
                .attr("y", -40)
                .style("text-anchor", "middle")
                .text("Total Amount");
            
            svg.selectAll("rect")
                .data(bins)
                .enter()
                .append("rect")
                    .attr("x", 1)
                    .attr("transform", function(d) { return "translate(" + x(d.x0) + "," + y(d.length) + ")"; })
                    .attr("width", function(d) { return x(d.x1) - x(d.x0)-1; })
                    .attr("height", function(d) { return height - y(d.length); })
                    .attr("fill", (d,i)=>{return `rgb(0, 0, ${i*15 + ""})`});
        }else{

            var margin = {top: 40, right: 30, bottom: 50, left: 80},
            width = document.getElementById("DataViz").offsetWidth - margin.left - margin.right,
            height = document.getElementById("DataViz").offsetHeight - margin.top - margin.bottom;
    
            var svg = d3.select("#DataViz")
                .append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                .append("g")
                    .attr("transform",
                        "translate(" + margin.left + "," + margin.top + ")");
            svg.append("text")
                .attr("x", (width/2))
                .style("text-anchor", "middle")
                .text(variable + " Histogram");

            let y = d3.scaleLinear()
                .domain([0, max+1])
                .range([0, height]);
            svg.append("g")
                .call(d3.axisLeft(y));
            svg.append("text")
                .attr("transform", "rotate(-90)")
                .attr("x", -(height/2))
                .attr("y", -40)
                .style("text-anchor", "middle")
                .text(variable);

            let histogram = d3.histogram()
                .value(function(d){return d.val})
                .domain([0, max])
                .thresholds(y.ticks(20));
    
            let bins = histogram(data);

            let x = d3.scaleLinear()
                .range([0, width])
                .domain([0, d3.max(bins, function(d) { return d.length; })])
            svg.append("g")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(x));
            svg.append("text")
                .attr("x", (width/2))
                .attr("y", height+40)
                .style("text-anchor", "middle")
                .text("Total Amount");

           console.log(bins);
            
            
            svg.selectAll("rect")
                .data(bins)
                .enter()
                .append("rect")
                .attr("x", 1)
                    .attr("transform", function(d) { return "translate(" + 0 + "," + y(d.x0) + ")"; })
                    .attr("height", function(d) { return y(d.x1) - y(d.x0)-1; })
                    .attr("width", function(d) { return x(d.length); })
                    .attr("fill", (d,i)=>{return `rgb(0, 0, ${i*15 + ""})`});


        }
        d3.select(window).on("resize.DataViz", resize);
    }
    
    function resize(){
        redraw();
    }
}