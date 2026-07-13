tu as Trois choses à faire : premièrement dans la Navbar.tsx et le footer:
Logo dans Navbar : mettre ici le logo de l'amescao : chemin vers : amescao\public\AMESCAO.PrincipalLogoIcon.svg et supprimer le cercle du motion.div de la lettre A. donne lui de bonne dimension, comme c'est un svg qui avait 192px\*192px pour qu'il reste bien dans la bare de navigation : Navbar
Logo dans footer : remplacer aussi au niveau de : <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold">
A

</div>

deuxiènement dans la section de gestion des données c'est à dire notre petit CMS avec la page admin, dans CardItem.tsx je veux que les cartes spécifiques de la table "profiles" tu affiche les les cartes des utilisateurs en une ligne complète et empilé, ligne par ligne comme on affiche les messages sur un téléphone, donc on extencie la carte pour qu'elle occupe toute la ligne : en affichant, la photo, en petit cercle, le nom et prenom, le role, et l'e-mail. tout cela en ligne /avec une petite date de création du profil. j'ai dis que cet affichage n'est que pour les cartes de la tables "profiles "seulement et que c'est dans la section de gestion du contenu : donc page admin et non pour le site principale fait attention.

troisiènement, vérifier dans module/Contact.tsx voir si le formulaire d'envoie de mail, permet réelement d'envoyer le mail, à l'adresse : amescao2026@gmail.com. c'est pas juste un envoie fictif, ça doit être réel.
