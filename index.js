import firebase from 'firebase/compat/app'; //v9
import 'firebase/compat/auth'; //v9
import 'firebase/compat/firestore'; //v9
import express from 'express';
const app = express();
import config from './serviceAccountKey.json' assert { type: 'json' };
import bodyParser from 'body-parser';
// import { getAuth } from 'firebase/compat/auth';
const port = process.env.PORT || 3000;
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
//! firebase connection
try {
	firebase.initializeApp(config);
	console.log('Firebase Database Connected Success');
} catch (error) {
	console.log('===============', error);
}
//! database connection
const db = firebase.firestore();
const auth = firebase.auth();

// Get Specific User
app.get('/user', (req, res) => {
	db.collection('Users')
		.doc(req.body.uid)
		.get()
		.then((user) => {
			res.json(user.data());
		})
		.catch((err) => {
			res.json(err);
		});
});

// Create User
app.post('/CreateUser', (req, res) => {
	const UserData = {
		name: req.body.displayName,
		address: req.body.address,
		email: req.body.email,
		bio: req.body.bio,
		photoUrl: req.body.photoUrl,
		phoneNumber: req.body.phoneNumber,
		uid: req.body.uid,
	};
	db.collection('Users')
		.doc(req.body.uid)
		.set(UserData)
		.then((user) => {
			res.json({ msg: 'success' });
		})
		.catch((err) => {
			res.json(err);
		});
});

app.listen(port, () => console.log(`Server is listen at ${port}`));
