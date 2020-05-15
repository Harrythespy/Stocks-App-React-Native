import React, { useState, useEffect } from 'react';
import { StyleSheet, View, FlatList, Text, TouchableOpacity, /* include other react-native components here as needed */ 
RefreshControl,
AsyncStorage} from 'react-native';
import { useStocksContext } from '../contexts/StocksContext';
import { scaleSize } from '../constants/Layout';


// FixMe: implement other components and functions used in StocksScreen here (don't just put all the JSX in StocksScreen below)
function getStocksDetail(serverURL, symbols) {
  // Fetch each symbol in watchlist from the server url
  return (
    symbols.map( symbol => {
      const url = `${serverURL}/history?symbol=${symbol}`;
      return fetch(url)
              .then(res => res.json())
              .then(stocks => stocks.map(stock => {
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
              }));
    })
  );
}

function StockList(props) {
  const [refresh, setRefresh] = useState(false);
  // Get the latest history of each stock
  const latestHisotry = props.data.map( stock => {
    return stock[0];
  });

  const pressHandler = (stock) => {
    // Handle the onPress event on the list
    if (props.selectedStock) {
      props.selectedStock(stock);
    }
  }
  
  const refreshHandler = () => {
    setRefresh(true);
    console.log("Refresh");
    setRefresh(false);
  };

  const PGL = (item) => {
    // Rounding the number to keep only two decimals
    var value = ((item.close-item.open)/item.open*100).toFixed(2);
    if (value > 0 ){
      // If the value is greater than 0, return percentage gain
      return (
        <View style={[styles.percentageGain, styles.gainLoss]}>
          <Text style={[styles.labelRight, styles.label]}>
            +{value}%
          </Text>
        </View>
      );
    } else {
      // If the value is smaller than 0, return percentage loss
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
    <View style={styles.listView}>
      <FlatList 
        data={latestHisotry}
        keyExtractor={(item) => item.symbol}
        renderItem={({item}) => (
          <TouchableOpacity onPress={() => pressHandler(item)}>
            <View style={styles.item}>
                <Text style={styles.label}>{item.symbol}</Text>
                <Text style={[styles.label, styles.labelRight]}>{item.close}</Text>
                {PGL(item)}
            </View>
          </TouchableOpacity>
        )}
        refreshing={refresh}
        onRefresh={refreshHandler}
      />
    </View>
  );
}

function TabBarInfo(props) {
  // Display the tab bar information of the selected stock

  const kFormatter = (num) => {
    // Format the number of volumes
    return Math.abs(num) > 999999 ? Math.sign(num)*((Math.abs(num)/1000000).toFixed(1)) + 'M' : Math.sign(num)*Math.abs(num)
  }

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
          <Text style={styles.smaleValue}> {kFormatter(props.data.volumes)}</Text>
        </View>
        <View style={styles.column}/>
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
    // Store the list of symbol hisotry into state
    Promise.all(getStocksDetail(ServerURL, watchList))
    .then(stocks => setState(stocks))
    .catch(e => setError(e));
  }, [watchList]);

  if (error) {
    // Handling error occurred when fetching data from url.
    return <Text style={styles.emptyLabel}>Error fecthing data: {error}</Text>
  }
  
  return (
    <View style={styles.container}>
      <StockList data={state} selectedStock={value => setSelectedStock(value)}/>
      {selectedStock && Object.keys(selectedStock).length === 0? null : <TabBarInfo data={selectedStock}/>}
      {state.length === 0 && <Text style={styles.emptyLabel}>No stocks currently added.</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  // FixMe: add styles here ...
  // use scaleSize(x) to adjust sizes for small/large screens
  container: {
    flex: 1,
  },
  listView: {
    flex: 1,
  },

  emptyLabel: {
    flex: 1,
    color: "white",
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
    backgroundColor: "#77D572",
  },
  percentageLoss: {
    backgroundColor: "#EC4B3D",
  },

  // Tab bar information properties
  tabBarInfoContainer: {
    flex: 0.3,
    flexDirection: "column",
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
    paddingVertical: 8,
    paddingHorizontal: 17,
  },
  closeButton: {
    position: "absolute",
    right: 0,
    top: 0
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
    padding: 8,
    borderBottomWidth: 0.4,
    borderBottomColor: "grey",
  }, 
  column: {
    flex: 1,
    flexDirection: "row",
    paddingHorizontal: 4,
    alignItems: "baseline",
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
  }
  });