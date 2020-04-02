import React, { Component } from 'react'
import { Text, View, StyleSheet, AsyncStorage, Platform, TouchableOpacity, StatusBar, Image } from 'react-native'
import { Container, Header, Content, ListItem, Item, Input, Icon, Left, Body, Right, List, Spinner } from 'native-base'
import Colors from "../constants/colors"
import OffLine from "../components/OfflineNotice"
import axios from "axios"

export default class Account extends Component {

  state= {
    user: "",
    loading: false
  }

  async componentDidMount() {
    this.setState({loading: true})
    let User = await AsyncStorage.getItem("authUser");
    User = JSON.parse(User)
    let user = {}
    axios.get(`https://app.shoppingrunway.mx/api/v1/profile`, {
      headers: {
        Authorization: `Bearer ${User.token}`
      }
    })
      .then(res => {
        console.log("1", res)
        user = {
          ...res.data.customer
        }
        user.orders = []
        return axios.get(`https://app.shoppingrunway.mx/api/v1/orderHistory`, {
          headers: {
            Authorization: `Bearer ${User.token}`
          }
        })
      })
      .then(res => {
        console.log("2", res)
        user.orders = res.data.orders;
        this.setState({user,loading: false})
      })
      .catch(e => console.error(e))
  }

  render() {
    const { loading, user: { name, username, email, image, orders} } = this.state;
    return (
      <Container>
        <Header style={styles.header}>
        <Left>
          <Icon
                style={[styles.white, {fontSize: 35}]}
                name={Platform.OS === "ios" ? "ios-menu" : "md-menu"}
                onPress={() => {
                  this.props.navigation.openDrawer()
                }}
              />
        </Left>
        <Body>
          <View style={{alignItems: "center", marginLeft: 40}}>
            <Text style={[styles.white, {fontSize: 20}]}>Mi cuenta</Text>
          </View>
        </Body>
        <Right>
            <View style={{flexDirection: "row"}}>
              <Icon
                onPress={() => this.props.navigation.navigate('Search')}
                style={styles.white}
                name={Platform.OS === "ios" ? "ios-search" : "md-search"}
              />
              <Icon
                onPress={() => {
                  this.props.navigation.navigate("Cart")
                }}
                style={[styles.white, {marginLeft: 18, marginRight: 12}]}
                name={Platform.OS === "ios" ? "ios-cart" : "md-cart"}
              />
            </View>
          </Right>
      </Header>
      <OffLine />
      <Content>
        {loading ?
          (<Spinner style={{marginTop: 80}} size={80} color="#555" />)
          :
        (<>

          <View style={{
            flexDirection: "row",
            marginHorizontal: 12,
            marginTop: 12,
            marginBottom: 18
          }}>
            <TouchableOpacity
              style={{
                backgroundColor: "#f1f1f1",
                width: 100,
                height: 130,
                borderRadius: 6,

              }}
            >
              {image ?
              (<Image source={{uri: image}} />)
            : (<Text style={{fontSize: 14, alignSelf: "center", marginTop: 55}}>No profile</Text>)}
            </TouchableOpacity>
            <View style={{marginLeft: 12}}>
              <Text style={{fontSize: 18}}>{name}</Text>
              <Text style={{fontSize: 18}}>{username}</Text>
              <Text style={{fontSize: 18}}>{email}</Text>
            </View>
          </View>

          {orders && orders.length > 0 ? (
          <List>
            {orders.map((order, i) => (
              <ListItem key={i} style={{position: "relative"}}>
                <Text style={{fontSize: 17, marginLeft: 12}}>Order n° {order.order_id}</Text>
                  <View style={{position: "absolute", top: 25, left: 12}}>
                      <Text style={{fontSize: 17}}>Num items: {order.num_items}</Text>
                      {/*<Text style={{fontSize: 17}}>Discount: {order.discount}</Text>*/}
                      <Text style={{fontSize: 17}}>Order status: {order.status}</Text>
                  </View>
              </ListItem>
            ))}
          </List>) : (
            <Text style={{fontSize: 14, alignSelf: "center"}}>No existen ordenes</Text>
          )}
        </>)}
      </Content>
      </Container>
    )
  }
}

const styles = StyleSheet.create({
    header: {
        backgroundColor: Colors.primary.main,
        ...Platform.select({
            android: {
                marginTop: StatusBar.currentHeight
            }
        })
    },
    white: {
        color: Colors.primary.light
    },
})
