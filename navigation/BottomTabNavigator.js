import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import TabBarIcon from '../components/TabBarIcon';
import StocksScreen from '../screens/StocksScreen';
import SearchScreen from '../screens/SearchScreen';
import { Button } from 'react-native';
import { useStocksContext } from '../contexts/StocksContext';
import { scaleSize } from '../constants/Layout';

const BottomTab = createBottomTabNavigator();
const INITIAL_ROUTE_NAME = 'Search';

export default function BottomTabNavigator({ navigation, route }) {
  navigation.setOptions({ 
    headerTitle: getHeaderTitle(route),
    headerTitleStyle: {
      fontSize: scaleSize(20),
    },
  });

  if (getHeaderTitle(route) === "Stocks") {
    React.useLayoutEffect(() => {
      navigation.setOptions({
        headerRight: () => (
          <Button style={{color:"white", margin: 5}} onPress={() => alert("Delete button")} title="Delete" />
        ),
      });
    }, []);
  }
  
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
