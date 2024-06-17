
import {  List, SimpleList, TextField } from "react-admin";



export const LanguageList = (() => {


    return (
    <List  exporter={false} sort={{ field: 'code', order:"ASC"}} >
        <SimpleList >
               
                <TextField source ="code" label="arolios.code"/>

        </SimpleList>

       
    </List>)
} )
