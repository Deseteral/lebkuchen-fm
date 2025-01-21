export async function getUsers() {
  return fetch('/api/users')
    .then((res) => res.json())
    .then((res) => res.users);
}
