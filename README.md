# Exhibition Curator

**Frame and Curate** is a web application that allows users to create personalized virtual exhibitions from multiple museum and university collections. Users can search and select artworks to curate exhibitions, view detailed information, and share their creations.  

- [**Live Demo**](https://frameandcurate.vercel.app)
  
---

## Features

- Search and filter artworks from multiple free museum/university APIs.  
- Create a temporary personalized exhibition by selecting artworks.
- View the exhibition and click on a piece to view detailed information.
- Log in with Google
- Save and share your exhibition
- Responsive and accessible UI.  

---

## Tech Stack

- **Frontend:** Next.js, TypeScript, React, Tailwind CSS  
- **Database:** Firebase, Firebase Auth
- **APIs:** Various museum/university collection APIs
- **Hosting:** Vercel   

---

## Installation / Running Locally

1. **Clone the repository**  

```
git clone https://github.com/Bryxny/exhibition-curator
cd frontend
```

2. **Install dependecies**

```
npm install
```

3. **Create a .env.local file in the root directory with your Firebase and API keys:**

```
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

HARVARD_API_KEY=your_harvard_api_key
```
4. **Run the development server**

```
npm run dev
```
Open http://localhost:3000 to view the app.

---

## Usage

1. Search for artworks using keywords.
2. Add artworks to your personal exhibition.  
3. Click on an artwork to view detailed information.
4. Log in with google to save and share your exhibitions. 

---

## APIs Used

- **Harvard Art Museums API**
- **The Metropolitan Museum of Art Collection API**

---

## Future Enhancements

- Add social media integration.  
- Add PWA features.
- Advanced filtering of artworks. 



