import * as React from 'react';

interface IHEaderProps {
  title: string,
}

function Header(props: IHEaderProps) {
  return (
    <section className="hero is-primary">
      <div className="hero-body">
        <div className="container">
          <h1 className="title">
            LebkuchenFM
          </h1>
          <h2 className="subtitle">
          { props.title }
          </h2>
        </div>
      </div>
    </section>
  )
}

export default Header;
