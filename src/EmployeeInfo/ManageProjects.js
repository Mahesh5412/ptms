/*
FileName:UserManagaProjects.js
Version:1.0.0
Purpose:Getting the List of Manage projects .
Devloper:Naveen,Mahesh
*/

import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, StatusBar, Dimensions } from 'react-native';
import { Title, Button, Container, Content, Header, Right, Left, Body, Tab, Tabs, Subtitle, TabHeading, Footer, Item, Input, FooterTab } from 'native-base';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ApprovedProjects from "../EmployeeInfo/ApprovedProjects";
import RequestedProjects from "../EmployeeInfo/RequestedProjects";

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

      
            <Icon size={25} name="arrow-left" style={{ color: '#fff' ,paddingTop: 17 }} onPress={() =>
              this.props.navigation.goBack(null)} />
        
          <Body style={{ paddingLeft: 30, }}>
            <Title style={{ color: '#fff', fontWeight: '600', alignContent: "center" }}>Employee Project Info</Title>
            <Subtitle></Subtitle>
          </Body>
          <Icon name="home" size={25} style={{ color: '#fff', paddingTop: 17 }} onPress={() =>
            this.props.navigation.navigate('UserProfile')} />
        </Header>
        <Tabs tabBarUnderlineStyle={{ borderBottomWidth: 0 }}>
          <Tab heading={<TabHeading style={{ backgroundColor: '#00A2C1' }}><Text style={{ color: '#fff' }}>REQUESTED</Text></TabHeading>}>
            <RequestedProjects navigation={this.props.navigation} />
          </Tab>
          <Tab heading={<TabHeading style={{ backgroundColor: '#00A2C1' }}><Text style={{ color: '#fff' }}>APPROVED</Text></TabHeading>}>
            <ApprovedProjects navigation={this.props.navigation} />
          </Tab>
        </Tabs>
      </Container>
    );
  }
}