/*
FileName:UserManagaProjects.js
Version:1.0.0
Purpose:Getting the List of Manage projects .
Devloper:Rishitha,Harsha
*/

import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, StatusBar, Dimensions } from 'react-native';
import { Icon, Title, Button, Container, Content, Header, Right, Left, Body, Tab, Tabs, Subtitle,TabHeading, Footer, Item, Input, FooterTab } from 'native-base';


import Approved from '../UserComponents/UserApprovedProjects';
import Requested from '../UserComponents/UserRequestedProjects ';

export default class ManageProjects extends Component {
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
       
          <Icon name="md-menu" size={25} style={{ color: '#fff', paddingTop: 17 }} onPress={() =>
            this.props.navigation.toggleDrawer()} />
          <Body style={{ paddingLeft: 30, }}>
            <Title style={{ color: '#fff', fontWeight: '600' }}>Manage Projects</Title>
            <Subtitle></Subtitle>
          </Body>
          <Icon name="home" size={25} style={{ color: '#fff', paddingTop: 17 }} onPress={() =>
            this.props.navigation.navigate('UserProfile')} />
        </Header>
        <Tabs tabBarUnderlineStyle={{ borderBottomWidth: 0 }}>
          <Tab heading={<TabHeading style={{ backgroundColor: '#00A2C1' }}><Text style={{ color: '#fff' }}>REQUESTED</Text></TabHeading>}>
            <Requested navigation={this.props.navigation} />
          </Tab>
          <Tab heading={<TabHeading style={{ backgroundColor: '#00A2C1' }}><Text style={{ color: '#fff' }}>APPROVED</Text></TabHeading>}>
            <Approved navigation={this.props.navigation} />
          </Tab>
        </Tabs>
      </Container>
    );
  }
}