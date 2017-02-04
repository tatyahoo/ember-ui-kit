export default function() {
  this.get('/users', ({ db }, req) => {
    let { start, end } = req.queryParams;

    return db.users.slice(Number(start), Number(end));
  });
}
