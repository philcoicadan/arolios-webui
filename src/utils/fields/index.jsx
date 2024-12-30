import  * as React from "react";
import { DateField, NumberField, RichTextField, BooleanField, EmailField, UrlField, TextField, WrapperField, Loading, NumberInput, BooleanInput, DateInput, TextInput, PasswordInput, ReferenceInput, SelectInput, useRecordContext, useShowContext, useEditContext, DateTimeInput, AutocompleteInput } from "react-admin";
import { RichTextInput } from "ra-input-rich-text";
import { email, required } from "react-admin";
import {Typography} from '@mui/material';
import { extractDomainClassifier, idFromURL  } from "../utils";
import { Link } from "react-admin";
import { IconButton, Grid } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CheckIcon from '@mui/icons-material/Check';
import IconLink from '@mui/icons-material/Link'
import * as MUI from '@mui/material';
import { useContext } from "react";
import { AssociationMemberEndContext, ClassifierContext } from "../contexts";
import { useCreatePath} from "react-admin";
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from "react";
import {useFormContext} from 'react-hook-form';

const validateRequired = (is_required) => { return is_required ? [required() ]: [] };

const validateText = (is_required) => { return validateRequired(is_required) }; //TODO to be completed
const validateNumber = (is_required) => { return validateRequired(is_required) }; //TODO to be completed
const validateDecimal = (is_required) => { return validateRequired(is_required) }; //TODO to be completed
const validateDate = (is_required) => { return validateRequired(is_required) }; //TODO to be completed
const validateTime = (is_required) => { return validateRequired(is_required) }; //TODO to be completed
const validateTimestamp = (is_required) => { return validateRequired(is_required) }; //TODO to be completed
const validateTimetz = (is_required) => { return validateRequired(is_required) }; //TODO to be completed
const validateTimestamptz = (is_required) => { return validateRequired(is_required) }; //TODO to be completed
const validateRichText = (is_required) => { return validateRequired(is_required) }; //TODO to be completed
const validateEmail = (is_required) => { return validateRequired(is_required).concat([email()]) };
const validateUrl = (is_required) => { return validateRequired(is_required) }; //TODO to be completed
const validatePassword = (is_required) => { return validateRequired(is_required) }; //TODO to be completed
const validateBoolean = (is_required) => { return validateRequired(is_required) }; //TODO to be completed
const validateEnum = (is_required) => { return validateRequired(is_required) }; //TODO to be completed


 
const MemberEndShowButton = ( {resource, resourceDisplay, prefix, field, sx }) => {
    const createPath = useCreatePath();
    const record = useRecordContext();
    const navigate = useNavigate();
    const {mapClassifierNameResource} = useContext(ClassifierContext);

    if (!record) return null;

    const handleClick = () => {
 
         const link = createPath({
            type: 'show',
            resource: resource,
            id: idFromURL(record[prefix][field]['url'])
        
         });
         
         mapClassifierNameResource (
            resource,
            resourceDisplay
        )
        navigate(link);
    };

    return <MUI.Link  component="button"  variant="body2" onClick={handleClick} sx={sx}><IconLink/></MUI.Link> ;
}

export const concatenateIdFieldValues = ( record ) => {
    let allIdFields = "" ;
    let enumFields = [];
    for (const [key, value] of Object.entries(record.properties)) {
       // if (key[0] !== '_') {
            if (value instanceof Object) {
                if (value.hasOwnProperty("properties")) { // linked prop
                    allIdFields= allIdFields.concat(" ", concatenateIdFieldValues(record['properties'][key]));
                } else { // composite prop  
                    for (const [key2, value2] of Object.entries(record['properties'][key])) {
                        if (key2 !== 'url' && !(value2 instanceof Object)) {
                            allIdFields = allIdFields.concat(" ", String(value2));
                        }
                    } 
                }
            } else if (key.startsWith ("_t") ){
                allIdFields = allIdFields.concat(" ", String(value));
                enumFields.push(key.substring(2));
            } else if ( enumFields.indexOf( key ) === -1) {
                allIdFields = allIdFields.concat(" ", String(value));
            }
      // }
    }
    allIdFields = allIdFields.trim();
    return allIdFields;
}


const MemberEndEditField = ( {property, prefix, field  }) => {
    const resource = property['type']['id_name'];
    const filterToQuery = searchText => ({ _s: `%${searchText}%`});

    return (
        <ReferenceInput reference={resource}  source={`${prefix}.${field}.id`} sort={{ field: 'id', order:"DESC"}} queryOptions={{ meta:{ getmany_context: 'references', prefix: 'classes', suffix: 'instances', properties: 'list'}}}>
            <AutocompleteInput  label={property._tpathname} optionText={concatenateIdFieldValues} filterToQuery={filterToQuery} validate={validateRequired(property.required)} />
        </ReferenceInput>
    )
    
}


const MemberEndListField = ({ label, prefix, field, classifier, classifierDisplay }) => (
    <WrapperField label={label} sortable={false}>
        <MemberEndShowButton resource={classifier} resourceDisplay={classifierDisplay} prefix={prefix} field={field} />
    </WrapperField>
);





const InsertEmptyAssociation = ({assoc}) => {
    //TODO: that doesn't work
    return (

            <Typography variant="body1" color="textPrimary">{assoc}</Typography>

    )
}

export const InsertOutputClassMemberEnd = ({ property, prefix, field }) => {
    const { record, isLoading } = useShowContext();
    const createPath = useCreatePath();
    const {mapAssociationProperty} = useContext(AssociationMemberEndContext);
    const {mapClassifierNameResource} = useContext(ClassifierContext);
    const assocResource =  idFromURL(property['memberEnd']['association']['url']);
    const classifierResource = idFromURL(property['classifier']['url']);

    const mapAssocProp = () => {
        mapAssociationProperty( 
            assocResource,
            `${classifierResource}.${property.name}`
        );
            
        mapClassifierNameResource (
            idFromURL(property['memberEnd']['association']['url']),
            property['memberEnd']['association']['_tid_name']
        );
    }


    const handleClick1 = () => {
        mapClassifierNameResource(assocResource, property['memberEnd']['association']['_tid_name'])
    }

    const handleClick2 = () => {
        mapClassifierNameResource(property['type']['id_name'], property['type']['_tid_name']);
    }

    if (isLoading) return (<Loading />);

    if (record[prefix][field] == null) {
        return (<InsertEmptyAssociation assoc={property._tpathname} />);
    }
    if (record[prefix][field].hasOwnProperty('association')) {
        if (record[prefix][field]['association'].hasOwnProperty('instance_url')) {
            const id = idFromURL (record[prefix][field]['association']['instance_url']) // memberEnd  with association info => association to be shown
            return <Link to={createPath({ resource: assocResource, type: 'show', id: id })} onClick={handleClick1}>{property._tpathname}</Link>
        }
    }
    if (record[prefix][field].hasOwnProperty('url')) { // memberEnd with ONE instance value => show instance
        const id = idFromURL (record[prefix][field]['url']);
        return <Link to={createPath({ resource: property['type']['id_name'], type: 'show', id: id })}  onClick={handleClick2}>{property._tpathname}</Link>
    } else { // no instance => query of associations from a class and a memberEnd 
       
        return <Link to={`/${classifierResource}/${record['id']}/association_ends/${property.id_name}`}  onClick={mapAssocProp}>{property._tpathname}</Link>;
    }

}



export const InsertListField = ( property, prefix) => {

    const source = `${prefix}.${property.id_name}`;
    const typeResource = property.type.id_name;
    const typeResourceDisplay = property.type._tid_name;
    switch (property.metatype) {
        case "_primitive": {
            const { classifier } = extractDomainClassifier (typeResource);
            switch (classifier) {
                case "integer":
                case "smallint":
                case "bigint":
                case "decimal":
                case "real":
                case "doubleprecision":
                    return (<NumberField key={`${prefix}.${property.id_name}`} label={property._tpathname} source={source} />);
                case "boolean":
                    return (<BooleanField key={`${prefix}.${property.id_name}`} label={property._tpathname} source={source} valueLabelTrue="arolios.true" valueLabelFalse="arolios.false"/>);
                case "text":
                    return (<RichTextField key={`${prefix}.${property.id_name}`} label={property._tpathname} source={source} />);
                case "date":
                    return (<DateField key={`${prefix}.${property.id_name}`} label={property._tpathname} source={source} />);
                case "email": //future use
                    return (<EmailField key={`${prefix}.${property.id_name}`} label={property._tpathname} source={source} />);
                case "url": //future use
                    return (<UrlField key={`${prefix}.${property.id_name}`} label={property._tpathname} source={source} />);
                default:
                    // charstring time timestamp timetz timestamptz
                    return (
                        <TextField key={`${prefix}.${property.id_name}`} label={property._tpathname} source={source} />
                    );
                

            };
            }
        case "_enumeration":
            {
                const source_enum = `${prefix}._t${property.id_name}`;
            return (<TextField key={`${prefix}.${property.id_name}`} label={property._tpathname} source={source_enum} />);
            }
        case "_composite_type":
            break;
        case "_class":
            return (<MemberEndListField key={`${prefix}.${property.id_name}`} label={property._tpathname} prefix={prefix} field={property.id_name} classifier={typeResource} classifierDisplay={typeResourceDisplay} />)
        

        default:
            return (<TextField key={`${prefix}.${property.id_name}`} label={property._tpathname} source={source} />);
    }
};
export const InsertShowField = (property, prefix) => {
    const source = `${prefix}.${property.id_name}`;
    
    switch (property.metatype) {
        case "_primitive": {
            const { classifier } = extractDomainClassifier (property.type.id_name);
            switch (classifier) {
                case "integer":
                case "smallint":
                case "bigint":
                case "decimal":
                case "real":
                case "doubleprecision":
                    return (<NumberField key={`${prefix}.${property.id_name}`} label={property._tpathname} source={source} />);
                case "boolean":
                    return (<BooleanField key={`${prefix}.${property.id_name}`} label={property._tpathname} source={source} valueLabelTrue="arolios.true" valueLabelFalse="arolios.false"/>);
                case "text":
                    return (<RichTextField key={`${prefix}.${property.id_name}`} label={property._tpathname} source={source} />);
                case "date":
                    return (<DateField key={`${prefix}.${property.id_name}`} label={property._tpathname} source={source} />);
                case "email": //future use
                    return (<EmailField key={`${prefix}.${property.id_name}`} label={property._tpathname} source={source} />);
                case "url": //future use
                    return (<UrlField key={`${prefix}.${property.id_name}`} label={property._tpathname} source={source} />);
                default:
                    // charstring time timestamp timetz timestamptz
                    return (
                                <TextField key={`${prefix}.${property.id_name}`} label={property._tpathname} source={source} />
                           );
            };
            }
        case "_enumeration":
            {
                const source_enum = `${prefix}._t${property.id_name}`;
                return (<TextField key={`${prefix}.${property.id_name}`} label={property._tpathname} source={source_enum} />);
            }
        case "_composite_type":

            break;
        case "_class":
            return (<InsertOutputClassMemberEnd key={`${prefix}.${property.id_name}`} property={property} prefix={prefix} field={property.id_name} />)

        default:
            return (
                <TextField  key={`${prefix}.${property.id_name}`} label={property._tpathname} source={source} />
           );
    }
};

export const InsertEditField = (property, prefix) => {
    const source = `${prefix}.${property.id_name}`;
    switch (property.metatype) {
        case "_primitive": {
            const { classifier } = extractDomainClassifier (property.type.id_name);
            switch (classifier) {
                case "charstring":

                return (<TextInput key={`${prefix}.${property.id_name}`} label={property._tpathname} source={source} multiline fullWidth resettable validate={validateText(property.required)} />);
                case "integer":
                case "smallint":
                case "bigint":
                case "real":
                case "doubleprecision":
                    return (<NumberInput key={`${prefix}.${property.id_name}`} label={property._tpathname} source={source} validate={validateNumber(property.required)} />);
                case "decimal": // decimal : display as number, capture as text for keeping exact value in server
                    return (<TextInput key={`${prefix}.${property.id_name}`} label={property._tpathname} source={source} resettable  validate={validateDecimal(property.required)} />);
                case "boolean":
                    return (<BooleanInput key={`${prefix}.${property.id_name}`} label={property._tpathname} source={source} validate={validateBoolean(property.required)} />);
                case "text":
                    return (<RichTextInput key={`${prefix}.${property.id_name}`} label={property._tpathname} source={source} validate={validateRichText(property.required)} />);
                case "date":
                    return (<DateInput key={`${prefix}.${property.id_name}`} label={property._tpathname} source={source} validate={validateDate(property.required)} />);
                case "time":
                    return (<TextInput key={`${prefix}.${property.id_name}`} label={property._tpathname} source={source} validate={validateTime(property.required)} />);
                case "timetz":
                    return (<TextInput key={`${prefix}.${property.id_name}`} label={property._tpathname} source={source} validate={validateTimetz(property.required)} />);
                case "timestamp":
                    return (<DateTimeInput key={`${prefix}.${property.id_name}`} label={property._tpathname} source={source} validate={validateTimestamp(property.required)} />);
                case "timestamptz":
                    return (<DateTimeInput key={`${prefix}.${property.id_name}`} label={property._tpathname} source={source} validate={validateTimestamptz(property.required)} />);
                case "email": //future use
                    return (<TextInput label={property._tpathname} source={source} type="email" multiline fullWidth resettable validate={validateEmail(property.required)} />);
                case "url": //future use
                    return (<TextInput key={`${prefix}.${property.id_name}`} label={property._tpathname} source={source} type="url" multiline fullWidth resettable validate={validateUrl(property.required)} />);
                case "password": //future use
                    return (<PasswordInput key={`${prefix}.${property.id_name}`} label={property._tpathname} source={source} multiline fullWidth resettable validate={validatePassword(property.required)} />);

                default:
                    // charstring 
                    return (<TextInput key={`${prefix}.${property.id_name}`} label={property._tpathname} source={source} multiline fullWidth resettable />);

            };
         }
        case "_enumeration":
            const typeResource=property.type.id_name;

            return (
            <ReferenceInput key={`${prefix}.${property.id_name}`} source={source} reference={typeResource} sort={{field: 'name', order: 'ASC'}} queryOptions={{ meta:{ prefix: 'enumerations', suffix: 'values', getmany_context:'values'}} }  >
                <SelectInput label={property._tpathname} optionText="_tname" optionValue="name" validate={validateEnum(property.required)}/>
            </ReferenceInput>
            ) 
            
        case "_composite_type":
            break;

        case "_class": 
        
                return (<MemberEndEditField key={`${prefix}.${property.id_name}`} property={property} prefix={prefix} field={property.id_name}  />);
            
                

        default:
            //TODO error to be returned
            return (<TextInput key={`${prefix}.${property.id_name}`} label={property._tpathname} source={source} />);
    }
};
