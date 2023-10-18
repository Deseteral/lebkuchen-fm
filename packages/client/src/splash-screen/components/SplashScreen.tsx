import * as React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UserData } from 'lebkuchen-fm-service';
import { userLogout } from '../../services/user-account-service';
import './SplashScreen.css';
import { AnimatedBackground } from '../../animated-background/AnimatedBackground';
import { getUserList } from '../../admin/services/get-user-list';

function SplashScreen() {
  const [userList, setUserList] = React.useState<UserData[]>([]);
  const [currentRacer, setCurrentRacer] = React.useState<string>('🏎️');
  const racers = ['🏎️', '🏇🏾', '🚙', '🛻', '🚜', '🚐', '🐪', '🐗', '🐎'];

  const refreshUserList = () => {
    getUserList().then((users) => setUserList(users));
  };

  const randomizeRacer = () => {
    setCurrentRacer(racers[Math.floor(Math.random() * racers.length)]);
  };

  React.useLayoutEffect(() => {
    refreshUserList();
    randomizeRacer();
  });

  return (
    <div>
      <AnimatedBackground />
      <motion.div initial={{ opacity: 0, scale: 0.1 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
        <div>
          <div className="menu max-w-7xl mx-auto">
            <div className="container">
              <div className="column">
                <h2 className="text-3xl font-extrabold tracking-tight text-gray-500 sm:text-4xl">
                  <span className="block text-indigo-500">Lebkuchen FM</span>
                  <span className="block">No to jedziemy?</span>
                </h2>
                {userList && (
                <h5 className="font-extrabold tracking-tight text-indigo-500">
                  Online: {userList.length}
                </h5>
                )}
              </div>
              <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
                <div className="inline-flex rounded-md shadow mr-8">
                  <NavLink
                    to="/player"
                    className="bounceButton inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-gray-200 text-4xl bg-indigo-600 hover:bg-indigo-700"
                  >
                    Eeee...
                    <div className="carDrive">
                      {currentRacer}
                    </div>
                  </NavLink>
                </div>
                <div className="inline-flex rounded-md shadow">
                  <NavLink
                    to="/add-sound"
                    className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 text-xl bg-white hover:bg-indigo-100"
                  >
                    Dodaj dźwięk
                  </NavLink>
                </div>
                <div className="inline-flex rounded-md shadow ml-8">
                  <NavLink
                    to="/soundboard"
                    className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 text-xl bg-white hover:bg-indigo-100"
                  >
                    Soundboard
                  </NavLink>
                </div>
                <div className="inline-flex rounded-md shadow ml-8">
                  <button
                    type="button"
                    onClick={() => userLogout()}
                    className="wiggle inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 text-xl bg-white hover:bg-indigo-100"
                  >
                    Wyloguj
                  </button>
                </div>
                <div className="ml-3 inline-flex rounded-md shadow" />
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export { SplashScreen };
