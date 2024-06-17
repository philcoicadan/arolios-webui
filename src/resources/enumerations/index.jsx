import { FunctionField, List, SimpleList, useResourceContext} from "react-admin";



export const EnumerationValuesList = (() => {

    const resource = useResourceContext ();


    return (
    <List  exporter={false} sort={{ field: 'name', order:"ASC"}} queryOptions={{ meta:{ prefix: `enumerations`, suffix: 'values'}}}>
        <SimpleList >
               
            <FunctionField source ="name" label="arolios.value"
                    render = {record => record['_tname'] }/>    

        </SimpleList>

       
    </List>)
} )
