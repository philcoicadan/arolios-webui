import { useCreatePath, useGetList} from 'react-admin';
import {useNavigate } from 'react-router-dom';
import { useContext , useEffect, useState} from "react";
import { ClassifierContext} from '../../utils/contexts'


const CustomDashboard = () => {
   
    const navigate = useNavigate();
    const createPath = useCreatePath();

    const { mapDomainNameResource } = useContext(ClassifierContext);

    

    useEffect(() => {
       
        if (sessionStorage.getItem('arolios_model_default_domain')) {
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