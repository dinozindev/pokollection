# Pokollection

A website / application where users are able to create an account, search for pokemon cards from the TCGDex API, create a Collection, save Favorite cards, build different binders with different cards and share their profile.

Cards contain informations like:
- Image
- Set
- Set Number
- Illustrator
- Rarity

## Technologies Used
- React.js
- TypeScript
- Tailwind CSS
- Firebase

## Instalation
To run this application, you need to:
- Create an account on Firebase and create a new Web Project with Authentication and Firestore;
- Clone the repository using:
```
git clone https://github.com/dinozindev/pokemon-cards.git
```
- Create a .env file for your firebaseConfig values:
```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```
- Install the dependencies:
```
npm install
```
- Run the project using:
```
npm run dev
```

## Screenshots

![home](https://imgur.com/ZlkWCi8.png)

![cards](https://imgur.com/t6vhrXp.png)

![profile](https://imgur.com/yXOjx63.png)

![card_details](https://imgur.com/8m5aGmq.png)

![binders](https://imgur.com/sc4ljCk.png)
