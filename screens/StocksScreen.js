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
                  open: stock.open,
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
    if (props.selectedStock) {
      props.selectedStock(stock)
    }
  }
  const PGL = (item) => {
    var value = ((item.close-item.open)/item.open*100).toFixed(2);
    if (value > 0 ){
      return (
        <View style={[styles.percentageGain, styles.gainLoss]}>
          <Text style={[styles.labelRight, styles.label]}>
            {value}%
          </Text>
        </View>
      );
    } else {
      return (
        <View style={[styles.percentageLoss, styles.gainLoss]}>
          <Text style={[styles.labelRight, styles.label]}>
            {value}%
          </Text>
        </View>
      );
    }
  }
  return(
    <FlatList 
      data={props.data}
      keyExtractor={(item) => item.symbol}
      renderItem={({item}) => (
        <TouchableOpacity onPress={() => PressHandler(item)}>
          <View style={styles.item}>
              <Text style={styles.label}>{item.symbol}</Text>
              <Text style={[styles.label, styles.labelRight]}>{item.close}</Text>
              {PGL(item)}
          </View>
        </TouchableOpacity>
      )}
    />
  );
}

function TabBarInfo(props) {
  // Display the tab bar information of the selected stock
  return (
    <View style={styles.tabBarInfoContainer}>
      <View style={styles.row}>
        <Text style={styles.company}>{props.data.name}</Text>
      </View>
      <View style={styles.row}>
        <View style={styles.column}>
          <Text style={styles.smaleLabel}>OPEN</Text>
          <Text style={styles.smaleValue}>{props.data.open}</Text>
        </View>
        <View style={styles.column}>
          <Text style={styles.smaleLabel}>LOW</Text>
          <Text style={styles.smaleValue}>{props.data.low}</Text>
        </View>
      </View>
      <View style={styles.row}>
        <View style={styles.column}>
          <Text style={styles.smaleLabel}>CLOSE</Text>
          <Text style={styles.smaleValue}> {props.data.close}</Text>
        </View>
        <View style={styles.column}>
          <Text style={styles.smaleLabel}> HIGHT</Text>
          <Text style={styles.smaleValue}> {props.data.high}</Text>
        </View>
      </View>
      <View style={styles.row}>
        <View style={styles.column}>
          <Text style={styles.smaleLabel}>VOLUMES</Text>
          <Text style={[styles.smaleValue, styles.volumes]}> {props.data.volumes}</Text>
        </View>
      </View>
    </View>
  );
}

export default function StocksScreen({route, navigation}) {
  const { ServerURL, watchList } = useStocksContext();
  const [state, setState] = useState([]);
  const [error, setError] = useState(null);
  const [selectedStock, setSelectedStock] = useState({});
  // can put more code here

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
      <StockList data={state} selectedStock={value => setSelectedStock(value)}/>
      {selectedStock && <TabBarInfo data={selectedStock}/>}
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
    flex: 1,
    alignSelf: "center",
    justifyContent: "center",
    fontSize: scaleSize(20),
  },

  // Table Cell Properties
  item: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderTopWidth: 0.2,
    borderTopColor: "grey",
  }, 
  label: {
    flex: 1,
    fontSize: scaleSize(20),
    textAlign: "left",
    color: "white",
    justifyContent: "center",
  },
  labelRight: {
    textAlign: "right",
  },
  gainLoss: {
    flex: 0.7,
    alignItems: "flex-end",
    justifyContent: "center",
    marginLeft: 20,
    paddingHorizontal: 8,
    paddingVertical: 7,
    borderRadius: 10,
  },
  percentageGain: {
    backgroundColor: "#EC4B3D",
  },
  percentageLoss: {
    backgroundColor: "#77D572",
  },

  // Tab bar information properties
  tabBarInfoContainer: {
    flex: 1,
    flexDirection: "column",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: "black",
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 20,
      },
    }),
    backgroundColor: "#212121",
    paddingVertical: 10,
    paddingHorizontal: 17,
  },
  company: {
    flex: 1,
    width: "100%",
    color: "white",
    textAlign: "center",
    justifyContent: "center",
    fontWeight: "700",
    fontSize: scaleSize(20),
  },
  row: {
    flex: 1, 
    flexDirection: "row",
    padding: 10,
    borderBottomWidth: 0.4,
    borderBottomColor: "grey",
  }, 
  column: {
    flex: 1,
    flexDirection: "row",
    paddingHorizontal: 4,
  },
  smaleLabel: {
    flex: 1,
    color: "#5A5A5A",
    fontSize: scaleSize(14),
  },
  smaleValue: {
    flex: 1,
    textAlign: "right",
    alignSelf: "flex-end",
    color: "white",
    fontSize: scaleSize(16),
  },
  volumes: {
    flex: 2.5,
    textAlign: "left",
  }
  });