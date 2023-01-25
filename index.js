import firebase from "firebase/compat/app"; //v9
import "firebase/compat/auth"; //v9
import "firebase/compat/firestore"; //v9
import express from "express";
const app = express();
import config from "./serviceAccountKey.json" assert { type: "json" };
import bodyParser from "body-parser";
const port = process.env.PORT || 3000;
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
//! firebase connection
try {
	firebase.initializeApp(config);
	console.log("Firebase Database Connected Success");
} catch (error) {
	console.log("===============", error);
}
//! database connection
const db = firebase.firestore();

// Get Specific User
app.get("/user", (req, res) => {
	db.collection("Users")
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
app.post("/CreateUser", (req, res) => {
	const { displayName, address, email, bio, photoUrl, phoneNumber, likes, comments, uid } = req.body;
	const UserData = {
		displayName: displayName,
		address: address,
		email: email,
		bio: bio,
		photoUrl: photoUrl,
		phoneNumber: phoneNumber,
		likes: likes,
		comments: comments,
		uid: uid,
	};
	db.collection("Users")
		.doc(req.body.uid)
		.set(UserData)
		.then((user) => {
			res.json({ msg: "success" });
		})
		.catch((err) => {
			res.json(err);
		});
});
app.post("/like", (req, res) => {
	const { postId, userId, like } = req.body;
	const likeUser = {
		postId: "orvEuvlALEjBBpVuuWfE",
		userId: "9PuCnUQUPfdD62yGnvXL2303",
		like: true,
	};
	let isLike = "";
	likeUser.like
		? (isLike = firebase.firestore.FieldValue.arrayUnion(likeUser))
		: (isLike = firebase.firestore.FieldValue.arrayRemove(likeUser));

	db.collection("Upload")
		.doc("9PuCW7G1nUQUPfdD62yGnvXL2303")
		.update({ like: isLike })
		.then(() => {
			res.status(200).json({ msg: "success" });
		})
		.catch((err) => {
			res.status(400).json(err);
		});
});

app.get("/post", (req, res) => {
	db.collection("Upload")
		.doc("9PuCW7G1nUQUPfdD62yGnvXL2303")
		.get()
		.then((snap) => {
			res.json(snap.data());
		})
		.catch((err) => {
			res.status(400).json(err);
		});
});
app.listen(port, () => console.log(`Server is listen at ${port}`));
