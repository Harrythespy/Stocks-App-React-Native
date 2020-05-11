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
      // add it into the list.
      setState( prev => {
        return prev.concat(newSymbol);
      });
      // store the list to local storage.
      try {
        AsyncStorage.setItem("log", JSON.stringify(state));
      } catch {
        alert("There was an error saving.");
      }
    } else {
      alert("The selected stock has been added already.");
      
    }

    // function clearWatchList() {
    //   setState(prev => []);
    //   try {
    //     AsyncStorage.clear();
    //   } catch {
    //     alert("There was an error removing all logs.");
    //   }
    // }
  }

  useEffect(() => {
    // FixMe: Retrieve watchlist from persistent storage
    loadFromDisk();
  }, []);

  return { ServerURL: 'http://131.181.190.87:3001', watchList: state,  addToWatchlist };
};
