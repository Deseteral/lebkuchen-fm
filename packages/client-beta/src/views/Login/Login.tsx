import clsx from 'clsx';
import styles from './Login.module.css';
import shutdownIcon from '../../../public/shutdownIcon.png';
import windowsLogo from '../../../public/windows.png';
import chess from '../../../public/chess.webp';
import frog from '../../../public/frog.webp';
import arrow from '../../../public/arrow.png';
import hint from '../../../public/hint.png';
import { createSignal } from 'solid-js';
import { userLogin } from '../../services/user-account-service';
import { MessageBox } from '@components/MessageBox/MessageBox';

function Login() {
  const [selectedUser, setSelectedUser] = createSignal<string | null>(null);
  const [showHint, setShowHint] = createSignal(false);
  const [showAdminError, setShowAdminError] = createSignal(false);
  const [showUserError, setShowUserError] = createSignal(false);
  const username = localStorage.getItem('lebkuchenfm-username');

  const userClassNames = (role: string) => clsx(
    styles.user,
    selectedUser() && selectedUser() !== role && styles.faded,
    selectedUser() && selectedUser() === role && styles.selected
  )

  const shutdown = () => {
    //TODO system closing view
    const body = document.body;
    body.removeChild(document.getElementById('root')!);
    body.style.backgroundColor = 'black';
    body.style.backgroundImage = 'none';
  };

  const selectUser = (e: MouseEvent) => {
    e.stopPropagation()
    const userSection = e.currentTarget as HTMLElement;
    setSelectedUser(userSection.id);
    const activeTagName = document.activeElement?.tagName;
    if(activeTagName !== 'INPUT' && activeTagName !== 'BUTTON') {
      const inputs = userSection.querySelectorAll('input');
      if(inputs[0].value) {
        inputs[1].focus();
      } else {
        inputs[0].focus();
      }
    }
  }

  const loginAdmin = (e: SubmitEvent) => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const password = form.password.value;
    userLogin('lebkuchen', password)
      .then(res => {
        if(!res.ok) {
          setShowAdminError(true)
          setTimeout(() => setShowAdminError(false), 3000)
        }
      })
  }

  const loginUser = (e: SubmitEvent) => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const username = form.username.value;
    const password = form.password.value;
    userLogin(username, password)
      .then(res => {
        if(res.ok) {
          localStorage.setItem('lebkuchenfm-username', username);
        } else {
          setShowUserError(true)
          setTimeout(() => setShowUserError(false), 3000)
        }
      })
  }

  const hintClick = () => {
    setShowHint(true);
    setTimeout(()=> setShowHint(false), 3000);
  }

  return (
    <>
      <header class={styles.header} />
      <main class={styles.main} onClick={() => setSelectedUser(null)}>
        <div class={styles.mainLeft}>
          <img class={styles.windowsLogo} src={windowsLogo} />
          <p class={styles.mainLeftText}>To begin, click your user name</p>
        </div>
        <div class={styles.verticalLine} />
        <div class={styles.mainRight}>
          <section
            id="admin"
            class={userClassNames('admin')}
            onClick={selectUser}
          >
            <img class={styles.avatar} src={chess} />
            <div class={styles.userContent}>
              <span class={styles.username}>Administrator</span>
              {selectedUser() === 'admin' && (
                <form class={styles.form} onSubmit={loginAdmin}>
                  {showAdminError() && <MessageBox type="login" />}
                  <label class={styles.label}>
                    Type your password
                    <input class={styles.input} type="password" name="password"/>
                  </label>
                  <button class={clsx(styles.button, styles.submit)} type="submit">
                    <img src={arrow} />
                  </button>
                  {showHint() && <MessageBox type='hint' />}
                  <button class={clsx(styles.button, styles.hint)} type="button" onClick={hintClick}>
                    <img src={hint} />
                  </button>
                </form>
              )}
            </div>
          </section>
          <section
            id="guest"
            class={userClassNames('guest')}
            onClick={selectUser}
          >
            <img class={styles.avatar} src={frog} />
            <div class={styles.userContent}>
              <span class={styles.username}>{username || 'Guest'}</span>
              {selectedUser() === 'guest' && (
                <form class={styles.form} onSubmit={loginUser}>
                  {showUserError() && <MessageBox type="login" />}
                  <div class={styles.flex}>
                    <label class={styles.label}>
                      Type your username
                      <input class={styles.input} type="text" name="username" value={username || ''}/>
                    </label>
                    <label class={styles.label}>
                      Type your password
                      <input class={styles.input} type="password" name="password"/>
                    </label>
                  </div>
                  <button class={clsx(styles.button, styles.submit)} type="submit">
                    <img src={arrow} />
                  </button>
                </form>
              )}
            </div>
          </section>
        </div>
      </main>
      <footer class={styles.footer}>
        <label class={styles.shutdownLabel}>
          <button class={styles.shutdownBtn} onClick={shutdown}>
            <img src={shutdownIcon} alt="" />
          </button>
          Turn off computer
        </label>
        <div class={styles.footerText}>
          <p>After you log on, you can add or change accounts</p>
          <p>Just go to Control Panel and click User Accounts</p>
        </div>
      </footer>
    </>
  );
}

export { Login };
