import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TouchableWithoutFeedback, Keyboard, FlatList, Text, TouchableOpacity, TextInput /* include other react native components here as needed */ } from 'react-native';
import { useStocksContext } from '../contexts/StocksContext';
import { scaleSize } from '../constants/Layout';
import { Ionicons } from '@expo/vector-icons';

// FixMe: implement other components and functions used in SearchScreen here (don't just put all the JSX in SearchScreen below)

function getStocks(serverUrl) {
  const url = `${serverUrl}/stocks/symbols`;
  
  return fetch(url)
      .then(res => res.json())
      .then(stocks => stocks.map( stock => {
        return {
          symbol: stock.symbol,
          name: stock.name,
          industry: stock.industry
        };
      }));
}

function SearchBar(props) {
  const [innerSearch, setInnerSearch] = useState("");
  useEffect(() => {
    if(props.seatchedItem) {
      props.seatchedItem(innerSearch);
    }
  }, [innerSearch]);
 
  return (
    <View>
      {/* <Ionicons name="search1" size={24} color="black" /> */}
      <Text style={styles.searchLabel}>Type a company name or stock symbol:</Text>
      <TextInput style = {styles.input}
        underlineColorAndroid = "transparent"
        placeholder = " Search"
        placeholderTextColor = "#898989"
        autoCapitalize = "none"
        value = {innerSearch}
        onChangeText = { text => {
          setInnerSearch(text);
        }}
      />
    </View>
  );
}

function StockList(props) {

  function PressHandler(symbol) {
    // Add the selected symbol to watch list
    props.addToWatchlist(symbol);
    // Navigate to Stock page.
    props.navigation.navigate('Stocks');
  }
  return(
    <FlatList 
      data={props.data}
      keyExtractor={(item) => item.symbol}
      renderItem={({item}) => (
        
        <TouchableOpacity style={styles.item} onPress={() => PressHandler(item.symbol)}>
          <Text>
            <Text style={styles.symbolLabel}>{item.symbol}</Text>
            <Text style={styles.industryLabel}>  {item.industry}</Text>
          </Text>
          <Text style={styles.companyLabel}>{item.name}</Text>
        </TouchableOpacity>
      )}
    />
  );
}

export default function SearchScreen({ navigation }) {
  const { ServerURL, addToWatchlist } = useStocksContext();
  const [state, setState] = useState([]);
  const [stocks, setStocks] = useState([]);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  useEffect(() => {
    // FixMe: fetch symbol names from the server and save in local SearchScreen state
    getStocks(ServerURL)
    .then(stocks => {
      setState(stocks);
    })
    .catch(e => {
      setError(e);
    });
  }, [ServerURL]);

  useEffect(() => {
    if(search !== "") {
      setStocks(state.filter(stock => {
        return (
          stock.symbol.toLowerCase().includes(search.toLowerCase()) || 
          stock.name.toLowerCase().includes(search.toLowerCase())
        );
      }));
    } else {
      setStocks([]);
    }
  }, [search]);

  if(error) {
    return <View><Text>Error occurred: {error}</Text></View>
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <SearchBar seatchedItem={v => setSearch(v)} navigation={navigation} />
        <StockList data={stocks} navigation={navigation} addToWatchlist={addToWatchlist} />
      </View>
    </TouchableWithoutFeedback>    
  )
}

const styles = StyleSheet.create({
// FixMe: add styles here ...
// use scaleSize(x) to adjust sizes for small/large screens
  container: {
    flex: 1,
  },
  input: {
    fontSize: scaleSize(20),
    color: "white",
    margin: 10,
    height: 40,
    borderRadius: 8,
    backgroundColor: "#1E1E1E",
    borderWidth: 1,
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
  industryLabel: {
    paddingStart: 20,
    color: "#636363",
    fontSize: scaleSize(14),
  },
  companyLabel: {
    // paddingLeft: 10,
    color: "#898989",
    fontSize: scaleSize(15),
  },
  searchLabel: {
    marginTop: 10,
    fontSize: scaleSize(14),
    alignSelf: "center",
    color: "white",
  }
});