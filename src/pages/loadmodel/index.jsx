import {FileInput, FileField, useNotify, useRedirect } from 'react-admin';
import { SimpleForm, useTranslate} from 'react-admin';
import { backEndURL } from '../../utils/utils';



const LoadModel = () => {
    const translate = useTranslate();
    const notify = useNotify();
    const redirect = useRedirect();
    const postModel = (data) => {

        const { token } = JSON.parse(sessionStorage.getItem('arolios_auth'));
        const formData = new FormData();
        formData.append ('file', data.model.rawFile, `${data.model.title}`);
        const request = new Request(backEndURL() + '/models', {
            method: 'POST', 
            body: formData,
            headers: new Headers({ 'Authorization':`Bearer ${token}` }),            
        });

        return fetch(request, { credentials: 'include'})
        .then(response => {
            if (response.status < 200 || response.status >= 300) {
                throw new Error(response.statusText);
            }
            notify ('arolios.import_success', {type: 'success', messageArgs: { title: `${data.model.title}`}})
            redirect ('/');
            return Promise.resolve();
        })
        .catch(() => {
            throw new Error('Network error')
        });

    }
    return (
        <div>
            <h1>{translate('arolios.model_loading')}</h1>
            <SimpleForm onSubmit={postModel}>
            <FileInput source="model" label={translate('resources.models.name',1)}>
                <FileField source="src" title="title"/>
            </FileInput>
            
            </SimpleForm>
        </div>
    )
}

export default LoadModel;