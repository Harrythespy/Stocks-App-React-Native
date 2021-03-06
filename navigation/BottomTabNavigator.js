import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import TabBarIcon from '../components/TabBarIcon';
import StocksScreen from '../screens/StocksScreen';
import SearchScreen from '../screens/SearchScreen';
import { Button, AsyncStorage } from 'react-native';
import { scaleSize } from '../constants/Layout';

const BottomTab = createBottomTabNavigator();
const INITIAL_ROUTE_NAME = 'Search';

export default function BottomTabNavigator({ navigation, route }) {
  let page = getHeaderTitle(route);
  
  React.useLayoutEffect(() => {
    if (page === "Stocks") {
      navigation.setOptions({
        headerTitle: getHeaderTitle(route),
        headerTitleStyle: {
          fontSize: scaleSize(20),
        },
        headerRight: () => (
          <Button 
            onPress={async() => {
              await AsyncStorage.setItem("log", JSON.stringify([]));
              alert("Stocks have been removed. \n Please pull to refresh list.");
            }} title="Delete" />
        ),
      });
    } else {
      navigation.setOptions({ 
        headerTitle: getHeaderTitle(route),
        headerTitleStyle: {
          fontSize: scaleSize(20),
        },
        headerRight: null,
      });
    }
  }, [page]);

  return (
    <BottomTab.Navigator initialRouteName={INITIAL_ROUTE_NAME}>
      <BottomTab.Screen
        name="Stocks"
        component={StocksScreen}
        options={{
          title: 'Stocks',
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="md-trending-up" />,
        }}
      />
      <BottomTab.Screen
        name="Search"
        component={SearchScreen}
        options={{
          title: 'Search',
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="md-search" />,
        }}
      />
    </BottomTab.Navigator>
  );
}

function getHeaderTitle(route) {
  return  route.state?.routes[route.state.index]?.name ?? INITIAL_ROUTE_NAME;
}
