import { useState, useContext, useEffect, useMemo } from 'react';
import { GlobalStoreContext } from '../../store'
import * as d3 from "d3";

export default function BarChart(){
    const { store } = useContext(GlobalStoreContext);
    const isVert = store.vert;
    const variable = store.selectedX;
    let dataTemp = {};
    let data =[];
    for(let i=0; i<store.data.length; i++){
        if( Object.hasOwn(dataTemp, store.data[i][variable])) dataTemp[store.data[i][variable]] = dataTemp[store.data[i][variable]] + 1;
        else dataTemp[store.data[i][variable]] = 1
    }
    let max = 0;
    for(let property in dataTemp){
        if(dataTemp[property]> max) max = dataTemp[property];
        data.push({prop:property, val:dataTemp[property]});
    }
    redraw();
    function redraw(){

        d3.select("#DataViz").selectAll("svg").remove()

        if(isVert){// if it is vertical
            let margin = {top: 30, right: 30, bottom: 70, left: 60},
            width = document.getElementById("DataViz").offsetWidth - margin.left - margin.right,
            height = document.getElementById("DataViz").offsetHeight - margin.top - margin.bottom;

            //Create basic svg
            let svg = d3.select("#DataViz")
                .append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                    .attr("id", "BarChart")
                .append("g")
                    .attr("transform",
                        "translate(" + margin.left + "," + margin.top + ")")
            svg.append("text")
                .attr("x", (width/2))
                .style("text-anchor", "middle")
                .text(variable + " Bar Chart");


            //add X axis
            var x = d3.scaleBand()
                .range([ 0, width ])
                .domain(data.map(function(d) { return d.prop; }))
                .padding(0.2);
            svg.append("g")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(x))
                .selectAll("text")
                .attr("transform", "translate(-10,0)rotate(-45)")
                .style("text-anchor", "end");
            svg.append("text")
                .attr("x", (width/2))
                .attr("y", height+50)
                .style("text-anchor", "middle")
                .text(variable);

                
            
            // Add Y axis
            var y = d3.scaleLinear()
                .domain([0, max])
                .range([ height, 0]);
                svg.append("g")
                .call(d3.axisLeft(y));
            svg.append("text")
                .attr("transform", "rotate(-90)")
                .attr("x", -(height/2))
                .attr("y", -40)
                .style("text-anchor", "middle")
                .text("Total Amount");


            // Bars
            svg.selectAll("mybar")
            .data(data)
            .enter()
            .append("rect")
                .attr("x", function(d) { return x(d.prop); })
                .attr("y", function(d) { return y(d.val); })
                .attr("width", x.bandwidth())
                .attr("height", function(d) { return height - y(d.val); })
                .attr("fill", (d,i)=>{return `rgb(0, 0, ${i*15 + ""})`})
            
            
        
            
        }else{// if it is horizontal
            let margin = {top: 20, right: 30, bottom: 40, left: 90},
            width = document.getElementById("DataViz").offsetWidth - margin.left - margin.right,
            height = document.getElementById("DataViz").offsetHeight - margin.top - margin.bottom;

            let svg = d3.select("#DataViz")
                .append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                .append("g")
                    .attr("transform",
                        "translate(" + margin.left + "," + margin.top + ")")
            svg.append("text")
                .attr("x", (width/2))
                .style("text-anchor", "middle")
                .text(variable + " Bar Chart");
            
            //add X axis
            let x = d3.scaleLinear()
                .range([0, width])
                .domain([0, max])
            svg.append("g")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(x))
                .selectAll("text")
                .attr("transform", "translate(-10,0)rotate(-45)")
                .style("text-anchor", "end");
            svg.append("text")
                .attr("x", (width/2))
                .attr("y", height+35)
                .style("text-anchor", "middle")
                .text("Total Amount");

                
            
            // Add Y axis
            let y = d3.scaleBand()
                .domain(data.map(function(d) { return d.prop; }))
                .range([ 0, height])
                .padding(.1);
            svg.append("g")
                .call(d3.axisLeft(y));
            svg.append("text")
                .attr("transform", "rotate(-90)")
                .attr("x", -(height/2))
                .attr("y", -50)
                .style("text-anchor", "middle")
                .text(variable);
            
                //bars
            svg.selectAll("myRect")
                .data(data)
                .enter()
                .append("rect")
                .attr("x", x(0))
                .attr("y", function(d) { return y(d.prop); })
                .attr("width", function(d) { return x(d.val); })
                .attr("height", y.bandwidth() )
                .attr("fill", (d,i)=>{return `rgb(0, 0, ${i*15 + ""})`})

        }
        d3.select(window).on("resize.DataViz", null);
        d3.select(window).on("resize.DataViz", resize);
    }




    function resize(){
        redraw();
    }
    
}