import React, { Component } from 'react'
import { Text, View, Platform, StyleSheet, StatusBar, Modal, TouchableWithoutFeedback, Image, AsyncStorage, TouchableOpacity, Dimensions ,TouchableHighlight} from 'react-native'
import {
	Container,
	Header,
	Content,
	Left,
	Body,
	Right,
	Icon,
	Button,
	Item,
	Label,
	Picker,
	Input,
	Toast,
	Badge,DeckSwiper
} from 'native-base'
import Swiper from "react-native-swiper"
import numeral from "numeral"
import ImageZoom from 'react-native-image-pan-zoom';
import OffLine from "../components/OfflineNotice"
import {addCart} from "../redux/actions/products"
//utils
import Colors from "../constants/colors"
//redux
import { connect } from 'react-redux'
import {getProductDetails} from "../redux/actions/products"
import ImageViewer from "react-native-image-zoom-viewer";
import HeaderText from "../components/HeaderText";
import {cartAdd} from "../redux/actions/cart";
import Carousel from "../components/Carousel";

class ProductDetails extends Component {
    constructor(props) {
      super(props);
      this.state = {
        fullscreen: false,
        selectedImg: null,
        color: '',
        size: '',
        quantity: 1,
        sizes:[],
        colors:[],
        selectedColor:'',
        selectedSize:''
      }
    }

  static navigationOptions = {
    header: null
  };

  componentDidMount() {

    const { navigation } = this.props;
    navigation.addListener('willFocus', () => {

      const SIZES = this.props.navigation.state.params.product.colorsAndSizes;

      console.log("Color", SIZES[0].colors[0]);

      this.setState({sizes: SIZES, size:SIZES[0], color:SIZES[0].colors[0], selectedColor:'', selectedSize:''});
    });
   // const FIRST_COLOR = this.props.navigation.state.params.product.colorsAndSizes[0].colors;
   // const FIRST_SIZE = this.props.navigation.state.params.product.colorsAndSizes[0].size;
  }

  decrement = () => {
    if(this.state.quantity > 1) {
      let quantity = this.state.quantity - 1;
      this.setState({quantity})
    }
  };

  increment = () => {
    //get colors and increment if the quantity of the selected color is greater than the selected quantity
    /*const colors =
    this.props.navigation.state.params.product.colorsAndSizes.map(item => item.color);
    const selectedColor = colors.find(c => c.name === this.state.color);*/
    const selectedColor = this.state.selectedColor;
    if(selectedColor.qty > this.state.quantity) {
      let quantity = this.state.quantity + 1;
      this.setState({quantity})
    }
  };

  handleColorChange = value => {
    console.log("SELECT COLOR", value);
   // const colors = colorsAndSizes.map(item => item.color);
    this.setState({color: value, selectedColor:value})
  };

  handleSizeChange = value => {
    console.log("SELECT Size", value);
    this.setState({size: value, colors: value.colors, selectedSize: value});
  };

  addToCart = async () => {
    console.log(this.state.selectedColor);

    if(this.state.selectedColor === '' || this.state.selectedColor === null || this.state.selectedColor === undefined
    || this.state.selectedSize === '' || this.state.selectedSize === null || this.state.selectedSize === undefined){
      alert('Favor de seleccionar talla y color');

    }else{
      let cartProducts = await AsyncStorage.getItem("cartProducts");
      if(cartProducts === null) {
        cartProducts = []
      } else {
        cartProducts = JSON.parse(cartProducts)
      }

      /* const colors =
       this.props.navigation.state.params.product.colorsAndSizes.map(item => item.color);
       const sizes =
       this.props.navigation.state.params.product.colorsAndSizes.map(item => item.size);

       const selectedColor = colors.find(c => c.name === this.state.color.name);
       const selectedSize = sizes.find(s => s.name === this.state.size.name);

       console.log("COLOR MAP", colors);
       console.log("sizes MAP", sizes);
   */
      console.log("COLOR", this.state.selectedColor);
      console.log("SIZE", this.state.selectedSize);

      const { id, name, price, sku } = this.props.navigation.state.params.product;

      cartProducts.push({
        id,
        name,
        price,
        sku,
        image: this.props.navigation.state.params.product.images[0],
        color: this.state.selectedColor,
        size: this.state.selectedSize,
        qty: this.state.quantity
      });

      await AsyncStorage.setItem("cartProducts", JSON.stringify(cartProducts));

      const text = `${this.state.quantity} ${this.props.navigation.state.params.product.name} added to cart`;
      Toast.show({
        text,
        duration: 2500,
        position: "top",
        style: {
          backgroundColor: "#a5d6a7",
        },
        textStyle: {color: "#1b5e20"}
      });
      this.props.addCart();
      this.props.cartAdd(this.props.cardNum);
      this.setState({quantity: 1})
    }
  };

  render() {
    const {
      product: {
        name,
        price,
        description,
        colorsAndSizes,
        images
      }
    } = this.props.navigation.state.params;
    //retrieve product's colors and size separatly
   // const colors = colorsAndSizes.map(item => item.color);
  //  const sizes = colorsAndSizes.map(item => item.size);

    const { color, size, quantity, sizes, colors, selectedColor, selectedSize } = this.state;

    const imagesUrls = images.map(image => {
      return {url: image}
    });

      return (
      <Container>
        {!this.state.fullscreen ? (
        <>
        <Header style={styles.header}>
          <Left>
            <View style={{flexDirection: "row"}}>
              <Icon
                style={[styles.white, {fontSize: 35}]}
                name={Platform.OS === "ios" ? "ios-arrow-back" : "md-arrow-back"}
                onPress={() => {this.props.navigation.goBack()}}
              />
            </View>

          </Left>
          <Body style={{flex:2}}>
              <HeaderText style={[styles.white, {fontSize: 18}]}>{name}</HeaderText>
          </Body>
          <Right>
            <View style={{flexDirection: "row"}}>
              <Icon
               onPress={() => this.props.navigation.navigate("Search")}
                style={styles.white}
                name={Platform.OS === "ios" ? "ios-search" : "md-search"}
              />
              <Icon
                onPress={() => this.props.navigation.navigate("Cart")}
                style={[styles.white, {marginLeft: 10, marginRight: 8}]}
                name={Platform.OS === "ios" ? "ios-cart" : "md-cart"}
              />
							<Badge style={{position: 'absolute', top: 0, right: 0, height: 20, }}>
								<Text style={{color:'#fff'}}>{this.props.cardNum}</Text>
							</Badge>
            </View>
          </Right>
        </Header>
        <OffLine />
        <Content style={{padding: 10}}>
          {
						images&&images.length===1?<TouchableHighlight
							onPress={() => this.setState({fullscreen: true, selectedImg: images[0]})}
							 style={{ backgroundColor: "#eee"}}>
							<Image style={styles.image} source={{uri: images[0]}}/>
						</TouchableHighlight>:<Carousel
							autoplay={true}
							infinite={true}
							autoplayInterval={5000}
              // dotStyle={styles.dotStyle}
              // dotActiveStyle={styles.activeDotStyle}
						>
							{images.map((image, i) => (
								<TouchableHighlight
									onPress={() => this.setState({fullscreen: true, selectedImg: image})}
									key={i} style={{ backgroundColor: "#eee"}}>
									<Image style={styles.image} source={{uri: image}}/>
								</TouchableHighlight>
							))}
						</Carousel>
          }

          {/*<Swiper style={{height: 230}} autoplay autoplayTimeout={8}>*/}
            {/**/}
          {/*</Swiper>*/}

          <View style={{ justifyContent: "space-between", marginVertical: 6}}>
            <Text style={{fontSize: 18}}>{name}</Text>
            <Text style={{fontSize: 18, fontWeight: "bold", color: "#555"}}>
              {numeral(price).format('$0,0.00')}
            </Text>
          </View>

          <View>
            <Item style={{justifyContent: "space-between", marginTop: 8}}>
              <Label style={[styles.lgText, {marginRight: 12}]}>Talla</Label>
              <Picker selectedValue={selectedSize} onValueChange={this.handleSizeChange}
                      iosHeader="Talla"
                      iosIcon={<Icon name="arrow-down" />}
                      style={{ width: undefined }} placeholder="Selecciona...">
                {sizes.map(s => (
                  <Picker.Item key={s.id} value={s} label={s.name}/>
                ))}
              </Picker>
            </Item>

            <Item style={{justifyContent: "space-between",marginTop: 8}}>
              <Label style={[styles.lgText, {marginRight: 12}]}>Color</Label>
              <Picker selectedValue={selectedColor} onValueChange={this.handleColorChange}
                      iosHeader="Color"
                      iosIcon={<Icon name="arrow-down" />}
                      style={{ width: undefined }} placeholder="Selecciona...">
                {colors.map(c => (
                  <Picker.Item key={c.id} value={c} label={c.name}/>
                ))}
              </Picker>
            </Item>

            <View style={styles.row}>
              <Text style={styles.lgText}>Cantidad</Text>
                <TouchableOpacity
                  style={[styles.qtyBox, {backgroundColor: "#f1f1f1", marginLeft: 18}]}
                  onPress={this.decrement}>
                  <Text style={{fontSize: 32}}> - </Text>
                </TouchableOpacity>
                <View style={[styles.qtyBox, {marginHorizontal: 20}]}>
                  <Text style={{fontSize: 24}}>{quantity}</Text>
                </View>
                <TouchableOpacity
                  style={[styles.qtyBox, {backgroundColor: "#f1f1f1"}]}
                  onPress={this.increment}>
                  <Text style={{fontSize: 28}}> + </Text>
                </TouchableOpacity>
            </View>
          </View>

          <Button onPress={() => this.addToCart()} style={[styles.addToCardBtn, {flexDirection: "row", justifyContent: "center"}]}>
            <Text style={[styles.white, {fontSize: 20}]}>
              Agregar a Carrito
            </Text>
          </Button>

          <View style={{marginBottom: 24}}>
            <Text style={{marginBottom: 8, fontSize: 16}}>  {" "}
              {description}{" "} </Text>
          </View>
        </Content>
        </>) : (
          <Modal
            animationType="slide"
            trasnparent={true}
            visible={this.state.fullscreen}
            presentationStyle="fullScreen"
            style={styles.fullscreen}
            onRequestClose={() => this.setState({ fullscreen: false, selectedImg: null })}>
            <ImageViewer
              imageUrls={imagesUrls}
              enableSwipeDown={true}
              onSwipeDown={() => {this.setState({ fullscreen: false, selectedImg: null })}}
              renderHeader={() =>
                <TouchableWithoutFeedback>
                  <Icon onPress={() => this.setState({ fullscreen: false, selectedImg: null })}
                        style={{color: 'white', position:'absolute', width: 40, height: 40,  top:30, left:20, zIndex:100, fontSize: 35,shadowOffset:{  width: 1,  height: 1 },
                          shadowColor: 'black',shadowRadius: 5,
                          shadowOpacity: 1.0,}}
                        name={Platform.OS === "ios" ? "ios-close" : "md-close"}
                  />
              </TouchableWithoutFeedback>}
            >
            </ImageViewer>
          </Modal>
        )}
      </Container>
    )
  }
}

const WIDTH = Dimensions.get("window").width;

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
        color: Colors.primary.light,       
        
    },
    image: {
			 height: 230,
	    width: WIDTH,
      resizeMode: "contain",
      alignItems:'center',
      justifyContent:'center'
    },
    addToCardBtn: {
      alignSelf: "center",
      margin: 45,
      backgroundColor: Colors.secondary.main,
      width: "94%",
      borderRadius: 6
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 15
    },
    lgText: {
      fontSize: 18
    },
    qtyBox: {
      padding: 8,
      alignItems: "center",
      justifyContent: "center",
      borderColor: "#eee",
      borderWidth: 1
    },
    fullscreen: {
      flex: 1
    }
});

const mapStateToProps = (state) => ({
  products: state.products,
	cardNum:state.cart.cardNum

});

const mapDispatchToProps = {
  getProductDetails,
  addCart,cartAdd
};

export default connect(mapStateToProps, mapDispatchToProps)(ProductDetails)
