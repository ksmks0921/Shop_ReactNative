import React, { Component } from "react";
import {
  Text,
  View,
  StyleSheet,
  AsyncStorage,
  Image,
  Platform,
  StatusBar
} from "react-native";
import {
  Container,
  Header,
  Content,
  List,
  ListItem,
  Left,
  Icon,
  Right,
  Body,
  Toast,
  Button,
  Spinner
} from "native-base";
import Colors from "../constants/colors";
import numeral from "numeral";
import OffLine from "./OfflineNotice";
import { connect } from "react-redux";
import {cartReduce,cartClear} from "../redux/actions/cart";

class ShoppingCart extends Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false,
      cartProducts: [],
      loading: false,
      discount: "0"
    };
  }

  static navigationOptions = {
    header: null
  };

  async componentDidMount() {
    this.loadShoppingCart();
   /* let user = await AsyncStorage.getItem("authUser");
    user = JSON.parse(user);*/
    /*if (user.promotions && user.promotions.discount) {
      this.setState({ discount: user.promotions.discount });
    }*/
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.newAdded !== this.props.newAdded) {
      this.loadShoppingCart();
    }
  }

  loadShoppingCart = async () => {
    this.setState({ loading: true });
    let cartProducts = await AsyncStorage.getItem("cartProducts");
    if (cartProducts !== null) {
      this.setState({ cartProducts: JSON.parse(cartProducts) },()=>{console.log('cartProducts',this.state.cartProducts)});
    }
    this.setState({ loading: false });
  };

  handleRemoveFromCart = async index => {
    const cartProducts = this.state.cartProducts.filter(
      (product, i) => i !== index
    );
    await AsyncStorage.setItem("cartProducts", JSON.stringify(cartProducts));
		this.props.cartReduce(this.props.cardNum);
    this.setState({ cartProducts });

    Toast.show({
      text: "Item removed",
      duration: 2500,
      position: "top",
      style: {
        backgroundColor: "#c8e6c9",
        ...Platform.select({
          android: {
            marginTop: StatusBar.currentHeight
          }
        })
      },
      textStyle: { color: "#1b5e20" }
    });
  };

  handleCheckoutClick = async () => {
    let user = await AsyncStorage.getItem("authUser");
    user = JSON.parse(user);
    if (user !== null) {
      const { cartProducts } = this.state;
      const total =
        cartProducts.length > 0
          ? cartProducts
              .map(item => item.price * item.qty)
              .reduce((prev, next) => prev + next,0)
          : 0;

      const products = cartProducts.map(product => {
        const { price, qty, size, color, id } = product;
        return {
          product_id: id,
          color_id: color.id,
          size_id: size.id,
          price,
          qty
        };
      });
      this.props.navigation.navigate("Page1", { total, products });
    } else {
      this.props.navigation.navigate("Login");
    }
  };

  handleClearCart = async () => {
    await AsyncStorage.removeItem("cartProducts");
    this.setState({ cartProducts: 0 });
    this.props.cartClear()
    alert("Se borraron los productos");
    /*Toast.show({
      text: "Vaciar",
      duration: 2500,
      position: "top",
      style: {
        backgroundColor: "#c8e6c9",
        ...Platform.select({
          android: {
            marginTop: StatusBar.currentHeight
          }
        })
      },
      textStyle: { color: "#1b5e20" }
    });*/
  };

 /* _doubleProducts = producs =>
    producs.map(({ qty }) => (+qty > 1 ? qty - 1 : 0));
  _productsNum = producs =>
    producs.length + this._doubleProducts(producs).reduce((a, b) => a + b, 0);*/

  render() {
    const { cartProducts, loading } = this.state;
    console.log("Productos En Carrito", cartProducts);
   // console.log(cartProducts);
    //const num_items = this._productsNum(cartProducts);
    const num_items = cartProducts.length;
    console.log(num_items);
    const shipping =
      num_items !== 0
        ? num_items <= 5
          ? 80
          : 80 + Math.ceil((num_items - 5) / 3) * 15
        : 0;
    const Total =
      cartProducts.length > 0
        ? cartProducts
            .map(item => item.price * item.qty)
            .reduce((prev, next) => prev + next,0)
        : 0;

   // const total = shipping + Total - +this.state.discount;
    const total = shipping + Total;
    const CartItem = ({ item, index }) => (
      <ListItem >
        <View style={{ width: 103, height: 103, backgroundColor: "#f1f1f1" }}>
          <Image source={{ uri: item.image }} style={styles.productImage} />
        </View>
        <View style={{marginLeft:10}}>
					<Text
            numberOfLines={2}
						style={{color: "#555",width:200, fontSize: 17}}>
						{item.name}
					</Text>

					<Text style={{color: "#555", fontSize: 15, }}>
						{numeral(item.price).format("$0,0.00")}
					</Text>

						<Text style={{ color: "#666" }}>Color: {item.color.name}</Text>

						<Text style={{ color: "#666" }}>Talla: {item.size.name}</Text>

					<View style={{flexDirection: "row", }}>
						<Text style={{ color: "#666" }}>Qty: {item.qty}</Text>
						<Text style={{ marginLeft: 10, color: "#666" }}>
							Total: {numeral(item.qty * item.price).format("$0,0.00")}
						</Text>
					</View>
        </View>



        <Icon
          style={styles.removeBtn}
          onPress={() => this.handleRemoveFromCart(index)}
          name={Platform.OS === "ios" ? "ios-close-circle" : "md-close-circle"}
        />
      </ListItem>
    );

    return (
      <>
        <Container>
          <Header style={styles.header}>
            <Left>
              <Icon
                style={[styles.white, { fontSize: 35 }]}
                name={ Platform.OS === "ios" ? "ios-close" : "md-close"}
                onPress={() => {this.props.navigation.goBack();}}
              />
            </Left>
            <Body>
              <Text style={[styles.white, { fontSize: 20 }]}>MI CARRITO</Text>
            </Body>
            <Right>
              <Text style={[styles.white, { fontSize: 18, marginRight: 12 }]}>
                Total: {numeral(total).format("$0,0.00")}
              </Text>
            </Right>
          </Header>
          <OffLine />
          <Content style={{ flex: 1 }}>
            {loading ? (
              <Spinner style={{ marginTop: 80 }} size={60} color="#555" />
            ) : cartProducts !== null && cartProducts.length > 0 ? (
              <List>
                {cartProducts.map((item, i) => (
                  <CartItem key={i} index={i} item={item} />
                ))}
              </List>
            ) : (
              <Text style={{alignSelf: "center", fontSize: 18, color: "#333", marginVertical: 20}}>
                No hay productos en el carrito.
              </Text>
            )}
            {cartProducts.length > 0 && (
              <View style={{flexDirection: "row", justifyContent: "space-around", marginVertical: 18}}>
                <Button onPress={this.handleCheckoutClick} style={styles.payBtn}>
                  <Text style={[{ fontSize: 17 }, styles.white]}>Pagar</Text>
                </Button>

                <Button onPress={this.handleClearCart}
                  style={{
                    borderColor: "#ccc",
                    borderWidth: 1,
                    padding: 8,
                    justifyContent: "center",
                    alignItems: "center",
                    alignSelf: "center",
                    borderRadius: 8,
                    backgroundColor: "#fff"
                  }}>
                  <Text style={{ fontSize: 17, color: "#444" }}>
                    Vaciar Carrito
                  </Text>
                  <Icon
                    name={Platform.OS === "ios" ? "ios-trash" : "md-trash"} style={{color: "#555"}}
                  />
                </Button>
              </View>
            )}
          </Content>
        </Container>
      </>
    );
  }
}

const mapStateToProps = state => ({
  newAdded: state.products.newAdded,
	cardNum:state.cart.cardNum
});

const mapDispatchToProps = {
	cartReduce,cartClear
}


export default connect(mapStateToProps,mapDispatchToProps)(ShoppingCart);

const styles = StyleSheet.create({
  header: {
    backgroundColor: Colors.primary.main,
    ...Platform.select({
      android: {
        marginTop: StatusBar.currentHeight
      }
    })
  },
  cardItem: {
    position: "relative"
  },
  productImage: {
    flex: 1,
    width: null,
    height: null,
    resizeMode: "cover",
    borderRadius: 6
  },
  white: {
    color: Colors.primary.light,
  },
  removeBtn: {
    color: "#f44336",
    position: "absolute",
    top: 12,
    right: 12
  },
  payBtn: {
    backgroundColor: Colors.secondary.main,
    padding: 8,
    width: "40%",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    borderRadius: 8
  }
});
