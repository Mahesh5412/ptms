/*
FileName:AdminDrawerComponents.js
Version:1.0.0
Purpose:Navgate to all Admin classes from Here and logout
Devloper:Rishitha,Naveen,Harsha,Mahesh,Raju
*/
import React, { Component } from 'react';
import { NavigationActions, DrawerLayoutAndroid, DrawerActions } from 'react-navigation';
import { Text, View, StyleSheet, Alert, ImageBackground, Dimensions, Image, TouchableOpacity } from 'react-native'
import { Title, Button, Container, Content, Header, Right, Left, Body, Tab, Tabs, TabHeading, Footer, FooterTab } from 'native-base';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { white } from 'ansi-colors';
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';


export default class drawerContentComponents1 extends Component {

  constructor(props) {
    super(props);
    this.state = {
      usertype: '',
      ptime: '0',
    }
  }

  preferedDays = () => {
    // alert(this.state.nodays);
    const days = this.state.ptime;
    AsyncStorage.setItem('nodays', days);
    AsyncStorage.setItem("level",''),
    this.props.navigation.navigate('AdminManageTask');

  }

  //this methos is used to ask the user about confirm about 
  logOutOption() {
    Alert.alert(
      'Alert',
      'Do you want to Logout',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        { text: 'OK', onPress: () => this.logOut() },
      ],
      { cancelable: false },
    );
  }

  //this method is used for logout the application and also clear the asyncstorage .
  logOut() {
    AsyncStorage.clear();
    this.props.navigation.navigate('Auth');
  }

  navigateToScreen = (route) => (
    () => {
      const navigateAction = NavigationActions.navigate({
        routeName: route
      });
      this.props.navigation.dispatch(navigateAction);
      this.props.navigation.dispatch(DrawerActions.closeDrawer());
    })

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.headerContainer}>

          <View style={{ alignItems: 'center', marginTop: 10, }}>
            <Image style={{ width: wp('37%'), height: hp('18%') }} source={require('../Images/drawer.png')} />
            <Text style={{ color: '#000000', paddingLeft: 10 }}>Welcome Admin</Text>
          </View>
        </View>


        <View style={styles.screenContainer}>


          <TouchableOpacity onPress={this.navigateToScreen('AdminManageProjects')}>
            <View style={styles.screenStyle}>
              <Icon size={25} name="home" style={{ color: '#000000', width: wp('8%') }} />
              <Text style={{ color: '#000000', marginLeft: 20 }}>Manage Projects</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={this.navigateToScreen('RoadBlockList')}>
            <View style={styles.screenStyle}>
              <Icon size={25} name="bitbucket" style={{ color: '#000000', width: wp('8%') }} />
              <Text style={{ color: '#000000', marginLeft: 20 }}>RoadBlock</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.preferedDays.bind(this)}>
            <View style={styles.screenStyle}>
              <Icon size={25} name="id-badge" style={{ color: '#000000', width: wp('8%') }} />
              <Text style={{ color: '#000000', marginLeft: 20 }}>Manage Tasks</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={this.navigateToScreen('AdminManageEmployees')}>
            <View style={styles.screenStyle}>
              <Icon size={25} name="user" style={{ color: '#000000', width: wp('8%') }} />
              <Text style={{ color: '#000000', marginLeft: 20 }}>Manage Employees</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={this.navigateToScreen('AdminUserPreference')}>
            <View style={styles.screenStyle}>
              <Icon size={25} name="users" style={{ color: '#000000', width: wp('8%') }} />
              <Text style={{ color: '#000000', marginLeft: 20 }}>User Preference</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={this.navigateToScreen('AdminCompletedProjects')}>
            <View style={styles.screenStyle}>
              <Icon size={25} size={25} name="lightbulb-o" style={{ color: '#000000', width: wp('8%') }} />
              <Text style={{ color: '#000000', marginLeft: 20 }}>Completed Projects</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={this.navigateToScreen('Updates1')}>
            <View style={styles.screenStyle}>
              <Icon size={25} name="history" style={{ color: '#000000', width: wp('8%') }} />
              <Text style={{ color: '#000000', marginLeft: 20 }}>Updates</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={this.logOutOption.bind(this)}>
            <View style={styles.screenStyle}>
              <Icon size={25} name="sign-out" style={{ color: '#000000', width: wp('8%') }} />
              <Text style={{ color: '#000000', marginLeft: 20 }}>Logout</Text>
            </View>
          </TouchableOpacity>


        </View>
      </View>

    )
  }
}

const styles = StyleSheet.create({
  container: {

    backgroundColor: '#fff',
    height: Dimensions.get('window').height,


  },
  headerContainer: {
    // height: 150,
    height: hp('23%')
  },
  headerText: {
    color: '#fff8f8',
  },
  screenContainer: {
    paddingTop: 20,

  },
  screenStyle: {

    marginTop: 2,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'grey',
    padding: 10,
    height: hp('8%'),
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,



  },
  screenTextStyle: {
    fontSize: 23,
    marginLeft: 40

  },
  imageViewContainer: {
    width: wp('25%'),
    height: hp('15%'),
    resizeMode: 'cover',

    margin: 10,
    borderRadius: 400 / 2,
  },

});