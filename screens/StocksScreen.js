import React, { useState, useEffect } from 'react';
import { StyleSheet, View, FlatList, Text, TouchableOpacity /* include other react-native components here as needed */ } from 'react-native';
import { useStocksContext } from '../contexts/StocksContext';
import { scaleSize } from '../constants/Layout';


// FixMe: implement other components and functions used in StocksScreen here (don't just put all the JSX in StocksScreen below)
function getStocksDetail(serverURL, symbols) {
  return (
    symbols.map( symbol => {
      const url = `${serverURL}/stocks/${symbol}`;
      return fetch(url)
              .then(res => res.json())
              .then(stock => {
                return {
                  symbol: stock.symbol,
                  name: stock.name,
                  industry: stock.industry,
                  open: stock.symbol,
                  high: stock.high,
                  low: stock.low,
                  close: stock.close,
                  volumes: stock.volumes,
                }
              });
    })
  );
}

function StockList(props) {
  function PressHandler(stock) {
    console.log(stock);
  }
  
  return(
    <FlatList 
      data={props.data}
      keyExtractor={(item) => item.symbol}
      renderItem={({item}) => (
        <TouchableOpacity style={styles.item} onPress={() => PressHandler(item)}>
          <Text>
            <Text style={styles.symbolLabel}>{item.symbol}</Text>
            {/* <Text style={styles.industryLabel}>  {item.}</Text> */}
          </Text>
        </TouchableOpacity>
      )}
    />
  );
}

export default function StocksScreen({route, navigation}) {
  const { ServerURL, watchList } = useStocksContext();
  const [state, setState] = useState([]);
  const [error, setError] = useState(null);
  // can put more code here

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button onPress={() => clearWatchList} style={{color: "white"}} title="Delete" />
      ),
    });
  }, [navigation]);

  useEffect(() => {
    Promise.all(getStocksDetail(ServerURL, watchList))
    .then(stocks => setState(stocks))
    .catch(e => setError(e));
  }, [watchList]);

  if (error) {
    return <Text style={styles.emptyLabel}>Error fecthing data: {error}</Text>
  }

  return (
    <View style={styles.container}>
      <StockList data={state} />
      {state.length === 0 && <Text style={styles.emptyLabel}>No Stocks currently added.</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  // FixMe: add styles here ...
  // use scaleSize(x) to adjust sizes for small/large screens
  container: {
    flex: 1,
  },
  emptyLabel: {
    color: "white",
    fontSize: scaleSize(20),
    padding: 10,
    alignSelf: "center",
    justifyContent: "center",
  },
  item: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderTopWidth: 0.2,
    borderTopColor: "grey",
  },
  symbolLabel: {
    fontSize: scaleSize(20),
    color: "white",    
  },
  });