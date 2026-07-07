# Lueur — mise en ligne

## Ce que tu as déjà
- `index.html` : l'app complète (FR/EN/ES, journal, réflexion, suggestion sociale, encart sponsorisé)
- `manifest.json` + `icon.svg` + `sw.js` : la rendent installable (PWA)
- `api/reflect.js` : la fonction serveur qui appelle Claude en sécurité

Sans backend connecté, l'app fonctionne déjà grâce à une réponse de secours locale.

## Mise en ligne
1. Créer un compte GitHub si besoin.
2. Déposer ces fichiers dans un dépôt.
3. Aller sur vercel.com, se connecter avec GitHub, "Add New Project", choisir ce dépôt, "Deploy".
4. Pour activer l'IA : Vercel → Settings → Environment Variables → ajouter ANTHROPIC_API_KEY.
5. Tester sur mobile : "Ajouter à l'écran d'accueil".

## Monétisation
Google AdSense exige une politique de confidentialité et un peu de trafic avant d'accepter le site.
En attendant, un partenariat direct (marque bien-être) est souvent plus rapide à obtenir.
