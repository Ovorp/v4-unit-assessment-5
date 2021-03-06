async function readPosts(req, res) {
  let { id } = req.session.user;
  let { mine, search, oldest } = req.query;
  const db = await req.app.get('db');
  if (mine && !search) {
    if (oldest) {
      db.post
        .read_all_oldest_first()
        .then((posts) => res.status(200).send(posts));
    } else {
      db.post.read_all_posts().then((posts) => res.status(200).send(posts));
    }
  } else if (!mine && search) {
    if (oldest) {
      db.search
        .search_other_oldest_first([`%${search.toLowerCase()}%`, id])
        .then((posts) => res.status(200).send(posts));
    } else {
      db.search
        .search_other_users_posts([`%${search.toLowerCase()}%`, id])
        .then((posts) => res.status(200).send(posts));
    }
  } else if (mine && search) {
    if (oldest) {
      db.search
        .search_all_oldest_first([`%${search.toLowerCase()}%`])
        .then((posts) => res.status(200).send(posts));
    } else {
      db.search
        .search_all_posts([`%${search.toLowerCase()}%`])
        .then((posts) => res.status(200).send(posts));
    }
  } else {
    if (oldest) {
      db.post
        .read_other_oldest_first([id])
        .then((posts) => res.status(200).send(posts));
    } else {
      db.post
        .read_other_users_posts([id])
        .then((posts) => res.status(200).send(posts));
    }
  }
}

function createPost(req, res) {
  if (!req.session.user) {
    return res.status(403).json('Forbidden, you are not logged in');
  }
  const { id } = req.session.user;
  const { title, img, content } = req.body;
  const date = new Date();
  const db = req.app.get('db');
  if (id) {
    db.post
      .create_post([id, title, img, content, date])
      .then(() => res.status(200).json('post posted'));
  }
  return;
}

function readPost(req, res) {
  req.app
    .get('db')
    .post.read_post(req.params.id)
    .then((post) =>
      post[0] ? res.status(200).send(post[0]) : res.status(200).send({})
    );
}

function deletePost(req, res) {
  req.app
    .get('db')
    .post.delete_post(req.params.id)
    .then((_) => res.sendStatus(200));
}

module.exports = {
  readPosts,
  createPost,
  readPost,
  deletePost,
};

// readPosts: async (req, res) => {
//   let { id } = req.session.user;
//   let { mine, search, oldest } = req.query;
//   const db = await req.app.get('db')
//   if (mine && !search) {
//     if (oldest) {
//       db.post.read_all_oldest_first()
//         .then(posts => res.status(200).send(posts))
//     } else {
//       db.post.read_all_posts()
//         .then(posts => res.status(200).send(posts))
//     }
//   } else if (!mine && search) {
//     if (oldest) {
//       db.search.search_other_oldest_first([`%${search.toLowerCase()}%`, id])
//         .then(posts => res.status(200).send(posts))
//     } else {
//       db.search.search_other_users_posts([`%${search.toLowerCase()}%`, id])
//         .then(posts => res.status(200).send(posts))
//     }
//   } else if (mine && search) {
//     if (oldest) {
//       db.search.search_all_oldest_first([`%${search.toLowerCase()}%`])
//         .then(posts => res.status(200).send(posts))
//     } else {
//       db.search.search_all_posts([`%${search.toLowerCase()}%`])
//         .then(posts => res.status(200).send(posts))
//     }
//   } else {
//     if (oldest) {
//       db.post.read_other_oldest_first([id])
//         .then(posts => res.status(200).send(posts))
//     } else {
//       db.post.read_other_users_posts([id])
//         .then(posts => res.status(200).send(posts))
//     }
//   }
// },
// createPost: (req, res) => {
//   //code here
// },
// readPost: (req, res) => {
//   req.app.get('db').post.read_post(req.params.id)
//     .then(post => post[0] ? res.status(200).send(post[0]) : res.status(200).send({}))
// },
// deletePost: (req, res) => {
//   req.app.get('db').post.delete_post(req.params.id)
//     .then(_ => res.sendStatus(200))
// }
