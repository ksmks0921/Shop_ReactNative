import React, { Component } from 'react'
import { Text, View, Platform, StyleSheet, StatusBar, FlatList } from 'react-native'
import {Container, Header, Content, Left, Body, Right, Icon, Spinner, Badge} from 'native-base'
//components
import ProductItem from "../components/ProductItem"
//utils
import Colors from "../constants/colors"
//redux
import { connect } from 'react-redux'
import HeaderText from "../components/HeaderText";
//import { getProducts } from '../redux/actions/products'

class ProductList extends Component {
  state = {
    loading: false
  }

  static navigationOptions = {
    header: null
  };

  componentWillReceiveProps(nextProps) {
    if(nextProps.products.loading !== this.props.products.loading) {
      this.setState({loading: nextProps.products.loading})
    }
  }

  render() {
    const Title = this.props.navigation.state.params.categoryName ?
      this.props.navigation.state.params.categoryName
      : this.props.navigation.state.params.brandName;

    console.log('LIST',this.props.products);
    return (
      <Container>
        <Header style={styles.header}>
          <Left>

            <Icon
              style={[styles.whiteIcon, {fontSize: 35}]}
              name={
                Platform.OS === "ios" ? "ios-arrow-back" : "md-arrow-back"
              }
              onPress={() => {
                this.props.navigation.goBack();
              }}
            />
          </Left>
          <Body style={{flex:2}}>
            <View>
              <HeaderText style={styles.textLogo}>{Title}</HeaderText>
            </View>
          </Body>
          <Right>
            <View style={{flexDirection: "row"}}>
              <Icon
                onPress={() => this.props.navigation.navigate('Search')}
                style={styles.whiteIcon}
                name={Platform.OS === "ios" ? "ios-search" : "md-search"}
              />
              <Icon
                onPress={() => this.props.navigation.navigate('Cart')}
                style={[styles.whiteIcon, {marginLeft: 18, marginRight: -5, }]}
                name={Platform.OS === "ios" ? "ios-cart" : "md-cart"}
              />
							<Badge style={{position: 'absolute', top: 0, right: 0, height: 20, }}>
								<Text style={{color:'#fff'}}>{this.props.cardNum}</Text>
							</Badge>
            </View>
          </Right>
        </Header>
        <Content>
            {!this.props.products.loading ? (<FlatList
                data={this.props.products.product}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({item}) => (
                    <ProductItem
                      product={item}
                      navigation={this.props.navigation}
                    />
                )}
                numColumns={2}
            />) : (
                  <Spinner style={{marginTop: 80}} color="#666" size={80}/>
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
        color: Colors.primary.light,
        width: 40,
        height: 40
    },
    textLogo: {
      fontSize: 18,
      color: "#fff"
    }
})

const mapStateToProps = (state) => ({
  products: state.products,
	cardNum: state.cart.cardNum,
})

const mapDispatchToProps = {
//  getProducts
}

export default connect(mapStateToProps, mapDispatchToProps)(ProductList)
