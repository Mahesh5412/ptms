/*
FileName:AdminManageTask.js
Version:1.0.0
Purpose:Shows the list pending and completed tasks list(dashboard for maintasks)
Devloper:Rishitha,Harsha
*/
import React, { Component } from 'react';
import { TextInput, Platform, StyleSheet, Text, View, Image, StatusBar, Dimensions, Alert } from 'react-native';
import { Title, Icon, Button, Container, Content, Header, Right, Left, Body, Tab, Tabs, TabHeading, Footer, Item, Input, FooterTab } from 'native-base';
import AsyncStorage from '@react-native-community/async-storage';

import Pending1 from '../AdminComponets/AdminPendingManageTasks';
import Completed1 from '../AdminComponets/AdminCompletedManageTasks'


export default class ManageTask extends Component {
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
            <Icon name="md-menu" style={{ color: '#fff', }} onPress={() =>
              this.props.navigation.toggleDrawer()} />
          </Left>
          <Body>
            <Title style={{ color: '#fff', fontWeight: '600' }}>Manage Task</Title>
          </Body>
          <Right>
            <Icon name="ios-home" style={{ color: '#fff' }} onPress={() =>
              this.props.navigation.navigate('AdminManageProjects')} />

          </Right>



        </Header>






        <Tabs tabBarUnderlineStyle={{ borderBottomWidth: 0 }}>
          <Tab heading={<TabHeading style={{ backgroundColor: '#00A2C1' }}><Text style={{ color: '#fff' }}>PENDING</Text></TabHeading>}>
            <Pending1 navigation={this.props.navigation} />
          </Tab>




          <Tab heading={<TabHeading style={{ backgroundColor: '#00A2C1' }}><Text style={{ color: '#fff' }}>COMPLETED</Text></TabHeading>}>
            <Completed1 navigation={this.props.navigation} />
          </Tab>



        </Tabs>




      </Container>
    );
  }
}
