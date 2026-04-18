Système de Gestion des Ventes — C2A

Application web de gestion des ventes permettant d’automatiser les processus commerciaux : devis, commandes, facturation, paiement et gestion de stock.

Contexte du projet

Ce projet s’inscrit dans le cadre d’un Projet de Fin d’Études (PFE) 2025/2026.

Entreprise : C2A

Problématique

L’entreprise utilise une gestion manuelle :

Perte de temps
Erreurs humaines
Difficulté de suivi des ventes et du stock
Objectif

Mettre en place une solution web permettant :

Automatisation des ventes
Suivi en temps réel
Centralisation des données
Architecture

Architecture Three-Tier (3 couches) :

Frontend : React.js
Backend : Spring Boot
Base de données : MySQL
Stack Technique
Backend
Java 17
Spring Boot 3
Spring Security + JWT
Spring Data JPA
MySQL
Swagger
Frontend
React 18
Tailwind CSS
Axios
Recharts
Fonctionnalités
Authentification
Login sécurisé avec JWT
Gestion des rôles
Gestion des clients
Ajouter / Modifier / Supprimer
Recherche
Gestion des produits
Catalogue produits
Gestion du stock
Gestion des devis
Création de devis
Conversion en commande
Gestion des commandes
Suivi des commandes
Historique
Facturation et paiement
Génération de factures
Suivi des paiements
Dashboard
Statistiques des ventes
Graphiques
Modélisation UML

Diagrammes disponibles :

Diagramme de cas d’utilisation
Diagramme de classes
Diagramme de séquence
Architecture technique
Installation
Backend (Spring Boot)
Créer la base de données :
mysql -u root -p
CREATE DATABASE c2a_ventes;
Configurer application.properties
Lancer le projet :
mvn spring-boot:run

Swagger :

http://localhost:8080/api/swagger-ui.html
Frontend (React)

Installer et lancer :

npm install
npm run dev

Accès :

http://localhost:3000
Comptes de test

Admin
email : admin@c2a.com

mot de passe : 123456

Vendeur
email : vendeur@c2a.com

mot de passe : 123456

Structure du projet
Backend
c2a-backend/
 ├── controllers/
 ├── services/
 ├── repositories/
 ├── models/
 ├── security/
 └── config/
Frontend
c2a-frontend/
 ├── pages/
 ├── components/
 ├── services/
 ├── context/
 └── routes/
Compétences développées
Architecture REST
Sécurité JWT
Conception UML
Développement Full Stack
Gestion de projet
Planning

Mois 1 : Analyse et cahier des charges
Mois 2 : Conception UML
Mois 3 : Backend
Mois 4 : Frontend
Mois 5 : Tests
Mois 6 : Déploiement

Auteur

Ryhab Elmoncer
