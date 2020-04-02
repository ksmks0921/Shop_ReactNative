import React from 'react'
import { Text, View } from 'react-native'
import { createDrawerNavigator, createStackNavigator } from 'react-navigation'
//components
import DrawerComponent from "../components/DrawerComponent"
//screens
import HomeScreen from "../screens/Home"
import Login from "../screens/login"
import Register from "../screens/Register"
import ProductListScreen from "../screens/ProductList"
import ProductDetails from "../screens/ProductDetails"
import ShoppingCart from "../components/ShoppingCart"
import Search from "../screens/Search"
import Account from "../screens/Account"
import Checkout from "../screens/checkout"
import Page1 from "../screens/Page1"


const appStackNavigator = createStackNavigator({
    Home: HomeScreen,
    ProductList: ProductListScreen,
    ProductDetails,
    Cart: ShoppingCart,
    Page1,
    Checkout,
    Account,
    Search
});

const AppDrawerNavigator = new createDrawerNavigator({
    Home: appStackNavigator,
      Login,
      Register,
  /*  ProductList: ProductListScreen,
    ProductDetails,*/

   /* Cart: ShoppingCart,
    Account,
    Page1,
    Checkout*/
},
{
    contentComponent: DrawerComponent
});


export default AppDrawerNavigator
