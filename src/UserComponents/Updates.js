/*
FileName:AdminManageTask.js
Version:1.0.0
Purpose:Shows the list pending and completed tasks list(dashboard for maintasks)
Devloper:Rishitha,Harsha
*/
import React, { Component } from 'react';
import { TextInput, Platform, StyleSheet, Text, View, StatusBar, Dimensions, Alert, Linking } from 'react-native';
import { Icon, Title, Button, Container, Content, Header, Right, Left, Body, Tab, Tabs, TabHeading, Footer, Item, Input, FooterTab } from 'native-base';
export default class Updates extends Component {
  render() {
    return (
      <Container>
        <Header
          androidStatusBarColor="#00A2C1"

          style={{
            backgroundColor: '#00A2C1',
            height: 80,
            width: Dimensions.get('window').width,
            borderBottomColor: '#ffffff',
            justifyContent: 'space-between',
          }}>
          <Left>
            <Icon name="md-menu" style={{ color: '#fff' }} onPress={() =>
              this.props.navigation.toggleDrawer()} />
          </Left>
          <Body>
            <Title style={{ color: '#fff', fontWeight: '600' }}>Updates</Title>
          </Body>
          <Right>
            <Icon name="ios-home" style={{ color: '#fff' }} onPress={() =>
              this.props.navigation.navigate('UserProfile')} />

          </Right>

        </Header>

        <View style={styles.Main}>
          <Text style={styles.TextStyle} onPress={() => Linking.openURL('http://115.98.3.215:90/ptmsreact/update.html')} >Click Here To Update</Text>
        </View>


      </Container>
    );
  }
}
//Style for UI
const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  TextStyle: {
    color: '#E91E63',
    textDecorationLine: 'underline',
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    marginTop: 250,
    fontSize: 25,
    fontWeight: "bold"
  }
});
