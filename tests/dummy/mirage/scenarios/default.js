import { faker } from 'ember-cli-mirage';

faker.seed(20);

export default function(server) {
  let tags = server.createList('tag', faker.random.number(10));
  let users = server.createList('user', faker.random.number(5));

  users.forEach(user => {
    let posts = server.createList('post', faker.random.number(10));

    user.postIds = posts.map(post => post.id);
    user.posts.save();

    posts.forEach(post => {
      let comments = server.createList('comment', faker.random.number(3));

      post.authorId = user.id;
      post.tagIds = tags.slice(faker.random.number(tags.length - 1)).map(tag => tag.id);
      post.commentIds = comments.map(comment => comment.id);

      comments.forEach(comment => {
        comment.postId = post.id;
        comment.authorId = users[faker.random.number(users.length - 1)].id;

        comment.post.save();
        comment.author.save();
      });

      post.author.save();
      post.tags.save();
      post.comments.save();
    })
  });
}
