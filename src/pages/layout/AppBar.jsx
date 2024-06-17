import * as React from 'react';
import { AppBar, TitlePortal, Link} from 'react-admin';


import {
    Box,
} from '@mui/material';
import ForestIcon from '@mui/icons-material/Forest';

export const CustomAppBar = (props) => (

    
    <AppBar
    sx={{
        "& .RaAppBar-title": {
            flex: 1,
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            overflow: "hidden",
        },
    }}
    {...props}
    > 
 
        <Box className="RaAppBar-title" sx={{ marginRight: '1em', height: 30 }}>
        <Link to='/about' sx={{ color: 'white'}}><ForestIcon /></Link>
        </Box>

        <span className="RaAppBar-spacer" />
        <TitlePortal /> 
    </AppBar>
);



export default CustomAppBar;