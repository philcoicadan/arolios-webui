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