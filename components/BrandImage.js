import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native'
//redux
import { connect } from 'react-redux'
import { getProductsWithBrand } from "../redux/actions/products"


const WIDTH = Dimensions.get("window").width;

class BrandImage extends Component {

  handleImagePress = () => {
    this.props.getProductsWithBrand(this.props.brand.id);
    this.props.navigation.navigate('ProductList', {brandName: this.props.brand.name})
  };

  render() {
    const { brand: {id, image} } = this.props;
    if(id !== 99999 ){
      return (
        <TouchableOpacity style={{backgroundColor: "#f1f1f1", marginBottom: 3}} onPress={this.handleImagePress}>
          <Image style={styles.image} source={{uri: image}} />
        </TouchableOpacity>
      )
    }else{
      return(<></>);
    }
  }
}

BrandImage.propTypes = {
    brand: PropTypes.object.isRequired,
};

const styles = StyleSheet.create({
    image: {
        height: 120,
        width: WIDTH,
        resizeMode: "cover"
    }
});

const mapDispatchToProps = {
  getProductsWithBrand
};

export default connect(null, mapDispatchToProps)(BrandImage)
