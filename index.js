import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static('build'));
// app.use(express.static('build'));

import { signUp, signIn, sendPost , allPosts , logOut , commentPost , getOnePost , likePost , home} from "./functions";

app.post("/signUp", signUp);
app.post("/signIn", signIn);
app.post("/logOut", logOut);

app.post("/sendPost", sendPost);
app.get("/allPosts", allPosts);
app.get("/getOnePost/:postId", getOnePost);
app.post("/commentPost/:postId", commentPost);
app.post("/likePost/:postId", likePost);

// app.post('/userPost/:postID',getUserPost);
app.get('*',home);
app.listen(8000, () =>
  console.log(`localhost started at http://localhost:8000`)
);
