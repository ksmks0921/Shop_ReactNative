import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { Text, View, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native'
import numeral from "numeral"

const WIDTH = Dimensions.get("window").width;

export default class ProductItem extends Component {
  handleImagePress = () => {
    this.props.navigation.navigate('ProductDetails', {product: this.props.product})
  };

  render() {
      const {product: { name, price, images}} = this.props;

    return (
      <View style={[styles.card, {width: (WIDTH / 2) - 16, margin: 8}]}>
        <TouchableOpacity
          style={{
            backgroundColor: "#f1f1f1",
            flex: 1,
            minHeight: 230,
          }}
          onPress={this.handleImagePress}
        >
          <Image style={styles.image} source={{uri: images[0]}} />
        </TouchableOpacity>
        <View style={{padding: 10, alignItems: "center"}}>
            <Text style={{color: "#333"}}>{name}</Text>
            <Text style={{color: "#333"}}>--- {numeral(price).format('$0,0.00')} ---</Text>
        </View>
      </View>
    )
  }
}

ProductItem.propTypes = {
    product: PropTypes.object.isRequired,
    navigation: PropTypes.object.isRequired
};

const styles = StyleSheet.create({
    card: {
      backgroundColor: '#fff',
      borderTopWidth: 0,
      shadowOffset: {width: 3, height: 3},
      shadowColor: '#000',
      shadowOpacity: 0.5,
      elevation: 1
    },
    image: {
        flex: 1,
        height: null,
        width: null,
        resizeMode: "cover"
    }
});
