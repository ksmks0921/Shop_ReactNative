import React, { Component } from 'react'
import { Text, View, NetInfo, Platform } from 'react-native'
import {Icon} from "native-base"

export default class OfflineNotice extends Component {
    state = {
        isConnected: true
    };

    componentDidMount() {
        NetInfo.addEventListener('connectionChange', this.handleStateChange)
    }

    handleStateChange = isConnected => {
        if(isConnected.type === "none") {
          this.setState({isConnected:false})
        } else {
          this.setState({isConnected: true})
        }
    }

    componentWillUnmount() {
       NetInfo.isConnected.removeEventListener('connectionChange', this.handleStateChange)
    }
  render() {
      const Notif = !this.state.isConnected ? (
        <View style={{
            backgroundColor: "#b52424",
            padding: 3,
            height: 30,
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "row"
        }}>
          <Icon style={{marginRight: 5,color: "#fff"}}name={Platform.OS === "ios" ? "ios-wifi" : "md-wifi"} />
          <Text style={{color: "#fff"}}> No internet connection :(</Text>
        </View>
      ) : null
    return (
      <>{Notif}</>
    )
  }
}
