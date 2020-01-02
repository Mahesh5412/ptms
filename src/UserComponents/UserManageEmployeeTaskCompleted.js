/*
FileName:AdminManageEmployeesTaskCompleted.js
Version:1.0.0
Purpose:Shows the list of Emloyees completed tasks
Devloper:Rishitha,Harsha
*/
import React, { Component } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import { Platform, StyleSheet, Text, View, Dimensions, TouchableOpacity, FlatList, Image, Alert } from 'react-native';
import { Icon, Left, Button, Container, Header, Content, Item, Input } from 'native-base';
import { Collapse, CollapseHeader, CollapseBody } from "accordion-collapse-react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
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
              <Text style={styles.signUpText0} >Task_No: </Text>
              <Text style={styles.signUpText1} >{item.subTaskId}</Text>
              {/* <Text style={styles.signUpText1} >{item.date}</Text> */}
            </View>
            {/* <Text style={styles.signUpText2} >{item.date}</Text> */}



            <View style={{ flexDirection: 'row', paddingRight: 25, }}>
              <Text style={styles.signUpText4} >Project Title:</Text>
              <Text style={styles.signUpText3} >{item.mainTaskTitle}</Text>
            </View>




            <View style={styles.box1}>

              <View style={{ flexDirection: 'row' }}>
                <Text style={styles.signUpText00} >Task Title:</Text>
                <Text style={styles.signUpText11} >{item.taskTitle}</Text>
                {/* <Text style={styles.signUpText1} >{item.status}</Text> */}
              </View>
              <Text style={styles.signUpText02} >{item.status}</Text>


            </View>
          </CollapseHeader>

          <CollapseBody>


            <View style={{ flexDirection: 'row', paddingRight: 25, }}>
              <Text style={styles.signUpText44} >Description:</Text>
              <Text style={styles.signUpText33} > {item.subTaskDesc}</Text>
              {/* <Text style={styles.signUpText33} >{item.recipeNames}</Text> */}
            </View>


            <View style={styles.box1}>

              <View style={{ flexDirection: 'row',width:wp('50%') }}>
                <Text style={styles.signUpText000} >Target Time:</Text>
                <Text style={styles.signUpText111} >{item.targetDate}</Text>
                {/* <Text style={styles.signUpText1} >{item.date}</Text> */}
              </View>
              <Text style={styles.signUpText002} >Status:{item.taskStatus}</Text>


            </View>
            <View style={styles.box1}>

              <View style={{ flexDirection: 'row' }}>
                <Text style={styles.signUpText000} >Assigned on:</Text>
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

            <View style={{ flexDirection: 'row', paddingRight: 25, }}>
              <Text style={styles.signUpText44} >Task status Description:</Text>
              <Text style={styles.signUpText33} >{item.taskStatusDesc}</Text>
              {/* <Text style={styles.signUpText33} >{item.recipeNames}</Text> */}
            </View>

            <View style={styles.box1}>

              <View style={{ flexDirection: 'row' }}>
                <Text style={styles.signUpText000} >Extra Hours:</Text>
                <Text style={styles.signUpText111} >{item.extraHours}</Text>
                {/* <Text style={styles.signUpText1} >{item.date}</Text> */}
              </View>
              {/* <Text style={styles.signUpText002} >Updated On:0000-00-00 00:00:00 </Text> */}

            </View>


            <View style={styles.box1}>

              <View style={{ flexDirection: 'row' }}>
                <Text style={styles.signUpText000} >Dependency:</Text>
                <Text style={styles.signUpText111} >{item.dependencyId}</Text>
                {/* <Text style={styles.signUpText1} >{item.date}</Text> */}
              </View>
              <Text style={styles.signUpText002} >Dependent:{item.dependencyTitle}</Text>

            </View>


            <View
              style={{
                borderBottomColor: '#C0C0C0',
                borderBottomWidth: 0.2,
              }}
            />



          </CollapseBody>

        </Collapse>
        <View style={{ backgroundColor: '#fff', height: 5 }}>
          </View>
      </View>
    )
  }
}
export default class Completed extends Component {
  constructor(props) {

    super(props);
    this.state = {
      isLoading: true,
      dataSource: [],
      isFetching: false,
      result: '',
      empId: '',
    }
    this.arrayholder = [];
  }


  componentDidMount() {
    log("Debug", "user Manageemployee view completed tasks screen is loaded");
    this.getEmployeeSubTasksCompleted()
  }
  //Refresh the list
  onRefresh() {
    this.getEmployeeSubTasksCompleted() ;
  }



  componentWillReceiveProps(nextProps) {
    console.log(nextProps);
    console.log("re loading...........")
    this.getEmployeeSubTasksCompleted();
  }

  //gettting getEmployeeSubTasksCompleted
  getEmployeeSubTasksCompleted() {
    log("Info", "UserManageEmployeeTaskCompleted:getEmployeeSubTasksCompleted() method is used to get employee completed tasks");
    AsyncStorage.getItem("cropcode", (err, res) => {
      const cropcode = res;

      AsyncStorage.getItem("empId", (err, res) => {
        const empId = res;

        AsyncStorage.getItem("emp_role", (err, res) => {
          const emp_role = res;

          //Checking the Internet Connection
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
                    action: "completed",
                    empId: this.props.navigation.state.params.empId,
                  })
                })
                .then((response) => response.json())
                .then((responseJson) => {
                  console.log(responseJson);
                  // Alert.alert("status"+responseJson.status);
                  if (responseJson.status === 'True') {
                    console.log(JSON.stringify(responseJson))
                    this.setState({
                      isLoading: false,
                      dataSource: responseJson.data,
                      isFetching: false
                    }, function () {
                    });
                    this.arrayholder = responseJson.data;
                  } else {
                    log("Info", "no completed employee tasks in usermanageemployeecompleted at user side");
                    this.arrayholder = [];
                    this.setState({
                      isLoading: false,
                    })
                    Snackbar.show({
                      title: 'No Completed Subtasks',
                      backgroundColor: '#3BB9FF',
                      duration: Snackbar.LENGTH_LONG,
                    });
                  }

                })
                .catch((error) => {
                  console.error(error);
                  log("Error", "Error in getting employee completed tasks at user side");
                });
            }
          });



        });

      });

    });

  }
  //Seperate the list data
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
  //for Empty data
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

  //Search the task based on id,taskname,description,and user
  SearchFilterFunction(text) {
    log("Info", "userManageEmployeeTaskCompleted:SearchFilterFunction(text) used for searching functionality");
    console.log(text);
    const newData = this.arrayholder.filter(function (item) {
      const subTaskId = item.subTaskId.toUpperCase()
      const subTaskId1 = text.toUpperCase()
      const mainTaskTitle = item.mainTaskTitle.toUpperCase()
      const mainTaskTitle1 = text.toUpperCase()

      const taskTitle = item.taskTitle.toUpperCase()
      const taskTitle1 = text.toUpperCase()
      const subTaskDesc = item.subTaskDesc.toUpperCase()
      const subTaskDesc1 = text.toUpperCase()
      const targetDate = item.targetDate.toUpperCase()
      const targetDate1 = text.toUpperCase()
      const taskStatus = item.taskStatus.toUpperCase()
      const taskStatus1 = text.toUpperCase()
      const assignedDate = item.assignedDate.toUpperCase()
      const assignedDate1 = text.toUpperCase()
      const assignedBy = item.assignedBy.toUpperCase()
      const assignedBy1 = text.toUpperCase()
      const timeLeft = item.timeLeft.toUpperCase()
      const timeLeft1 = text.toUpperCase()
      const dependencyId = item.dependencyId.toUpperCase()
      const dependencyId1 = text.toUpperCase()
      const dependencyTitle = item.dependencyTitle.toUpperCase()
      const dependencyTitle1 = text.toUpperCase()

      return subTaskId.indexOf(subTaskId1) > -1 ||
        mainTaskTitle.indexOf(mainTaskTitle1) > -1 ||

        taskTitle.indexOf(taskTitle1) > -1 ||
        subTaskDesc.indexOf(subTaskDesc1) > -1 ||
        targetDate.indexOf(targetDate1) > -1 ||
        taskStatus.indexOf(taskStatus1) > -1 ||
        assignedDate.indexOf(assignedDate1) > -1 ||
        assignedBy.indexOf(assignedBy1) > -1 ||
        timeLeft.indexOf(timeLeft1) > -1 ||
        dependencyId.indexOf(dependencyId1) > -1 ||
        dependencyTitle.indexOf(dependencyTitle) > -1

    })
    this.setState({
      dataSource: newData,
      text: text
    })
  }


  render() {
    if (this.state.isLoading) {
      return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <DotIndicator color='#00A2C1' />
        </View>
      );
    }
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
    //  paddingTop: 15,
    // justifyContent:'center',
    // alignItems:'center',
    paddingLeft: hp('1%'),
  },
  buttonContainer: {
    width: wp('95%'),
    alignSelf: 'baseline',
    marginBottom: 10,
    color: '#d2691e',
    // backgroundColor:'#c0c0c0',
    // justifyContent:'center',
    // alignItems:'center',
    // borderWidth: 0.4,
    // borderRadius: 15,
    marginLeft: 4,
    // shadowOffset : { width: 50, height: 50 },
    // shadowColor: Platform.OS ==='ios' ? null: 'black',
    // shadowOpacity: 9,
    //elevation: 7,

  },
  signupButton: {
    //shadowOpacity: 13,
    //  backgroundColor: '#ffffff',

    // shadowColor: '#141615',

  },
  subcontainer: {
    flex: 2,
    flexDirection: 'row',
    //paddingTop: 40
  },
  signUpText0: {
    fontSize: 14,

    // fontWeight: 'bold',
    color: 'green',
    paddingLeft: 10,
  },
  signUpText1: {
    fontSize: 14,
    // paddingTop: 20,
    // fontWeight: 'bold',
    color: 'green',
    paddingLeft: 10,
  },

  signUpText00: {
    fontSize: 14,
    paddingLeft: 10,
    color: 'black',
  },
  signUpText11: {
    fontSize: 14,
    // paddingBottom: 10,
    color: 'black',
    width: '55%',
    // fontWeight: 'bold',
    // paddingLeft: 10,
  },
  signUpText000: {
    fontSize: 14,
    // paddingTop: 20,
    // fontWeight: 'bold',
    color: 'black',
    paddingLeft: 10,
  },
  signUpText111: {
    fontSize: 14,
    // paddingBottom: 5,
    //  paddingTop: 20,
    // fontWeight: 'bold',
    color: 'black',
     paddingLeft: 2,
  },
  end: {

    alignItems: 'flex-end',

  },
  end1: {
    flex: 1,
    // paddingTop: 20,
    justifyContent: 'space-between',

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
    //   paddingTop: 20,
    paddingLeft: 23,
    color: 'black',

    // fontWeight: 'bold',
    justifyContent: 'center',

  },
  signUpText02: {
    fontSize: 14,

    color: 'blue',
    // paddingBottom: 5,
    paddingRight: 10,
    // fontWeight: 'bold',
    justifyContent: 'center',

  },
  signUpText002: {
    fontSize: 14,
    paddingRight: 10,
    // paddingTop: 20,
    paddingLeft: 23,
    // color: 'red',
    // paddingBottom: 5,
    // fontWeight: 'bold',
    justifyContent: 'center',

  },
  signUpText3: {

    // paddingBottom: 5,
     paddingLeft: 2,
    fontSize: 14,
    // fontWeight: 'bold',
    // paddingRight:hp('-10%'),
    paddingRight: 13,

    alignItems: 'center',
  },
  signUpText4: {
    // paddingBottom: 5,
    paddingLeft: 10,
    fontSize: 14,
    color: 'black',
    alignItems: 'center',
  },


  signUpText33: {


    paddingLeft: 2,
    fontSize: 14,
    width: '80%',
    paddingRight: 13,
    // fontWeight: 'bold',
    paddingTop: -15,
    alignItems: 'center',
  },
  signUpText44: {
    // paddingBottom: 5,
    paddingLeft: 10,


    color: 'black',
    fontSize: 14,
    alignItems: 'center',
  },

  signup: {
    //paddingTop:20,
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
    marginBottom: 5,

  },
  box1: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    position: 'relative',
    // marginBottom: 10,

  },
  signUpText: {
    fontSize: 14,
    justifyContent: 'center',


    color: 'white',
    alignSelf: 'center',
  },
  boxheader: {
    justifyContent: 'space-between',
    flexDirection: 'column',
    position: 'relative',
    marginBottom: 5,

  },
});
