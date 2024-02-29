import { useState, useContext, useEffect, useMemo } from 'react';
import { GlobalStoreContext } from '../store'
import {
    BarChart,
    Histogram,
    Scatter
} from './Charts'

export default function HomeScreen(){
    const { store } = useContext(GlobalStoreContext);
    const isHist = store.visType == "bar"?true:false;
    const hasX = store.selectedX != "";
    const hasY = store.selectedY != "";
    const isVert = store.vert;
    
     
    let display = useMemo(()=>{
        if(!hasX && !hasY) return <></>
        else if(isHist && store.colType[store.selectedX] == "cat") return <BarChart/>
        else if(isHist && store.colType[store.selectedX] == "num") return <Histogram/>
        else if(!isHist && hasX && hasY) return <Scatter/>
        else return <></>
    });

    return (
        <div id="DataViz" style={{display:"block", width:"90%", background:"white", height:"90vh", marginLeft:"5%", overflow:"hidden"}}>
            {display}
        </div>
    )
}