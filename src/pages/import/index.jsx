import {FileInput, FileField, useNotify, useRedirect } from 'react-admin';
import { SimpleForm, useTranslate} from 'react-admin';
import { backEndURL } from '../../utils/utils';


const ImportData = () => {
    const translate = useTranslate();
    const notify = useNotify();
    const redirect = useRedirect();
    const postData = (data) => {

        const { token } = JSON.parse(sessionStorage.getItem('arolios_auth'));
        const formData = new FormData();
        formData.append ('file', data.import.rawFile, `${data.import.title}`);
        const request = new Request(backEndURL() + '/instances', {
            method: 'PUT', 
            body: formData,
            headers: new Headers({ 'Authorization':`Bearer ${token}` }),            
        });

        return fetch(request, { credentials: 'include'})
        .then(response => {
            if (response.status < 200 || response.status >= 300) {
                throw new Error(response.statusText);
            }
            notify ('arolios.import_success', {type: 'success', messageArgs: { title: `${data.import.title}`}})
            redirect ('/');
            return Promise.resolve();
            
        })
        .catch(() => {
            throw new Error('Network error')
        });

    }
    return (
        <div>
            <h1>{translate('arolios.data_loading')}</h1>
            <SimpleForm onSubmit={postData}>
            <FileInput source="import" label="arolios.import">
                <FileField source="src" title="title"/>
            </FileInput>
            
            </SimpleForm>
        </div>
    )
}

export default ImportData;