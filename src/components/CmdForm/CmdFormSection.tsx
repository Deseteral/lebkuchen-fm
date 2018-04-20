import * as React from "react";

import CmdForm from './CmdForm';

function CmdFormSection() {
  return(
    <section className="section">
      <div className="container">
        <h1 className="subtitle">
          Send test message
        </h1>
        <span className="subtitle">
          <CmdForm />
        </span>
      </div>
    </section>
  );
}

export default CmdFormSection;
