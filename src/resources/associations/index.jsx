
import {FunctionField, useTranslate, ListButton, TopToolbar, List, Datagrid, TextField, useCreatePath} from 'react-admin';
import { useContext } from "react";
import { ClassifierContext } from "../../utils/contexts";
import { useResourceContext } from "react-admin";
import { useExtractFirstResourceElement } from "../../utils/utils";
import { useState } from "react";
import IconInventory from '@mui/icons-material/Inventory'



const TLActions = ( {base} ) => {
    const translate = useTranslate();
    return (
    <TopToolbar>

            <ListButton
                resource={`${base}/classes`}
                label={translate('arolios.classes')}
                icon={<IconInventory/>}
            >
            </ListButton>


    </TopToolbar>
    )

}



export const AssociationList = (() => {
  
    const { domainNames  } = useContext(ClassifierContext);

    const translate = useTranslate();
    const resource = useResourceContext ();
    const domain = useExtractFirstResourceElement (resource, '/');
    const domainDisplay = domainNames[domain];

    const createPath = useCreatePath();
    const {mapClassifierNameResource} = useContext(ClassifierContext);


    return (
    <List title={`${domainDisplay}: ${translate ('arolios.associations')}` } actions={<TLActions base={domain}/>} exporter={false} sort={{ field: 'name', order:"ASC"}} queryOptions={{ meta:{ prefix: 'domains'}}}>
        <Datagrid 
            bulkActionButtons={false}

            rowClick= {(id, resource, record) => {
                mapClassifierNameResource (record.id, record._tid_name);

                return createPath( { resource: record.id, type: 'list' })}
            } >
               
               <FunctionField source ="name" label="arolios.name"
                    render = {record => record['_tname'] }/>
                <TextField source ="description" label="arolios.description" sortable={false}/>
        </Datagrid>

       
    </List>
    ) });