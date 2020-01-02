/*
FileName:RoadBlockList.js
Version:1.0.0
Purpose:Getting the List of all RoadBlock list 
Devloper:Rishitha,Mahesh
*/

import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, StatusBar, Dimensions, Image } from 'react-native';
import { Icon, Title, Button, Container, Content, Header, Right, Left, Body, Tab, Tabs, TabHeading, Footer, Item, Input, FooterTab } from 'native-base';
import Critical from '../CommonComponents/CriticalRoadBlockList';
import Solved from '../CommonComponents/SolvedRoadBlockList';


export default class RoadBlockList extends Component {
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
            <Title style={{ color: '#fff', fontWeight: '700', fontSize: 22 }}>Road Blocks</Title>

          </Body>
          <Right>
            <Icon name="ios-home" style={{ color: '#fff' }}
              onPress={() => this.props.navigation.navigate('UserProfile')} />
          </Right>
        </Header>

        <Tabs tabBarUnderlineStyle={{ borderBottomWidth: 0 }}>
          <Tab heading={<TabHeading style={{ backgroundColor: '#00A2C1' }}><Text style={{ color: '#fff' }}>CRITICAL</Text></TabHeading>}>
            <Critical navigation={this.props.navigation} />
          </Tab>

          <Tab heading={<TabHeading style={{ backgroundColor: '#00A2C1' }}><Text style={{ color: '#fff' }}>TO BE CRITICAL</Text></TabHeading>}>
            <Solved navigation={this.props.navigation} />
          </Tab>
        </Tabs>
      </Container>
    );
  }
}