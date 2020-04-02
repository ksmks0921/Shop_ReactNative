import React, { Component } from "react";
import {
  Text,
  View,
  StyleSheet,
  Platform,
  StatusBar,
  ActivityIndicator,
  AsyncStorage
} from "react-native";
import {
  Container,
  Header,
  Content,
  Input,
  Left,
  Item,
  Body,
  Icon,
  Button,
  Toast
} from "native-base";
import Colors from "../constants/colors";
// import Stripe from "react-native-stripe-api";
// import { DangerZone } from "expo";
// import { PaymentsStripe as Stripe } from "expo-payments-stripe";
import OffLine from "../components/OfflineNotice";
import numeral from "numeral";
import axios from "axios";


export default class Checkout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      titular: "",
      number: "",
      expmonth: "",
      expyear: "",
      cvc: "",
      discount: 0,
      loading:false,
      hasDiscount:false
    };
  }

  static navigationOptions = {
    header: null
  };


  async componentDidMount() {
    let user = await AsyncStorage.getItem("authUser");
    user = JSON.parse(user);
    console.log('user', user);

    await fetch('https://app.shoppingrunway.mx/api/v1/getPromotions',{
      method: "GET",
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.token}`
      },
    }).then(data=> data.json())
      .then(data=>{
      console.log('RESPONSE',data);
      if(!data.error && data.hasPromotion){
        this.setState({hasDiscount:true, discount:200});
      }else
        this.setState({hasDiscount:false, discount:0});
    }).catch(error => {
        this.setState({hasDiscount:false, discount:0});
      console.log('ERROR',error);
    })
  }

  _sendOrder = async () => {
    this.setState({ loading:true});
    const user = JSON.parse(await AsyncStorage.getItem("authUser"));
    const { token } = user;

    const {
      contact_name,
      street,
      num_ext,
      num_int,
      phone,
      cellphone,
      zipcode,
      suburb,
      city
    } = this.props.navigation.getParam("shipping");

    const shipping = {
      contact_name,
      street,
      num_ext,
      num_int: num_int ? num_int : "", // optional
      phone,
      cellphone,
      zipcode,
      suburbs_id: suburb.id,
      cities_id: city.id
    };

    const { total, products } = this.props.navigation.state.params;

    const num_items = this._productsNum(products);
    const shipping_cost =
      num_items <= 5 ? 80 : 80 + Math.ceil((num_items - 5) / 3) * 15;

    let discount = 0;
    if(this.state.hasDiscount && total >=2500)
      discount = 200;

    const totalFix = shipping_cost + total - discount;
    //const totalFix = shipping_cost + total;

    const order = {
      order_status: 1,
      subtotal: total,
      shipping_cost,
      num_items,
      discount: discount,
      total: totalFix,
      iva: 0
    };

    const { number, expmonth, expyear, cvc, titular } = this.state;

    if(titular.length === 0 || number.length === 0 || expmonth.length === 0 || expyear.length === 0 || cvc.length === 0) {
      alert('Debes llenar toda la información de pago');
      this.setState({ loading:false});
      return;
    }

    const billing = {
      headliner: titular,
      tdc: number,
      month: +expmonth,
      year: +expyear,
      cvv: cvc
    };

    const orderData = {
      shipping,
      order,
      products,
      billing
    };

    console.log(orderData);

    const response = await fetch(
      "https://app.shoppingrunway.mx/api/v1/registerOrder",
      {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(orderData)
      }
    ).then(res => res.json())
      .then(data => {
        this.setState({loading:false});
        if(!data.error){
          this.goHome();
          alert(data.message);
        }else{
          alert(data.message);
        }
        console.log(data);
      })
      .catch(error => {
        this.setState({loading:false});
      console.log(error.message);
    });
  };

  goHome = async () => {
    await AsyncStorage.removeItem("cartProducts", ()=>{
      this.props.navigation.navigate('Home');
    });
  };

  _doubleProducts = producs =>
    producs.map(({ qty }) => (+qty > 1 ? qty - 1 : 0));
  _productsNum = producs =>
    producs.length + this._doubleProducts(producs).reduce((a, b) => a + b, 0);

  render() {

    if(this.state.loading){
      return (
        <View style={styles.loader}>
          <ActivityIndicator size='large'/>
        </View>
      )
    }

    const { suburb, city } = this.props.navigation.getParam("shipping");
    const { total, products } = this.props.navigation.state.params;
    let discount = 0;

    if(total >= 2500 && this.state.hasDiscount)
      discount = 200;

   // const discount = this.state.discount;
    const num_items = this._productsNum(products);
    const shipping =
      num_items <= 5 ? 80 : 80 + Math.ceil((num_items - 5) / 3) * 15;
    const Total = shipping + total - discount;

    return (
      <Container>
        <Header style={styles.header}>
          <Left>
            <Icon
              style={[styles.white, { fontSize: 35 }]}
              name={Platform.OS === "ios" ? "ios-arrow-back" : "md-arrow-back"}
              onPress={() => {
                this.props.navigation.goBack();
              }}
            />
          </Left>
          <Body>
            <Text style={[styles.white, { fontSize: 18 }]}>Paso 2: Pago</Text>
          </Body>
        </Header>
        <OffLine />
        <Content style={styles.content}>
          <View style={{ marginVertical: 10 }}>
            <Text style={{ fontWeight: "bold", alignSelf: "center" }}>
              Ingresa tu información de pago
            </Text>
          </View>

          <View style={{flexDirection: "row", justifyContent: "center", alignItems: "center"}}>
            <View style={{width: 20, height: 20, borderRadius: 20, borderColor: "red", borderWidth: 2}}>
              <View style={{width: 10, height: 10, backgroundColor: "red", borderRadius: 10, marginTop: 3, marginLeft: 3}}/>
            </View>

            <View style={{width: 65, height: 40, borderRadius: 6, backgroundColor: "#ddd", marginLeft: 8}}>
              <View style={{backgroundColor: "#000", marginTop: 8, height: 5}}/>
            </View>

            <Text style={{ marginLeft: 8, fontSize: 16 }}>
              Tarjeta de crédito o débito
            </Text>
          </View>

          <View style={{backgroundColor: "#ddd", marginHorizontal: 8, marginVertical: 14, padding: 8}}>
            <Item style={styles.input}>
              <Input placeholder="Titular"   onChangeText={titular => this.setState({ titular })}/>
            </Item>
            <Item style={styles.input}>
              <Input placeholder="Número de tarjeta" keyboardType="numeric" maxLength={16} onChangeText={number => this.setState({ number })}
              />
            </Item>
            <View style={{ flexDirection: "row" }}>
              <Item style={{ width: 90, backgroundColor: "#eee" }}>
                <Input
                  placeholder="Mes"
                  keyboardType="numeric"
                  onChangeText={expmonth => this.setState({ expmonth })}
                  maxLength={2}
                />
              </Item>
              <Item style={{ width: 90, backgroundColor: "#eee" }}>
                <Input
                  placeholder="Año"
                  keyboardType="numeric"
                  onChangeText={expyear => this.setState({ expyear })}
                  maxLength={2}
                />
              </Item>
              <Item style={{ width: 90, backgroundColor: "#eee" }}>
                <Input
                  placeholder="CVV"
                  keyboardType="numeric"
                  maxLength={3}
                  onChangeText={cvc => this.setState({ cvc })}
                />
              </Item>
            </View>
          </View>

          <View style={{backgroundColor: "#ddd", marginHorizontal: 8, marginVertical: 14, padding: 8}}>
            <View style={{flexDirection: "row", justifyContent: "space-between", marginBottom: 5}}>
              <Text style={{fontSize: 17}}>
                Subtotal
              </Text>
              <Text style={{fontWeight: "400", fontSize: 16}}>
                {numeral(total).format("$0,0.00")}
              </Text>
            </View>

            <View style={{flexDirection: "row", justifyContent: "space-between", marginBottom: 5}}>
              <Text style={{fontSize: 17}}>Gastos de envío</Text>
              <Text style={{fontWeight: "400", fontSize: 16}}>
                {numeral(shipping).format("$0,0.00")}
              </Text>
            </View>

            <View style={{flexDirection: "row", justifyContent: "space-between", marginBottom: 5}}>
              <Text style={{fontSize: 17}}>Descuento</Text>
              <Text style={{fontWeight: "400", fontSize: 16}}>
                {numeral(discount).format("-$0,0.00")}
              </Text>
            </View>

            <View style={{flexDirection: "row", justifyContent: "space-between", marginBottom: 5}}>
              <Text style={{fontSize: 17}}>Total</Text>
              <Text style={{fontWeight: "400", fontSize: 16}}>
                {numeral(Total).format("$0,0.00")}
              </Text>
            </View>

          </View>

          <Button onPress={this._sendOrder} style={styles.payBtn}>
            <Text style={[styles.white, { fontSize: 17 }]}>
              Confirmar y Pagar
            </Text>
          </Button>
        </Content>
      </Container>
    );
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
  content: {
    paddingHorizontal: 10,
    paddingVertical: 8
  },
  white: {
    color: "#fff", 
    width: 35,
    height: 35
  },
  input: {
    borderColor: "#ccc",
    backgroundColor: "#eee"
  },
  payBtn: {
    backgroundColor: Colors.secondary.main,
    padding: 6,
    justifyContent: "center",
    alignItems: "center",
    width: "96%",
    alignSelf: "center",
    borderRadius: 8,
    marginTop: 18
  },loader: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
});
