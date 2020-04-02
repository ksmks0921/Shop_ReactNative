import React from "react";
import MainNavigator from "./navigation/MainNavigator";
import { View, Image } from "react-native";
import { Root } from "native-base";
import { Provider } from "react-redux";
import store from "./redux/store";
import { AppLoading, SplashScreen } from "expo";
import { Asset } from "expo-asset";

export default class App extends React.Component {
  state = {
    isready: false
  };

  async _cacheResourceAsync() {
    // const images = [require("./assets/SR.png")];

    // const cacheImages = images.map(image => {
    //   return Asset.fromModule(image).downloadAsync();
    // });

    // return Promise.all(cacheImages);

    return Promise.all([Asset.loadAsync([require("./assets/splash.png")])]);
    // const gif = require("./assets/SR.png");
    // return Asset.fromModule(gif).downloadAsync();
    /*const images = [require('./assets/splash.jpg')]
    const cacheImages = images.map(image => {
      return Asset.fromModule(image)
    })
    return Promise.all(cacheImages)*/
  }

  async _cacheResourcesAsync() {
    const images = [require('./assets/splash.png')];

    const cacheImages = images.map(image => {
      return Asset.fromModule(image).downloadAsync();
    }); 
    return Promise.all(cacheImages);
  }

  render() {
    if(!this.state.isready) {
    // SplashScreen.hide();
    // if (true) {
      return (
        <AppLoading
          startAsync={this._cacheResourcesAsync}
          onFinish={() => this.setState({ isready: true })}
          onError={console.warn}
          // autoHideSplash={true}
        />
        // <View style={{ flex: 1 }}>
        //   <View style={{margin: 40}}>
        // <View
        //   style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        // >
        //   <View style={{ margin: 40 }}>
        //     {/* <AppLoading
        //       startAsync={this._cacheResourceAsync}
        //       onFinish={() => this.setState({ isready: true })}
        //       onError={console.warn}
        //       autoHideSplash={true}
        //     /> */}
        //   </View>

        // <View
        //   style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        // >
        //   <View style={{marginLeft: 200, marginRight: 200}} >  
        //   <Image
        //     source={require("./assets/SR.png")}
        //     style={{ width: 600, height: 200, resizeMode: 'center' }}
        //   />
        //   </View>
        // </View>
      );
    } else {
      return (
        <Root>
          <Provider store={store}>
            <MainNavigator />
          </Provider>
        </Root>
      );
    }
  }
}
