import * as React from 'react';

const BESTVIEWED_BANNER_URL = 'https://web.archive.org/web/20090724131902im_/http://www.geocities.com/savagescorpio/music/BESTVIEWED.gif';

interface PanelProps {}
const Panel: React.FunctionComponent<PanelProps> = ({ children }) => (
  <>
    <h1>LebkuchenFM service inspector</h1>
    <img src={BESTVIEWED_BANNER_URL} alt="This page is best viewed with Internet Explorer" />
    <main>
      {children}
    </main>
  </>
);

export default Panel;
export { PanelProps };
