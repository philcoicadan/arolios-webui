## Installation

This section is intended for people with knowledge of building and installing software. 

To use **AROLIOS WebUI**, you must first install the prerequisites and then retrieve the sources which are written in JavaScript.

### Prerequisites 

**AROLIOS WebUI** depends on the software [React-Admin](http://marmelab.com/react-admin) which will be installed with all its dependencies. First you must install **node.js** which is a server software interpreting JavaScript and **npm** its package manager. 

There are several methods depending on your operating system to install these two software programs. 
Follow the instructions you find on the Internet, for example [here](https://docs.npmjs.com) 

### Construction 

1. Copy the downloaded sources to a new directory. 
2. Change to this directory and type the command: npm install  
This command installs all the necessary React-Admin packages as well as the packages they depend on. 
3. To build the production version, 
   1. copy the .env_template file into the .env file and modify the VITE_BACKEND_URL parameter by entering the URL of the server that implements the **AROLIOS API**. Example: https://my_arolios_server 
   2. type the command: npm run build  
   A dist directory is created with the files necessary for execution 
   
### Deployment 

1. Copy the dist directory created into the appropriate directory for the web server (for example Apache) which will be used by the **AROLIOS WebUI** users. Example /var/www/arolios_webui 
2. If you use the Apache server (recommended), copy the .htaccess file provided with the sources into this directory. In this case, you must configure Apache with, for example on Linux, the following commands: 
    1. sudo a2enmode rewrite 
    2. sudo systemctl apache2 restart 
3. Configure your web server (Apache for example) to serve **AROLIOS WebUI**. For example with Apache on Linux: 
    1. Place yourself in the /etc/apache2/sites-available directory 
    2. Copy the 000-default.conf or default-ssl.conf file if you want to operate in HTTPS (for example arolios.conf) 
    3. In this copy, fill in the ServerName parameters (the URL to address **AROLIOS WebUI**, for example www.my-arolios.example.com) and DocumentRoot (the location of the index.html file, for example /var/www/arolios_webui).
    4. If you operate in HTTPS mode, enter the SSLCertificateFile and SSLCertificateKeyFile lines in your configuration file and after saving, issue the command: sudo a2enmod ssl 
    5. Save your site by entering the following command (for example for arolios.conf): sudo a2ensite arolios.conf 
    6. Restart the Apache server: sudo systemctl restart apache2 
4. If the AROLIOS API server operates in HTTPS mode, each potential user must install in the browser the root certificate created during the installation of the server (see the documentation in the **arolios-doc** repository). In the browser settings, see the certificates section, and import your certificate into the authorities. 
5. If the AROLIOS API server that you entered in the VITE_BACKEND_URL parameter is launched as well as your web server serving **AROLIOS WebUI** (Apache for example), you can start **AROLIOS WebUI** from your web browser by addressing it with the URL entered in the configuration of your Web server (for example www.my-arolios.example.com) in HTTPS mode possibly.
In case of difficulty, refer to the documentation of your web server or to articles available on the Internet to deploy a React application.






