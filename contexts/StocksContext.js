import React, { useState, useContext, useEffect } from "react";
import { AsyncStorage } from "react-native";

const StocksContext = React.createContext();

export const StocksProvider = ({ children }) => {
  const [state, setState] = useState([]);

  return (
    <StocksContext.Provider value={[state, setState]}>
      {children}
    </StocksContext.Provider>
  );
};

export const useStocksContext = () => {
  const [state, setState] = useContext(StocksContext);

  // can put more code here
  async function loadFromDisk() {
    // Load existing data from local storage.
    try {
      const dataFromDisk = await AsyncStorage.getItem("log");
      if (dataFromDisk != null) setState(JSON.parse(dataFromDisk));
    } catch {
      alert("Disk corrupted");
    }
  }
  
  function addToWatchlist(newSymbol) {
    //FixMe: add the new symbol to the watchlist, save it in useStockContext state and persist to AsyncStorage
    if (!state.includes(newSymbol)) {
      // if new symbol does not exist in watch list.
      // update the list by adding new symbol.
      const newState = prev => {
        prev = prev.concat(newSymbol);
        return [...prev];
      };
      try {
        // store the list to local storage.
        AsyncStorage.setItem("log", JSON.stringify(newState(state)));
        setState(newState(state));
      } catch {
        alert("There was an error saving.");
      }
    } else {
      alert("The selected stock has been added already.");
      
    }
  }

  useEffect(() => {
    // FixMe: Retrieve watchlist from persistent storage
    loadFromDisk();
  }, []);

  return { ServerURL: 'http://131.181.190.87:3001', watchList: state,  addToWatchlist };
};
