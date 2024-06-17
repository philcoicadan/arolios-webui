
import {useTranslate, ListButton, TopToolbar, List, Datagrid, TextField, BooleanField ,FunctionField, useCreatePath, useResourceContext} from 'react-admin';

import { useContext } from "react";

import { ClassifierContext } from "../../utils/contexts";
import { useExtractFirstResourceElement } from "../../utils/utils";
import { useState } from "react";
import IconLink from '@mui/icons-material/Link'



const TLActions = ( {base} ) => {
    const translate = useTranslate();
    return (
    <TopToolbar>

            <ListButton
                resource={`${base}/associations`}
                label={translate('arolios.associations')}
                icon={<IconLink/>}
            >
            </ListButton>


    </TopToolbar>
    )
    
}


export const ClassList = (() => {
    const { domainNames  } = useContext(ClassifierContext);
    const resource = useResourceContext ();
    const translate = useTranslate ();
    const domain  = useExtractFirstResourceElement (resource, '/');
    const domainDisplay = domainNames[domain];
    const createPath = useCreatePath();
    const {mapClassifierNameResource} = useContext(ClassifierContext);

    return (
    <List  title={`${domainDisplay}: ${translate ('arolios.classes')}` } actions={<TLActions base={domain}/>} exporter={false} sort={{ field: 'name', order:"ASC"}} queryOptions={{ meta:{ prefix: 'domains'}}}>
        <Datagrid 
            bulkActionButtons={false}

            rowClick= {(id, resource, record) => {
                mapClassifierNameResource (record.id, record._tid_name);
                return createPath( { resource: record.id, type: 'list' })}
            } >
               
                <FunctionField source ="name" label="arolios.name"
                    render = {record => record['_tname'] }/>

                 <BooleanField source ="isAbstract" label="arolios.is_abstract"/>
                 
                <TextField source ="description" label="arolios.description" sortable={false}/>
        </Datagrid>

       
    </List>)
} )