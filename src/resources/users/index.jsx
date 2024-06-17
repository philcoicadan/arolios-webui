
import {FunctionField, Create, List, Datagrid, TextField,  EditButton, TextInput, Edit, SimpleForm, PasswordInput, Toolbar, SaveButton, DeleteWithConfirmButton, required, SelectInput, useTranslate} from 'react-admin';
import {RenderRole, roleChoices} from '../../utils/users'



export const UserList = (() => {

    return (
    <List sort={{ field: 'identifier', order:"ASC"}} exporter={false} queryOptions= { {meta: { i18n: false}}}>
        <Datagrid 
            bulkActionButtons={false}
         >

                <TextField source ="identifier" label="arolios.user_identifier"/>
                <FunctionField source ="role" label="arolios.user_role" render={RenderRole}/>
                <EditButton />
        </Datagrid>

       
    </List>)
 })

 const EditToolbar = () => {
    const translate = useTranslate();
    return (
        <Toolbar>
            <SaveButton />
            <DeleteWithConfirmButton
                confirmContent={translate('arolios.delete_confirm_msg')}
                translateOptions={ {name: translate('resources.users.name',1)}}
                
            />
        </Toolbar>
    )

}



const equalToPassword = (value, allValues) => {
    if (value !== allValues.password) {
        return 'arolios.password_not_identical';

    }
}
export const UserEdit = () => {

    const translate = useTranslate();
     
    return (
        
            <Edit   queryOptions={{ meta:{  context: 'rfu'}}}>
        
                <SimpleForm toolbar= {<EditToolbar />}>
                    <TextInput label="arolios.user_identifier" source="identifier" multiline fullWidth resettable validate={required()}/>
                    <PasswordInput label={translate('resources.password.name',1)} source="password" fullWidth /> 
                    <PasswordInput label="arolios.confirm_password" source="confirm_password" fullWidth validate={[equalToPassword]}/> 
                    <SelectInput label="arolios.user_role" source="role"   validate={required()}  choices={roleChoices()}/>
                    

                </SimpleForm>
        
            </Edit>

            

    
    )
}

export const UserCreate = () => {
    const translate = useTranslate ();

     
    return (
        
            <Create>
        
                <SimpleForm>
                    <TextInput label="arolios.user_identifier" source="identifier" multiline fullWidth resettable validate={required()}/>
                    <PasswordInput label={translate('resources.password.name',1)} source="password" fullWidth validate={required()}/> 
                    <PasswordInput label="arolios.confirm_password" source="confirm_password" fullWidth validate={[required(), equalToPassword]}/> 
                    <SelectInput label="arolios.user_role" source="role"  validate={required()}  choices={roleChoices()}/>
                    

                </SimpleForm>
        
            </Create>

            

    
    )
}

