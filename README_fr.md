# Aperçu général

**AROLIOS** est un projet de logiciels **open source** pour **gérer les données** utilisées dans un domaine métier ou tout autre activité .

**AROLIOS** apporte une réponse à toutes celles et ceux qui recherchent une solution ayant une ou plusieurs des particularités suivantes :

* la définition des types de données selon la vue du domaine métier ou de l'activité,
* les fonctions de base de gestion de données,
* l'import/export de données en masse,
* le multilinguisme pour les types de données et les données texte,
* une mise en oeuvre très rapide sans besoin de programmation,
* l'intégration dans le système d'information facilitée par une interface de programmation,
* l'accès sécurisé pour tous les utilisateurs via les technologies Web,
* des modifications/extensions possibles sans dépendre d'un fournisseur unique

Les fonctions de gestion de données sont **génériques**, c'est-à-dire indépendantes du type de données.

Une fois vos types de données définis, **aucune programmation** n'est nécessaire, **aucun code supplémentaire n'est généré**, vous pouvez de suite **créer, rechercher, consulter, modifier, supprimer** des données.

Le projet **AROLIOS** est composé actuellement de trois logiciels:
* **AROLIOS Core** est le logiciel comprenant plusieurs bibliothèques de programmes implémentant les fonctionnalités ainsi qu'un programme  pour initialiser la base de données.
* **AROLIOS Server** est le logiciel agissant comme serveur Web et implémentant une interface de programmation (l'API AROLIOS) en faisant appel à AROLIOS Core
* **AROLIOS WebUI** est le logiciel interagissant avec l'utilisateur, s'exécutant dans son navigateur Web et communiquant avec un serveur implémentant l'API AROLIOS.  

La suite du texte concerne **AROLIOS WebUI**

# Installation

Voir la documentation [ici](./docs/Installation_fr.md)

# Documentation

La documentation d'utilisation de **AROLIOS WebUI** se trouve [ici](./docs/UserGuide_fr.md)

La documentation sur les concepts et fonctionnalités d'**AROLIOS** se trouve [ici](https://lab.frogg.it/philcoicadan/arolios-doc/src/Presentation_fr.md)

La documentation pour utiliser l'API d'**AROLIOS** se trouve [ici](https://lab.frogg.it/philcoicadan/arolios-doc/src/API_fr.md)

# Assistance

Si vous constatez une anomalie ou si vous avez une suggestion d'amélioration, ouvrez un ticket dans ce projet. Pour toute autre demande, vous pouvez envoyer une courriel à [cette adresse](mailto:philcoicadan@arolios.org).


# Contribution

Voir le fichier CONTRIBUTING.md

# Licence

AROLIOS WebUI est publié sous licence MIT (identifiant SPDX: MIT).
Voir le fichier [LICENSE.txt](./LICENSE.md)

