import * as React from 'react';
import { Screens } from './EntryScreen';

interface SplashScreenProps {
  setScreen: (screen: Screens) => void,
}

function SplashScreen({ setScreen }: SplashScreenProps) {
  return (
    <div className="bg-gray-900 bg-opacity-75 m-8 rounded-xl">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
        <h2 className="text-3xl font-extrabold tracking-tight text-gray-500 sm:text-4xl">
          <span className="block text-indigo-500">Lebkuchen FM</span>
          <span className="block">No to jedziemy?</span>
        </h2>
        <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
          <div className="inline-flex rounded-md shadow mr-8">
            <button
              type="button"
              onClick={() => setScreen(Screens.Player)}
              className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-gray-200 text-4xl bg-indigo-600 hover:bg-indigo-700"
            >
              🏎️ Eeee...
            </button>
          </div>
          <div className="inline-flex rounded-md shadow">
            <button
              type="button"
              onClick={() => setScreen(Screens.Upload)}
              className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 text-xl bg-white hover:bg-indigo-100"
            >
              Dodaj dźwięk
            </button>
          </div>
          <div className="ml-3 inline-flex rounded-md shadow" />
        </div>
      </div>
    </div>
  );
}

export default SplashScreen;
