import * as React from 'react';
import HomeIcon from '@mui/icons-material/Home';
import UploadIcon from '@mui/icons-material/Upload';
import DownloadIcon from '@mui/icons-material/Download';
import HelpIcon from '@mui/icons-material/Help';
import PermDataSettingIcon from '@mui/icons-material/PermDataSetting';
import SettingsIcon from '@mui/icons-material/Settings';
import SchemaIcon from '@mui/icons-material/Schema';
import FlagIcon from '@mui/icons-material/Flag';
import DeleteIcon from '@mui/icons-material/Delete';
import DomainIcon from '@mui/icons-material/Domain';
import DescriptionIcon from '@mui/icons-material/Description';

import {useTranslate, useCreatePath, usePermissions } from 'react-admin';
import authProvider from '../../utils/authProvider';




import {

    Menu,
    MenuItemLink,

} from 'react-admin';





const CustomMenu = ( {dense = false, ...props}) => {

    const translate = useTranslate();
    const createPath = useCreatePath();
    const {permissions} = usePermissions();
    return (
        <Menu {...props}>
            <MenuItemLink
                    to="/"
                    state={{ _scrollToTop: true }}
                    primaryText='arolios.home'
                    leftIcon={<HomeIcon/>}
                    dense={dense}
            />
            <MenuItemLink
                    to={createPath({
                        resource: 'domains',
                        type: 'list',
                    })}
                    state={{ _scrollToTop: true }}
                    primaryText={translate('resources.domains.name',2)}
                    leftIcon={<DomainIcon/>}
                    dense={dense}
            />
 

            { authProvider.canEdit(permissions.role) ?
                <MenuItemLink
                    to="/instances/import"
                    state={{ _scrollToTop: true }}
                    primaryText='arolios.import'
                    leftIcon={<UploadIcon/>}
                    dense={dense}
                />
                : null
            }
            <MenuItemLink
                    to="/instances/export"
                    state={{ _scrollToTop: true }}
                    primaryText='arolios.export'
                    leftIcon={<DownloadIcon/>}
                    dense={dense}
            />
            { permissions.role === "admin" && permissions.isDefaultApp ? 
                <MenuItemLink
                    to={createPath({
                        resource: 'models',
                        type: 'create',
                    })}
                    state={{ _scrollToTop: true }}
                    primaryText={translate('resources.models.name',1)}
                    leftIcon={<SchemaIcon/>}
                    dense={dense}
                /> 
                : null
            }   
            { permissions.role === "admin" && permissions.isDefaultApp ? 
                <MenuItemLink
                   to={createPath({
                        resource: 'translations',
                        type: 'create',
                    })}
                    state={{ _scrollToTop: true }}
                    primaryText={translate('resources.translations.name',2)}
                    leftIcon={<FlagIcon/>}
                    dense={dense}
                />
                : null
            }

            <Menu.ResourceItem name='users' />
            

            <Menu.ResourceItem name='apps' />
            { permissions.role === "admin"  ? 
                <MenuItemLink
                    to={`apps/${permissions.appName}/config`}
                    state={{ _scrollToTop: true }}
                    primaryText='arolios.appconfig'
                    leftIcon={<PermDataSettingIcon/>}
                    dense={dense}
                />
                : null
            }
            { authProvider.canEdit(permissions.role) ?
                <MenuItemLink
                    to={createPath({
                        resource: 'trash',
                        type: 'list',
                    })}
                    state={{ _scrollToTop: true }}
                    primaryText={translate('resources.trash.name',1)}
                    leftIcon={<DeleteIcon/>}
                    dense={dense}
                />
                : null
            }

             <MenuItemLink
                    to={createPath({
                        resource: 'settings',
                        type: 'edit',
                        id: 'my_settings'
                    })}
                    state={{ _scrollToTop: true }}
                    primaryText={translate('resources.settings.name',2)}
                    leftIcon={<SettingsIcon/>}
                    dense={dense}
            />
            

            <MenuItemLink
                    to="help"
                    state={{ _scrollToTop: true }}
                    primaryText='arolios.help'
                    leftIcon={<HelpIcon/>}
                    dense={dense}
            />


            <MenuItemLink
                    to="about"
                    state={{ _scrollToTop: true }}
                    primaryText='arolios.about'
                    leftIcon={<DescriptionIcon/>}
                    dense={dense}
            />

        </Menu>
    )
}

export default CustomMenu;