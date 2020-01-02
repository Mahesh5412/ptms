/*
FileName:AdminManageEmployeesTasks.js
Version:1.0.0
Purpose:Employess task details shown
Devloper:Santhosh,Naveen
*/
import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, StatusBar, Dimensions } from 'react-native';
import { Title, Button, Container, Content, Header, Right, Left, Body, Tab, Tabs, TabHeading, Footer, Item, Input, FooterTab } from 'native-base';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Pending from '../AdminComponets/AdminManageEmployeeTaskPending';
import Completed from '../AdminComponets/AdminManageEmployeeTaskCompleted';
import Verified from '../AdminComponets/AdminManageEmployeeTaskVerified';


export default class AdminManageEmployeesTasks extends Component {
  render() {
   // alert(this.props.navigation.state.params.empId);
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
            <Icon size={20} name="arrow-left" style={{ color: '#fff' }} onPress={() =>
              this.props.navigation.goBack(null)} />
          </Left>

          <Body>
            <Title style={{ color: '#fff', fontWeight: '600' }}>View Tasks</Title>
          </Body>
          <Right>
            <Icon size={20} name="pencil" style={{ color: '#fff' }}
              onPress={() => this.props.navigation.navigate("EditUser", {
                empId: this.props.navigation.state.params.empId,
                name: this.props.navigation.state.params.name,
                mobile: this.props.navigation.state.params.mobile,
                email: this.props.navigation.state.params.email,
                designation: this.props.navigation.state.params.designation,
                userName: this.props.navigation.state.params.userName,
                team: this.props.navigation.state.params.team,
                empStatus: this.props.navigation.state.params.empStatus,
                role: this.props.navigation.state.params.role,
                workingStatus: this.props.navigation.state.params.workingStatus,
              })} />
          </Right>
        </Header>
        <Tabs tabBarUnderlineStyle={{ borderBottomWidth: 0 }}>
          <Tab heading={<TabHeading style={{ backgroundColor: '#00A2C1' }}><Text style={{ color: '#fff' }}>PENDING</Text></TabHeading>}>
            <Pending navigation={this.props.navigation} />
          </Tab>
          <Tab heading={<TabHeading style={{ backgroundColor: '#00A2C1' }}><Text style={{ color: '#fff' }}>COMPLETED</Text></TabHeading>}>
            <Completed navigation={this.props.navigation} />
          </Tab>
          <Tab heading={<TabHeading style={{ backgroundColor: '#00A2C1' }}><Text style={{ color: '#fff' }}>VERIFIED</Text></TabHeading>}>
            <Verified navigation={this.props.navigation} />
          </Tab>
        </Tabs>
      </Container>
    );
  }
}
