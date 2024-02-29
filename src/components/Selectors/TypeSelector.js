import { useState, useContext, useEffect } from 'react';
import { GlobalStoreContext } from '../../store'


import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

 
 
export default function TypeSelector(){
    const { store } = useContext(GlobalStoreContext);
    return(
        <FormControl variant="filled" sx={{ m: 1, maxWidth: 120, minWidth: 120}}>
            <InputLabel id="demo-simple-select-label" sx={{color:"orange"}}>Type</InputLabel>
            <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={store.visType}
                label="Type"
                onChange={(e)=>{store.updateVis(e.target.value);}}
                sx={{
                    border: "1px solid #ee6c4d",
                    color:"#fff",
                    '&::after': {
                        borderBottom: '1px solid orange'
                    },
                    '&::before': {
                        borderBottom: '1px solid orange'
                    }
                }}
            >
            <MenuItem value={"bar"}>Bar/Hist</MenuItem>
            <MenuItem value={"scatter"}>Scatter</MenuItem>
            </Select>
        </FormControl>
    )
}