import { createContext, useContext, useState, useEffect } from "react";
import * as d3 from "d3";
import csvData from './VideoGameSales-Cleaned.csv';

export const GlobalStoreContext = createContext({});

export const GlobalStoreActionType = {
    UPDATE_DATA:"UPDATE_DATA",
    UPDATE_VIS_TYPE:"UPDATE_VIS_TYPE",
    UPDATE_X: "UPDATE_X",
    UPDATE_Y: "UPDATE_Y",
    UPDATE_X_AND_Y: "UPDATE_X_AND_Y",
    ROTATE: "ROTATE",
}

export const VisType={
    BAR:"BAR",
    HIST:"HIST",
    SCATTER:"SCATTER"

}


function GlobalStoreContextProvider(props) {
    const [store, setStore] = useState({
        data: [],
        columns: [],
        visType: "bar",
        selectedX: "",
        selectedY: "",
        gotData: false,
        vert: true,
        colType:{
            Name: "cat",
            Platform: "cat",
            Year_of_Release: "cat",
            Genre: "cat",
            Publisher: "cat",
            NA_Sales: "num",
            EU_Sales: "num",
            JP_Sales: "num",
            Other_Sales: "num",
            Global_Sales: "num",
            Critic_Score: "num",
            Critic_Count: "num",
            User_Score: "num",
            User_Count: "num",
            Developer: "cat",
            Rating: "cat"
        }
    });
    
    const storeReducer = (action) => {
        const { type, payload } = action;
        switch (type) {
            case GlobalStoreActionType.UPDATE_DATA:{
                return setStore({ // loads the data into program
                    data: payload.data,
                    columns: payload.columns,
                    visType: store.visType,
                    selectedX: store.selectedX,
                    selectedY: store.selectedY,
                    gotData: true,
                    vert: store.vert,
                    colType: store.colType,
                });
            }
            case GlobalStoreActionType.UPDATE_VIS_TYPE:{
                return setStore({ // updates vis type (bar/hist or scatter)
                    data: store.data,
                    columns: store.columns,
                    visType: payload,
                    selectedX: "",
                    selectedY: "",
                    gotData: true,
                    vert: true,
                    colType: store.colType,
                });
            }
            case GlobalStoreActionType.UPDATE_X:{
                return setStore({ // update selected x
                    
                    data: store.data,
                    columns: store.columns,
                    visType: store.visType,
                    selectedX: payload,
                    selectedY: store.selectedY,
                    gotData: true,
                    vert: store.vert,
                    colType: store.colType,
                });
            }
            case GlobalStoreActionType.UPDATE_Y:{
                return setStore({ // update selected y
                    data: store.data,
                    columns: store.columns,
                    visType: store.visType,
                    selectedY: payload,
                    selectedX: store.selectedX,
                    gotData: true,
                    vert: store.vert,
                    colType: store.colType,
                });
            }
            case GlobalStoreActionType.UPDATE_X_AND_Y:{
                return setStore({ // update selected y
                    data: store.data,
                    columns: store.columns,
                    visType: store.visType,
                    selectedY: payload.y,
                    selectedX: payload.x,
                    gotData: true,
                    vert: store.vert,
                    colType: store.colType,
                });
            }
            case GlobalStoreActionType.ROTATE:{
                return setStore({ // update selected y
                    data: store.data,
                    columns: store.columns,
                    visType: store.visType,
                    selectedY: store.selectedY,
                    selectedX: store.selectedX,
                    gotData: true,
                    vert: !store.vert,
                    colType: store.colType,
                });
            }
            default:
                return store;
        }
    }

    // if the data was not loaded yet then load the data into store with column data
    useEffect(()=>{
        if(!store.gotData){
            d3.csv(csvData).then((data)=>{
                
                let temp = [];
                let row = data[0];
                for(const prop in row){
                    temp.push(prop);
                }
                temp.sort();

                store.updateData(data.slice(0,500), temp);
            });
        }
        
    },[store.data]);

    // update the data
    store.updateData = function(data, cols){
        storeReducer({
            type: GlobalStoreActionType.UPDATE_DATA,
            payload:{
                data:data,
                columns:cols
            }
        });
    }

    // log state of store into console
    store.log = function(){
        console.log(store);
    }

    // Update the chosen visualization
    store.updateVis = function(data){
        d3.select("#DataViz").selectAll("svg").remove()
        storeReducer({
            type: GlobalStoreActionType.UPDATE_VIS_TYPE,
            payload:data
        });
    }

    // UpdateX Comp
    store.updateX= function(data){
        storeReducer({
            type: GlobalStoreActionType.UPDATE_X,
            payload:data
        });
    }
    // UpdateY Comp
    store.updateY= function(data){
        storeReducer({
            type: GlobalStoreActionType.UPDATE_Y,
            payload:data
        });
    }

    store.swap = function(){
        storeReducer({
            type: GlobalStoreActionType.UPDATE_X_AND_Y,
            payload: {
                x: store.selectedY,
                y:store.selectedX
            }
        });

    }
    store.rotate = function(){
        storeReducer({
            type: GlobalStoreActionType.ROTATE,
            payload: {

            }
        });
    }

    return (
        <GlobalStoreContext.Provider value={{
            store
        }}>
            {props.children}
        </GlobalStoreContext.Provider>
    );

}

export default GlobalStoreContext;
export { GlobalStoreContextProvider };