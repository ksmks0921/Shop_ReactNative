import React, { Component } from "react";
import {
  Text,
  View,
  StyleSheet,
  AsyncStorage,
  KeyboardAvoidingView,
  TouchableOpacity,
  Platform,
  StatusBar,
  ActivityIndicator
} from "react-native";
import {
  Container,
  Header,
  Content,
  Button,
  Item,
  Input,
  Icon,
  Body,
  Left,
  Toast
} from "native-base";
import * as Facebook from "expo-facebook";
import OffLine from "../components/OfflineNotice";
//utils
import Colors from "../constants/colors";
import axios from "axios";
import { validateSignupData } from "../Helpers/validators";
import { connect } from "react-redux";
import { toggleAuth } from "../redux/actions/user";

class Register extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: "",
      last_name: "",
      email: "",
      password: "",
      phone: "",
      loading:false,
      errors: {}
    };
  }

  handleLoginWithFB = async () => {
    try {
      const {
        type,
        token,
        expires,
        permissions,
        declinedPermissions
      } = await Facebook.logInWithReadPermissionsAsync("2336779719916038", {
        permissions: ["email"]
      });

      if (type === "success") {
        const res = await fetch(
          `https://graph.facebook.com/me?fields=email,name&access_token=${token}`
        );
        const json = await res.json();
        console.log(json);
        AsyncStorage.setItem("authUser", JSON.stringify(json));

        const { name, id, email } = json;

        const messoftData = {
          name,
          facebook_id: id,
          email
        };

        console.log(messoftData);

        const messoft = await fetch(
          "https://app.shoppingrunway.mx/api/v1/loginFacebook",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(messoftData)
          }
        );

        const messoftJson = await messoft.json();

        console.log(messoftJson);

        const authUser = {
          ...messoftJson.data.customer,
          token: res.data.token,
          promotions: res.data.promotions
        };

        AsyncStorage.setItem("authUser", JSON.stringify(authUser));

        this.props.toggleAuth();
        this.props.navigation.goBack();
      }
    } catch ({ message }) {
      console.error(`Facebook Login failed, ${message}`);
    }
  };

  handleSignup = () => {
    const data = {
      name: this.state.name,
      last_name: this.state.last_name,
      email: this.state.email,
      password: this.state.password,
      phone: this.state.phone
    };
    const { valid, errors } = validateSignupData(data);
    if (valid) {
      this.setState({loading:true});
      axios
        .post("https://app.shoppingrunway.mx/api/v1/register", data)
        .then(async res => {
          const credentials = {
            ...res.data.customer,
            token: res.data.token
          };
          this.setState({loading:false});
          await AsyncStorage.setItem("authUser", JSON.stringify(credentials));
          Toast.show({
            text: "Registration success",
            duration: 2500,
            position: "top",
            style: {
              backgroundColor: "#c8e6c9"
            },
            textStyle: { color: "#1b5e20" }
          });
          this.props.toggleAuth();
          this.props.navigation.navigate("Home");
        })
        .catch(e => console.error(e));
    } else {
      this.setState({ errors });
    }
  };

  render() {
    const { errors } = this.state;

    if(this.state.loading){
      return (
        <View style={styles.loader}>
          <ActivityIndicator size='large'/>
        </View>
      )
    }
    return (
      <Container>
        <Header style={styles.header}>
          <Left>
            <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
              <Icon
                style={styles.white}
                name={Platform.OS === "ios" ? "ios-close" : "md-close"}
              />
            </TouchableOpacity>
          </Left>
          <Body>
            <Text style={[styles.white, { fontSize: 20 }]}>
              REGISTRAR SESION
            </Text>
          </Body>
        </Header>
        <OffLine />
        <Content style={{ paddingHorizontal: 18, paddingTop: 10 }}>
          {/*{
            <Button onPress={this.handleLoginWithFB} style={styles.fbBtn}>
              <Icon name="logo-facebook" />
              <Text style={[styles.white, { fontSize: 18, marginRight: 8 }]}>
                Ingresar con Facebook
              </Text>
            </Button>
          }*/}

          <KeyboardAvoidingView behavior="padding" enabled>
            <View style={{ marginVertical: 15 }}>
              <Item error={errors.name ? true : false} style={styles.Input}>
                <Icon
                  name={Platform.OS === "ios" ? "ios-person" : "md-person"}
                />
                <Input
                  placeholder="Name"
                  onChangeText={name => this.setState({ name })}
                />
                {errors.name && (
                  <Icon
                    style={{ color: "red" }}
                    name={
                      Platform.OS === "ios"
                        ? "ios-close-circle"
                        : "md-close-circle"
                    }
                  />
                )}
              </Item>
              <Item
                error={errors.last_name ? true : false}
                style={styles.Input}
              >
                <Icon
                  name={Platform.OS === "ios" ? "ios-person" : "md-person"}
                />
                <Input
                  placeholder="Last_Name"
                  onChangeText={last_name => this.setState({ last_name })}
                />
                {errors.last_name && (
                  <Icon
                    style={{ color: "red" }}
                    name={
                      Platform.OS === "ios"
                        ? "ios-close-circle"
                        : "md-close-circle"
                    }
                  />
                )}
              </Item>
              {errors.last_name && (
                <Text style={styles.error}>{errors.last_name}</Text>
              )}
              <Item error={errors.email ? true : false} style={styles.Input}>
                <Icon name={Platform.OS === "ios" ? "ios-mail" : "md-mail"} />
                <Input
                  placeholder="Email"
                  onChangeText={email => this.setState({ email })}
                />
                {errors.email && (
                  <Icon
                    style={{ color: "red" }}
                    name={
                      Platform.OS === "ios"
                        ? "ios-close-circle"
                        : "md-close-circle"
                    }
                  />
                )}
              </Item>
              {errors.email && <Text style={styles.error}>{errors.email}</Text>}
              <Item error={errors.password ? true : false}>
                <Icon name={Platform.OS === "ios" ? "ios-key" : "md-key"} />
                <Input
                  secureTextEntry
                  placeholder="Contrasena"
                  onChangeText={password => this.setState({ password })}
                />
                {errors.password && (
                  <Icon
                    style={{ color: "red" }}
                    name={
                      Platform.OS === "ios"
                        ? "ios-close-circle"
                        : "md-close-circle"
                    }
                  />
                )}
              </Item>
              {errors.password && (
                <Text style={styles.error}>{errors.password}</Text>
              )}
              <Item error={errors.name ? true : false} style={styles.Input}>
                <Icon
                  name={
                    Platform.OS === "ios"
                      ? "ios-phone-portrait"
                      : "md-phone-portrait"
                  }
                />
                <Input
                  placeholder="Phone"
                  onChangeText={phone => this.setState({ phone })}
                />
                {errors.phone && (
                  <Icon
                    style={{ color: "red" }}
                    phone={
                      Platform.OS === "ios"
                        ? "ios-close-circle"
                        : "md-close-circle"
                    }
                  />
                )}
              </Item>
              {errors.phone && <Text style={styles.error}>{errors.phone}</Text>}
              <Button onPress={this.handleSignup} style={styles.submitBtn}>
                <Text style={styles.white}>Entrar</Text>
              </Button>
              <View style={{ flexDirection: "row", justifyContent: "center" }}>
                <Text style={{ marginRight: 8 }}>No tienes cuenta?</Text>
                <TouchableOpacity
                  onPress={() => {
                    this.props.navigation.navigate("Login");
                  }}
                >
                  <Text>Iniciar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </Content>
      </Container>
    );
  }
}

const mapDispatchToProps = {
  toggleAuth
};

export default connect(
  null,
  mapDispatchToProps
)(Register);

const styles = StyleSheet.create({
  header: {
    backgroundColor: Colors.primary.main,
    justifyContent: "space-between",
    ...Platform.select({
      android: {
        marginTop: StatusBar.currentHeight
      }
    })
  },
  white: {
    color: Colors.primary.light
  },
  textLogo: {
    fontSize: 18,
    color: Colors.primary.light
  },
  Input: {
    marginTop: 16
  },
  submitBtn: {
    backgroundColor: Colors.secondary.main,
    padding: 6,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    alignSelf: "center",
    borderRadius: 8,
    marginVertical: 20
  },
  fbBtn: {
    padding: 8,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    width: "95%",
    borderRadius: 8
  },
  error: {
    color: "red",
    marginBottom: 12
  },loader: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
});
