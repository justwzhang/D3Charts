import { useState, useContext, useEffect } from 'react';
import { GlobalStoreContext } from '../store'
import{
    TypeSelector,
    VariableSelector
} from './Selectors'

import AppBar from '@mui/material/AppBar';
import { Button } from '@mui/material';

 export default function NavBar(){
    const [age, setAge] = useState(10);
    const { store } = useContext(GlobalStoreContext);
    let isHist = store.visType == "bar";

    function handleClick(){
        if(isHist)
            store.rotate()
        else
            store.swap()
    }
    return (
        <AppBar position="static" component="header" sx={{minHeight:'10vh', background:"#3d5a80", maxHeight:'10vh', width:"100vw"}}>
            <div style={{width:"100%"}}>
                <TypeSelector/>
                <VariableSelector/>
                <Button 
                    onClick={handleClick}
                    variant="contained"
                    style={{ marginTop:"1%"}}
                >
                    {isHist?"Rotate":"Swap X and Y"}
                </Button>
            </div>
            
        </AppBar>
        )
 }