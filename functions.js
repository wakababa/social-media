import fire from "./firebase";
import { dB } from "./firebase";
exports.signUp = (req, res) => {
  const body = req.body;
  const email = body.email;
  const password = body.password;

  fire
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .then((doc) => {
      if (doc) {
        const userDetails = {
          userName: `${email[0].toUpperCase()} - User`,
          userId: doc.user.uid,
          mail: doc.user.email,
          photoUrl:
            "https://firebasestorage.googleapis.com/v0/b/twitter-clone-35153.appspot.com/o/user.png?alt=media&token=f7c62168-f916-4ac7-aecf-fd48a5f41d4d",
          createdAT: Date.now().toString(),
        };
        doc.user.updateProfile({
          displayName:`${email[0].toUpperCase()} - User`,
          photoURL:"https://firebasestorage.googleapis.com/v0/b/twitter-clone-35153.appspot.com/o/user.png?alt=media&token=f7c62168-f916-4ac7-aecf-fd48a5f41d4d"
        })
        dB.collection("users")
          .add(userDetails)
          .then((result) => res.json(userDetails))
          .catch((err) => res.json(err.message));
      }
    })
    .catch((err) => res.json(err.message));
};
exports.signIn = (req, res) => {
  const body = req.body;
  const email = body.email;
  const password = body.password;

  fire
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then((doc) => res.json(doc))
    .catch((err) => res.json(err.message));
};

exports.logOut = (req, res) => {
  fire
    .auth()
    .signOut()
    .then(function () {
      // Sign-out successful.
      res.json("Sign Out successfull");
    })
    .catch(function (error) {
      // An error happened.
      res.json(error.message);
    });
};
exports.sendPost = (req, res) => {
  const body = req.body;
  const message = body.message;
  fire.auth().onAuthStateChanged((user) => {
    const postDetails = {
      userId: user.uid,
      userName: user.displayName,
      message,
      photoUrl:user.photoURL,
      like: 0,
      comments: [],
      createdAt: Date.now().toString(),
    };
    if (user) {
      dB.collection("posts")
        .add(postDetails)
        .then((doc) => {
          const newDetails = postDetails;
          newDetails.postId = doc.id;
          res.json(newDetails);
        })
        .catch((err) => res.json(err.message));
    } else {
      res.json("Sorry but you can not send any message");
    }
  });
};
exports.commentPost = (req, res) => {
  const body = req.body;
  const message = body.message;
  const postId  = req.params.postId;
  fire.auth().onAuthStateChanged((user) => {
    if (user) {
      const data = {
        userId: user.uid,
        postId,
        userName: user.displayName,
        photoUrl:user.photoURL,
        message,
        createdAt: Date.now().toString(),
      };
      dB.collection("posts").doc(postId)
      .get()
      .then(doc=>{
        if(!doc.exists){
          res.json('WE cant find this tweet')
        }
        dB.collection('comments').add(data)
      })
      .then(
        res.json(data)
        )
      .catch(err=>res.json(err.message))

    } else {
      res.json("You need singUp ! ");
    }
  }
  );
};
exports.likePost = (req, res) => {
  const postId  = req.params.postId;
  fire.auth().onAuthStateChanged((user) => {
    if (user) {
      dB.collection('posts').doc(postId)
      .get()
      .then(doc=>{
        dB.collection('posts').doc(postId)
      .update({
      like: doc.data().like + 1
      })
      .then(doc=>res.json(doc))
      .catch(err=>res.json(err.message))
      })
      .catch(err=>res.json(err.message))
    } else {
      res.json("You need singUp ! ");
    }
  }
  );
};
exports.allPosts = (req, res) => {
  let array = [];
  dB.collection("posts")
    .orderBy("createdAt", "desc")
    .get()
    .then((datas) => {
      datas.forEach((doc) => {
        array.push({
          userId: doc.data().userId,
          postId: doc.id,
          userName: doc.data().userName,
          message: doc.data().message,
          photoUrl:doc.data().photoUrl,
          like: doc.data().like,
          comments: doc.data().comments,
          createdAt: doc.data().createdAt,
        });
      });
      res.json(array);
    })
    .catch((err) => res.json(err.message));
};
exports.getOnePost = (req,res)=>{
  let postData = {};
  dB.collection('posts')
  .doc(req.params.postId)
  .get()
  .then(doc=>{
    if(doc){
      postData =doc.data();
      postData.postId= doc.id;
      dB.collection('comments')
      .where("postId","==",req.params.postId)
      .get()
      .then((data)=>{
        postData.comments= [];
        data.forEach((doc)=>{
          postData.comments.push(doc.data())
        });
        res.json(postData);
      })
      .catch(err=>res.json(err.message));
    }else{
      res.json('We did not find that post')
    }
  })
}


exports.home = (req, res) => {
  res.sendFile("index.html");
};
