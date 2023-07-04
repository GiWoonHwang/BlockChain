import React, { Component } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';
import { Dimensions } from 'react-native';

export default class CustomButton extends Component{
  static defaultProps = {
    title: 'untitled',
    buttonColor: '#000',
    titleColor: '#fff',
    onPress: () => null,
  }

  constructor(props){
    super(props);
  }

  render(){
    return (
      <TouchableOpacity style={[
        styles.button,
        {backgroundColor: this.props.buttonColor}
      ]}
      onPress={this.props.onPress}>
        <Text style={[
          styles.title,
          {color: this.props.titleColor}
        ]}>{this.props.title}</Text>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  button: {
    height:70,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
    borderRadius: 10,
    zIndex:2,
    width:Dimensions.get('window').width-30,
  },
  title: {
    fontSize: 30,
    fontWeight: "900",
  },
});