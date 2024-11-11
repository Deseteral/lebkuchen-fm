import styles from './Login.module.css';
import { AppWindow } from '@components/AppWindow/AppWindow';

function Login() {
  return (
    <AppWindow title="Login" close={() => {}}>
      <h1>Login</h1>
      <form>
        <input placeholder="Login" type="text" required />
        <input placeholder="Password" type="password" required />
        <button>Submit</button>
      </form>
    </AppWindow>
  );
}

export { Login };
