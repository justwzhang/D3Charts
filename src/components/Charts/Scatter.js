import { useState, useContext, useEffect, useMemo } from 'react';
import { GlobalStoreContext } from '../../store'
import * as d3 from "d3";

export default function Scatter(){
    const { store } = useContext(GlobalStoreContext);
    const variableX = store.selectedX;
    const variableY = store.selectedY;

    const xCat = store.colType[variableX] == "cat";
    const yCat = store.colType[variableY] == "cat";
    const bothCat = xCat && yCat;

    let data=[];
    const xMap = new Map();
    const yMap = new Map();

    let xCatData=[];
    let yCatData=[];

    let xMax = 0;
    let yMax = 0;

    let xCounter =1;
    let yCounter =1;
    for(let i=0; i<store.data.length; i++){
        let current = store.data[i];
        let valX = current[variableX];
        let valY = current[variableY];

        // xCatData and yCatData both store the individual values
        // data has everything unless both are categorical data
        if(xCat && xMap.get(valX) == undefined) {
            xCatData.push(valX);
            xMap.set(valX, xCounter++);
        }   
        if(yCat && yMap.get(valY) == undefined) {
            yCatData.push(valY);
            yMap.set(valY, yCounter++);
        }
        
        data.push({
            x: xCat?valX:parseFloat(valX),
            y: yCat?valY:parseFloat(valY)
        });

        if(!xCat && xMax < parseFloat(valX)) xMax = parseFloat(valX)
        if(!yCat && yMax < parseFloat(valY)) yMax = parseFloat(valY)
    }



    redraw();
    function redraw(){
        d3.select("#DataViz").selectAll("svg").remove();
        let margin = {top: 30, right: 40, bottom: 50, left: 80},
        width = document.getElementById("DataViz").offsetWidth - margin.left - margin.right,
        height = document.getElementById("DataViz").offsetHeight - margin.top - margin.bottom;

        // init general svg
        let svg = d3.select("#DataViz")
            .append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
            .append("g")
                .attr("transform",
                    "translate(" + margin.left + "," + margin.top + ")");
        svg.append("text")
            .attr("x", (width/2))
            .style("text-anchor", "middle")
            .text(variableX + " vs " + variableY);

        // draw x axis
        let x = d3.scaleLinear()
            .domain([0, xMax+1]) 
            .range([0, width]);
        if(xCat){
            // data is categorical
            x = d3.scaleBand()
                .range([ 0, width ])
                .domain(xCatData.map(function(d) { return d; }))
                .padding(0.2);
            svg.append("g")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(x))
                .selectAll("text")
                .attr("transform", "translate(-10,0)rotate(-45)")
                .style("text-anchor", "end");
        
        }else{
            // data is numerical
            svg.append("g")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(x));
        }

        svg.append("text")
            .attr("x", (width/2))
            .attr("y", height+40)
            .style("text-anchor", "middle")
            .text(variableX);

        // draw y axis
        let y = d3.scaleLinear()
            .domain([0, yMax+1])
            .range([0, height]);
        if(yCat){
            // data is categorical
            y = d3.scaleBand()
                .domain(yCatData.map(function(d) { return d; }))
                .range([ 0, height])
                .padding(.1);
        }
        svg.append("g")
            .call(d3.axisLeft(y));
        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("x", -(height/2))
            .attr("y", -50)
            .style("text-anchor", "middle")
            .text(variableY);



        // Add dots
        svg.append('g')
            .selectAll("dot")
            .data(data)
            .enter()
            .append("circle")
                .attr("cx", function (d) { 
                    let catAddOn = 0;
                    if(bothCat)// iff both are categorical data then add a bit of randomness to the x value
                        catAddOn = x.bandwidth()*.5 + Math.floor(Math.random() * width/80)
                    else if(xCat)
                        catAddOn = x.bandwidth()*.5
                    return x(d.x) + catAddOn; 
                } )
                .attr("cy", function (d) { 
                    let catAddOn = 0;
                    if(bothCat)// iff both are categorical data then add a bit of randomness to the y value
                        catAddOn = y.bandwidth()*.5 + Math.floor(Math.random() * width/80)
                    else if(yCat)
                        catAddOn = y.bandwidth()*.5
                    return y(d.y) + catAddOn;
                } )
                .attr("r", 3)
                .style("fill", "#69b3a2")


        d3.select(window).on("resize.DataViz", resize);

    }

    function resize(){
        redraw();
    }
}