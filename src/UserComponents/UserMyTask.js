/*
FileName:UserMyTask.js
Version:1.0.0
Purpose:Getting the List of all the lsit of mytaks list 
Devloper:Rishitha,Harsha
*/

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View,StatusBar,Dimensions,Image} from 'react-native';
import {Icon,Title,Button,Container,Content,Header,Right,Left,Body,Tab, Tabs, TabHeading,Footer,Item,Input,FooterTab} from 'native-base';
import Pending from '../UserComponents/UserPendingMyTask';
import Completed from '../UserComponents/UserCompletedMyTask';


export default class MyTask extends Component {
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
              <Icon name="md-menu" style={{color: '#fff'}} onPress={()=>
                this.props.navigation.toggleDrawer()}/>   
          </Left>
          <Body>
            <Title style={{color: '#fff', fontWeight: '700',fontSize:22 }}>MY TASKS</Title>
            
          </Body>
      <Right>
      <Image source={require('../Images/home.png')}
                  onPress={() => this.props.navigation.navigate('UserProfile')}/>   
      </Right>
        </Header>

        <Tabs tabBarUnderlineStyle={{borderBottomWidth:0}}>
          <Tab  heading={ <TabHeading style={{backgroundColor: '#00A2C1'}}><Text style={{color:'#fff'}}>PENDING</Text></TabHeading>}>
            <Pending navigation={this.props.navigation}/>
          </Tab>

 <Tab  heading={ <TabHeading style={{backgroundColor: '#00A2C1'}}><Text style={{color:'#fff'}}>COMPLETED</Text></TabHeading>}>
                     <Completed navigation={this.props.navigation}/>
          </Tab>
        </Tabs> 
            </Container>
    );
  }
}