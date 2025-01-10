import { fetchUtils } from 'react-admin';
import { stringify } from 'query-string';
import {idFromURL, backEndURL} from '../utils'




const apiUrl = backEndURL();

const httpClient = (url, options = {}) => {
    options.credentials = 'include';

    if (sessionStorage.getItem('arolios_auth') ) {
        if (!options.headers) {
            options.headers = new Headers({ Accept: 'application/json' });
        }
        const { token } = JSON.parse(sessionStorage.getItem('arolios_auth'));
        options.headers.set('Authorization', `Bearer ${token}`);
    }

    return fetchUtils.fetchJson(url, options);
};

 

const CustomDataProvider = { 
    getList: (resource, params) => {
        const { page, perPage } = params.pagination || {};
        const { field, order } = params.sort || {};
        const filter = params.filter || {};
        const {prefix, suffix ,context, properties, i18n } = params.meta || {};
        const lang = localStorage.getItem ("arolios_requested_language") || sessionStorage.getItem ("arolios_default_language");
        let query ='';
        let querySep = '?';
        if (i18n !== false) {
            query += `${querySep}lang=${lang}`;
            querySep = '&';    
        }
        if (page >0 && perPage >0) {
            const offset=  (page-1)*perPage;
            //const limit =perPage-1;
            query += `${querySep}o=${offset}&l=${perPage}`;
            querySep = '&';    
        }
        if (field) {
            //eliminate field translation 
            const field_arr1 = field.split('.');
            const field_arr2 = field_arr1.map ( (item) => ( item.startsWith ('_t')) ? item.substring(2) :  item);
            const true_field = field_arr2.join('.');
            query +=`${querySep}s=${true_field}`;
            querySep = '&';
        }
        if (order) {
            query +=`${querySep}d=${order}`;
            querySep = '&';
        }
        if (Object.entries(filter).length > 0) {
            query +=`${querySep}f=${JSON.stringify(filter)}`;
            querySep = '&';
        }
        
        
        let url = `${apiUrl}/`;
       
        if (prefix) {
            url += `${prefix}/`
        } 

        url += `${resource}`;
        if (suffix) {
            url += `/${suffix}`;

        }
        if (context) {
            query += `${querySep}c=${context}`;
        }
        if (properties) {
            query += `${querySep}p=${properties}`;
        }
        
        if (query.length >0) {
            url += `${query}`;
        }

        if (resource === 'apps') {
            return httpClient(url).then(({ headers, json }) => ({
                data: json["elements"].map(record => ( {id:record.name, ...record})),
                total: json["total"],
                
            }));
        } else if (resource === 'users') {
            return httpClient(url).then(({ headers, json }) => ({
                data: json["elements"].map(record => ( {id:record.identifier, ...record})),
                total: json["total"],
                
            }));
        } else if (resource === 'languages') {
            return httpClient(url).then(({ headers, json }) => ({
                data: json["elements"].map(record => ( {id:record.code, ...record})),
                total: json["total"],
                
            }));
        } else if (suffix === 'properties') {  //list properties
            return httpClient(url).then(({ headers, json }) => ({

                data: json["elements"].map(record => ( {id:record.id_name, ...record})),
                total: json["total"],
                
            }));
        } else if (suffix === 'values') {  //list enum values
            return httpClient(url).then(({ headers, json }) => ({

                data: json["elements"].map(record => ( {id:record.name, ...record})),
                total: json["total"],
                
            }));
        } else {
            return httpClient(url).then(({ headers, json }) => ({

                data: json["elements"].map(record => ( {id:idFromURL(record.url), ...record})),
                total: json["total"],

            }));
        }
        
    },

    getOne: (resource, params) => {

 
        const lang = localStorage.getItem ("arolios_requested_language") || sessionStorage.getItem ("arolios_default_language");
        let query = `?lang=${lang}`;
        const querySep = '&';
        const {prefix, suffix ,context } = params.meta || {};
        if (prefix === 'settings') {
            const modelLang = localStorage.getItem("arolios_requested_language") || sessionStorage.getItem ("arolios_default_language");
            return Promise.resolve({data: { id: params.id, requested_language: modelLang}});
        }
        let url = `${apiUrl}/`;

        if (prefix) {
            url += `${prefix}/`
        }
        url += `${resource}`;
        if (suffix) {
            url += `/${suffix}`;

        }

        url += `/${params.id}`;
        if (context) {
            query += `${querySep}c=${context}`;
        }
        
        if (query.length >0) {
            url += `${query}`;
        }

        if (resource === 'apps') {
            return httpClient(url).then(({ json }) => ({
                data: { id: json['name'], ...json} 
            })

            );
        } else  if (resource === 'users') {
            return httpClient(url).then(({ json }) => ({
                data: { id: json['identifier'], ...json} 
            })

            );
        } else {
            return httpClient(url).then(({ json }) => ({
                data: json
            })

            );
        }

    },

    getMany: (resource, params) => {
        const {prefix, getmany_context } = params.meta || {};
        if (getmany_context === "values") {
            // query of enumeration value
            const ids = params.ids;
            return Promise.resolve ({ data: [ { id:ids[0] }]});
        } else if (getmany_context === "languages" ) {
            // query of language
            const ids = params.ids;
            const query = { code: ids[0] };
            const url = `${apiUrl}/${resource}?f=${JSON.stringify(query)}`;

            return httpClient(url).then(({ headers, json }) => ({
                data: json["elements"].map(record => ( {id:record.code, ...record})),
                total: json["total"],
            
            }));
        } else if (getmany_context === "appassocs" ) {
            // query of app assocations (apps, domains)
            const ids = params.ids;
            const instid =ids[0] ;
            if (resource === 'apps' || resource === 'domains') {
                return Promise.resolve ( { data: [ { id: instid }]});
            } else if (resource === 'users') {
                const ids = params.ids;
                const instid = ids[0];
                // variant of getOne

                const url = `${apiUrl}/${resource}/${instid}`;

                return httpClient(url).then(({ json }) => ({
                    data: [ { id: json['identifier'], ...json} ],
                    total: 1
                }));

            } else    { // no case implemented

                let url = `${apiUrl}/`;
                if (prefix) {
                    url += `${prefix}/`
                }
                url += `${resource}/${instid}`;
                return httpClient(url).then(({ headers, json }) => ({
                    data: json.map(record => ( {id:idFromURL(record.url), ...record})),
                    total: 1,
                }));
            }
        } else if (getmany_context === "references" ) {
            const ids = params.ids;
            const instid =ids[0] ;
            // variant of getOne
            const lang = localStorage.getItem ("arolios_requested_language") || sessionStorage.getItem ("arolios_default_language");
            let query = `?lang=${lang}`;
            const querySep = '&';
            const {prefix, suffix ,context } = params.meta || {};
            
            let url = `${apiUrl}/`;

            // suffix of the list query is the resource

            if (suffix) {
                url += `${suffix}`;
            }
    
            url += `/${instid}`;
            if (context) {
                query += `${querySep}c=${context}`;
            }
            
            if (query.length >0) {
                url += `${query}`;
            }
    
            
            return httpClient(url).then(({ json }) => ({
                    data: [ json ],
                    total: 1
                }));
             
        } else  { // no case implemented
            const query = {
                filter: JSON.stringify({ ids: params.ids }),
            };
            const url = `${apiUrl}/${resource}?${stringify(query)}`;
            return httpClient(url).then(({ json }) => ({ data: json }));
        }
    },

    getManyReference: (resource, params) => {  // no case implemented
        const { page, perPage } = params.pagination;
        const { field, order } = params.sort;
        const query = {
            sort: JSON.stringify([field, order]),
            range: JSON.stringify([(page - 1) * perPage, page * perPage - 1]),
            filter: JSON.stringify({
                ...params.filter,
                [params.target]: params.id,
            }),
        };
        const url = `${apiUrl}/${resource}?${stringify(query)}`;

        return httpClient(url).then(({ headers, json }) => ({
            data: json,
            total: parseInt(headers.get('content-range').split('/').pop(), 10),
        }));
    },

    create: (resource, params) =>

        {
            const {prefix, suffix ,context } = params.meta || {};
            let url = `${apiUrl}/`;
            if (prefix) {
                url += `${prefix}/`
            }
            url += `${resource}`;
            if (suffix) {
                url += `/${suffix}`;
            }

    
            return httpClient(url, {
                method: 'POST',
                body: JSON.stringify(params.data)
            })
                .then(({ json }) => ({

                    data: (json) ? { ...params.data, id: idFromURL(json.url) } : { ...params.data, id: 0 }

                }))
                ;
      //  }
        },

    update: (resource, params) =>
        {

            let query = '';
            let querySep = '?';
    
            const {prefix, suffix ,context } = params.meta || {};
            if (prefix === 'settings') {
                localStorage.setItem("arolios_requested_language",  params.data.requested_language);          
                
                const url = `${apiUrl}/domains?lang=${params.data.requested_language}`
                httpClient(url).then(({ headers, json }) => {
                    if (json["total"] === 1) {
                        sessionStorage.setItem('arolios_model_default_domain', JSON.stringify({ name: json["elements"][0]['name'], _tname: json["elements"][0]['_tname'] }));
                    } else {
                        sessionStorage.removeItem('arolios_model_default_domain');
                    };
                    
                });
                        
                return Promise.resolve({data: params.data});
            }
            let url = `${apiUrl}/`;
            if (prefix) {
                url += `${prefix}/`
            }
            url += `${resource}`;
            if (suffix) {
                url += `/${suffix}`;
            }

            url += `/${params.id}`;
            if (context) {
                query += `${querySep}c=${context}`;
            }
            
            if (query.length >0) {
                url += `${query}`;
            }

    
            return httpClient(url, {
                    method: 'PATCH',
                    body: JSON.stringify(Object.keys(params.data)
                        .filter((key) => (key !== 'id'))
                        .reduce ( (obj, key) => { return Object.assign(obj, { [key]: params.data[key]});
                                                }, {}) 
                                        ), }
                    )
                    .then(({ json }) => ({

                        data: (json) ? { ...params.data, id: idFromURL(json.url) } : params.data
    
                    }))
            ;
            
        },

    updateMany: (resource, params) => { //no case implemented
        const query = {
            filter: JSON.stringify({ id: params.ids}),
        };
        return httpClient(`${apiUrl}/${resource}?${stringify(query)}`, {
            method: 'PUT',
            body: JSON.stringify(params.data),
        }).then(({ json }) => ({ data: json }));
    },

    delete: (resource, params) =>
        {

    
            const {prefix, suffix , instance } = params.meta || {};
            let url = `${apiUrl}/`;

            if (prefix) {
                url += `${prefix}/`
            }
            url += `${resource}`;
            if (suffix) {
                url += `/${suffix}`;
            }

            if (instance !== false) {
                url += `/${params.id}`;
            }
    
            return httpClient(url, {
                    method: 'DELETE', }
                    )
                    .then(({json}) => ({ data: json }) );
            
        },

    deleteMany: (resource, params) => { // no case implemented
        const query = {
            filter: JSON.stringify({ id: params.ids}),
        };
        return httpClient(`${apiUrl}/${resource}?${stringify(query)}`, {
            method: 'DELETE',
            body: JSON.stringify(params.data),
        }).then(({ json }) => ({ data: json }));
    },


   
} ;

export default CustomDataProvider;
