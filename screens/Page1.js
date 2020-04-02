import React, { Component } from "react";
import {
  Text,
  View,
  StyleSheet,
  Platform,
  StatusBar,
  Alert,
  KeyboardAvoidingView
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
  Picker,
  Label
} from "native-base";
import Colors from "../constants/colors";
import OffLine from "../components/OfflineNotice";
import axios from "axios";
import { validateSippingData } from "../Helpers/validators";


export default class Checkout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      contact_name: "",
      street: "",
      num_ext: "",
      num_int: "",
      phone: "",
      cellphone: "",
      zipcode: "",
      // contact_name: "Youssef",
      // street: "Ibn Tachfine",
      // num_ext: "1",
      // num_int: "2",
      // phone: "0630273619",
      // cellphone: "0630273619",
      // zipcode: "20304",
      suburb: null,
      city: null,
      state: null,
      seletedValue: "",
      suburbs: [],
      cities: [],
      states: [],
      errors: {}
    };
  }

  static navigationOptions = {
    header: null
  };


  handleZipCodeChange(zipcode) {
    this.setState({ zipcode }, () => {
      axios
        .get(`https://app.shoppingrunway.mx/api/v1/getSuburbs/null/${zipcode}`)
        .then(res => {
          const suburbs = res.data.suburbs;
          this.setState({ suburbs });
        })
        .catch(e => {
          console.log("ERROR", "Algo paso en el zipcode");
         // console.error(e)
        });
    });
  }

  handleSuburbChange = suburb => {
    this.setState({ suburb }, () => {
      const selectedSuburb = this.state.suburbs.find(
        s => s.id === this.state.suburb.id
      );
      axios
        .get(
          `https://app.shoppingrunway.mx/api/v1/getCities/${selectedSuburb.cities_id}`
        )
        .then(res => {
          this.setState({ cities: res.data.cities });
        })
        .catch(e => console.error(e));
    });
  };

  handleCityChange = city => {
    this.setState({ city }, () => {
      const { states_id } = this.state.cities.find(
        c => c.id === this.state.city.id
      );
      axios
        .get(`https://app.shoppingrunway.mx/api/v1/getStates/${states_id}`)
        .then(res => {
          this.setState({ states: res.data.states });
        })
        .catch(e => console.error(e));
    });
  };

  handleContinue = () => {
    const { valid, errors } = validateSippingData(this.state);
    if (valid) {
      this.props.navigation.navigate("Checkout", {
        total: this.props.navigation.state.params.total,
        products: this.props.navigation.state.params.products,
        shipping: this.state
      });
    } else {
      this.setState({ errors });
    }
  };

  render() {
    const { errors } = this.state;
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
            <Text style={[styles.white, { fontSize: 18 }]}>Dirección de envío</Text>
          </Body>
        </Header>
        <OffLine />
        <Content style={styles.content}>
          <KeyboardAvoidingView behavior="padding" enabled>
            <View style={{marginTop: 12, padding: 6}}>
              <Item floatingLabel error={errors.contact_name ? true : false} style={styles.input}>
                <Input
                  placeholder="Nombre y apellido"
                  onChangeText={contact_name => this.setState({ contact_name })}
                  value={this.state.contact_name}
                />
              </Item>
              {errors.contact_name && (
                <Text style={{ color: "#f44336", marginLeft: 8 }}>
                  {errors.contact_name}
                </Text>
              )}

              <Item floatingLabel error={errors.street ? true : false} style={styles.input}>
                <Input
                  placeholder="Calle"
                  onChangeText={street => this.setState({ street })}
                  value={this.state.street}
                />
              </Item>
              {errors.street && (
                <Text style={{ color: "#f44336", marginLeft: 8 }}>
                  {errors.street}
                </Text>
              )}

              <Item floatingLabel error={errors.num_ext ? true : false} style={styles.input}>
                <Input
                  placeholder="N° exterior"
                  onChangeText={num_ext => this.setState({ num_ext })}
                  value={this.state.num_ext}
                />
              </Item>
              {errors.num_ext && (
                <Text style={{ color: "#f44336", marginLeft: 8 }}>
                  {errors.num_ext}
                </Text>
              )}

              <Item floatingLabel error={errors.num_int ? true : false} style={styles.input}>
                <Input
                  placeholder="N° interior"
                  onChangeText={num_int => this.setState({ num_int })}
                  value={this.state.num_int}
                />
              </Item>
              {errors.num_int && (
                <Text style={{ color: "#f44336", marginLeft: 8 }}>
                  {errors.num_int}
                </Text>
              )}

              <Item floatingLabel error={errors.phone ? true : false} style={styles.input}>
                <Input
                  placeholder="Teléfono"
                  onChangeText={phone => this.setState({ phone })}
                  value={this.state.phone}
                />
              </Item>
              {errors.phone && (
                <Text style={{ color: "#f44336", marginLeft: 8 }}>
                  {errors.phone}
                </Text>
              )}

              <Item floatingLabel error={errors.cellphone ? true : false} style={styles.input}>
                <Input
                  placeholder="Celular"
                  onChangeText={cellphone => this.setState({ cellphone })}
                  value={this.state.cellphone}
                />
              </Item>
              {errors.cellphone && (
                <Text style={{ color: "#f44336", marginLeft: 8 }}>
                  {errors.cellphone}
                </Text>
              )}

              <Item floatingLabel error={errors.zipcode ? true : false} style={styles.input}>
                <Input
                  placeholder="Código Postal"
                  onChangeText={zipcode => this.handleZipCodeChange(zipcode)}
                  value={this.state.zipcode}
                />
              </Item>
              {errors.zipcode && (
                <Text style={{ color: "#f44336", marginLeft: 8 }}>
                  {errors.zipcode}
                </Text>
              )}

              <Item style={styles.input}>
                <Label>Colonia</Label>
                <Picker
                  selectedValue={this.state.suburb}
                  onValueChange={suburb => this.handleSuburbChange(suburb)}
                  iosHeader="Colonia"
                  iosIcon={<Icon name="arrow-down" />}
                  style={{ width: undefined }}>
                  {this.state.suburbs.map(s => (
                    <Picker.Item key={s.id} value={s} label={s.name} />
                  ))}
                </Picker>
              </Item>

              <Item style={styles.input}>
                <Label>Ciudad</Label>
                <Picker
                  selectedValue={this.state.city}
                  onValueChange={city => this.handleCityChange(city)}
                  iosHeader="Ciudad"
                  iosIcon={<Icon name="arrow-down" />}
                  style={{ width: undefined }}>
                  {this.state.cities.map(c => (
                    <Picker.Item key={c.id} value={c} label={c.name} />
                  ))}
                </Picker>
              </Item>

              <Item style={styles.input}>
                <Label>Estado</Label>
                <Picker
                  selectedValue={this.state.state}
                  onValueChange={state => this.setState({ state })}
                  iosHeader="Estado"
                  iosIcon={<Icon name="arrow-down" />}
                  style={{ width: undefined }}>
                  {this.state.states.map(state => (
                    <Picker.Item
                      key={state.id}
                      value={state}
                      label={state.name}
                    />
                  ))}
                </Picker>
              </Item>

              <Button onPress={this.handleContinue} style={styles.payBtn}>
                <Text style={[styles.white, { fontSize: 16 }]}>
                  Continuar a Pago
                </Text>
              </Button>
            </View>
          </KeyboardAvoidingView>
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
    backgroundColor: "#EF6C00",
    padding: 6,
    justifyContent: "center",
    alignItems: "center",
    width: "96%",
    alignSelf: "center",
    borderRadius: 8,
    marginTop: 18
  }
});
