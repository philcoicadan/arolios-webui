import {FileInput, FileField, useNotify, useRedirect } from 'react-admin';
import { SimpleForm, useTranslate } from 'react-admin';
import { backEndURL } from '../../utils/utils';

const LoadTranslations = () => {
    const translate = useTranslate();
    const notify = useNotify();
    const redirect = useRedirect();



    const postTranslations = (data) => {

        const { token } = JSON.parse(sessionStorage.getItem('arolios_auth'));
        const formData = new FormData();

        formData.append ('file', data.translations.rawFile, `${data.translations.title}`);
        const request = new Request(backEndURL() + '/translations', {
            method: 'POST', 
            body: formData,
            headers: new Headers({ 'Authorization':`Bearer ${token}` }),            
        });

        return fetch(request, { credentials: 'include'})
        .then(response => {
            if (response.status < 200 || response.status >= 300) {
                throw new Error(response.statusText);
            }
            notify ('arolios.import_success', {type: 'success', messageArgs: { title: `${data.translations.title}`}});
            redirect ('/');
            return Promise.resolve();
        })
        .catch(() => {
            throw new Error('Network error')
        });

    }
    return (
        <div>
            <h1>{translate('arolios.translation_loading')}</h1>
            <SimpleForm onSubmit={postTranslations}>
            <FileInput source="translations" label={translate('resources.translations.name',2)}>
                <FileField source="src" title="title"/>
            </FileInput>
            
            </SimpleForm>
        </div>
    )
}

export default LoadTranslations;