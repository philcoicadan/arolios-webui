import {useContext} from 'react';
import {FunctionField, List, Datagrid, TextField} from 'react-admin';
import { ClassifierContext} from '../../utils/contexts'

import { useCreatePath} from 'react-admin';


const DomainList = (() => {
    const createPath = useCreatePath();
    const {mapDomainNameResource} = useContext(ClassifierContext);

    return (
    <List resource={'domains'} sort={{ field: 'name', order:"ASC"}} exporter={false} >
        <Datagrid 
            bulkActionButtons={false}
            
            rowClick= {(id, resource, record) => {
                mapDomainNameResource (record['name'], record['_tname'])
                return createPath( { resource: `${record.name}/classes`, type: 'list'})

            }} >

                <FunctionField source ="name" label="arolios.name"
                    render = {record => record['_tname'] }/>
                <TextField source ="description" label="arolios.description"/>
        </Datagrid>

       
    </List>)
 })

export default DomainList;