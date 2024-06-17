import React, { useState, createContext } from 'react'


export const ClassifierContext = createContext()

export const ClassifierProvider = ({ children }) => {
  const [classifierNames, setClassifierNames] = useState( { })
  const [domainNames, setDomainNames] = useState( { })
 
  const mapClassifierNameResource = (resource, name) => {
    let new_pair = {} ;
    new_pair[resource] = name;
    setClassifierNames ( classifiers => ({ ...classifiers, ...new_pair}));

  }

  const mapDomainNameResource = (resource, name) => {
    let new_pair = {} ;
    new_pair[resource] = name;
    setDomainNames ( domains => ({ ...domains, ...new_pair}));

  }
  // const mapResourceClassifierId = (id, resource) => {
  //   let new_pair = {} ;
  //   new_pair[id] = resource;
  //   setResourceIds ( resourceIds => ({ ...resourceIds, ...new_pair}));

  // }
  return (
    <ClassifierContext.Provider value={{ classifierNames, mapClassifierNameResource, domainNames, mapDomainNameResource }}>
      {children}
    </ClassifierContext.Provider>
  )
} 

export const ClassSelectContext = createContext();

export const ClassSelectProvider = ({ children }) => {
  const [resource, setResource] = useState('');
  const [source, setSource] = useState('');
  const [select, setSelect] =useState ({}) ;
  const [open, setOpen] = useState (false);
  const [saveEnable, setSaveEnable] = useState(false);

  

  const setSourceSelect = ( key, value) => {
    let newPair = {};
    newPair[key] = value;
    setSelect (selections => ({ ...selections, ...newPair}));
  }

  return (
    <ClassSelectContext.Provider value={{ resource, setResource, source, setSource, open, setOpen, select, setSourceSelect, saveEnable , setSaveEnable }}>
      {children}
    </ClassSelectContext.Provider>
  )
} 

export const AssociationMemberEndContext = createContext();

export const AssociationMemberEndProvider = ( {children}) => {
  const [ associations, setAssociations] = useState ({});
  const mapAssociationProperty = ( assoc, property) => {
    let new_pair = {} ;
    new_pair[property] = assoc;
    setAssociations ( assocs => ({ ...assocs, ...new_pair}));

  }
  return (
    <AssociationMemberEndContext.Provider value={{associations, mapAssociationProperty}}>
      {children}
    </AssociationMemberEndContext.Provider>
  )
}