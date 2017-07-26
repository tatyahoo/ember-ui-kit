export default function() {
  this.get('/users');
  this.get('/users/:id');
  this.get('/posts');
  this.get('/posts/:id');
  this.get('/comments');
  this.get('/comments/:id');
  this.get('/tags');
  this.get('/tags/:id');
}
