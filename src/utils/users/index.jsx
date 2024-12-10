
import { useTranslate } from 'react-admin';

export const roleChoices = () => {
    return  [
    { id: 'no', name: 'arolios.user_roles.no'},
    { id: 'reader', name: 'arolios.user_roles.reader'},
    { id: 'producer', name: 'arolios.user_roles.producer'},
    { id: 'admin', name: 'arolios.user_roles.admin'}
 ]
    
};



export const RenderRole = ( (record)  => {
    const translate = useTranslate();
    const roles = {
      
        no: translate('arolios.user_roles.no'),
        reader: translate('arolios.user_roles.reader'),
        producer: translate('arolios.user_roles.producer'),
        admin: translate('arolios.user_roles.admin')
    }
     return roles[record.role];
 } )
