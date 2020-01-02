/*
FileName:AdminManageEmployeetaskPending.js
Version:1.0.0
Purpose:Shows the list of maintask list
Devloper:Rishitha,Harsha
*/
import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, Dimensions, TouchableOpacity, FlatList, Image } from 'react-native';
import { Icon, Left, Button, Container, Header, Content, Item, Input } from 'native-base';
import AsyncStorage from '@react-native-community/async-storage';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Collapse, CollapseHeader, CollapseBody } from "accordion-collapse-react-native";
import { API } from "../WebServices/RestClient";
import NetInfo from '@react-native-community/netinfo';
import Snackbar from 'react-native-snackbar';
import log from '../LogFile/Log';
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

class ListItem extends React.Component {
  render() {
    const { item } = this.props;
    return (

      <View>
        <Collapse style={styles.container}>



          <CollapseHeader style={styles.boxheader}>


            <View style={{ flexDirection: 'row' }}>
              <Text style={styles.signUpText0} >Task_no :</Text>
              <Text style={styles.signUpText1} >{item.subTaskId}</Text>
              {/* <Text style={styles.signUpText1} >{item.date}</Text> */}
            </View>
            {/* <Text style={styles.signUpText2} >{item.date}</Text> */}




            {/* <View style={{ flexDirection: 'row', paddingRight: 25, }}>
              <Text style={styles.signUpText4} >Project Title:</Text>
              <Text style={styles.signUpText3} >{item.projectitle}</Text>
            </View> */}

            <View style={styles.box1}>

              <View style={{ flexDirection: 'row' }}>
                <Text style={styles.signUpText00} >Project Title:</Text>
                <Text style={styles.signUpText11} >{item.mainTaskTitle}</Text>
                {/* <Text style={styles.signUpText1} >{item.date}</Text> */}
                <Text style={{ fontWeight: 'bold', color: '#00FF00' }}>verified</Text>
              </View>
              {/* <Text style={styles.signUpText022} >{item.assignedDate} </Text> */}


            </View>


            <View style={styles.box1}>

              <View style={{ flexDirection: 'row' }}>
                <Text style={styles.signUpText00} >Task Title:</Text>
                <Text style={styles.signUpText11} >{item.taskTitle}</Text>
                {/* <Text style={styles.signUpText1} >{item.date}</Text> */}
              </View>
              {/* <Text style={styles.signUpText002} >0</Text> */}


            </View>

          </CollapseHeader>
          <CollapseBody>



            <View style={{ flexDirection: 'row', paddingRight: 35, }}>
              <Text style={styles.signUpText44} >Description</Text>
              <Text style={styles.signUpText33} >{item.subTaskDesc}</Text>
              {/* <Text style={styles.signUpText33} >{item.recipeNames}</Text> */}
            </View>


            <View style={styles.box1}>

              <View style={{ flexDirection: 'row', paddingRight: 35,width:wp('55%') }}>
                <Text style={styles.signUpText000} >Target Time:</Text>
                <Text style={styles.signUpText111} >{item.targetDate}</Text>
                {/* <Text style={styles.signUpText1} >Task Status:0% completed</Text>  */}
              </View>
              <View styles={{ paddingRight: 40 }}>
                <Text style={styles.signUpText111} >Task Status:{item.taskStatus}% completed </Text>
              </View>

            </View>
            <View style={styles.box1}>

              <View style={{ flexDirection: 'row' }}>
                <Text style={styles.signUpText000} >Assigned On:</Text>
                <Text style={styles.signUpText111} >{item.assignedDate}</Text>
                {/* <Text style={styles.signUpText1} >{item.date}</Text> */}
              </View>
              {/* <Text style={styles.signUpText002} >Assigned By:Rishitha </Text> */}


            </View>

            <View style={{ flexDirection: 'row', paddingRight: 25, }}>
              <Text style={styles.signUpText44} >Assigned By:</Text>
              <Text style={styles.signUpText33} >{item.assignedBy}</Text>
              {/* <Text style={styles.signUpText33} >{item.recipeNames}</Text> */}
            </View>


            <View style={styles.box1}>

              <View style={{ flexDirection: 'row', width: wp('50%'), paddingRight: 50, }}>
                <Text style={styles.signUpText000} >Time Left:</Text>
                <Text style={styles.signUpText111} >{item.timeLeft}</Text>
                {/* <Text style={styles.signUpText1} >{item.date}</Text> */}
              </View>
              {/* <Text style={styles.signUpText000} >Updated On:{item.taskEndDate} </Text> */}

            </View>


            <View style={styles.box1}>

              <View style={{ flexDirection: 'row',width:('6u0%') }}>
                <Text style={styles.signUpText000} >Dependency:</Text>
                <Text style={styles.signUpText111} >{item.dependencyId}</Text>
                {/* <Text style={styles.signUpText1} >{item.date}</Text> */}
              </View>
              <Text style={styles.signUpText002} >Dependent:{item.dependencyTitle}</Text>

            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
              {/* <TouchableOpacity style={{ width: 20, backgroundColor: 'black' }}><Text style={{ color: '#fff', textAlign: 'center' }}>?</Text></TouchableOpacity>
              <TouchableOpacity style={{ width: 130, backgroundColor: 'black', marginLeft: 10, }}><Text style={{ color: '#fff', textAlign: 'center' }}>UPDATE STATUS</Text></TouchableOpacity>
              <TouchableOpacity style={{ width: 120, backgroundColor: '#6cbb3f', marginLeft: 10, }}><Text style={{ color: '#fff', textAlign: 'center' }}>VIEW SUB TASK</Text></TouchableOpacity> */}

            </View>


          </CollapseBody>

        </Collapse>
        <View style={{ backgroundColor: '#fff', height: 5 }}>
          </View>
      </View>
    )
  }
}
export default class Verified extends Component {
  constructor(props) {

    super(props);
    this.state = {
      isLoading: true,
      dataSource: [],
      isFetching: false,
      result: '',
      empid: ''
    }
  }


  componentDidMount() {
    log("Debug", "Admin Manageemployee view verified tasks screen is loaded");
    this.getEmployeesPendingTaskList()
  }

  //Refresh The data 
  onRefresh() {
this.getEmployeesPendingTaskList() ;
  }



  componentWillReceiveProps(nextProps) {

    this.getEmployeesPendingTaskList();
  }
  //Getting the employee pending maintask list start
  getEmployeesPendingTaskList() {
    log("Info", "AdminManageEmployeeTaskVerified:getEmployeesPendingTaskList() method is used to get employee verified tasks");
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
              fetch(API + 'getSubtasks.php',
                {
                  method: 'POST',
                  headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    crop: cropcode,
                    action: "verified",
                    userType: emp_role,
                    empId: this.props.navigation.state.params.empId
                  })
                })
                .then((response) => response.json())
                .then((responseJson) => {
                  console.log(responseJson);
                  console.log(JSON.stringify(responseJson))
                  if (responseJson.status === 'True') {
                    this.setState({
                      isLoading: false,
                      dataSource: responseJson.data,
                      isFetching: false
                    }, function () {
                    });
                  } else {
                    this.setState({
                      isLoading: false,
                    })
                    Snackbar.show({
                      title: 'No Verified Subtasks',
                      backgroundColor: '#3BB9FF',
                      duration: Snackbar.LENGTH_LONG,
                    });
                  }
                })
                .catch((error) => {
                  console.error(error);
                  log("Error", "Error in getting employee verified tasks at admin side");
                });
            }
          });
        });

      });

    });



  }
  //Getting the employee pending maintask list end

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


  //if data is empty in flatlist we will use _listEmptyComponent method

  _listEmptyComponent = () => {
    return (
      <View>
        <Text></Text>
        {/* <Image
          style={{ width: '100%', height: 200 }}
          source={{ uri: 'https://cdn.dribbble.com/users/2370289/screenshots/6150406/no_items_found.jpg' }} /> */}

      </View>
    )
  }


  render() {

    return (
      <Container style={{ height: Dimensions.get('window').height }}>
        <Item>
          {/* <Icon name="ios-search" /> */}
          <Input placeholder="Search" />
          <Icon name="ios-search" />

        </Item>
        <Content>


          <View style={styles.Container}>
            <View></View>
            <View >

            </View>
            <View style={styles.end1}>

              <FlatList
                // data={this.props.data}
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
                      item={item}

                    />
                  </View>
                }
                keyExtractor={item => item.id}
                ListEmptyComponent={this._listEmptyComponent}
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

    paddingRight: 20,
  },
  buttonContainer: {
    width: wp('95%'),
    alignSelf: 'baseline',
    marginBottom: 10,
    color: '#d2691e',
    backgroundColor: '#fadbd8',

    marginLeft: 4,


  },
  signupButton: {


  },
  subcontainer: {
    flex: 2,
    flexDirection: 'row',

  },
  signUpText0: {
    fontSize: 14,

    // fontWeight: 'bold',
    color: 'green',
    paddingLeft: 10,
  },
  signUpText1: {
    fontSize: 14,

    // fontWeight: 'bold',
    color: 'green',

  },

  signUpText00: {
    fontSize: 14,
    color: 'black',
    paddingLeft: 10,
  },
  signUpText11: {
    fontSize: 14,
    color: 'black',
    width: '65%'
  },
  signUpText000: {
    fontSize: 14,
    paddingLeft: 10,
    color: 'black',
  },
  signUpText111: {
    fontSize: 14,
    paddingLeft: -20,
     paddingTop:2,
    },
  end: {

    alignItems: 'flex-end',

  },
  end1: {
    flex: 1,
    //  paddingTop: 20,

    flexDirection: 'row',
  },
  s: {
    justifyContent: 'center',

    backgroundColor: '#ed7070',
    shadowOffset: { width: 50, height: 50 },
    alignItems: 'center',
    width: wp('40%'),
    height: hp('12%'),
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,

  },
  signUpText2: {
    fontSize: 14,
    paddingRight: 10,

    paddingLeft: 23,
    color: 'black',


    justifyContent: 'center',

  },
  signUpText02: {
    fontSize: 14,
    paddingRight: 10,

    paddingLeft: 23,
    color: 'red',

    justifyContent: 'center',

  },
  signUpText022: {
    fontSize: 14,

    paddingLeft: 23,
    color: 'green',


    justifyContent: 'center',

  },
  signUpText002: {




    justifyContent: 'center',

  },
  signUpText0002: {
    fontSize: 14,
    justifyContent: 'center',

  },
  signUpText3: {

    paddingLeft: 23,
    fontSize: 15,
    alignItems: 'center',
  },
  signUpText4: {

    paddingLeft: 20,

    fontSize: 14,
    alignItems: 'center',
  },

  signUpText33: {


   // paddingLeft: 23,
    fontSize: 14,
    // paddingRight:hp('-10%'),
    paddingRight: 35,
    // fontWeight: 'bold',
     paddingTop: 2,
    alignItems: 'center',
  },
  signUpText44: {

    paddingLeft: 10,

    // paddingTop: -10,
    color: 'black',
    fontSize: 14,
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
  box1: {

    flexDirection: 'row',
    position: 'relative',

    paddingRight: 25,
  },
  signUpText: {
    fontSize: 14,
    justifyContent: 'center',


    color: 'white',
    alignSelf: 'center',
  },
  boxheader: {

    flexDirection: 'column',
    position: 'relative',


  },
});