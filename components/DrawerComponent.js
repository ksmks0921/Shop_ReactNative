import React, { Component } from 'react'
import { Text, View, Platform, StyleSheet, FlatList, StatusBar } from 'react-native'
import { Container, Header, Content, ListItem, Item, Input, Icon, Left, Body, List, Right } from 'native-base'
import { WebBrowser } from "expo"
//custom components
import IsAuthOptions from "./IsAuthOptions"
//utils
import Colors from '../constants/colors'
//redux
import { connect } from 'react-redux'
import { getProducts } from "../redux/actions/products"


class DrawerComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
       selected: false,
       brands: [],
       selectedBrand: {}
    }
  }

  fb = () => {
    const url = "https://www.facebook.com/ShoppingRunway";
    return WebBrowser.openBrowserAsync(url)
  }

  insta = () => {
    const url = "https://www.instagram.com/shopping_runway";
    return WebBrowser.openBrowserAsync(url)
  }

  render() {
    const {selected, selectedBrand: { id, name, categories}} = this.state;

    const selectedMarkup = selected && (
      <List>
        {
          categories && categories.map(cat => (
            <ListItem key={cat.id} onPress={() => {
                this.props.getProducts(id, cat.id),
                this.props.navigation.navigate("ProductList", {categoryName: cat.name})
                this.props.navigation.closeDrawer()
            }}>
              <Left>
                <Text style={{fontSize: 16}}>{cat.name}</Text>
              </Left>
              <Right>
                <Icon
                  style={styles.forwardIcon}
                  name={Platform.OS === "ios" ? "ios-arrow-forward" : "md-arrow-forward"}
                />
              </Right>
            </ListItem>
          ))
        }
      </List>
    )

    return (
      <Container>
       { !selected ? (
       <>
        <Header searchBar style={styles.header}>
            <Item>
              <Icon name={Platform.OS === 'ios' ? 'ios-search' : 'md-search'} />
              <Input
                onFocus={() => this.props.navigation.navigate("Search")}
                placeholder='Buscar...'
              />
            </Item>
        </Header>
        <Content>
            <ListItem
              style={styles.listItem}
              onPress={() => {
                this.props.navigation.navigate('Home')
              }}>
              <Text>INICIO</Text>
              <Icon name={Platform.OS === "ios" ? "ios-arrow-forward" : "md-arrow-forward"} />
            </ListItem>
           {/* <ListItem style={styles.listItem}>
              <Text>PASARELA</Text>
              <Icon
                style={styles.forwardIcon}
                name={Platform.OS === "ios" ? "ios-arrow-forward" : "md-arrow-forward"}
              />
            </ListItem>*/}

            <FlatList
              data={this.props.brands.brands}
              keyExtractor={(item) => item.name}
              renderItem = {({item}) => (
                <ListItem onPress={() => {
                  this.setState({selected: true, selectedBrand: item})
                }}
                >
                  <Left>
                    <Text style={{fontSize: 16}}>{item.name}</Text>
                  </Left>
                  <Right>
                    <Icon
                      style={styles.forwardIcon}
                      name={Platform.OS === "ios" ? "ios-arrow-forward" : "md-arrow-forward"}
                    />
                  </Right>
                </ListItem>
              )}
              />

            <IsAuthOptions navigation={this.props.navigation} />

            <View style={{marginLeft: 14, marginTop: 12}}>
              <Text>Siguenos</Text>
              <View style={styles.socialContainer}>
                <Icon onPress={this.fb} style={[styles.socialIcon, {marginRight: 16}]} name="logo-facebook" />
                <Icon onPress={this.insta} style={styles.socialIcon} name="logo-instagram" />
              </View>
            </View>
        </Content>
       </> ) : (
         <>
            <Header style={styles.header}>
              <Left>
                <Icon
                  onPress={() => this.setState({selected: false})}
                  style={{fontSize: 35}}
                  name={Platform.OS === "ios" ? "ios-arrow-back" : "md-arrow-back"}
                />
              </Left>
              <Body>
                <Text style={{fontSize: 20}}>{name}</Text>
              </Body>
            </Header>
            <Content>
              {selectedMarkup}
            </Content>
         </>

       )
       }
      </Container>
    )
  }
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: Colors.primary.light,
    ...Platform.select({
        android: {
            marginTop: StatusBar.currentHeight
        }
    })
  },
  listItem: {
    justifyContent: "space-between"
  },
  forwardIcon: {
    color: "#888",
    fontSize: 22
  },
  socialContainer: {
    flexDirection: "row",
    marginTop: 10,
    marginBottom: 30
  },
  socialIcon: {
    fontSize: 34
  }
})

const mapStateToProps = (state) => ({
  brands: state.brands
})

const mapDispatchToProps = {
  getProducts
}

export default connect(mapStateToProps, mapDispatchToProps)(DrawerComponent)
