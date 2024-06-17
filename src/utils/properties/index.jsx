import { useState, useEffect } from "react";
import { useDataProvider , Error} from "react-admin";


export const useProperties = (resource, prefix, context) => {


    const dataProvider = useDataProvider();
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState();



    useEffect ( () => {
        if (resource) {
        dataProvider.getList(
                resource,
            {
                pagination : { page: 0, perPage: 0},
                sort: {field: 'name', order: 'ASC'},
                meta: { prefix: prefix, suffix: 'properties', context: context}
            }
            )
            .then(({ data}) => {
            setProperties(data);
            setLoading(false);
        })
        .catch(error => {
            setError(error);
            setLoading(false);
        })
    }}, [resource, context]) ;

    if (error) return <Error />;

    return {properties, loading};
}

