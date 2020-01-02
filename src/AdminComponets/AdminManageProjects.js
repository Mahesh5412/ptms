/*
FileName:AdminManageProjects.js
Version:1.0.0
Purpose:dashboard for Projects ,Here shows the list of projects
Devloper:Rishitha,Mahesh
*/
import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, StatusBar, Dimensions } from 'react-native';
import { Icon, Title, Button, Container, Content, Header, Right, Left, Body, Tab, Tabs, TabHeading, Footer, Item, Input, FooterTab, Subtitle } from 'native-base';

import Aproved1 from '../AdminComponets/AdminApprovedProjects ';
import Requested1 from '../AdminComponets/AdminRequestedProjects';

export default class ManageProjects1 extends Component {
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

        </Header>
        <Tabs tabBarUnderlineStyle={{ borderBottomWidth: 0 }}>
          <Tab heading={<TabHeading style={{ backgroundColor: '#00A2C1' }}><Text style={{ color: '#fff' }}>REQUESTED</Text></TabHeading>}>
            <Requested1 navigation={this.props.navigation} />
          </Tab>
          <Tab heading={<TabHeading style={{ backgroundColor: '#00A2C1' }}><Text style={{ color: '#fff' }}>APPROVED</Text></TabHeading>}>
            <Aproved1 navigation={this.props.navigation} />
          </Tab>
        </Tabs>
      </Container>
    );
  }
}
