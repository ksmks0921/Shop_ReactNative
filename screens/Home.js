import React, {Component} from 'react'
import {Text, View, Platform, StyleSheet, StatusBar, FlatList, Image} from 'react-native'
import {Container, Header, Content, Left, Body, Right, Icon, Spinner, Badge} from 'native-base'
//components
import OffLine from "../components/OfflineNotice"
import BrandImage from "../components/BrandImage"
//utils
import Colors from "../constants/colors"
//redux
import {connect} from 'react-redux'
import {getBrands} from "../redux/actions/brands"
import {cartInit} from "../redux/actions/cart"

class HomeScreen extends Component {
	static navigationOptions = {
		header: null
	};

	componentDidMount() {
		this.props.getBrands()
		this.props.cartInit()

	}

	render() {
		return (
			<Container>
				<Header style={styles.header}>
					<Left>
						<Icon
							style={[styles.whiteIcon, {fontSize: 35}]}
							name={Platform.OS === "ios" ? "ios-menu" : "md-menu"}
							onPress={() => {
								this.props.navigation.openDrawer()
							}}
						/>
					</Left>
					<Body>
					<View style={{alignItems: "center"}}>
						<Image source={require('../assets/logoHeader.png')} style={styles.image}/>
					</View>
					</Body>
					<Right>
						<View style={{flexDirection: "row"}}>
							<Icon
								onPress={() => this.props.navigation.navigate('Search')}
								style={styles.whiteIcon}
								name={Platform.OS === "ios" ? "ios-search" : "md-search"}
							/>
							<Icon
								onPress={() => {
									this.props.navigation.navigate("Cart")
								}}
								style={[styles.whiteIcon, {marginLeft: 18, marginRight: -5,}]}
								name={Platform.OS === "ios" ? "ios-cart" : "md-cart"}
							/>
							<Badge style={{position: 'absolute', top: 0, right: 0, height: 20, }}>
								<Text style={{color:'#fff'}}>{this.props.cardNum}</Text>
							</Badge>
						</View>
					</Right>
				</Header>
				<OffLine/>
				<Content>
					{!this.props.brands.loading ? (
						<FlatList
							data={this.props.brands.brands}
							keyExtractor={(item) => item.id.toString()}
							renderItem={({item}) => (
								<BrandImage
									brand={item}
									navigation={this.props.navigation}
								/>
							)}
						/>
					) : (
						<Spinner color="#555" size={30}/>
					)}
				</Content>
			</Container>
		)
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
	whiteIcon: {
		color: Colors.primary.light,
		width: 40, 
		height: 40
	},
	textLogo: {
		fontSize: 18,
		color: "#fff"
	}, image: {
		height: 50,
		width: 100,
		resizeMode: 'contain'
	}
})


const mapStateToProps = (state) => ({
	brands: state.brands,
	cardNum: state.cart.cardNum

});

const mapDispatchToProps = {
	getBrands, cartInit
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen)
