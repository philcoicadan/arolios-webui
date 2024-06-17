import  * as React from "react";
import { Authenticated, Admin, CustomRoutes, Resource, Error} from 'react-admin';
import { Route } from 'react-router';
import CustomDataProvider from './utils/dataProvider';
import authProvider from './utils/authProvider';
import i18nProvider from './utils/i18nProvider';
import {backEndURL, idFromURL} from './utils/utils';
import CustomDashboard from './pages/dashboard';
import CustomLayout from './pages/layout';
import DomainList  from './resources/domains';
import {UserList, UserCreate, UserEdit } from './resources/users';
import {AppList, AppCreate, AppEdit, AppConfigLoad, AppUserList, AppDomainList, AppUserCreate, AppDomainCreate}  from './resources/apps';
import { ClassList } from './resources/classes';
import { AssociationList } from './resources/associations';
import { SettingsEdit, PasswordCreate } from './resources/settings';
import AppsIcon from '@mui/icons-material/Apps'
import PeopleIcon from '@mui/icons-material/People';


import { ClassInstanceList, AssociationInstanceList
  , ClassInstanceCreate
  , AssocInstanceCreate
  , ClassInstanceEdit
  , AssocInstanceEdit
  , ClassInstanceShow 
  , AssocInstanceShow
  , InstanceAssocList
} from './resources/instances';
import {TrashList} from './resources/trash';
import { EnumerationValuesList} from './resources/enumerations';
import { LanguageList} from './resources/languages';
import Help from './pages/help';
import About from './pages/about';
import ImportData from './pages/import';
import ExportData from './pages/export';
import LoadModel from './pages/loadmodel';
import LoadTranslations from './pages/loadtranslations';




  const fetchDomains = (token, lang) => {
    const req = backEndURL() + '/domains?lang=' + lang;
    const request = new Request(req, {
            method: 'GET',
    headers: new Headers({ 'Content-Type': 'application/json' , 'Authorization':`Bearer ${token}`}),
    });
    return fetch(request, { credentials: 'include'})
    .then(response => {
        if (response.status < 200 || response.status >= 300) {
            throw new Error(response.statusText);
        }
        return response.json();
    })
    .then( (json ) => {

        if (json["total"] === 1) { 
            sessionStorage.setItem ('arolios_model_default_domain', JSON.stringify({name: json["elements"][0]['name'], _tname: json["elements"][0]['_tname']}));
        } else {
            sessionStorage.removeItem ('arolios_model_default_domain');
        };
        return Promise.resolve (  json["elements"]) 
    })

  }

  const fetchClasses = (token, lang)=> {
    const req = backEndURL() + '/classes?lang=' + lang;
    const request = new Request(req, {
            method: 'GET',
    headers: new Headers({ 'Content-Type': 'application/json' , 'Authorization':`Bearer ${token}`}),
    });
    return fetch(request, { credentials: 'include'})
    .then(response => {
        if (response.status < 200 || response.status >= 300) {
            throw new Error(response.statusText);
        }
        return response.json();
    })
    .then( ( json) => {

 
        return Promise.resolve ( json["elements"].map(record => ( {id:idFromURL(record.url), ...record}))) 
    })
  }

  const fetchAssociations = (token, lang)=> {
    const req = backEndURL() + '/associations?lang=' + lang;
    const request = new Request(req, {
            method: 'GET',
    headers: new Headers({ 'Content-Type': 'application/json' , 'Authorization':`Bearer ${token}`}),
    });
    return fetch(request, { credentials: 'include'})
    .then(response => {
        if (response.status < 200 || response.status >= 300) {
            throw new Error(response.statusText);
        }
        return response.json();
    })
    .then( (json) => {

 
        return Promise.resolve ( json["elements"].map(record => ( {id:idFromURL(record.url), ...record}))) 
    })
  }

  const fetchEnumerations = (token, lang)=> {
    const req = backEndURL() + '/enumerations?lang=' + lang;
    const request = new Request(req, {
            method: 'GET',
    headers: new Headers({ 'Content-Type': 'application/json' , 'Authorization':`Bearer ${token}`}),
    });
    return fetch(request, { credentials: 'include'})
    .then(response => {
        if (response.status < 200 || response.status >= 300) {
            throw new Error(response.statusText);
        }
        return response.json();
    })
    .then( (json) => {
 
        return Promise.resolve ( json["elements"].map(record => ( {id:idFromURL(record.url), ...record}))) 
    })
  }
  const fetchModelInfo = () => {
    const auth = sessionStorage.getItem('arolios_auth');
    if (auth) {
      const { token } = JSON.parse(sessionStorage.getItem('arolios_auth'));
      const lang = localStorage.getItem('arolios_model_language') || 
                  sessionStorage.getItem('arolios_model_default_language');
 
                  
      return fetchDomains (token, lang).then ( ( domains) => {
          return fetchClasses (token, lang).then  ( ( classes) => {
            return fetchAssociations (token, lang).then ( (associations) => {
              return fetchEnumerations (token, lang).then ( ( enumerations) => {
                return Promise.resolve ( { domains, classes, associations, enumerations}) ;
              })
            })
          })
      }
      )
      
      .catch(() => {
          throw new Error('Network error')
      }); 
  } else {
    return  Promise.reject() ;
  }
}

  const dynamicResourcesAndRoutes = (permissions) =>  {
 
    return fetchModelInfo().then ( ( {domains, classes, associations, enumerations}) => {
    return (
      <>
          <Resource name='settings' edit={SettingsEdit} />
          <Resource name='password' create={PasswordCreate} />
          <Resource name='domains' list={DomainList} />
          { authProvider.canEdit(permissions.role) ?
            <Resource name='trash' list={TrashList}/>
            : null
          }
          <Resource name='languages' list={LanguageList} />
                
          { (permissions.role === "admin" && permissions.isDefaultApp ) ? 
            <>
                <Resource name='apps' list={AppList} create={AppCreate} edit={AppEdit} icon={AppsIcon} recordRepresentation="name"/>
                <Resource name='users'  list={UserList} create={UserCreate} edit={UserEdit} icon={PeopleIcon} recordRepresentation="identifier"/>
                <Resource name='appusers' list={AppUserList} create={AppUserCreate}/>
                <Resource name='appdomains' list={AppDomainList} create={AppDomainCreate}/>
                <Resource name='models' create={LoadModel} />
                <Resource name='translations' create={LoadTranslations} />
            </>
            : null
          } 
          
          
               
    
            
            { domains.map ( resource => {
                return (<Resource name={`${resource.name}/classes`} key={resource.name} list={ClassList} /> )
              })}
            { domains.map ( resource => (
                <Resource name={`${resource.name}/associations`} key={resource.name} list={AssociationList} />
              ))}
            {classes.map(resource => {
                return ( resource._is_abstract ?
                  <Resource name={resource.id} key={resource.id} list={ClassInstanceList}  show={ClassInstanceShow} edit={authProvider.canEdit(permissions.role) ? ClassInstanceEdit : null} /> :
                  <Resource name={resource.id} key={resource.id} list={ClassInstanceList}  show={ClassInstanceShow} edit={authProvider.canEdit(permissions.role) ? ClassInstanceEdit : null} create={authProvider.canEdit(permissions.role) ? ClassInstanceCreate : null}/>
                  ) } )}
            {associations.map(resource => {
                return( <Resource name={resource.id} key={resource.id} list={AssociationInstanceList}  show={AssocInstanceShow} edit={authProvider.canEdit(permissions.role) ? AssocInstanceEdit : null} create={authProvider.canEdit(permissions.role) ? AssocInstanceCreate : null}/>
            ) } )}
            {enumerations.map(resource => {
                return( <Resource name={resource.id} key={resource.id} list={EnumerationValuesList} recordRepresentation="name"  />
            ) } )}
            <CustomRoutes>
            <Route path='/about' element={<About />} />
            <Route path='/help' element={<Authenticated><Help /></Authenticated>} />
              { authProvider.canEdit(permissions.role) ?
                <Route path='/instances/import' element={<Authenticated><ImportData /></Authenticated>} />
                : null
              }
              <Route path='/instances/export' element={<Authenticated><ExportData /></Authenticated>} />

              { permissions.role === "admin" ?
                  
                    <Route path='/apps/:instId/config' element={<Authenticated><AppConfigLoad /></Authenticated>} />
                  :  null 
                }
              
              {classes.map(resource => {
                            return ( <Route path={`/${resource.id}/:instId/association_ends/:propId`} key={resource.id} element={<Authenticated><InstanceAssocList/></Authenticated>} />)
                        } )}
              {authProvider.canEdit(permissions.role) ? 
                classes.map(resource => {
                  return ( <Route path={`/${resource.id}/select`} key={resource.id} element={<Authenticated><AssocInstanceEdit/></Authenticated>} />)
              } )
                : null
                }
            </CustomRoutes>
            
          </>
      )
      }
    )
  }
  
 
  export const App = () => 
  { 

      return (
   
    <Admin disableTelemetry dataProvider={CustomDataProvider} i18nProvider={i18nProvider} authProvider={authProvider} requireAuth  layout={CustomLayout}
    dashboard={CustomDashboard}
    title="AROLIOS App" >

      {dynamicResourcesAndRoutes }

     
      </Admin> 
      
      
   
    )
          }
  
  ;
  
          

