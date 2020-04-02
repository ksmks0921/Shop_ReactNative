import React from 'react';
import {Text} from 'react-native';

export default class HeaderText extends React.Component{

	//LUZ YBARRARAN SWIMWEAR
	render(){
		const text = this.props.children;
		let fontSize = 18;
		if(text.length>21){
			fontSize = 12
		}else if(text.length>14){
			fontSize = 16
		}
		return <Text {...this.props} style={[this.props.style,{fontSize:fontSize}]}>{text}</Text>
	}
}