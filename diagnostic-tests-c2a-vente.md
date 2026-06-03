# Rapport diagnostic et tests - C2A-Vente

Date du diagnostic : 2026-05-06

## 1. Résumé global

- État général du projet : projet full-stack structuré en deux sous-projets, `c2a-backend` pour l'API Spring Boot et `c2a-frontend` pour l'interface React/Vite. Le frontend compile. Le backend n'a pas pu être compilé ni testé dans cet environnement car Maven n'est pas disponible dans le PATH et aucun wrapper Maven n'est présent.
- Backend OK ou non : non validé par exécution. Plusieurs risques statiques importants sont détectés dans les repositories, services, configuration base de données et sécurité.
- Frontend OK ou non : build OK après utilisation de `npm.cmd run build` équivalent Windows de `npm run build`. Le projet n'a pas de script lint ni de tests frontend détectés. Des warnings Vite/Node et un bundle principal volumineux sont présents.
- Risques principaux :
  - Backend impossible à tester localement sans Maven ou wrapper `mvnw`.
  - Requête JPQL probablement bloquante dans `CommandeRepository` à cause de `LIMIT 1`.
  - Requête JPQL fragile/probablement invalide dans `DevisRepository` avec `LIKE :prefix%`.
  - Conversion devis -> commande cassée par une mauvaise génération du numéro de commande.
  - Configuration MySQL locale obligatoire sans profil de test.
  - Secrets JWT, mots de passe de démonstration et configuration mail présents dans le code/configuration.
  - CORS déclaré dans `application.properties` mais pas câblé dans `SecurityConfig`.
  - Plusieurs modules métier sont partiels côté frontend : utilisateurs, création commandes, création factures, livraisons/BL, rapports avancés.

## 2. Structure du projet

Arborescence principale détectée :

```text
C2A-Vente/
├─ README.md
├─ rapport-diagnostic-c2a-vente.pdf
├─ c2a-backend/
│  ├─ pom.xml
│  ├─ src/main/resources/application.properties
│  ├─ src/main/java/com/c2a/gestionventes/
│  │  ├─ GestionVentesApplication.java
│  │  ├─ config/
│  │  ├─ controller/
│  │  ├─ dto/
│  │  ├─ entity/
│  │  ├─ enums/
│  │  ├─ exception/
│  │  ├─ repository/
│  │  ├─ security/
│  │  └─ service/impl/
│  └─ target/                 # généré, déjà présent
└─ c2a-frontend/
   ├─ package.json
   ├─ package-lock.json
   ├─ vite.config.js
   ├─ tailwind.config.js
   ├─ postcss.config.js
   ├─ index.html
   ├─ src/
   │  ├─ App.jsx
   │  ├─ main.jsx
   │  ├─ api/
   │  ├─ context/
   │  ├─ components/
   │  └─ pages/
   ├─ node_modules/           # déjà présent
   └─ dist/                   # généré, déjà présent
```

Rôle de `c2a-backend` :
- API REST Spring Boot 3.2.0 avec Spring Web, JPA, Security, Validation, JWT, MySQL, Swagger/OpenAPI.
- Gestion métier : authentification, clients, produits, devis, commandes, stock, factures, paiements, dashboard.

Rôle de `c2a-frontend` :
- Application React 18 + Vite + Tailwind.
- Pages principales : login, dashboard, clients, produits, devis, commandes, factures, stock.
- Communication API via Axios avec `baseURL: '/api'`.

Fichiers importants détectés :
- Backend : `c2a-backend/pom.xml`
- Backend : `c2a-backend/src/main/resources/application.properties`
- Backend : `c2a-backend/src/main/java/com/c2a/gestionventes/config/SecurityConfig.java`
- Backend : `c2a-backend/src/main/java/com/c2a/gestionventes/security/JwtAuthFilter.java`
- Backend : `c2a-backend/src/main/java/com/c2a/gestionventes/security/JwtUtil.java`
- Backend : `c2a-backend/src/main/java/com/c2a/gestionventes/repository/CommandeRepository.java`
- Backend : `c2a-backend/src/main/java/com/c2a/gestionventes/repository/DevisRepository.java`
- Backend : `c2a-backend/src/main/java/com/c2a/gestionventes/service/impl/DevisServiceImpl.java`
- Frontend : `c2a-frontend/package.json`
- Frontend : `c2a-frontend/vite.config.js`
- Frontend : `c2a-frontend/src/api/axios.js`
- Frontend : `c2a-frontend/src/api/services.js`
- Frontend : `c2a-frontend/src/context/AuthContext.jsx`
- Frontend : `c2a-frontend/src/App.jsx`

## 3. Tests backend

### Résultats des commandes backend

| Test | Commande lancée | Résultat | Erreur trouvée si existe | Fichier concerné | Gravité | Explication simple | Proposition de correction sans modifier le code |
|---|---|---|---|---|---|---|---|
| Compilation Maven | `mvn clean install` dans `c2a-backend` | Échec | `mvn` n'est pas reconnu comme commande PowerShell | Environnement local, `c2a-backend/pom.xml` non exécuté | Bloquante | Maven n'est pas installé ou pas dans le PATH. Aucun wrapper `mvnw` / `mvnw.cmd` n'est présent. | Installer Maven et l'ajouter au PATH, ou ajouter un Maven Wrapper au projet puis relancer la compilation. |
| Tests Maven | `mvn test` dans `c2a-backend` | Échec | `mvn` n'est pas reconnu comme commande PowerShell | Environnement local | Bloquante | Les tests ne peuvent pas être lancés sans Maven. | Même correction : Maven installé/PATH ou wrapper Maven. |
| Démarrage Spring Boot | `mvn spring-boot:run` | Non lancé | Maven indisponible | Environnement local, `application.properties` | Bloquante | Le démarrage Spring Boot n'est pas possible tant que Maven est indisponible. | Corriger l'environnement Maven puis tester aussi la disponibilité MySQL. |
| Présence wrapper Maven | `Test-Path mvnw` et `Test-Path mvnw.cmd` | `False`, `False` | Aucun wrapper Maven | `c2a-backend/` | Moyenne | Le projet dépend d'une installation Maven globale. | Ajouter `mvnw` / `mvnw.cmd` pour fiabiliser les tests sur toutes les machines. |

### Vérification backend statique

| Vérification | Résultat | Erreur trouvée si existe | Fichier concerné | Gravité | Explication simple | Proposition de correction sans modifier le code |
|---|---|---|---|---|---|---|
| `pom.xml` | Structure Maven cohérente, dépendances Spring Boot/JPA/Security/JWT présentes | Non exécutable ici à cause de Maven absent | `c2a-backend/pom.xml` | Bloquante côté diagnostic | Le fichier semble structuré, mais la compilation réelle n'a pas été validée. | Relancer `mvn clean install` après installation de Maven. |
| Configuration base de données | MySQL local obligatoire | URL `jdbc:mysql://localhost:3306/c2a_vente`, user `root`, mot de passe vide | `application.properties` | Élevée | Le backend dépend d'une base MySQL locale et risque de ne pas démarrer sur une autre machine ou en CI. | Prévoir profils `dev/test/prod`, variables d'environnement, et base H2/Testcontainers pour les tests. |
| Configuration JPA | Fonctionnelle en dev mais risquée | `spring.jpa.hibernate.ddl-auto=update`, `spring.jpa.show-sql=true` | `application.properties` | Moyenne | `update` modifie le schéma automatiquement ; `show-sql` peut exposer trop de logs. | Utiliser Flyway/Liquibase et désactiver SQL verbeux hors dev. |
| Propriété parasite | Ligne isolée détectée | Ligne `x` seule | `application.properties` | Faible | Cette propriété ne casse pas forcément Spring, mais elle est inutile et brouille la configuration. | Supprimer cette ligne lors d'une future correction. |
| Circular references | Activées | `spring.main.allow-circular-references=true` | `application.properties` | Moyenne | Cela peut masquer une dépendance circulaire au lieu de la corriger. | Identifier le cycle réel et désactiver cette option. |
| Repository commandes | Requête JPQL probablement invalide | `LIMIT 1` dans une requête JPQL | `CommandeRepository.java:23` | Bloquante probable | JPQL ne supporte pas `LIMIT` comme SQL natif ; Spring Data peut échouer au démarrage. | Utiliser `nativeQuery = true`, `Pageable`, ou une méthode dérivée `findTopByNumeroStartingWithOrderByNumeroDesc`. |
| Repository devis | Requête fragile/probablement invalide | `LIKE :prefix%` | `DevisRepository.java:21` | Élevée | JPQL attend généralement `LIKE CONCAT(:prefix, '%')` ou un paramètre contenant `%`. | Construire le pattern côté service ou utiliser `CONCAT(:prefix, '%')`. |
| Génération numéro commande depuis devis | Bug certain à l'exécution | `String.valueOf(commandeRepository.findByNumero(prefix))` puis `Integer.parseInt(...)` | `DevisServiceImpl.java:125` | Élevée | `findByNumero(prefix)` retourne un `Optional<Commande>` et ne cherche pas le dernier numéro. `String.valueOf` donnera `Optional.empty` ou `Optional[...]`, ce qui casse le parsing. | Réutiliser une vraie méthode `findLastNumero(prefix)` corrigée et gérer le cas absent. |
| Génération numéro facture | Risque de collision | Numéro basé sur `Math.random()` | `FactureServiceImpl.java:95` | Moyenne | Deux factures peuvent recevoir le même numéro malgré la contrainte unique. | Générer par séquence/mois comme commandes/devis, avec verrouillage ou contrainte + retry. |
| Créances client | Incohérence métier | Créance client non augmentée à la création d'une facture, seulement diminuée au paiement | `FactureServiceImpl.java:48-89` | Élevée | Le solde client affiché peut rester faux. | À la création facture, mettre à jour `client.soldeCreance`; au paiement, diminuer ce solde de manière transactionnelle. |
| Stock | Type de mouvement non obligatoire | `MouvementStockRequest.type` n'a pas `@NotNull` | `BusinessDTOs.java:244`, `StockServiceImpl.java:43-49` | Élevée | Si `type` est absent, le service passe dans la branche sortie et peut retirer du stock. | Ajouter `@NotNull` sur `type` et refuser explicitement les types inconnus. |
| JWT | Pas de gestion claire des tokens invalides | `extractUsername(jwt)` peut lever une exception avant validation | `JwtAuthFilter.java:36`, `JwtUtil.java:64-67` | Moyenne | Un token expiré/malformé peut produire une erreur 500 au lieu d'un 401 propre. | Capturer `JwtException` dans le filtre et répondre 401. |
| CORS | Propriété non câblée | `cors.allowed-origins` est définie, mais `SecurityConfig` ne configure pas `cors()` | `application.properties:26`, `SecurityConfig.java` | Élevée | Les appels navigateur directs vers `localhost:8081` peuvent être bloqués selon le mode de déploiement. | Ajouter une configuration CORS Spring Security utilisant la propriété. |
| Sécurité routes | Auth globale présente | `.anyRequest().authenticated()` | `SecurityConfig.java:35-36` | OK avec réserves | Les routes sont protégées par défaut, mais beaucoup de GET sont accessibles à tout utilisateur connecté. | Vérifier les règles métier par rôle sur toutes les lectures sensibles. |
| Mots de passe initiaux | Comptes de démonstration codés | `admin123`, `gerant123`, `commercial123`, `comptable123` | `DataInitializer.java:26-44` | Élevée | Ces identifiants peuvent devenir dangereux hors environnement de démo. | Les charger depuis profil dev ou seed uniquement non-prod. |
| Tests backend | Aucun dossier test détecté | `src/test` absent | `c2a-backend/src/test` | Moyenne | La logique métier n'est pas couverte automatiquement. | Ajouter tests unitaires services et tests d'intégration repositories/controllers. |

## 4. Tests frontend

### Résultats des commandes frontend

| Test | Commande lancée | Résultat | Erreur trouvée si existe | Fichier concerné | Gravité | Explication simple | Proposition de correction sans modifier le code |
|---|---|---|---|---|---|---|---|
| Installation dépendances | Vérification `Test-Path node_modules` | `True` | Aucune | `c2a-frontend/node_modules` | OK | `node_modules` existe déjà, donc `npm install` n'a pas été lancé conformément à la règle. | Ne rien faire sauf si dépendances manquantes sur une autre machine. |
| Build React/Vite via PowerShell | `npm run build` | Échec environnemental | `npm.ps1` bloqué par ExecutionPolicy PowerShell | Environnement Windows | Moyenne | PowerShell refuse d'exécuter le script `npm.ps1`. | Utiliser `npm.cmd run build` sous Windows ou ajuster la politique PowerShell si autorisé. |
| Build React/Vite équivalent Windows | `npm.cmd run build` | Succès | Build OK en 10.72s | `c2a-frontend/package.json`, `vite.config.js` | OK avec warnings | Vite compile 1222 modules et génère `dist`. | Surveiller les warnings listés ci-dessous. |
| Lint frontend | Non lancé | Aucun script `lint` | `package.json` | Moyenne | Le script demandé n'existe pas. | Ajouter ESLint et un script `lint` lors d'une future amélioration. |
| Serveur dev | Non lancé | Non nécessaire | `vite.config.js` | OK | Le build suffit pour vérifier la compilation frontend. | Lancer `npm run dev` seulement pour test manuel navigateur. |

Warnings frontend importants :
- `The CJS build of Vite's Node API is deprecated`.
- Warning Node : `MODULE_TYPELESS_PACKAGE_JSON` sur `postcss.config.js`, suggestion d'ajouter `"type": "module"` ou d'adapter les fichiers de config.
- Bundle principal : `assets/index-BOpD0HaW.js` à environ 663 kB minifié, warning Vite au-dessus de 500 kB.
- Proposition : introduire du code splitting par routes/pages, ou configurer `manualChunks`.

### Vérification frontend statique

| Vérification | Résultat | Erreur trouvée si existe | Fichier concerné | Gravité | Explication simple | Proposition de correction sans modifier le code |
|---|---|---|---|---|---|---|
| Imports | OK au build | Aucune erreur d'import détectée par Vite | `src/**` | OK | Le build production passe. | Ajouter lint/tests pour compléter. |
| Routes React | OK au build | Routes privées basées sur présence de `user` localStorage | `App.jsx` | Moyenne | Toutes les pages principales sont derrière `PrivateRoute`, mais il n'y a pas de garde par rôle côté UI. | Ajouter des guards par rôle pour masquer les pages/actions interdites. |
| Services API | Globalement alignés avec backend | Pas de mismatch majeur sur `/clients`, `/produits`, `/devis`, `/commandes`, `/factures`, `/stock`, `/dashboard` | `src/api/services.js` | OK avec réserves | Les routes principales correspondent aux controllers. | Compléter les services manquants : utilisateurs, création facture UI, création commande UI, bons de livraison. |
| AuthContext/token | Fonctionnel mais fragile sécurité | Token et user stockés dans `localStorage` | `AuthContext.jsx`, `axios.js` | Élevée | `localStorage` est exposé en cas de XSS. | Préférer cookie HttpOnly/SameSite ou durcir CSP et sanitisation si localStorage est conservé. |
| Gestion erreurs API | Partielle | Plusieurs pages font `.catch(() => {})` | Pages `Dashboard`, `Clients`, `Produits`, `Devis`, `Commandes`, `Factures`, `Stock` | Moyenne | Les erreurs de chargement sont silencieuses, ce qui masque pannes backend/API. | Afficher un état erreur et proposer retry. |
| Tailwind | Build OK | Pas d'erreur Tailwind détectée | `tailwind.config.js`, `src/index.css` | OK | Les classes sont compilées. | Ajouter lint CSS/formatage si nécessaire. |
| Composants/pages | Build OK | Certaines fonctionnalités métier manquent côté UI | `pages/commandes`, `pages/factures`, `pages/auth` | Moyenne | Commandes : pas de création depuis l'UI. Factures : paiement seulement, pas création. Utilisateurs : pas d'UI admin. | Compléter les parcours métier après correction backend. |
| Tests frontend | Aucun fichier `.test` / `.spec` détecté | Pas de test unitaire/composant | `c2a-frontend/src` | Moyenne | Aucun filet de sécurité automatique côté React. | Ajouter Vitest + React Testing Library pour AuthContext, services API et pages critiques. |

## 5. Communication backend/frontend

- URL API utilisée par frontend : `baseURL: '/api'` dans `c2a-frontend/src/api/axios.js`.
- Proxy dev Vite : `/api` vers `http://localhost:8081` dans `c2a-frontend/vite.config.js`.
- Backend : `server.port=8081` et `server.servlet.context-path=/api` dans `application.properties`.
- Conclusion URL : en développement via Vite proxy, `/api/auth/login` côté navigateur devient `http://localhost:8081/api/auth/login`, ce qui correspond au backend.

Endpoints backend disponibles et correspondance frontend :

| Domaine | Backend controller | Frontend service | Correspondance | Problème possible |
|---|---|---|---|---|
| Auth | `/auth/login`, `/auth/register` | `/auth/login` | Partielle | Register existe backend mais pas UI admin. |
| Clients | `/clients`, `/clients/{id}`, `/clients/site/{site}`, `/clients/creances` | Oui | OK | GET non filtrés par rôle ; soft delete visible dans `findAll`. |
| Produits | `/produits`, `/produits/{id}`, `/produits/rupture` | Oui | OK | Pas de delete/désactivation côté API frontend. |
| Devis | `/devis`, `/devis/{id}`, `/devis/{id}/statut/{statut}`, `/devis/{id}/convertir` | Oui | OK | Création/conversion risquent de casser côté backend à cause des numéros/repositories. |
| Commandes | `/commandes`, `/commandes/{id}`, `/commandes/site/{site}`, `/commandes/statut/{statut}`, patch statut | Oui | OK | Frontend n'a pas de création commande directe. Repository backend probablement bloquant. |
| Factures | `/factures`, `/factures/{id}`, `/factures/retard`, `/factures/paiements` | Oui | OK partiel | Frontend ne crée pas de facture, seulement paiements. |
| Stock | `/stock/mouvements/{produitId}`, `/stock/rupture`, `/stock/mouvements` | Oui | OK | `type` mouvement non obligatoire côté DTO backend. |
| Dashboard | `/dashboard` | Oui | OK partiel | Backend ne renseigne pas `topClients` ni `topProduits`. |

Problèmes possibles CORS :
- `cors.allowed-origins=http://localhost:3000,http://localhost:5173` est défini.
- Aucune configuration CORS n'est visible dans `SecurityConfig`.
- En mode Vite dev avec proxy, CORS est moins visible. En mode frontend séparé sans reverse proxy, les appels peuvent échouer.

Problèmes possibles JWT/token :
- Le header `Authorization: Bearer <token>` est bien ajouté par Axios.
- Le token est stocké dans `localStorage`, ce qui est pratique mais sensible aux XSS.
- Les tokens invalides/expirés peuvent être mal gérés dans le filtre JWT si une exception est levée avant la réponse 401.

Incohérences noms de routes :
- Aucune incohérence majeure détectée sur les routes utilisées par `services.js`.
- Les modules `users`, `bons de livraison`, rapports avancés n'ont pas d'interface/service frontend dédié.

## 6. Fonctionnalités métier

| Module | Backend trouvé ? | Frontend trouvé ? | Test possible ? | Problème détecté | Gravité | Fichiers concernés |
|---|---|---|---|---|---|---|
| Authentification | Oui | Oui | Build frontend OK, backend non exécutable sans Maven | Secrets JWT/config demo en dur, token localStorage, Maven absent | Élevée | `AuthController.java`, `AuthServiceImpl.java`, `JwtUtil.java`, `AuthContext.jsx`, `LoginPage.jsx` |
| Gestion utilisateurs | Partiel | Non | Non | Entité/repository/register existent, mais pas de CRUD utilisateurs ni UI admin | Moyenne | `User.java`, `UserRepository.java`, `AuthController.java` |
| Gestion clients | Oui | Oui | Frontend build OK, backend non testé | Soft delete mais `findAll()` retourne aussi les inactifs ; règles rôle lecture peu fines | Moyenne | `ClientController.java`, `ClientServiceImpl.java`, `ClientsPage.jsx` |
| Gestion produits | Oui | Oui | Frontend build OK, backend non testé | Pas de delete/désactivation API visible ; update ne contrôle pas référence dupliquée si évolution future | Moyenne | `ProduitController.java`, `ProduitServiceImpl.java`, `ProduitsPage.jsx` |
| Gestion devis | Oui | Oui | Frontend build OK, backend non testé | Query `LIKE :prefix%` fragile ; conversion vers commande cassée par génération numéro | Élevée | `DevisRepository.java`, `DevisServiceImpl.java`, `DevisPage.jsx` |
| Gestion commandes | Oui | Partiel | Frontend build OK, backend non testé | Query `LIMIT 1` probablement bloquante ; pas de création commande UI | Bloquante probable | `CommandeRepository.java`, `CommandeServiceImpl.java`, `CommandesPage.jsx` |
| Gestion stock | Oui | Oui | Frontend build OK, backend non testé | Type mouvement nullable pouvant provoquer une sortie de stock par défaut | Élevée | `StockController.java`, `StockServiceImpl.java`, `BusinessDTOs.java`, `StockPage.jsx` |
| Gestion factures | Oui | Partiel | Frontend build OK, backend non testé | Création facture non exposée dans UI ; numéro aléatoire ; créance client non augmentée | Élevée | `FactureController.java`, `FactureServiceImpl.java`, `FacturesPage.jsx` |
| Gestion paiements | Partiel via factures | Oui via factures | Frontend build OK, backend non testé | Pas de module paiement autonome ; paiement dépend du bon état de la facture/créance | Moyenne | `FactureController.java`, `PaiementRepository.java`, `FacturesPage.jsx` |
| Dashboard / rapports | Oui | Oui | Frontend build OK, backend non testé | `topClients` et `topProduits` existent dans DTO mais ne sont pas remplis | Moyenne | `DashboardController.java`, `BusinessDTOs.java`, `Dashboard.jsx` |

## 7. Sécurité

- Routes protégées :
  - `SecurityConfig` protège toutes les routes sauf `/auth/**`, `/swagger-ui/**`, `/v3/api-docs/**`.
  - `@PreAuthorize` est présent sur certaines actions sensibles : création clients, produits, devis, commandes, factures, paiements, mouvements stock, dashboard.
- Rôles utilisateurs :
  - Backend utilise `ROLE_` via `User.getAuthorities()`.
  - Frontend reçoit `role` sans préfixe `ROLE_`, ce qui convient à `hasRole(...roles)` côté frontend.
  - Le frontend n'applique pas de restriction de navigation/action par rôle sur toutes les pages.
- JWT :
  - Secret JWT codé dans `application.properties`.
  - Expiration configurée à `86400000`.
  - Pas de refresh token, pas de révocation/blacklist.
  - Gestion des tokens invalides à renforcer dans `JwtAuthFilter`.
- Mots de passe :
  - BCrypt utilisé côté backend.
  - Comptes initiaux et mots de passe demo codés dans `DataInitializer` et visibles dans `LoginPage`.
- CORS :
  - Propriété déclarée mais configuration CORS Spring Security absente.
- Accès non autorisé :
  - `GlobalExceptionHandler` gère `AccessDeniedException`.
  - Les erreurs d'authentification JWT avant contrôleur peuvent ne pas passer par ce handler.
- Stockage token frontend :
  - `localStorage` utilisé pour `c2a_token` et `c2a_user`.
  - Risque XSS : préférer cookie HttpOnly/SameSite ou durcissement CSP.

## 8. Qualité du code

- Duplication :
  - Mappings DTO manuels répétés dans plusieurs services (`toResponse` clients, lignes, commandes/devis/factures).
  - Une couche mapper dédiée ou MapStruct, déjà présent dans `pom.xml`, pourrait réduire la duplication.
- Noms incohérents ou incomplets :
  - `CommandeRepository.findLastNumero` et `DevisRepository.findLastNumero` n'utilisent pas la même stratégie.
  - `DevisServiceImpl.genererNumeroCommande` utilise `findByNumero(prefix)` au lieu d'une méthode de dernier numéro.
- Code mort / modules incomplets :
  - Entité/repository `BonLivraison` présents, mais pas de controller/service/frontend détecté.
  - DTO `topClients` / `topProduits` présents, mais non alimentés par `DashboardController`.
  - Register utilisateur backend présent, mais pas d'écran admin.
- Fichiers inutilisés ou générés :
  - `target`, `dist`, `node_modules`, `.idea` sont présents et non suivis.
  - À vérifier dans `.gitignore` pour éviter de versionner des artefacts.
- Erreurs potentielles :
  - JPQL invalide/fragile.
  - Numéros métier générés sans verrouillage transactionnel robuste.
  - `Math.random()` pour les factures.
  - `MouvementStockRequest.type` nullable.
  - Catch silencieux frontend.
- Manque de validation :
  - Certains enums ou montants ne sont pas tous annotés `@NotNull`.
  - `tva` n'a pas de contrainte explicite.
  - Les entités utilisent `Double` pour l'argent ; `BigDecimal` serait plus sûr.
- Manque de gestion d'erreurs :
  - Frontend masque plusieurs erreurs API.
  - JWT invalides/expirés à gérer proprement en 401.
- Tests :
  - Aucun test backend détecté.
  - Aucun test frontend détecté.
  - Aucun lint frontend configuré.

## 9. Liste priorisée des problèmes

| Priorité | Problème | Gravité | Fichier | Pourquoi c'est important | Correction proposée |
|---|---|---|---|---|---|
| 1 | Maven absent et aucun wrapper Maven | Bloquante | `c2a-backend/` | Impossible de compiler/tester/démarrer le backend dans cet environnement. | Installer Maven ou ajouter `mvnw` / `mvnw.cmd`. |
| 1 | Requête JPQL avec `LIMIT 1` | Bloquante probable | `CommandeRepository.java:23` | Peut empêcher le contexte Spring de démarrer. | Remplacer par méthode dérivée avec `Top`/`OrderBy`, `Pageable`, ou `nativeQuery=true`. |
| 1 | Requête devis `LIKE :prefix%` | Élevée | `DevisRepository.java:21` | Peut échouer à la validation de requête ou retourner des résultats incorrects. | Utiliser `LIKE CONCAT(:prefix, '%')` ou passer `prefix + '%'`. |
| 1 | Conversion devis -> commande génère un numéro invalide | Élevée | `DevisServiceImpl.java:125` | La conversion d'un devis validé peut échouer systématiquement. | Utiliser une méthode corrigée de dernier numéro commande. |
| 1 | Configuration DB locale rigide | Élevée | `application.properties` | Démarrage dépendant de MySQL local `root` sans mot de passe. | Externaliser via variables/profils et ajouter profil test. |
| 2 | CORS déclaré mais non configuré dans Spring Security | Élevée | `application.properties`, `SecurityConfig.java` | Risque d'échec navigateur selon déploiement frontend/backend. | Ajouter `cors()` et un `CorsConfigurationSource`. |
| 2 | Secret JWT et mots de passe demo en dur | Élevée | `application.properties`, `DataInitializer.java`, `LoginPage.jsx` | Risque critique hors environnement de démo. | Externaliser secrets, limiter comptes demo au profil dev. |
| 2 | Créances client incohérentes | Élevée | `FactureServiceImpl.java` | Le suivi client peut afficher des soldes faux. | Augmenter la créance à l'émission facture et la diminuer au paiement. |
| 2 | Type mouvement stock nullable | Élevée | `BusinessDTOs.java`, `StockServiceImpl.java` | Une requête incomplète peut retirer du stock. | Ajouter `@NotNull` et validation explicite. |
| 3 | Aucun test backend/frontend | Moyenne | `c2a-backend/src/test`, `c2a-frontend/src` | Les régressions métier ne sont pas détectées automatiquement. | Ajouter tests unitaires, intégration et composants React. |
| 3 | Pas de script lint frontend | Moyenne | `package.json` | Les erreurs de qualité/imports/styles ne sont pas détectées tôt. | Ajouter ESLint + script `npm run lint`. |
| 3 | UI métier partielle | Moyenne | `pages/commandes`, `pages/factures`, `pages/auth` | Certains parcours ne sont pas utilisables depuis l'interface. | Ajouter UI création commandes, création factures, gestion utilisateurs. |
| 4 | Bundle frontend volumineux | Faible à moyenne | Build Vite | Peut ralentir le chargement initial. | Ajouter code splitting par routes et chunks manuels. |
| 4 | Catch silencieux frontend | Moyenne | Pages React | L'utilisateur ne voit pas les pannes API. | Ajouter état erreur, toast ciblé et bouton retry. |
| 4 | Numéro facture aléatoire | Moyenne | `FactureServiceImpl.java:95` | Risque collision et manque de traçabilité comptable. | Génération séquentielle fiable par période. |

## 10. Plan d'amélioration conseillé

Étape 1 : rendre le backend testable.
- Installer Maven ou ajouter le Maven Wrapper.
- Relancer `mvn clean install` puis `mvn test`.
- Ajouter un profil de test avec base isolée.

Étape 2 : corriger les blocages backend probables.
- Corriger `CommandeRepository.findLastNumero`.
- Corriger `DevisRepository.findLastNumero`.
- Corriger `DevisServiceImpl.genererNumeroCommande`.
- Relancer compilation et démarrage Spring Boot.

Étape 3 : fiabiliser configuration et démarrage.
- Externaliser DB, JWT, mail et comptes initiaux.
- Ajouter `application-dev.properties`, `application-test.properties`, `application-prod.properties`.
- Vérifier démarrage avec MySQL réel puis avec profil test.

Étape 4 : renforcer sécurité.
- Configurer CORS dans Spring Security.
- Gérer tokens JWT invalides/expirés en 401.
- Retirer mots de passe demo des builds non-dev.
- Revoir le stockage token frontend.

Étape 5 : corriger les règles métier critiques.
- Corriger le calcul des créances client.
- Remplacer génération aléatoire des factures.
- Ajouter validation `@NotNull` sur enums critiques.
- Vérifier stock, facture, paiement, devis -> commande avec tests.

Étape 6 : compléter les fonctionnalités frontend.
- Ajouter création commandes.
- Ajouter création factures.
- Ajouter gestion utilisateurs/admin.
- Ajouter bons de livraison si ce module est prévu.
- Ajouter affichage erreurs API et restrictions UI par rôle.

Étape 7 : ajouter qualité et tests.
- Backend : tests services, repositories, controllers, sécurité JWT.
- Frontend : Vitest/React Testing Library pour AuthContext, routes privées, services et formulaires.
- Ajouter ESLint avec `npm run lint`.
- Surveiller taille bundle Vite.

Confirmation finale :
- Je n'ai modifié aucun fichier existant de code source, configuration, `pom.xml`, `package.json`, `application.properties` ou fichiers `src`.
- Le seul fichier créé manuellement à la racine est `diagnostic-tests-c2a-vente.md`.
- Note de transparence : la commande de test frontend autorisée `npm.cmd run build` a régénéré le dossier `c2a-frontend/dist`, ce qui est l'effet normal d'un build Vite.
