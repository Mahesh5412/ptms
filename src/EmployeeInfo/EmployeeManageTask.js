/*
FileName:UserManageTask.js
Version:1.0.0
Purpose:Getting the List of user managetaks lsit 
Devloper:Naveen,Mahesh
*/

import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, StatusBar, Dimensions, Alert, Image } from 'react-native';
import {  Title, Button, Container, Content, Header, Right, Left, Body, Tab, Tabs, TabHeading, Footer, Item, Input, FooterTab } from 'native-base';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import EmployeePendingManageTask from '../EmployeeInfo/EmployeePendingManageTask';
import EmployeeCompletedManageTask from '../EmployeeInfo/EmployeeCompletedManageTask';
import AsyncStorage from '@react-native-community/async-storage';
import log from '../LogFile/Log';

export default class EmployeeManageTask extends Component {


  // componentDidUpdate() {
  //   //Getting the Levels
  //   console.warn( "alert"+this.props.navigation.state.params.levelno)
  //   AsyncStorage.setItem('levelno', this.props.navigation.state.params.levelno);

  // }
  // componentDidMount(){
  //   console.warn( "alert123"+this.props.navigation.state.params.levelno)
  //   AsyncStorage.setItem('levelno', this.props.navigation.state.params.levelno);
  // }
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
            <Icon size={25} name="arrow-left" style={{ color: '#fff' }} onPress={() =>
              this.props.navigation.goBack(null)} />
          </Left>
          <Body>
            <Title style={{ color: '#fff', fontWeight: '600' }}>Manage Task</Title>
          </Body>
          <Right>
            <Icon name="home" size={25} style={{ color: '#fff' }}
              onPress={() => this.props.navigation.navigate('UserProfile')} />
          </Right>

        </Header>

        <Tabs tabBarUnderlineStyle={{ borderBottomWidth: 0 }}>
          <Tab heading={<TabHeading style={{ backgroundColor: '#00A2C1' }}><Text style={{ color: '#fff' }}>PENDING</Text></TabHeading>}>
            <EmployeePendingManageTask navigation={this.props.navigation} />
          </Tab>

          <Tab heading={<TabHeading style={{ backgroundColor: '#00A2C1' }}><Text style={{ color: '#fff' }}>COMPLETED</Text></TabHeading>}>
            <EmployeeCompletedManageTask navigation={this.props.navigation} />
          </Tab>
        </Tabs>
      </Container>
    );
  }
}