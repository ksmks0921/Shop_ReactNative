import React, { Component } from 'react'
import {Text, View, Platform, StyleSheet, StatusBar, FlatList, TouchableOpacity} from 'react-native'
import { Container, Header, Content, Left, Body, Right, Icon, Input, Item } from 'native-base'
//components
import ProductItem from "../components/ProductItem"
import OffLine from "../components/OfflineNotice"

//utils
import Colors from "../constants/colors"
import axios from "axios"

export default class SearchPage extends Component {
    constructor(props) {
      super(props)
      this.state = {
        results: []
      }
      this.searchText = ''

    }
    static navigationOptions = {
        header: null
    }


  handleSubmit = () => {
    if(this.searchText.length > 0) {
      axios.get(`https://app.shoppingrunway.mx/api/v1/searchProduct/${this.searchText}`)
         .then(res => {
           this.setState({results: res.data.products})
         })
         .catch(e => console.error(e))
    }
  }
  render() {
    return (
        <Container>
        <Header searchBar style={styles.header}>
          <Left style={{flex:1}}>
            <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
              <Icon
                style={[styles.whiteIcon, {marginLeft:10, fontSize: 35}]}
                name={Platform.OS === "ios" ? "ios-close" : "md-close"}
              />
            </TouchableOpacity>
          </Left>
          <Item style={{flex:5}}>
            <Icon name={Platform.OS === 'ios' ? 'ios-search' : 'md-search'} />
            <Input
              autoFocus
              placeholder='Buscar'
              onChangeText={text => this.searchText = text}
              onSubmitEditing={this.handleSubmit}
            />
          </Item>
          {/*<Left>
              <Icon
                style={[styles.whiteIcon, {fontSize: 35}]}
                name={Platform.OS === "ios" ? "ios-menu" : "md-menu"}
                onPress={() => {
                  //this.props.navigation.goBack()
                  this.props.navigation.openDrawer()
                }}
              />
          </Left>
          <Body>
            <View style={{alignItems: "center", marginLeft: 30}}>
              <Text style={styles.textLogo}>Search</Text>
            </View>
          </Body>
          <Right>
            <View style={{flexDirection: "row"}}>
              <Icon
                onPress={() => {
                  this.props.navigation.navigate("Cart")
                }}
                style={styles.whiteIcon}
                name={Platform.OS === "ios" ? "ios-search" : "md-search"}
              />
              <Icon
                style={[styles.whiteIcon, {marginLeft: 18, marginRight: 12}]}
                name={Platform.OS === "ios" ? "ios-cart" : "md-cart"}
              />
            </View>
              </Right>*/}
        </Header>
        <OffLine />
        <Content>
            {this.state.results.length > 0 ? (
              <FlatList
                data={this.state.results}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({item}) => (
                    <ProductItem
                      product={item}
                      navigation={this.props.navigation}
                    />
                )}
                numColumns={2}
              />
            ) : (
              <Text style={{alignSelf: "center", fontSize: 18, color: "#555", marginTop:10}}>Sin resultados</Text>
            )}
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
    whiteIcon: {
        color: Colors.primary.light
    },
    textLogo: {
      fontSize: 18,
      color: "#fff"
    }
});
