
import { useTranslate } from 'react-admin';

export const roleChoices = () => {
    return  [
    { id: 'no', name: 'arolios.user_roles.no'},
    { id: 'reader', name: 'arolios.user_roles.reader'},
    { id: 'author', name: 'arolios.user_roles.author'},
    { id: 'admin', name: 'arolios.user_roles.admin'}
 ]
    
};



export const RenderRole = ( (record)  => {
    const translate = useTranslate();
    const roles = {
      
        no: translate('arolios.user_roles.no'),
        reader: translate('arolios.user_roles.reader'),
        author: translate('arolios.user_roles.author'),
        admin: translate('arolios.user_roles.admin')
    }
     return roles[record.role];
 } )
