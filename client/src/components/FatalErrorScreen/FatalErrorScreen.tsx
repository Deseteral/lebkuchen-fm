import styles from './FatalErrorScreen.module.css';

function FatalErrorScreen() {
  return (
    <main class={styles.container}>
      <section class={styles.panel}>
        <header class={styles.header}>LebkuchenFM</header>
        <div class={styles.content}>
          <h1 class={styles.title}>System failure</h1>
          <p class={styles.message}>
            LebkuchenFM encountered an unexpected error and cannot continue. Reload the desktop to
            recover.
          </p>
          <div class={styles.actions}>
            <button
              type="button"
              class={styles.button}
              onClick={() => window.location.assign('/login')}
            >
              Go to login
            </button>
            <button type="button" class={styles.button} onClick={() => window.location.reload()}>
              Reload
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}

export { FatalErrorScreen };
