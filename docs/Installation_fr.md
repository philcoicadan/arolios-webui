## Installation

Cette section s'adresse aux personnes ayant des connaissances en construction et installation de logiciels.

Pour utiliser **AROLIOS WebUI**, vous devez en premier lieu installer les prérequis puis récupérer les sources qui sont écrits en langage JavaScript.

### Prérequis

**AROLIOS WebUI** dépend du logiciel [React-Admin](http://marmelab.com/react-admin) qui sera installé avec toutes ses dépendances. Au préalable il faut installer **node.js** qui est un logiciel serveur interprétant le JavaScript et **npm** son gestionnaire de paquets.

Il y a plusieurs méthodes dépendantes de votre système d'exploitation pour installer ces deux logiciels.
Suivez les instructions que vous trouverez sur Internet, par exemple [ici](https://docs.npmjs.com)


 ### Construction

 1. Copiez les sources téléchargés dans un nouveau répertoire.
 2. Placez-vous dans ce répertoire et tapez la commande: npm install  
 Cette commande installe tous les paquets React-Admin nécessaires ainsi que les paquets dont ils dépendent.
 3. Pour construire la version de production, 
    1. copiez le fichier .env_template dans le fichier .env et modifiez le paramètre VITE_BACKEND_URL pour lui indiquer l'URL du serveur qui implémente l'**API AROLIOS**. Exemple: https://my_arolios_server
    2. tapez la commande: npm run build  
    Un répertoire dist est créé avec les fichiers nécessaires à l'exécution

### Déploiement

1. Copiez le répertoire dist créé dans le répertoire adéquat pour le serveur web (par exemple Apache) qui servira aux utilisateurs **AROLIOS WebUI**. Exemple /var/www/arolios_webui
2. Si vous utilisez le serveur Apache (recommandé), copiez dans ce répertoire le fichier .htaccess fourni avec les sources. Dans ce cas, il faut configurer Apache avec, par exemple sur Linux,  les commandes suivantes:
    1. sudo a2enmode rewrite
    2. sudo systemctl apache2 restart
3. Configurez votre serveur web (Apache par exemple) pour servir **AROLIOS WebUI**. Par exemple avec Apache sur Linux:
    1. Placez-vous dans le repertoire /etc/apache2/sites-available
    2. Copiez le fichier 000-default.conf ou default-ssl.conf si vous voulez fonctionner en HTTPS (par exemple arolios.conf)
    3. Dans cette copie, renseignez les paramètres ServerName (l'URL pour adresser **AROLIOS WebUI**, par exemple www.my-arolios.example.com)  et DocumentRoot (l'emplacement du fichier index.html, par exemple /var/www/arolios_webui). 
    4. Si vous fonctionnez en mode HTTPS, renseignez dans votre fichier de configuration les lignes SSLCertificateFile  et SSLCertificateKeyFile et après enregistrement passez la commande: sudo a2enmod ssl
    5. Enregistrez votre site en passant la commande suivante (par exemple pour arolios.conf): sudo a2ensite arolios.conf 
    6. Redémarrez le serveur Apache: sudo systemctl restart apache2
4. Le serveur de l'API AROLIOS fonctionnant en mode HTTPS, chaque utilisateur potentiel doit installer dans son navigateur le certificat racine créé lors de l'installation du serveur (voir la documentation dans le dépôt **arolios-doc** ). Dans le paramétrage du navigateur, voir la rubrique des certificats, et importer votre certificat dans les autorités.
5. Si le serveur de l'API AROLIOS que vous avez renseigné dans le paramètre VITE_BACKEND_URL est lancé ainsi que votre serveur web servant **AROLIOS WebUI**  (Apache par exemple), vous pouvez démarrer **AROLIOS WebUI** depuis votre navigateur web en l'adressant avec l'URL renseigné dans la configuration de votre serveur Web ( par exemple www.my-arolios.example.com).
 en mode HTTPS éventuellement
En cas de difficulté, référez-vous à la documentation de votre serveur web ou aux articles disponibles sur Internet pour y déployer une application React.




