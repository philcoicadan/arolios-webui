import { Toolbar, SaveButton, PasswordInput, Create, Edit, SimpleForm, SelectInput, required, ReferenceInput, TopToolbar, useNotify, useRedirect} from "react-admin";
import * as MUI from '@mui/material';
import { useCreatePath, useTranslate} from "react-admin";
import { useNavigate } from 'react-router-dom';


const equalToNewPassword = (value, allValues) => {
    if (value !== allValues.new_password) {
        return 'arolios.password_not_identical';

    }
}

export const PasswordCreate = () => {
    const notify = useNotify();
    const redirect = useRedirect();
    const onSuccess = (data) => {
        notify('arolios.password_updated');
        redirect('edit', 'settings', 'my_settings');

    }
    return (


        <Create title="arolios.change_password" mutationOptions={{ onSuccess }} >

            <SimpleForm>

                <PasswordInput label="arolios.current_password" source="current_password" fullWidth validate={required()} />
                <PasswordInput label="arolios.new_password" source="new_password" fullWidth validate={required()} />
                <PasswordInput label="arolios.confirm_password" source="confirm_password" fullWidth validate={[required(), equalToNewPassword]} />


            </SimpleForm>

        </Create>
    )
}

const ChangePasswordButton = () => {
    const translate = useTranslate();
    const createPath = useCreatePath();
    const navigate = useNavigate();

    const handleClick = () => {
        const link = createPath({
            type: 'create',
            resource: 'password'
        });

        navigate(link);
    };

    return (<MUI.Link component="button" variant="body2" onClick={handleClick} >{translate('arolios.change_password')}</MUI.Link>);
}


const SettingActions = () => (
    <TopToolbar>
        <ChangePasswordButton />
    </TopToolbar>
)


const EditToolbar = () => {

    return (
        <Toolbar>
            <SaveButton />
        </Toolbar>
    )

}

export const SettingsEdit = () => {
    const translate = useTranslate();
 
    return (


        <Edit title={translate('resources.settings.name', 2)} actions={<SettingActions />} redirect={false} mutationOptions={{ meta: { prefix: 'settings' }  }} mutationMode="pessimistic" queryOptions={{ meta: { prefix: 'settings', context: 'rfu' } } }>

            <SimpleForm toolbar={<EditToolbar />}>

                <ReferenceInput source="model_language" reference="languages" sort={{ field: 'code', order: 'ASC' }} queryOptions={{ meta: { getmany_context: 'languages' } }}>
                    <SelectInput label="arolios.model_language" optionText="name" optionValue="code" validate={required()} />
                </ReferenceInput>

            </SimpleForm>


        </Edit>)


}
