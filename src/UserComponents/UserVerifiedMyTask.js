import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View,Dimensions} from 'react-native';
import {Icon,Left,Button,Container,Header,Content,Item,Input} from 'native-base';



export default class Verified extends Component{
  render() {
    return (
         <Container style={{height: Dimensions.get('window').height}}>
      <Content>
     <Item>
            <Icon name="ios-search" />
            <Input placeholder="Search" />
            <Icon name="ios-people" />

          </Item>
       



      </Content>



      </Container>
    );
  }
}
