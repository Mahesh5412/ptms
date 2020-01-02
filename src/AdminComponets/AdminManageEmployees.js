/*
FileName:AdminManageEmployees.js
Version:1.0.0
Purpose:Employees List and Managing the employee like delete and tasks list of employee
Devloper:Santhosh,Naveen
*/
import React, { Component } from 'react';
import { Alert, Platform, Linking, StyleSheet, Text, FlatList, TouchableOpacity, Image, View, StatusBar, Dimensions } from 'react-native';
import { Title, Button, Container, Content, Header, Right, Left, Body, Tab, Tabs, Subtitle, TabHeading, Footer, Item, Input, FooterTab } from 'native-base';
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
// class ListItem extends React.Component {
//   render() {
//     const { item } = this.props;
//     return (

//       <View style={styles.container}>
//         <View style={styles.signup}>
//           <View style={[styles.buttonContainer, styles.signupButton]} >
//             <View style={styles.box}>
//               <View style={{ flexDirection: 'row' }}>
//                 <Text style={styles.signUpText1} >{item.name}</Text>
//               </View>
//               <Text style={styles.designationText}>{item.role}</Text>
//             </View>
//             {/* <View > */}
//             <View style={{ flexDirection: 'row', }}>
//               <Text style={styles.signUpText11}>Email : </Text>
//               <TouchableOpacity style={{ flexDirection: 'row' }}>
//                 <Icon name="envelope" style={{ color: 'red', marginLeft: 20, marginTop: 12 }} size={15}
//                   onPress={() => Linking.openURL('mailto:support@example.com')} />
//               </TouchableOpacity>
//               <Text style={styles.signUpText11email}
//                 onPress={() => Linking.openURL('mailto:support@example.com')}
//               >{item.email}</Text>

//               <TouchableOpacity style={{ alignSelf: 'flex-end', paddingTop: -50 }}
//                 onPress={() => this.props.navigation.navigate("AdminManageEmployeesTasks", {
//                   empId: item.id,
//                   name: item.name,
//                   mobile: item.mobileNumber,
//                   email: item.email,
//                   designation: item.designation,
//                   userName: item.userName,
//                   team: item.team,
//                   empStatus: item.empStatus,
//                   workingStatus: item.workingStatus,
//                   role: item.role
//                 })}>
//                 <Icon name="chevron-right" style={{ color: '#808080', }} size={15} />
//               </TouchableOpacity>

//             </View>
//             <View style={{ flexDirection: 'row' }}>
//               <Text style={styles.signUpText11}>Mobile : </Text>
//               <TouchableOpacity style={{ flexDirection: 'row' }}>
//                 <Icon name="phone" style={{ color: '#00FF00', marginLeft: 20, marginTop: 12 }} size={20}
//                   onPress={() => Communications.phonecall(item.mobileNumber, true)} />
//                 <Text style={styles.signUpText11mobile}
//                   //onPress={()=>{Linking.openURL('tel:${item.mobileNumber}');}}
//                   onPress={() => Communications.phonecall(item.mobileNumber, true)}
//                 >{item.mobileNumber}</Text>
//               </TouchableOpacity>
//             </View>
//             {/* <TouchableOpacity onPress={()=>this.props.deleteAction()} style={{alignSelf:'flex-end',paddingTop:-50}}>
//                 <Icon name="remove" style={{ color: 'black',}} size={15}
//                      />
//                 </TouchableOpacity> */}

//             <View
//               style={{
//                 borderBottomColor: '#C0C0C0',
//                 borderBottomWidth: 0.2,
//               }}
//             />



//           </View>



//           {/* </View> */}

//         </View>

//       </View>
//     )
//   }
// }
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
    this.state = {
      isLoading: true,
      dataSource: [],
      isFetching: false,
      result: '',
      empid: '',
      name: '',
      mobile: '',
      email: '',
      designation: '',
      userName: '',
      team: '',
      empStatus: '',
      action: '',
      role: '',
      workingStatus: ''

    }
    this.arrayholder = [];
  }

  handleTabFocus = () => {
    this.onRefresh();
  };
  componentDidMount() {
    log("Debug", "Employees list getting screen is loaded at admin side");
    this.getEmployeeList()
  }
  //refresh the list of employees
  onRefresh() {
    this.setState({
      dataSource:[],
    })
   this.getEmployeeList();
  }
  // componentWillReceiveProps(nextProps) {

  //   this.getEmployeeList();
  // }
  //Get Employee List 
  //Get Employee List start
  getEmployeeList() {
    log("Info", "UserManageEmployees:getEmployeeList() method is used to get employee list");
    AsyncStorage.getItem("cropcode", (err, res) => {
      const cropcode = res;

      AsyncStorage.getItem("empId", (err, res) => {
        const empId = res;


        AsyncStorage.getItem("emp_role", (err, res) => {
          const emp_role = res;

          NetInfo.fetch().then(state => {
            if (state.type == "none") {
              console.log(state.type);
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
                  console.log(responseJson);
                  console.log(JSON.stringify(responseJson))
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
                  log("Error", "error in getting employee list at admin side");
                });
            }
          });



        });

      });

    });



  }
  //Get Employee List end

  // delete Employee start
  deleteAction(item, index) {
    log("Info", "UserManageEmployees:deleteAction(item, index) method is used to give alert");
    Alert.alert(
      'Alert..!',
      'Do you want to delete Employee',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        { text: 'OK', onPress: () => this.deleteEmployee(item) },
      ],
      { cancelable: false },
    );
  }
  //delete Employee end

  //delete the Emmployee
  deleteEmployee = (item) => {
    log("Info", "UserManageEmployees:deleteEmployee() method is used to delete employee");
    AsyncStorage.getItem("cropcode", (err, res) => {
      const crop = res;
      NetInfo.fetch().then(state => {
        if (state.type == "none") {
          console.log(state.type);
          Snackbar.show({
            title: 'No Internet Connection',
            backgroundColor: 'red',
            duration: Snackbar.LENGTH_LONG,
          });
        } else {
          fetch(API + 'employeeDelete.php', {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              empid: item.id,
              crop: crop,
              action: 'delete',
            })
          }).then((response) => response.json())
            .then((responseJson) => {
              console.log(JSON.stringify(responseJson));
              console.log(responseJson);

              if (responseJson.status === 'True') {
                console.log("done")
                this.setState({ open: false })
                this.props.navigation.navigate('AdminManageEmployees');
              }
              else {
              }
            }).catch((error) => {
              console.error(error);
              log("Error", "error in employee deletion");
            });
        }
      });
    });
  };
  //Delete Employee end
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

  onItemDeleted = (empId) => {
    this.setState(prevState => {
      return {
        places: prevState.places.filter(place => {
          return place.empId !== empId;
        })
      }
    })
  }


  //if data is empty in flatlist we will use _listEmptyComponent method

  _listEmptyComponent = () => {
    return (
      <View>
        <Text></Text>

      </View>
    )
  }
  // Search Data start
  SearchFilterFunction(text) {
    log("Info", "UserManageEmployees:SearchFilterFunction(text) method is used for search functionality");
    console.log(text);

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
  // Search Data end 

  render() {
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

          <Icon name="bars" size={25} style={{ color: '#fff', paddingTop: 17 }} onPress={() =>
            this.props.navigation.toggleDrawer()} />
          <Body style={{ paddingLeft: 30, }}>
            <Title style={{ color: '#fff', fontWeight: '600' }}>Manage Employees</Title>
            <Subtitle></Subtitle>
          </Body>

          <Icon name="home" size={25} style={{ color: '#fff', paddingTop: 17 }} onPress={() =>
            this.props.navigation.navigate('AdminManageProjects')} />

        </Header>
        <Item>
        <NavigationEvents
            onDidFocus={() => this.onRefresh()}
          />
          <Input placeholder="Search"
            onChangeText={(text) => this.SearchFilterFunction(text)} />
          <Icon color={'#C0C0C0'} size={25} style={{ marginRight: 10 }} name="search" />
        </Item>

        <Content>


          <View style={styles.Container}>
            <View></View>
            <View >

            </View>
            <View style={styles.end1}>

              {/* <FlatList
                extraData={this.state}
                keyExtractor={this._keyExtractor}
                renderItem={this._renderItem}
                style={{ flex: 1, }}
                data={this.state.dataSource}
                onRefresh={() => this.onRefresh()}
                refreshing={this.state.isFetching}
                ItemSeparatorComponent={this.FlatListItemSeparator}
                renderItem={({ item, index }) =>
                  <View style={styles.container2} >
                    <ListItem
                      navigation={this.props.navigation}
                      item={item}
                      deleteAction={() => this.deleteAction(item, index)}//delete action for employee
                    />
                  </View>
                }
                keyExtractor={item => item.id}
                ListEmptyComponent={this._listEmptyComponent}
              /> */}
                <SwipeListView
            data={this.state.dataSource}
            onRefresh={() => this.onRefresh()}
            refreshing={this.state.isFetching}
            renderItem={(data, rowMap) => (
              <View style={styles.container}>
              <View style={styles.signup}>
                <View style={[styles.buttonContainer, styles.signupButton]} >
                  <View style={styles.box}>
                    <View style={{ flexDirection: 'row' }}>
                      <Text style={styles.signUpText1} >{data.item.name}</Text>
                    </View>
                    <Text style={styles.designationText}>{data.item.role}</Text>
                  </View>
                  {/* <View > */}
                  <View style={{ flexDirection: 'row', }}>
                    <Text style={styles.signUpText11}>Email : </Text>
                    <TouchableOpacity style={{ flexDirection: 'row' }}>
                      <Icon name="envelope" style={{ color: 'red', marginLeft: 20, marginTop: 12 }} size={15}
                        onPress={() => Linking.openURL('mailto:support@example.com')} />
                    </TouchableOpacity>
                    <Text style={styles.signUpText11email}
                      onPress={() => Linking.openURL('mailto:support@example.com')}
                    >{data.item.email}</Text>
      
                    <TouchableOpacity style={{ alignSelf: 'flex-end', paddingTop: -50 }}
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
                      <Icon name="chevron-right" style={{ color: '#808080', }} size={15} />
                    </TouchableOpacity>
      
                  </View>
                  <View style={{ flexDirection: 'row' }}>
                    <Text style={styles.signUpText11}>Mobile : </Text>
                    <TouchableOpacity style={{ flexDirection: 'row' }}>
                      <Icon name="phone" style={{ color: '#00FF00', marginLeft: 20, marginTop: 12 }} size={20}
                        onPress={() => Communications.phonecall(data.item.mobileNumber, true)} />
                      <Text style={styles.signUpText11mobile}
                        //onPress={()=>{Linking.openURL('tel:${item.mobileNumber}');}}
                        onPress={() => Communications.phonecall(data.item.mobileNumber, true)}
                      >{data.item.mobileNumber}</Text>
                    </TouchableOpacity>
                  </View>
                  {/* <TouchableOpacity onPress={()=>this.props.deleteAction()} style={{alignSelf:'flex-end',paddingTop:-50}}>
                      <Icon name="remove" style={{ color: 'black',}} size={15}
                           />
                      </TouchableOpacity> */}
      
                  <View
                    style={{
                      borderBottomColor: '#C0C0C0',
                      borderBottomWidth: 0.2,
                    }}
                  />
      
      
      
                </View>
      
      
      
                {/* </View> */}
      
              </View>
      
            </View>
            )}
            renderHiddenItem={ (data, rowMap) => (
              <View style={styles.rowBack}>
              <Text>{data.item.empStatus}</Text> 
              <Text>{data.item.empStatus}</Text> 
          </View>
            )}
            leftOpenValue={75}
            rightOpenValue={-75}
        />
            </View>
          </View>
        </Content>
        <View style={{ height: hp('10%') }}></View>
        <TouchableOpacity onPress={() => this.props.navigation.navigate("AddUser")} style={styles.bottomView}>

          <View style={styles.bottomView} >
            <Text style={styles.textStyle}>  Add Employee</Text>
          </View>
        </TouchableOpacity>
      </Container>
    );
  }
}
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


    marginLeft: 4,


  },
  signupButton: {


  },
  subcontainer: {
    flex: 2,
    flexDirection: 'row',

  },
  signUpText0: {
    fontSize: 13,

    paddingLeft: 20,
  },
  signUpText1: {
    fontSize: 13,
    width: '80%',
    paddingLeft: 10,
    fontWeight: 'bold'
  },

  signUpText00: {
    fontSize: 13,

    paddingLeft: 20,
  },
  signUpText11: {
    fontSize: 13,
    paddingTop: 10,

    color: 'black',
    paddingLeft: 10,
  },
  signUpText11email: {
    fontSize: 13,
    paddingTop: 10,
    width: wp('65%'),
    color: 'black',
    paddingLeft: 10,
  },
  signUpText11mobile: {
    fontSize: 13,
    paddingTop: 10,
    fontStyle: 'italic',
    color: 'black',
    paddingLeft: 10,
  },
  signUpText12: {
    fontSize: 13,
    paddingTop: 10,
    paddingBottom: 10,
    color: 'black',
    paddingLeft: 15,
  },
  signUpText000: {
    fontSize: 13,

    paddingBottom: 10,
    paddingLeft: 20,
  },
  signUpText111: {
    fontSize: 13,
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
    fontSize: 13,
    paddingRight: 10,

    paddingLeft: 23,
    color: 'black',

    justifyContent: 'center',

  },
  signUpText02: {
    fontSize: 13,
    paddingRight: 10,

    paddingLeft: 23,
    color: 'red',
    paddingBottom: 10,

    justifyContent: 'center',

  },
  rowBack: {
    alignItems: 'center',
    backgroundColor: '#81def0',
    textAlign:'center',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 15,
},
  signUpText022: {
    fontSize: 13,

    paddingLeft: 23,
    color: 'green',
    paddingBottom: 10,

    justifyContent: 'center',

  },
  signUpText002: {
    fontSize: 13,

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
    fontSize: 13,

    paddingRight: 13,

    alignItems: 'center',
  },
  signUpText4: {
    paddingBottom: 10,
    paddingLeft: 20,

    fontSize: 13,
    alignItems: 'center',
  },


  signUpText33: {

    paddingBottom: 10,
    paddingLeft: 23,
    fontSize: 13,

    paddingRight: 35,

    alignItems: 'center',
  },
  signUpText44: {
    paddingBottom: 10,
    paddingLeft: 20,

    paddingTop: -10,

    fontSize: 13,
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
    fontSize: 13,
    justifyContent: 'center',


    color: 'white',
    alignSelf: 'center',
  },
  empstatusText: {
    fontSize: 13,
    paddingLeft: 23,
    paddingBottom: 10,
    justifyContent: 'center',
    // fontStyle: 'italic'

  },
  designationText: {
    fontSize: 13,
    paddingLeft: 23,
    paddingBottom: 10,
    //   fontWeight:'bold',
    justifyContent: 'center',

  },

  bottomView: {
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'absolute',
    height: FOOTER_MAX_HEIGHT,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'black',
    alignItems: 'center'
  },
  textStyle: {

    color: '#fff',
    paddingLeft: 5,
    paddingRight: 5,
    backgroundColor: '#00A2C1',
    fontSize: 22,
    marginLeft: 5,
    borderRadius: 5

  },
});
