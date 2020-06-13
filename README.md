# Stocks-App-React-Native

This is an mobile application which is written in JavaScript with Expo React Native. The app is a replica of **Apple Stocks** app that allows user to search the specfic stocks in the search screen while the details of stocks will be displayed in Stock screen by clicking the stock.

## Getting Started

### Prerequisites
**Node.js**
Download the macOS Installer directly from the [nodejs.org](https://nodejs.org/en/download/current/) web site.
If you want to download the package with bash:
``` bash
curl "https://nodejs.org/dist/latest/node-${VERSION:-$(wget -qO- https://nodejs.org/dist/latest/ | sed -nE 's|.*>node-(.*)\.pkg</a>.*|\1|p')}.pkg" > "$HOME/Downloads/node-latest.pkg" && sudo installer -store -pkg "$HOME/Downloads/node-latest.pkg" -target "/"
```
Installing node.js by Homebrew:
``` bash
brew install node
```

### Installing
**Reinstall Packages of the project**
In the project directory installing packages by running:
``` bash
npm install
```

## Running the App
**Open this project on your device**
After packages are installed successfully, compile the project with the following statement.
``` bash
npm start
```
Or
``` bash
expo start
```

## Built With
* JavaScript
* HTML
* CSS
* [React Native](https://reactnative.dev) - React Native is a JavaScript library created by Facebook, and it uses native components instead of web components as building blocks.
* [Expo](https://docs.expo.io) - Expo is a framework and a platform for universal React applications.

## Screenshots of the Application
![Empty Watchlist](/Screenshots/EmptyWatchList.png?raw=true "Stock Screen" | height=300)
![Empty Search Screen](/Screenshots/EmptySearchScreen.png?raw=true "Stock Screen" | height=300)
![Search Screen Company](/Screenshots/SearchByCompanyName.png?raw=true "Stock Screen" | height=300)
![Search Screen Symbol](/Screenshots/SearchByStockSymbol.png?raw=true "Stock Screen" | height=300)
![Scaled Font Size](/Screenshots/ScaleFontSize.png?raw=true "Stock Screen" | height=300)
![Stock Screen](/Screenshots/StockScreen.png?raw=true "Stock Screen" | height=300)
![Android](/Screenshots/RunOnAndroid.JPG?raw=true "Stock Screen" | height=300)
![DeleteAlert](/Screenshots/DeleteAlert.png?raw=true "Stock Screen" | height=300)

## Author
This Application is developed by **Harry Shen**.
See also the list of contributors who participated in this project.

## License
This project is licensed under the MIT License - see the LICENSE.md file for details.