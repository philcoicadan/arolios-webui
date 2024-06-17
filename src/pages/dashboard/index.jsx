import { useCreatePath} from 'react-admin';
import {useNavigate } from 'react-router-dom';
import { useContext } from "react";
import { ClassifierContext} from '../../utils/contexts'

const CustomDashboard = () => {
    const createPath = useCreatePath();
    const navigate = useNavigate();
    const {mapDomainNameResource} = useContext(ClassifierContext);


    const def_dom = sessionStorage.getItem('arolios_model_default_domain') ;
    if ( def_dom ) {
        const { name, _tname} = JSON.parse(sessionStorage.getItem('arolios_model_default_domain'));
        mapDomainNameResource (name, _tname);
        return navigate(createPath( { resource: `${name}/classes`, type: 'list'}));

 
    } else {
       
        return navigate(createPath( { resource: 'domains', type: 'list' }));
    }
}

export default CustomDashboard;