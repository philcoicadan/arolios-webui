import { backEndURL } from "../utils";

const authProvider = {
    login: ({ username, password }) =>  {

        const request = new Request(backEndURL() + '/login', {
                method: 'POST',
            body: JSON.stringify({ username, password }),
            headers: new Headers({ 'Content-Type': 'application/json' }),
        });
        return fetch(request, { credentials: 'include'})
            .then(response => {
                if (response.status < 200 || response.status >= 300) {
                    throw new Error(response.statusText);
                }
                return response.json();
            })
            .then( json => {
                const auth = { id: json.user.identifier, token: json.token};
                const permissions = { role: json.user.role, appName: json.app.name, isDefaultApp: json.app.isDefault}
                sessionStorage.setItem('arolios_auth', JSON.stringify(auth));
                sessionStorage.setItem('arolios_permissions', JSON.stringify(permissions));
                sessionStorage.setItem('arolios_model_default_language', json.app.defaultLanguage) ;
            })
            .catch(() => {
                throw new Error('Network error')
            });
    },
    logout: () => {
        sessionStorage.removeItem('arolios_auth'); 
        sessionStorage.removeItem('arolios_permissions');
        sessionStorage.removeItem('arolios_model_default_language');
        // try to clear the server side
        const request = new Request(backEndURL() + '/logout', {
                method: 'POST',            
        });

        return fetch(request, { credentials: 'include'})
        .then(response => {
            if (response.status < 200 || response.status >= 300) {
                throw new Error(response.statusText);
            }
            return Promise.resolve();
        })
        .catch(() => {
            throw new Error('Network error')
        });
    },
    checkAuth: () => sessionStorage.getItem('arolios_auth')
        ? Promise.resolve()
        : Promise.reject(),
    checkError:  (error) => {
      if (!error) {
        return Promise.reject(new Error ('not known error'));
      }
        const status = error.status;
        if (status === 401 || status === 403) {
            sessionStorage.removeItem('arolios_auth');
            sessionStorage.removeItem('arolios_permissions');
            sessionStorage.removeItem('arolios_model_default_language');
            return Promise.reject( new Error ('Authentication error'));
        }
        // other error code (404, 500, etc): no need to log out
        return Promise.resolve();
    },
    getIdentity: () => {
        try {
            const { id, identifier } = JSON.parse(sessionStorage.getItem('arolios_auth'));
            return Promise.resolve({ id, fullName: identifier });
        } catch (error) {
            return Promise.reject(error);
        }
    },
    getPermissions: () => {
        const permissions = JSON.parse(sessionStorage.getItem('arolios_permissions'));
        return (permissions) ? Promise.resolve (permissions) : Promise.reject();

       
    },

    canEdit: (role) => {
        return role === 'admin' || role === 'producer' ;
    }
};

export default authProvider;

