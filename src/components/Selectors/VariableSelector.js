import { useState, useContext, useEffect, useMemo } from 'react';
import { GlobalStoreContext } from '../../store'


import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';

 
 
export default function VariableSelector(){
    const { store } = useContext(GlobalStoreContext);
    const [variable, setVariable] = useState("X");
    let isHist = store.visType == "bar"?true:false;
    let menuItems = useMemo(()=>{
        return store.columns.map((item, index)=>{
            return <MenuItem value={item}>{item}</MenuItem>
        })
    });
    
    function setVar(e){
        if (variable == "X")
            store.updateX(e.target.value);
        else
            store.updateY(e.target.value);
    } 

    return(
        <>
            <FormControl variant="filled" sx={{ m: 1, maxWidth: 120, minWidth: 200}}>
                <InputLabel sx={{color:"orange"}}>{"Change Variable"}</InputLabel>
                <Select
                    value={isHist?store.selectedX:(variable=="X"?store.selectedX:store.selectedY)}
                    label="Type"
                    onChange={(e)=>{setVar(e)}}
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
                {
                    menuItems
                }
                </Select>
            </FormControl>
            {
                isHist?<></>:
                <FormControl variant="filled" sx={{ m: 1, maxWidth: 120, minWidth: 200}}>
                    <FormLabel>Variable</FormLabel>
                    <RadioGroup
                        row
                        defaultValue={variable}
                        onChange={e=>{setVariable(e.target.value)}}

                        >
                        <FormControlLabel value="X" control={<Radio />} label="X" />
                        <FormControlLabel value="Y" control={<Radio />} label="Y" />
                        </RadioGroup>
                </FormControl>
            }
        </>
    )
}