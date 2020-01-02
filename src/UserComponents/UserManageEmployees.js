/*
FileName:UserManageEmployees.js
Version:1.0.0
Purpose:Getting the List of all the employees list 
Devloper:Rishitha,Santosh,Mahesh
*/
import React, { Component } from 'react';
import { Platform, Linking, StyleSheet, Text, FlatList, TouchableOpacity, View, StatusBar, Dimensions, Alert } from 'react-native';
import { Title, Button, Container, Content, Header, Right, Left, Body, Tab, Tabs, TabHeading, Footer, Subtitle, Item, Input, FooterTab } from 'native-base';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';
import Communications from 'react-native-communications';
import { API } from "../WebServices/RestClient";
import NetInfo from '@react-native-community/netinfo';
import Snackbar from 'react-native-snackbar';
import log from '../LogFile/Log';
import { SwipeListView } from 'react-native-swipe-list-view';
import { NavigationEvents } from 'react-navigation';
import {
  BallIndicator,
  BarIndicator,
  DotIndicator,
  MaterialIndicator,
  PacmanIndicator,
  PulseIndicator,
  SkypeIndicator,
  UIActivityIndicator
} from 'react-native-indicators';

class ListItem extends Component {

  render() {

    const { data } = this.props;
    const { emp_role } = this.props;

    let button;

    if (emp_role === "Emp") {
      
    const { data } = this.props;
      button = null;
    } else {

    const { data } = this.props;
      button =
        <TouchableOpacity style={{ marginTop: 12 }}
          onPress={() => this.props.navigation.navigate("EmployeeInfo", {
            empId: data.item.id,
            name: data.item.name,
            mobile: data.item.mobileNumber,
            email: data.item.email,
            designation: data.item.designation,
            userName: data.item.userName,
            team: data.item.team,
            empStatus: data.item.empStatus,
            workingStatus: data.item.workingStatus,
            role: data.item.role
          })}>
          <Icon name="chevron-right" style={{ color: '#808080', paddingRight: 5 }} size={15} />
        </TouchableOpacity>
    }

    let buttonttt;
    return (

      <View style={styles.container}>
        <View style={styles.signup}>
          <View style={[styles.buttonContainer, styles.signupButton]} >
            <View style={styles.box}>
              <View style={{ flexDirection: 'row' }}>
                <Text style={styles.signUpText1} >{data.item.name}</Text>
              </View>
              <Text style={styles.designationText}>{data.item.role}</Text>
            </View>
            <View style={{ flexDirection: 'row', }}>
              <View style={{ flexDirection: 'row', width: wp('90%') }}>
                <Text style={styles.signUpText11}>Email : </Text>
                <TouchableOpacity style={{ flexDirection: 'row' }}>
                  <Icon name="envelope" style={{ color: 'red', marginLeft: 5, marginTop: 12 }} size={15}
                    onPress={() => Linking.openURL('mailto:support@example.com')} />
                  <Text style={styles.signUpText11email}
                    onPress={() => Linking.openURL('mailto:support@example.com')}
                  >{data.item.email}</Text>
                </TouchableOpacity>
              </View>
              <View>
                {button}
              </View>
            </View>

          </View>
          <View style={{ flexDirection: 'row' }}>
            <Text style={styles.signUpText11}>Mobile : </Text>

            <TouchableOpacity style={{ flexDirection: 'row' }}>
              <Icon name="phone" style={{ color: '#00FF00', marginLeft: 5, marginTop: 12 }} size={20}
                onPress={() => Communications.phonecall(data.item.mobileNumber, true)} />
              <Text style={styles.signUpText11mobile}
                onPress={() => Communications.phonecall(data.item.mobileNumber, true)}
              >{data.item.mobileNumber}</Text>
            </TouchableOpacity>

          </View>
          <View
            style={{
              marginTop: 15,
              borderBottomColor: '#C0C0C0',
              borderBottomWidth: 0.2,
            }}
          />
        </View>

      </View>
    )
  }
}
export default class UserManageEmployees extends Component {
  static navigationOptions = () => {
    return {
      tabBarOnPress({ navigation, defaultHandler }) {
        navigation.state.params.onTabFocus();
        defaultHandler();
        this.onRefresh();
      }
    };
  }


  constructor(props) {
    super(props);
    props.navigation.setParams({
      onTabFocus: this.handleTabFocus
    });
    let button;
    this.state = {
      isLoading: true,
      dataSource: [],
      isFetching: false,
      result: '',
      emp_role: '',
    
    
    }
    this.arrayholder = [];
    this.button=button;
   
  
  }
  handleTabFocus = () => {
    this.onRefresh();
  };
 
  componentDidMount() {
    log("Debug", "Employees list getting screen is loaded at user side");
    //to get the lsit of list of employees
    this.UserManageEmployees()

    AsyncStorage.getItem("emp_role", (err, res) => {
      console.log(res)
      const emp_role1 = res;
      this.setState({ emp_role: emp_role1 })
    })
  }
  //to refresh the data
  onRefresh() {
     this.UserManageEmployees() ;

  }
  // componentWillReceiveProps(nextProps) {
  //   //to get the lsit of list of employees
  //   this.UserManageEmployees();
  // }

  //to get the lsit of list of employees
  UserManageEmployees() {
    log("Info", "UserManageEmployees:getEmployeeList() method is used to get employee list");
    AsyncStorage.getItem("cropcode", (err, res) => {
      const cropcode = res;

      AsyncStorage.getItem("empId", (err, res) => {
        const empId = res;


        AsyncStorage.getItem("emp_role", (err, res) => {
          const emp_role = res;
          //Checking the Internet Connection
          NetInfo.fetch().then(state => {
            if (state.type == "none") {

              Snackbar.show({
                title: 'No Internet Connection',
                backgroundColor: 'red',
                duration: Snackbar.LENGTH_LONG,
              });
            } else {

              fetch(API + 'getEmployees.php',
                {
                  method: 'POST',
                  headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    crop: cropcode,
                    action: "pending",
                    userType: emp_role,
                    empId: empId
                  })
                })
                .then((response) => response.json())
                .then((responseJson) => {

                  // console.log(JSON.stringify(responseJson))
                  this.setState({
                    isLoading: false,
                    dataSource: responseJson.data,
                    isFetching: false
                  }, function () {
                  });
                  this.arrayholder = responseJson.data;

                })
                .catch((error) => {
                  console.error(error);
                  log("Error", "error in getting employee list at user side");
                });

            }
          });

        });

      });

    });
  }
  //Seperate the List date
  FlatListItemSeparator = () => {
    return (
      <View
        style={{
          //  height: .5,
          width: "100%",
          backgroundColor: "#000",
        }}
      />
    );
  }
  //For Empty list
  _listEmptyComponent = () => {
    return (
      <View>
        <Text></Text>

      </View>
    )
  }

  //to filter the search data in search area 
  SearchFilterFunction(text) {
    log("Info", "UserManageEmployees:SearchFilterFunction(text) method is used for search functionality")
    const newData = this.arrayholder.filter(function (item) {

      const name = item.name.toUpperCase()
      const name1 = text.toUpperCase()
      const empStatus = item.empStatus.toUpperCase()
      const empStatus1 = text.toUpperCase()
      const designation = item.designation.toUpperCase()
      const designation1 = text.toUpperCase()
      const email = item.email.toUpperCase()
      const email1 = text.toUpperCase()
      const mobileNumber = item.mobileNumber.toUpperCase()
      const mobileNumber1 = text.toUpperCase()

      return name.indexOf(name1) > -1 ||
        //  date.indexOf(date1) > -1 || 
        empStatus.indexOf(empStatus1) > -1 ||
        designation.indexOf(designation1) > -1 ||
        email.indexOf(email1) > -1 ||
        mobileNumber.indexOf(mobileNumber1) > -1
    })
    this.setState({
      dataSource: newData,
      text: text
    })
  }



  


  render() {
    let button;
    if (this.state.emp_role === "Emp") {
      button = null;
    } else {
      button =
        <TouchableOpacity style={{ marginTop: 12 }}
          onPress={(item) => this.props.navigation.navigate("UserManageEmployeesTasks", {
            empId: item.id,
            name:item.name,
            mobile: item.mobileNumber,
            email:item.email,
            designation: item.designation,
            userName: item.userName,
            team:item.team,
            empStatus: item.empStatus,
            workingStatus: item.workingStatus,
            role: item.role
          })}>
          <Icon name="chevron-right" style={{ color: '#808080', paddingRight: 5 }} size={15} />
        </TouchableOpacity>
    }
 
    if (this.state.isLoading) {
      return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <DotIndicator color='#00A2C1' />
        </View>
      );

    }
     
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

          <Icon name="navicon" size={25} style={{ color: '#fff', paddingTop: 17 }} onPress={() =>
            this.props.navigation.toggleDrawer()} />
          <Body style={{ paddingLeft: 30, }}>
            <Title style={{ color: '#fff', fontWeight: '600' }}>Manage Employees</Title>
            <Subtitle></Subtitle>
          </Body>
          <Icon name="home" size={25} style={{ color: '#fff', paddingTop: 17 }} onPress={() =>
            this.props.navigation.navigate('UserProfile')} />

        </Header>

        <Item >
        <NavigationEvents
            onDidFocus={() => this.onRefresh()}
          />
          <Input placeholder="Search"
            onChangeText={(text) => this.SearchFilterFunction(text)} />
          <Icon style={{ marginRight: 10, color: 'black' }} size={25} name="search" />
        </Item>
        <Content>


          <View style={styles.Container}>
            <View></View>
            <View >

            </View>
            <View style={styles.end1}>

              <SwipeListView
                data={this.state.dataSource}
                renderItem={(data) => (
                 
                  <View style={styles.container2} >
                  <ListItem navigation={this.props.navigation}
                    data={data}
                    emp_role={this.state.emp_role}

                  />
                </View>
            
                )}
                
                renderHiddenItem={(data, rowMap) => (
              
                <View style={styles.rowBack}>
   
                <Text>{data.item.empStatus}</Text> 
                <Text>{data.item.empStatus}</Text> 
            </View>
            
                )}
                
                leftOpenValue={100}
                rightOpenValue={-100}
                
              />

            </View>
          </View>

        </Content>
      </Container>
    );
  }
}
//Styles for UI
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor:'white',

    paddingRight: 20,
  },
  buttonContainer: {
    width: wp('95%'),
    alignSelf: 'baseline',
    marginBottom: 10,
    color: '#d2691e',
    //backgroundColor:'#fadbd8',
    marginLeft: 4,
  },
  signupButton: {


  },
  subcontainer: {
    flex: 2,
    flexDirection: 'row',

  },
  signUpText0: {
    fontSize: 15,

    paddingLeft: 20,
  },
  signUpText1: {
    fontSize: 16,

    paddingLeft: 10,
    fontWeight: 'bold'
  },

  signUpText00: {
    fontSize: 15,

    paddingLeft: 20,
  },
  signUpText11: {
    fontSize: 12,
    paddingTop: 10,

    color: 'black',
    paddingLeft: 10,
  },
  signUpText11email: {
    fontSize: 12,
    paddingTop: 10,

    color: 'black',
    paddingLeft: 10,
  },
  signUpText11mobile: {
    fontSize: 12,
    paddingTop: 10,
    //fontStyle: 'italic',
    color: 'black',
    paddingLeft: 10,
  },
  signUpText12: {
    fontSize: 15,
    paddingTop: 10,
    paddingBottom: 10,
    color: 'black',
    paddingLeft: 15,
  },

  signUpText000: {
    fontSize: 12,

    paddingBottom: 10,
    paddingLeft: 20,
  },
  signUpText111: {
    fontSize: 12,
    paddingBottom: 10,

    color: 'black',

    paddingLeft: -20,
  },
  end: {

    alignItems: 'flex-end',

  },
  end1: {
    flex: 1,

    justifyContent: 'space-between',

    flexDirection: 'row',
  },
  s: {
    justifyContent: 'center',

    // backgroundColor: '#ed7070',
    shadowOffset: { width: 50, height: 50 },
    alignItems: 'center',
    width: wp('40%'),
    height: hp('12%'),
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,

  },
  signUpText2: {
    fontSize: 15,
    paddingRight: 10,

    paddingLeft: 23,
    color: 'black',

    justifyContent: 'center',

  },
  signUpText02: {
    fontSize: 15,
    paddingRight: 10,

    paddingLeft: 23,
    color: 'red',
    paddingBottom: 10,

    justifyContent: 'center',

  },
  signUpText022: {
    fontSize: 15,

    paddingLeft: 23,
    color: 'green',
    paddingBottom: 10,

    justifyContent: 'center',

  },
  rowBack: {
    alignItems: 'center',
    backgroundColor: '#81def0',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 10,
},
rowFront: {
  alignItems: 'center',
  backgroundColor: '#81def0',
  flex: 1,
  flexDirection: 'row',
  justifyContent: 'space-between',
  paddingRight: 10,
},
  signUpText002: {
    fontSize: 12,

    paddingLeft: 23,

    paddingBottom: 10,

    justifyContent: 'center',

  },
  signUpText0002: {
    fontSize: 13,
    paddingRight: 45,

    paddingLeft: 23,

    paddingBottom: 10,

    justifyContent: 'center',

  },
  signUpText3: {

    paddingBottom: 10,
    paddingLeft: 23,
    fontSize: 15,

    paddingRight: 13,

    alignItems: 'center',
  },
  signUpText4: {
    paddingBottom: 10,
    paddingLeft: 20,

    fontSize: 15,
    alignItems: 'center',
  },


  signUpText33: {

    paddingBottom: 10,
    paddingLeft: 23,
    fontSize: 12,

    paddingRight: 35,

    alignItems: 'center',
  },
  signUpText44: {
    paddingBottom: 10,
    paddingLeft: 20,

    paddingTop: -10,

    fontSize: 12,
    alignItems: 'center',
  },

  signup: {

    color: "#FFF",
  },
  boxone: {
    flex: 1,
    marginTop: 5,

  },
  boxtwo: {
    flex: 1,

  },
  boxthree: {
    flex: 1,

  },
  box: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    position: 'relative',


  },

  signUpText: {
    fontSize: 20,
    justifyContent: 'center',


    color: 'white',
    alignSelf: 'center',
  },
  empstatusText: {
    fontSize: 12,
    paddingLeft: 23,
    paddingBottom: 10,
    justifyContent: 'center',
    // fontStyle: 'italic'

  },
  designationText: {
    fontSize: 12,
    paddingLeft: 23,
    paddingBottom: 10,
    //   fontWeight:'bold',
    justifyContent: 'center',

  },
});