import { List, Datagrid,
    ShowButton, EditButton, Loading, Show, Edit, SimpleShowLayout, SimpleForm,
     Create, TopToolbar, ExportButton, CreateButton, SaveButton, Toolbar, DeleteWithConfirmButton, SearchInput, useTranslate, EmptyClasses,
     useRecordSelection} from 'react-admin';
import { useContext} from "react";
import { AssociationMemberEndContext, ClassifierContext } from "../../utils/contexts";
import { useProperties } from "../../utils/properties";
import { InsertShowField , InsertListField, InsertEditField} from "../../utils/fields" ;
import { useResourceContext, useResourceDefinition,  useRecordContext, useCreatePath, usePermissions} from "react-admin";
import {  idFromURL, extractResourceFromPathName} from "../../utils/utils";
import {useParams, useLocation} from "react-router-dom";

import {Typography} from '@mui/material';
import Inbox from '@mui/icons-material/Inbox';
import { styled } from '@mui/material/styles';
import authProvider from '../../utils/authProvider';



const classFunctions = {

unfoldProperties: function (properties) {
        let allProps =[];
        properties.forEach ( (prop) => {
            if (prop.metatype === "_composite_type") { // attributes of composite type exploded
                prop.nested.forEach (( nested_prop) => {
                    if (nested_prop.metatype === "_composite_type") {  //property can be nested on two levels
                        nested_prop.nested.forEach ( (sub_nested) => {
                            allProps.push ({ property: sub_nested, prefix: 'properties' }) ;
                        })
                    } else {
                        allProps.push ({ property: nested_prop, prefix: 'properties' }) ;                
                    }
                } ) 
                    
            } else  {
                allProps.push ( {property: prop, prefix: 'properties'} ) ;   //  association members kept
                    if (prop.metatype === "_class") { // ids of association members exploded except object refs
                        prop.linked.forEach ( (linked) => {
                            if (linked.metatype !== "_class") {
                                if (linked.metatype === '_composite_type') {
                                    linked.nested.forEach((nested_prop) => {
                                        if (nested_prop.metatype === "_composite_type") {  //property can be nested on two levels

                                            nested_prop.nested.forEach((sub_nested) => {
                                                allProps.push({ property: sub_nested, prefix: `properties.${prop.name}.properties` });
                                            })
                                        } else {
                                            allProps.push({ property: nested_prop, prefix: `properties.${prop.name}.properties` });
                                        }
                                    }) 
                                } 
                                else {
                                    allProps.push ({ property: linked, prefix: `properties.${prop.name}.properties`}) ;
                                }
                            }
                        } )
                    }
    
            }
        })
        return allProps;
} ,

unfoldPropertiesNoLink: function (properties) {
    let allProps =[];
    properties.forEach ( (prop) => {
        if (prop.metatype === "_composite_type") { // attributes of composite type exploded
            prop.nested.forEach (( nested_prop) => {
                if (nested_prop.metatype === "_composite_type") {  //property can be nested on two levels
                    nested_prop.nested.forEach ( (sub_nested) => {
                        allProps.push ({ property: sub_nested, prefix: 'properties' }) ;
                    })
                } else {
                    allProps.push ({ property: nested_prop, prefix: 'properties' }) ;
                }
            } ) 
        } else if (prop.metatype === "_class") { // ids of association members exploded except object refs
                    prop.linked.forEach ( (linked) => {
                        if (linked.metatype !== "_class") {
                            if (linked.metatype === '_composite_type') {
                                linked.nested.forEach (( nested_prop) => {
                                    if (nested_prop.metatype === "_composite_type") {  //property can be nested on two levels
                                        nested_prop.nested.forEach ( (sub_nested) => {
                                            allProps.push ({ property: sub_nested, prefix: `properties.${prop.name}.properties`}) ;
                                        })
                                    } else {
                                        allProps.push ({ property: nested_prop, prefix: `properties.${prop.name}.properties` }) ;  
                                              
                                    }
                                } ) 
                            } 
                            else {
                                allProps.push ({ property: linked, prefix: `properties.${prop.name}.properties`}) ;
                            }
                    }
                    } )
        } else {
            allProps.push ( {property: prop, prefix: 'properties'} ) ;   //  association members not kept
        }

    })
    return allProps;
} ,

unfoldAllProperties: function (properties) {
    let allProps =[];
    properties.forEach ( (prop) => {
        if (prop.metatype === "_composite_type") { // attributes of composite type exploded
            prop.nested.forEach (( nested_prop) => {
                if (nested_prop.metatype === "_composite_type") {  //property can be nested on two levels
                    nested_prop.nested.forEach ( (sub_nested) => {
                        allProps.push ({ property: sub_nested, prefix: 'properties' }) ;
                    })
                } else {
                    allProps.push ({ property: nested_prop, prefix: 'properties' }) ;
                }
            } ) 
        } else  { // Association members included
            allProps.push ( {property: prop, prefix: 'properties'} ) ;
        }

    })
    return allProps;
} ,
associationMemberEnds: function (properties) {
    let scProps =[];
    properties.forEach ( (prop) => {
        if (prop.metatype === "_class") {
                scProps.push ( {property: prop, prefix: 'properties'} )  ;                 
        }
    })
    return scProps;
}
} ;

const assocFunctions = {
    unfoldProperties: function (properties) {
        let allProps =[];
        properties.forEach ( (prop) => {
            if (prop.metatype === "_composite_type") { // attributes of composite type exploded
                prop.nested.forEach (( nested_prop) => {
                    if (nested_prop.metatype === "_composite_type") {  //property can be nested on two levels
                        nested_prop.nested.forEach ( (sub_nested) => {
                            allProps.push ({ property: sub_nested, prefix: 'properties' }) ;
                        })
                    } else {
                        allProps.push ({ property: nested_prop, prefix: 'properties' }) ;
                    }
                } ) 
            } else {
                allProps.push ( {property: prop, prefix: 'properties'} ) ;   //  association members kept
                if (prop.metatype === "_class") { // ids of association members exploded except object refs
                    prop.linked.forEach ( (linked) => {
                        if (linked.metatype !== "_class") {
                            if (linked.metatype === '_composite_type') {
                                linked.nested.forEach (( nested_prop) => {
                                    if (nested_prop.metatype === "_composite_type") {  //property can be nested on two levels
                                        nested_prop.nested.forEach ( (sub_nested) => {
                                            allProps.push ({ property: sub_nested, prefix: `properties.${prop.name}.properties` }) ;
                                        })
                                    } else {
                                        allProps.push ({ property: nested_prop, prefix: `properties.${prop.name}.properties` }) ;  
                                    }
                                              } ) 
                            } 
                            else {
                                allProps.push ({ property: linked, prefix: `properties.${prop.name}.properties`}) ;
                            }
                    }
                    } )
                }
            }
    
        })
        return allProps;
    } ,
    unfoldNotRefProperties: function (properties) {
        let allProps =[];
        properties.forEach ( (prop) => {
            if (prop.metatype === "_composite_type") { // attributes of composite type exploded
                prop.nested.forEach (( nested_prop) => {
                    if (nested_prop.metatype === "_composite_type") {  //property can be nested on two levels
                        nested_prop.nested.forEach ( (sub_nested) => {
                            allProps.push ({ property: sub_nested, prefix: 'properties' }) ;
                        })
                    } else {
                        allProps.push ({ property: nested_prop, prefix: 'properties' }) ;
                    }
                } ) 
            } else if (prop.metatype !== "_class") {  // Association members included
                allProps.push ( {property: prop, prefix: 'properties'} ) ;
            }
    
        })
        return allProps;
    } ,

    unfoldAllProperties: function (properties) {
        let allProps =[];
        properties.forEach ( (prop) => {
            if (prop.metatype === "_composite_type") { // attributes of composite type exploded
                prop.nested.forEach (( nested_prop) => {
                    if (nested_prop.metatype === "_composite_type") {  //property can be nested on two levels
                        nested_prop.nested.forEach ( (sub_nested) => {
                            allProps.push ({ property: sub_nested, prefix: 'properties' }) ;
                        })
                    } else {
                        allProps.push ({ property: nested_prop, prefix: 'properties' }) ;
                    }
                } ) 
            } else  { // Association members included
                allProps.push ( {property: prop, prefix: 'properties'} ) ;
            }
    
        })
        return allProps;
    }  
}


const classFilters = ( loading ) => {
   // if (loading) return [];
    const arr1 = [ <SearchInput source="_s" alwaysOn />]

    return arr1;
    
        
    
}
// Variant from react-admin's Empty
const CustomEmpty = (props) => {
    const { className } = props;
    const { hasCreate } = useResourceDefinition(props);
    const resource = useResourceContext(props);

    const {classifierNames} = useContext(ClassifierContext);

    const csf_name = props.classifier  || classifierNames[resource];

    const translate = useTranslate();

    const emptyMessage = translate('ra.page.empty', { name: csf_name });
    const inviteMessage = translate('ra.page.invite');


    return (
        <Root className={className}>
            <div className={EmptyClasses.message}>
                <Inbox className={EmptyClasses.icon} />
                <Typography variant="h4" paragraph>
                    {translate(`resources.${resource}.empty`, {
                        _: emptyMessage,
                    })}
                </Typography>
                {hasCreate && (
                    <Typography variant="body1">
                        {translate(`resources.${resource}.invite`, {
                            _: inviteMessage,
                        })}
                    </Typography>
                )}
            </div>
            {hasCreate && (
                <div className={EmptyClasses.toolbar}>
                    <CreateButton variant="contained" />
                </div>
            )}
        </Root>
    );
};

//BEGIN variant of Root from react-admin's Empty which is not exported.
const Root = styled('span', {
    name: 'CustomEmpty',
    overridesResolver: (props, styles) => styles.root,
})(({ theme }) => ({
    flex: 1,
    [`& .${EmptyClasses.message}`]: {
        textAlign: 'center',
        opacity: theme.palette.mode === 'light' ? 0.5 : 0.8,
        margin: '0 1em',
        color:
            theme.palette.mode === 'light'
                ? 'inherit'
                : theme.palette.text.primary,
    },

    [`& .${EmptyClasses.icon}`]: {
        width: '9em',
        height: '9em',
    },

    [`& .${EmptyClasses.toolbar}`]: {
        textAlign: 'center',
        marginTop: '2em',
    },
}));
//END variant from react-admin's Empty

const ListActions = ({resource, meta }) => {
    const { hasCreate } = useResourceDefinition({resource: resource});
    return (
    <TopToolbar>
        { hasCreate && (<CreateButton resource={resource} />)}
        <ExportButton meta={meta} />
    </TopToolbar>
    )
};

const ClassInstanceListShowButton = () => {
    const record = useRecordContext ();
    const resource = idFromURL(record["class"]["url"]);
    return ( <ShowButton resource={resource} />)
}

const ClassInstanceListEditButton = () => {
    const record = useRecordContext ();
    const resource = idFromURL(record["class"]["url"]);
    return ( <EditButton resource={resource} />)
}

export const ClassInstanceList = () => {

    const resource = useResourceContext ();


    const {properties, loading} = useProperties (resource, 'classes', 'list');
     const {classifierNames } = useContext(ClassifierContext);
     const {permissions} = usePermissions();

     const csf_name = classifierNames[resource];
     const translate = useTranslate();
    return (
    <List  title={translate ('arolios.list_of', { type: csf_name }) } empty={<CustomEmpty />} actions={<ListActions resource={resource} meta={ {prefix: 'classes', suffix: 'instances', properties: 'all'} }/> } filters={classFilters(properties, loading)} sort={{ field: 'id', order:"DESC"}} queryOptions={{ meta:{ prefix: 'classes', suffix: 'instances', properties: 'list'}}}>
   {loading ? (
        <Loading />
    ) : (
        <Datagrid 

            bulkActionButtons={false}

        >

            {
            classFunctions.unfoldProperties(properties).map ( ( {property, prefix} ) => {
                return InsertListField  ( property, prefix);
                
            } ) }

            <ClassInstanceListShowButton/>     
            { authProvider.canEdit(permissions.role)  && <ClassInstanceListEditButton/> 
            }
        </Datagrid>
    )
    }

    </List>)
}


export const AssociationInstanceList = () => {

    const resource = useResourceContext ();

    const {properties, loading} = useProperties (resource, 'associations', 'list');
     const {classifierNames } = useContext(ClassifierContext);


     const csf_name = classifierNames[resource];
     const translate = useTranslate();
     const {permissions} = usePermissions();

    return (
    <List title={translate ('arolios.list_of', { type: csf_name }) } empty={<CustomEmpty />} actions={<ListActions resource={resource} meta={ {prefix: 'associations', suffix: 'instances', properties: 'all'} }/> } filters={classFilters(properties, loading)} sort={{ field: 'id', order:"DESC"}} queryOptions={{ meta:{ prefix: 'associations', suffix: 'instances', properties: 'list'}}}>
   {loading ? (
        <Loading />
    ) : (
        <Datagrid 

            bulkActionButtons={false}
  
            >

            {
            assocFunctions.unfoldProperties(properties).map ( ( {property, prefix} ) => {
                return InsertListField  ( property, prefix);
            } ) }

            <ShowButton/>
            { authProvider.canEdit(permissions.role)  && <EditButton/> 
            }
        </Datagrid>
    )
    }

    </List>)
}

const ClassInstanceShowLayout = ( {properties} ) => {

return (
    <SimpleShowLayout>
       

            {
            classFunctions.unfoldProperties(properties).map ( ( {property, prefix} ) => {
                    return InsertShowField  ( property, prefix);
            } ) }
            
 
          

    </SimpleShowLayout>
    
)
}

export const ClassInstanceShow = () => {


    const resource = useResourceContext();

    const { properties, loading } = useProperties(resource, 'classes', 'read');

    const {classifierNames } = useContext(ClassifierContext);
    const csf_name = classifierNames[resource];
    const translate = useTranslate();


    return (
 
            <Show title={translate ('arolios.instance_of', { type: csf_name }) } resource='instances' >


                {loading ? (
                    <Loading />
                ) : (
                    <ClassInstanceShowLayout properties={properties} />
                )

                }

            </Show>
        )
}

export const AssocInstanceShow = () => {
    const resource = useResourceContext();

    const { properties, loading } = useProperties(resource, 'associations', 'read');
    const {classifierNames } = useContext(ClassifierContext);
    const csf_name = classifierNames[resource];
    const translate = useTranslate();


    return (
        
            <Show title={translate ('arolios.instance_of', { type: csf_name }) } resource='instances'>
                {loading ? (
                    <Loading />
                ) : (
                    <SimpleShowLayout>

                        {
                            assocFunctions.unfoldProperties(properties).map(({property, prefix}) => {
                                return InsertShowField  ( property, prefix);
                            })}


                    </SimpleShowLayout>
                )}

            </Show>
       )
}

const EditToolbar = ( {type} ) => {
    const translate = useTranslate();
    return (
        <Toolbar>
            <SaveButton  />
            <DeleteWithConfirmButton
                resource='instances'
                confirmTitle = {translate('arolios.delete_confirm_title', { name : type}) }
                redirect='/'
            />

        </Toolbar>
    )
}

export const ClassInstanceEdit = () => {

    const resource = useResourceContext();
    const createPath = useCreatePath();
    const { classifierNames } = useContext(ClassifierContext);
    const csf_name = classifierNames[resource];
    const translate = useTranslate();

    const { properties, loading } = useProperties(resource, 'classes', 'update');
    return (

        <Edit title={translate('arolios.instance_of', { type: csf_name })} resource='instances' queryOptions={{ meta: { context: 'rfu' } }} redirect={createPath({ resource: resource, type: 'list' })}>

            {loading ? (
                <Loading />
            ) : (
                <div>
                    <SimpleForm toolbar={<EditToolbar type={csf_name} />}>

                        {

                            classFunctions.unfoldAllProperties(properties).map(({ property, prefix }) => {
                                return InsertEditField(property, prefix);
                            })}

                    </SimpleForm>
                </div>
            )}

        </Edit>
    )
}


export const AssocInstanceEdit = () => {
    const resource = useResourceContext();
    const createPath = useCreatePath();

    const { properties, loading } = useProperties(resource, 'associations', 'update');

    const { classifierNames } = useContext(ClassifierContext);
    const csf_name = classifierNames[resource];
    const translate = useTranslate();

    return (

        <Edit title={translate('arolios.instance_of', { type: csf_name })} resource='instances' queryOptions={{ meta: { context: 'rfu' } }} redirect={createPath({ resource: resource, type: 'list' })}>

            {loading ? (
                <Loading />
            ) : (
                <SimpleForm toolbar={<EditToolbar />}>

                    {
                        assocFunctions.unfoldNotRefProperties(properties).map(({ property, prefix }) => {
                            return InsertEditField(property, prefix);
                        })}


                </SimpleForm>
            )}

        </Edit>
    )


}

export const ClassInstanceCreate = () => {
    const resource = useResourceContext();

    const { properties, loading } = useProperties(resource, 'classes', 'create');
    const { classifierNames } = useContext(ClassifierContext);
    const csf_name = classifierNames[resource];
    const translate = useTranslate();

    return (

        <Create title={translate('arolios.instance_of', { type: csf_name })} redirect='show' mutationOptions={{ meta: { prefix: 'classes', suffix: 'instances' } }}>
            {loading ? (
                <Loading />
            ) : (
                <div>
                    <SimpleForm>

                        {

                            classFunctions.unfoldAllProperties(properties).map(({ property, prefix }) => {
                                return InsertEditField(property, prefix);
                            })}

                    </SimpleForm>
                </div>
            )}

        </Create>

    )
}

export const AssocInstanceCreate = () => {
    const resource = useResourceContext();

    const { properties, loading } = useProperties(resource, 'associations', 'create');

    const { classifierNames } = useContext(ClassifierContext);
    const csf_name = classifierNames[resource];
    const translate = useTranslate();

    return (

        <Create title={translate('arolios.instance_of', { type: csf_name })} redirect='show' mutationOptions={{ meta: { prefix: 'associations', suffix: 'instances' } }}>
            {loading ? (
                <Loading />
            ) : (
                <div>
                    <SimpleForm>

                        {

                            assocFunctions.unfoldAllProperties(properties).map(({ property, prefix }) => {
                                return InsertEditField(property, prefix);
                            })}

                    </SimpleForm>
                </div>
            )}

        </Create>
    )
}


export const InstanceAssocList = () => {

    const { instId, propId } = useParams ();
    const {pathname} = useLocation();
    const translate = useTranslate();
    const resource = extractResourceFromPathName (pathname);
    const { associations }= useContext(AssociationMemberEndContext);
    const { classifierNames } = useContext(ClassifierContext);
    const assocResource = associations[`${resource}.${propId}`];


    const {properties, loading} = useProperties (assocResource, "associations", 'list');
    const csf_name = classifierNames[assocResource];
    const {permissions} = usePermissions();

    return (
    <List title={translate ('arolios.list_of', { type: csf_name }) } empty={<CustomEmpty classifier={csf_name}/>} disableSyncWithLocation resource='instances' actions={<ListActions resource={assocResource} meta={ {suffix: `${instId}/association_ends/${propId}`, properties: 'all'} }/> } filters={classFilters(properties, loading)} sort={{ field: 'id', order:"DESC"}} queryOptions={{ meta:{ suffix: `${instId}/association_ends/${propId}`, properties: 'list'}}}>
    {loading ? (
        <Loading />
    ) : (

    <Datagrid 

        bulkActionButtons={false}
  
        >

        { 
     
            assocFunctions.unfoldProperties(properties).map ( ( {property,prefix }) => {
                return InsertListField  ( property, prefix);
            
        } ) } 
        <ShowButton resource={assocResource}/>
        { authProvider.canEdit(permissions.role)  && <EditButton resource={assocResource}/> 
            }
           

    </Datagrid>
    ) }
   
</List>)
}
