import React, { Component } from "react";
import { Text, AsyncStorage } from "react-native";
import { ListItem, Toast } from "native-base";
import { connect } from "react-redux";
import { toggleAuth } from "../redux/actions/user";

class AuthOptions extends Component {
  state = {
    isAuthenticated: false
  };

  async componentDidMount() {
    const isAuthenticated = await AsyncStorage.getItem("authUser");

    if (isAuthenticated === null) {
      this.setState({ isAuthenticated: false });
    } else {
      this.setState({ isAuthenticated: true });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.authenticated !== this.props.authenticated) {
      this.setState({ isAuthenticated: nextProps.authenticated });
    }
  }

  handleLogin = () => {
    this.props.navigation.navigate("Login");
  };

  handleLogout = async () => {
    await AsyncStorage.removeItem("cartProducts");
    await AsyncStorage.removeItem("authUser");
    this.setState({isAuthenticated:false});
    this.props.toggleAuth();

    Toast.show({
      text: "Logout",
      duration: 2500,
      position: "top",
      style: {
        backgroundColor: "#c8e6c9"
      },
      textStyle: { color: "#1b5e20" }
    });
  };

  handleRegister = () => {
    this.props.navigation.navigate("Register");
  };

  handleAccountClick = () => {
    this.props.navigation.navigate("Account");
  };

  render() {
     const {isAuthenticated} = this.state;
   // const { authenticated } = this.props;
    console.log("BOOLEAN AUTH" , isAuthenticated);

    return (
      <>
        {isAuthenticated ? (
          <>
         {/*   <ListItem onPress={this.handleAccountClick}>
              <Text>MI CUENTA</Text>
            </ListItem>*/}
            <ListItem onPress={this.handleLogout}>
              <Text>CERRAR SESION</Text>
            </ListItem>
          </>
        ) : (
          <>
            <ListItem onPress={this.handleLogin}>
              <Text>INICIAR SESION</Text>
            </ListItem>
            <ListItem onPress={this.handleRegister}>
              <Text>REGISTRARME</Text>
            </ListItem>
          </>
        )}
      </>
    );
  }
}

const mapStateToProps = state => ({
  authenticated: state.user.authenticated
});

const mapDispatchToProps = {
  toggleAuth
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AuthOptions);
