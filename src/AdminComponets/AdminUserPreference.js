/*
FileName:AdminUserPreference.js
Version:1.0.3
Purpose:levels of viewing data 
Devloper:Rishitha,Harsha
*/
import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, StatusBar, Dimensions, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Title, Button, Container, Content, Header, Right, Left, Body, Tab, Tabs, TabHeading, Footer, Item, Input, FooterTab } from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';
import RadioGroup from 'react-native-radio-button-group';
import AsyncStorage from '@react-native-community/async-storage';
import log from '../LogFile/Log';
export default class AdminUserPreference extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      nodays: '',
      resetdays: '0',
    }
  }
  componentDidMount() {
    log("Debug", "admin userpreference screen is loaded");
  }
  //sending levels to UserManageTask 
  ViewLevel(level) {
    log("Info", "to get level no");
    console.warn("levelno rishi" + level);
    AsyncStorage.setItem('level', level);
    this.props.navigation.navigate("AdminManageTask");
  }
  preferedDays = () => {
    log("Info", "to get nodays");
    // alert(this.state.nodays);
    const days = this.state.nodays;
    AsyncStorage.setItem('nodays', days);
    this.props.navigation.navigate("AdminManageTask");

  }
  resetDays = () => {
    // alert(this.state.nodays);
    log("Info", "to reset nodays");
    const days = this.state.resetdays;
    AsyncStorage.setItem('nodays', days);
    this.props.navigation.navigate("AdminManageTask");
  }
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
            <Icon size={25} name="navicon" style={{ color: '#fff' }} onPress={() =>
              this.props.navigation.toggleDrawer()} />
          </Left>
          <Body>
            <Title style={{ color: '#fff', fontWeight: '600' }}>User Preference</Title>
          </Body>
          <Right>
            <Icon size={25} name="home" style={{ color: '#fff' }} onPress={() =>
              this.props.navigation.navigate('AdminManageProjects')} />

          </Right>
        </Header>
        <Content>
          <View>
            <TextInput placeholder="Days" style={{
              width: '90%', borderBottomWidth: 2,
              marginLeft: 10, justifyContent: 'center', alignSelf: 'center',
              alignContent: 'center', alignItems: 'center'
            }}
              onChangeText={(nodays) => this.setState({ nodays })}
              numeric value keyboardType={'numeric'}>
            </TextInput>
            <Text style={{
              justifyContent: 'center', alignItems: 'center',
              marginTop: 30, alignSelf: 'center'
            }}>Levels of Viewing</Text>
            <View style={{ marginTop: 150, flexDirection: 'row', justifyContent: 'center' }}>
              <RadioGroup
                horizontal
                options={[
                  {
                    id: '1',
                    labelView: (
                      <Text>
                        <Text style={{ color: 'black' }}>Level1</Text>
                      </Text>
                    ),
                  },
                  {
                    id: '2',
                    labelView: (
                      <Text>
                        <Text style={{ color: 'black' }}>Level2</Text>
                      </Text>
                    ),
                  },
                  {
                    id: '3',
                    labelView: (
                      <Text>
                        <Text style={{ color: 'black' }}>Level3</Text>
                      </Text>
                    ),
                  },
                ]}
                //activeButtonId={'user'}
                circleStyle={{ fillColor: 'black', borderColor: 'black' }}
                onChange={(option) => {this.ViewLevel(option.id)}}>
              </RadioGroup>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
              <TouchableOpacity style={styles.opencancel}
                onPress={this.resetDays}>
                <Text style={{ color: 'white' }}>Reset</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.opensave}
                onPress={this.preferedDays}>
                <Text style={{ color: 'white' }}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Content>



      </Container>







    );
  }
}
const styles = StyleSheet.create({
  opencancel: {
    flex: 1,
    ...Platform.select({
      ios: {
        backgroundColor: 'red',
        margin: 20,
        height: 30,
        alignItems: "center",
        justifyContent: 'center'
      },
      android: {
        backgroundColor: 'red', margin: 20, height: 30, alignItems:
          "center", justifyContent: 'center'
      },
    }),
  },
  opensave: {
    flex: 1,
    ...Platform.select({
      ios: {
        backgroundColor: 'green', margin: 20, height: 30, alignItems:
          "center", justifyContent: 'center'
      },
      android: {
        backgroundColor: 'green', margin: 20, height: 30, alignItems:
          "center", justifyContent: 'center'
      },
    }),
  },
});