import { EventData, PlayerState, makeDefaultPlayerState } from 'lebkuchen-fm-service';
import React, { createContext, useContext, useReducer } from 'react';

type Dispatch = (action: EventData) => void;
type FMStateProviderProps = { children: React.ReactNode };

const FMStateContext = createContext<{
  state: PlayerState; dispatch: Dispatch } | undefined
>(undefined);

function stateReducer(state: PlayerState, action: EventData): PlayerState {
  switch (action.id) {
    case 'ChangeVolumeEvent':
      return {
        ...state,
        volume: (action.isRelative ? state.volume : 0) + action.nextVolume,
      };
    default:
      throw new Error('unhandled action type');
  }
}

function FMStateProvider({ children }: FMStateProviderProps) {
  const [state, dispatch] = useReducer(stateReducer, makeDefaultPlayerState());
  const stateContextValue = { state, dispatch };

  return (
    <FMStateContext.Provider value={stateContextValue}>
      {children}
    </FMStateContext.Provider>
  );
}

function useFMStateContext() {
  const context = useContext(FMStateContext);

  if (context === undefined) {
    throw new Error('useFMState must be used within a FMStateProvider');
  }

  return context;
}

export { FMStateProvider, useFMStateContext };
