import {FileInput, FileField , useNotify, useRedirect, useCreatePath} from 'react-admin';
import { SimpleForm, useTranslate, required} from 'react-admin';
import { backEndURL } from '../../utils/utils';


// from downloadCSV
const    downloadJSON = (content, filename) => {
        const fakeLink = document.createElement('a');
        fakeLink.style.display = 'none';
        document.body.appendChild(fakeLink);
        const blob = new Blob([content], { type: 'application/json;charset=utf-8' });
        // @ts-ignore
        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            // Manage IE11+ & Edge
            // @ts-ignore
            window.navigator.msSaveOrOpenBlob(blob, `${filename}.json`);
        } else {
            fakeLink.setAttribute('href', URL.createObjectURL(blob));
            fakeLink.setAttribute('download', `${filename}.json`);
            fakeLink.click();
        }
    };

const ExportData = () => {
    const translate = useTranslate();
    const notify = useNotify();
    const redirect = useRedirect();
    const createPath = useCreatePath();
    const postData = (data) => {

        const { token } = JSON.parse(sessionStorage.getItem('arolios_auth'));
        const formData = new FormData();
        formData.append ('file', data.query.rawFile, `${data.query.title}`);
        if (data.params != null) {
            formData.append ('file', data.params.rawFile, `${data.params.title}`);
        }
        const request = new Request(backEndURL() + '/instances', {
            method: 'POST', 
            body: formData,
            headers: new Headers({ 'Authorization':`Bearer ${token}` }),            
        });

        return fetch(request, { credentials: 'include'})
        .then(response => {
            if (response.status < 200 || response.status >= 300) {
                throw new Error(response.statusText);
            }
            return response.json();
        } )
        .then ( json => {
            notify ('arolios.export_success', {type: 'success', messageArgs: { title: `${data.query.title}`}});
            downloadJSON (JSON.stringify(json["elements"]), "export");
            redirect ('/');
            return Promise.resolve();
        })
        .catch(() => {
            throw new Error('Network error')
        });

    }
    return (
        <div>
            <h1>{translate('arolios.data_export')}</h1>
            <SimpleForm onSubmit={postData}>
            <FileInput source="query" label="arolios.export_query">
                <FileField source="src" title="title" validate={required}/>
            </FileInput>
            <FileInput source="params" label="arolios.export_params">
                <FileField source="src" title="title"/>
            </FileInput>
            
            </SimpleForm>
        </div>
    )
}


export default ExportData;