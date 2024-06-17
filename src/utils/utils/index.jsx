import { SaveButton, Toolbar, useNotify, useRedirect} from 'react-admin';

export const extractDomainClassifier = ( resource) => {

    const [domain, classifier] = resource.split('.',2);

    return { domain, classifier};

}

export const useExtractFirstResourceElement = ( resource, sep='.') => {

    const fragments = resource.split(sep,2);
    return fragments[0];
}

export const extractResourceFromPathName = ( pathname) => {

    const fragments = pathname.split('/',2);

    return fragments[1];    

}

export const idFromURL = ( url) => {

    const id = url.split('/').pop();
  
    return id;    

}


export const ImportSaveButton = props => {
    const notify = useNotify();
    const redirect = useRedirect ();
    const onSuccess = (response) => {
        notify ('arolios.import_success',  {type: 'success', messageArgs: { title: `${response.data.title}`}});
        redirect ('/home');
    };
    return <SaveButton {...props} />;
}
export const ImportSaveToolbar = () => {
    <Toolbar>
        <ImportSaveButton />
    </Toolbar>
}

export const backEndURL = () => {
   return import.meta.env.VITE_BACKEND_URL;
}