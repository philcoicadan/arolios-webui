import { useCreatePath} from 'react-admin';
import {useNavigate } from 'react-router-dom';
import { useContext , useEffect} from "react";
import { ClassifierContext} from '../../utils/contexts'

const CustomDashboard = () => {
    const createPath = useCreatePath();
    const navigate = useNavigate();
    const {mapDomainNameResource} = useContext(ClassifierContext);
    const def_dom = sessionStorage.getItem('arolios_model_default_domain') ;

    useEffect(() => {

        if (def_dom) {
            const { name, _tname } = JSON.parse(sessionStorage.getItem('arolios_model_default_domain'));
            const path = createPath({ resource: `${name}/classes`, type: 'list' });
            mapDomainNameResource(name, _tname);

            return navigate(path);


        } else {
            const path = createPath({ resource: 'domains', type: 'list' });
            return navigate(path);
        }
    }, []);
}

export default CustomDashboard;