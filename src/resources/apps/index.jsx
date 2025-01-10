import * as React from "react";
import {AutocompleteInput, FunctionField, WrapperField, Edit, Toolbar, SaveButton, DeleteWithConfirmButton, ReferenceInput, SelectInput, Link, useCreatePath, useNotify, useRedirect, required, FileInput, FileField, TextInput, List, Datagrid, TextField, TopToolbar, Create, SimpleForm, CreateButton, EditButton, ListButton, useRecordContext} from 'react-admin';
import DomainIcon from '@mui/icons-material/Domain'
import IconLink from '@mui/icons-material/Link'
import PeopleIcon from '@mui/icons-material/People'
import PermDataSettingIcon from '@mui/icons-material/PermDataSetting'
import { useTranslate } from "react-admin";
import {useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import {useParams} from "react-router-dom";
import {roleChoices, RenderRole} from '../../utils/users'
import { idFromURL , backEndURL} from "../../utils/utils";


const ALActions = ( { selection }) => {
    const translate = useTranslate();
    return (
    <TopToolbar>
            <CreateButton/>
            <ListButton
                resource={'appdomains'}
                label={translate('resources.appdomains.name',2)}
                icon={<DomainIcon/>}
            >
            </ListButton>
            <ListButton
                resource={'appusers'}
                label={translate('resources.appusers.name',2)}
                icon={<PeopleIcon/>}
            >
            </ListButton>

    </TopToolbar>
    )
    
}



const AppConfigButton = () => {
    const record = useRecordContext ();
    const navigate =useNavigate();

    const handleClick = () => {
        const link = `/apps/${record.name}/config`
       navigate(link);
    }

    return ( <Button  variant="outlined" onClick={handleClick} startIcon={ <PermDataSettingIcon/>} >
               
            </Button> )
}

export const AppList = (() => {
    
    return (
    <List actions={<ALActions/>} sort={{ field: 'name', order:"ASC"}} exporter={false} queryOptions= { {meta: { i18n: false}}}>
        <Datagrid 
            
            bulkActionButtons={false}
            
         >

                <TextField source ="name" label="arolios.name"/>

                <EditButton />
                <AppConfigButton />
               
        </Datagrid>

       
    </List>)
 })
 const AppAssocField = ({ resource, field, label }) => {
    const record  = useRecordContext();
    const createPath = useCreatePath();
   if (!record) return null;

    const id = idFromURL(record[`${field}`]['url']);

    return (
        <WrapperField label={label} sortable={false}>
            <Link to={createPath( {resource: resource, id: id, type:'show'})}><IconLink/></Link>
        </WrapperField>
    );

}


 export const AppUserList = (() => {
    const translate = useTranslate();
       
    return (
    <List  disableSyncWithLocation   exporter={false} sort={{ field: 'user.identifier', order:"ASC"}} queryOptions={{  properties: 'list'}}>
        <Datagrid 
            bulkActionButtons={false}
        >

                <AppAssocField resource ="apps" field ="app" label={translate('resources.apps.name',1)}/> 
                <TextField source = "app.name" label="arolios.app_name"/>
                <AppAssocField resource = "users" field ="user" label={translate('resources.users.name',1)}/>
                <TextField source = "user.identifier" label="arolios.user_identifier"/>
                <FunctionField source = "role" label="arolios.user_role" render={RenderRole}/>

                <DeleteWithConfirmButton
                confirmContent={translate('arolios.delete_confirm_msg')}
                translateOptions={ {name: translate('resources.appusers.name',1)}}
            />

               
        </Datagrid>

       
    </List>)
 } )

 export const AppDomainList = (() => {

    const translate = useTranslate();

    return (
    <List  disableSyncWithLocation exporter={false} sort={{ field: 'id', order:"DESC"}} queryOptions={{  properties: 'list'}}>

    <Datagrid 

        bulkActionButtons={false}

        >
                <AppAssocField resource ="apps"  field ="app"  label={translate('resources.apps.name',1)}/>
                <TextField source = "app.name" label="arolios.app_name"/>
                
                <TextField source = "domain.name" label="arolios.domain_name"/>
 
            <DeleteWithConfirmButton
                confirmContent={translate('arolios.delete_confirm_msg')}
                translateOptions={ {name: translate('resources.appdomains.name',1)}}
            />
           

    </Datagrid> 
   
</List>)

 })

 export const AppConfigLoad = (() => {
    
    const translate = useTranslate();
    const { instId } = useParams ();
    const notify = useNotify();
    const redirect = useRedirect();
    const postConfig = (data) => {

        const { token } = JSON.parse(sessionStorage.getItem('arolios_auth'));
        const formData = new FormData();
        formData.append ('file', data.appconfig.rawFile, `${data.appconfig.title}`);
        const request = new Request(backEndURL() + `/apps/${instId}/config`, {
            method: 'POST', 
            body: formData,
            headers: new Headers({ 'Authorization':`Bearer ${token}` }),            
        });

        return fetch(request, { credentials: 'include'})
        .then(response => {
            if (response.status < 200 || response.status >= 300) {
                throw new Error(response.statusText);
            }
            notify ('arolios.import_success', {type: 'success', messageArgs: { title: `${data.appconfig.title}`}})
            redirect ('/');
            return Promise.resolve();
        })
        .catch(() => {
            throw new Error('Network error')
        });

    }
    return (
        <div>
            <h1>{translate('arolios.appconfig_loading')}</h1>
            <SimpleForm onSubmit={postConfig}>
            <FileInput source="appconfig" label="arolios.appconfig">
                <FileField source="src" title="title"/>
            </FileInput>
            
            </SimpleForm>
        </div>
    )
 })

 export const AppCreate = (() => {
 
    return (
    <Create  redirect="list" >
    
        <SimpleForm>
            
        <TextInput label="arolios.name" source='name' validate={[required()]} />
        <TextInput label="arolios.description" source='description' />

        </SimpleForm>
      
 

    </Create> 
    )
 })


 const EditToolbar = () => {
    const translate = useTranslate();

    return (
        <Toolbar>
            <SaveButton />
            <DeleteWithConfirmButton
                confirmContent={translate('arolios.delete_confirm_msg')}
                translateOptions={ {name: translate('resources.apps.name',1)}}
            />
        </Toolbar>
    )

}
 export const AppEdit = (() => {
    return (
    <Edit  queryOptions={{ meta:{  context: 'rfu'}}}>
    
        <SimpleForm toolbar= {<EditToolbar />}>
            
        <TextInput label="arolios.name" source='name' validate={[required()]} />
        <TextInput label="arolios.description" source='description' />

        </SimpleForm>
      
 

    </Edit> 
    )
 })




export const AppUserCreate = () => {
    const translate = useTranslate();
    const filterToQuery = searchText => ({ _s: `%${searchText}%` });
    return (

        <Create redirect="list" mutationOptions={{ meta: {} }}>

            <SimpleForm>

                <ReferenceInput source='app' reference='apps' sort={{ field: 'name', order: 'ASC' }} perPage={100} queryOptions={{ meta: { getmany_context: 'appassocs' } }}>
                    <SelectInput label={translate('resources.apps.name', 1)} optionText="name" optionValue="name" validate={required()} />
                </ReferenceInput>

                <ReferenceInput reference="users" source="user" sort={{ field: 'identifier', order: "ASC" }} queryOptions={{ meta: { getmany_context: 'appassocs' } }}>
                    <AutocompleteInput label={translate('resources.users.name', 1)} optionText="identifier" optionValue="identifier" filterToQuery={filterToQuery} validate={required()} />
                </ReferenceInput>


                <SelectInput label="arolios.user_role" source="role" validate={required()} choices={roleChoices()} />



            </SimpleForm>
        </Create>
    )
}

 export const AppDomainCreate = (() => {
    const translate=useTranslate();

    return (
    <Create redirect="list">
    
        <SimpleForm>

        <ReferenceInput source='app' reference='apps' sort={{field: 'name', order: 'ASC'}} perPage={100} queryOptions={{ meta:{ getmany_context: 'appassocs'}} }>
                <SelectInput label={translate('resources.apps.name',1)} optionText="name" optionValue="name" validate={required()}/>
        </ReferenceInput>

        <ReferenceInput source='domain' reference='domains' sort={{field: 'name', order: 'ASC'}} perPage={100} queryOptions={{ meta:{  getmany_context: 'appassocs'}} }>
                <SelectInput label="arolios.domain" optionText="_tname" optionValue="name" validate={required()}/>
        </ReferenceInput>

        </SimpleForm>
      
 

    </Create> 
    )
 })
