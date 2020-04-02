import React, { Component } from "react";
import {
  Text,
  View,
  StyleSheet,
  AsyncStorage,
  KeyboardAvoidingView,
  TouchableOpacity,
  Platform,
  StatusBar
} from "react-native";
import {
  Container,
  Header,
  Content,
  Button,
  Item,
  Toast,
  Input,
  Icon,
  Body,
  Left,
  Spinner
} from "native-base";
import * as Facebook from "expo-facebook";
import OffLine from "../components/OfflineNotice";
import axios from "axios";
//utils
import Colors from "../constants/colors";
import { validateLoginData } from "../Helpers/validators";
//redux
import { connect } from "react-redux";
import { toggleAuth } from "../redux/actions/user";


class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: "",
      errors: {},
      loading: false
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

        const { name, id, email } = json;

        const messoftData = {
          name,
          facebook_id: id,
          email
        };

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

        const authUser = {
          ...messoftJson.customer,
          token: messoftJson.token,
        };


        AsyncStorage.setItem("authUser", JSON.stringify(authUser));

        this.props.toggleAuth();
        this.props.navigation.goBack();
      }
    } catch ({ message }) {
      console.error(`Facebook Login failed, ${message}`);
    }
    // try {
    //   const {
    //     type,
    //     token,
    //     expires,
    //     permissions,
    //     declinedPermissions
    //   } = await Facebook.logInWithReadPermissionsAsync("2336779719916038", {
    //     permissions: ["public_profile"]
    //   });
    //   const res = await fetch(
    //     `https://graph.facebook.com/me?access_token=${token}`
    //   );
    //   const { name, email, facebook_id } = res;
    //   axios
    //     .post("https://srun.messoft.net/api/v1/loginFacebook", {
    //       name,
    //       email,
    //       facebook_id
    //     })
    //     .then(async res => {
    //       const authUser = {
    //         ...res.data.customer,
    //         token: res.data.token,
    //         promotions: res.data.promotions
    //       };
    //       await AsyncStorage.setItem("authUser", JSON.parse(authUser));
    //     })
    //     .catch(e => console.error(e));
    // } catch ({ message }) {
    //   console.error(`Facebook Login failed, ${message}`);
    // }

    // try {
    //   console.log("logging in");

    //   const {
    //     type,
    //     token,
    //     expires,
    //     permissions,
    //     declinedPermissions
    //   } = await Facebook.logInWithReadPermissionsAsync("2336779719916038", {
    //     permissions: ["public_profile"]
    //   });

    //   console.log(type, token);

    //   if (type === "success") {
    //     const response = await fetch(
    //       `https://graph.facebook.com/me?access_token=${token}`
    //     );

    //     json = await response.json();
    //     console.log(json);
    //     // const authUser = {

    //     // }
    //     // AsyncStorage.setItem("authUser", json.name);
    //   }
    // } catch (err) {
    //   console.log(err.message);
    // }
  };

  handleLogin = () => {
    const data = {
      email: this.state.email,
      password: this.state.password
    };

    const { valid, errors } = validateLoginData(data);

    if (valid) {
      this.setState({ loading: true });
      axios
        .post('https://app.shoppingrunway.mx/api/v1/login', data)
        .then(async res => {
          const credentials = {
            ...res.data.customer,
            token: res.data.token
          };
          await AsyncStorage.setItem("authUser", JSON.stringify(credentials));
          Toast.show({
            text: "Loggin success",
            duration: 2500,
            position: "top",
            style: {
              backgroundColor: "#c8e6c9"
            },
            textStyle: { color: "#1b5e20" }
          });
          this.setState({ loading: false });
          this.props.toggleAuth();
          this.props.navigation.navigate("Home");
        })
        .catch(e => {
          this.setState({loading:false});
          alert('Correo o constraseña incorrecta');
          console.log("ERROR", e);
         // console.error(e);
        });
    } else {
      this.setState({ errors });
    }
  };

  render() {
    const { errors, loading } = this.state;
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
            <Text style={[styles.white, { fontSize: 20 }]}>INICIAR SESION</Text>
          </Body>
        </Header>
        <OffLine />
        <Content style={{ paddingHorizontal: 18, paddingTop: 50 }}>
          {/*<Button onPress={this.handleLoginWithFB} style={styles.fbBtn}>
            <Icon name="logo-facebook" />
            <Text style={[styles.white, { fontSize: 18, marginRight: 8 }]}>
              Ingresar con Facebook
            </Text>
          </Button>*/}
          <KeyboardAvoidingView behavior="padding" enabled>
            <View style={{ marginVertical: 20 }}>
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
                <Icon name={Platform.OS === "ios" ? "ios-lock" : "md-lock"} />
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
              <Button onPress={this.handleLogin} style={styles.submitBtn}>
                {loading && <Spinner color="#fff" size={20} />}
                <Text style={styles.white}>Entrar</Text>
              </Button>
              <View style={{ flexDirection: "row", justifyContent: "center" }}>
                <Text style={{ marginRight: 8 }}>No tienes cuenta?</Text>
                <TouchableOpacity
                  onPress={() => {
                    this.props.navigation.navigate("Register");
                  }}
                >
                  <Text>Registrate</Text>
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
)(Login);

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
    marginTop: 18
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
  }
});
