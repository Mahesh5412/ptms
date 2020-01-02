/*
FileName:UserCompletedManageTasks.js
Version:1.0.0
Purpose:Getting the List of completedProjects and also verify the project by role
Devloper:Rishitha,Harsha,Mahesh
*/
import React, { Component } from 'react';
import { Left, Button, Container, Header, Content, Item, Input } from 'native-base';
import { Platform, TextInput, StyleSheet, Text, View, Dimensions, TouchableOpacity, FlatList, Image, Alert } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { API } from "../WebServices/RestClient";
import NetInfo from '@react-native-community/netinfo';
import Snackbar from 'react-native-snackbar';
import log from '../LogFile/Log';
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

import { Collapse, CollapseHeader, CollapseBody } from "accordion-collapse-react-native";



class ListItem extends React.Component {

  //to verify the main task 
  // to validate the user
  MaintaskVerify() {
    log("Info", "MaintaskVerify() method is used to give alert");
    const { item } = this.props;

    Alert.alert(
      'Alert..!',
      'Do you want to Verify Task',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        { text: 'OK', onPress: () => this.MaintaskVerification(item.taskid) },
      ],
      { cancelable: false },
    );

  }

  //verifying the main task 
  MaintaskVerification(maintaskid) {
    log("Info", "MaintaskVerification(maintaskid) method is used to verify maintask");
    AsyncStorage.getItem("cropcode", (err, res) => {
      const cropcode = res;
      NetInfo.fetch().then(state => {
        if (state.type == "none" || state.type == 'unknown') {
          console.log(state.type);
          Snackbar.show({
            title: 'No Internet Connection',
            backgroundColor: 'red',
            duration: Snackbar.LENGTH_LONG,
          });
        } else {
          fetch(API + 'manageMaintasks.php',
            {
              method: 'POST',
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                crop: cropcode,
                mainTaskId: maintaskid,
                action: 'verify'

              })
            })
            .then((response) => response.json())
            .then((responseJson) => {
              if (responseJson.status == 'True') {

              } else if (responseJson.status == 'false') {

                Alert.alert("you can not verify tasks untill subtasks are verified");
                log("Warn", "you can not verify tasks untill subtasks are verified");

              }
            })
            .catch((error) => {
              console.error(error);
              log("Error", "Maintask verification error");
            });
        }
      });
    });
  }

  render() {
    const { item } = this.props;

    return (
      <View>
        <Collapse style={styles.container}>
          <CollapseHeader style={styles.boxheader}>

            <View style={{ flexDirection: 'row' }}>
              <View style={{ flexDirection: 'row', width: wp('90%') }}>
                <Text style={styles.signUpText0} >Task:</Text>
                <Text style={styles.signUpText1} >{item.subTaskId} - {item.mainTaskTitle}</Text>
              </View>

            </View>




            {/* <View style={{ flexDirection: 'row', paddingRight: 25, paddingTop: 5 }}>
              <Text style={styles.signUpText4} >Project Title:</Text>
              <Text style={styles.signUpText3} >{item.mainTaskTitle}</Text>
            </View> */}




            <View style={styles.box1}>

              <View style={{ flexDirection: 'row', width: wp('75%') }}>
                <Text style={styles.signUpText00} >Title:</Text>
                <Text style={styles.signUpText11} >{item.taskTitle}</Text>
                {/* <Text style={styles.signUpText1} >{item.status}</Text> */}
              </View>
              <Text style={styles.signUpText02} >{item.status}</Text>


            </View>
          </CollapseHeader>

          <CollapseBody>


            <View style={{ flexDirection: 'row', paddingRight: 25, width: wp('90%') }}>
              <Text style={styles.signUpText44} >Description:</Text>
              <Text style={styles.signUpText33} >{item.subTaskDesc}</Text>
              {/* <Text style={styles.signUpText33} >{item.recipeNames}</Text> */}
            </View>


            <View style={styles.box1}>

              <View style={{ flexDirection: 'row', width: wp('35%') }}>
                <Text style={styles.signUpText000} >Target Time:</Text>
                <Text style={styles.signUpText111} >{item.targetDate}</Text>
                {/* <Text style={styles.signUpText1} >{item.date}</Text> */}
              </View>
              <Text style={styles.signUpText002} >Task Status:{item.taskStatus}%Completed</Text>


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
              <Text style={styles.signUpText44} >By:</Text>
              <Text style={styles.signUpText33} >{item.assignedBy}</Text>
              {/* <Text style={styles.signUpText33} >{item.recipeNames}</Text> */}
            </View>

            <View style={{ flexDirection: 'row', paddingRight: 25, }}>
              <Text style={styles.signUpText44} >Status:</Text>
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

              <View style={{ flexDirection: 'row', width: wp('50%') }}>
                <Text style={styles.signUpText000} >Dependency:</Text>
                <Text style={styles.signUpText1111} >{item.dependencyId}</Text>

                {/* <Text style={styles.signUpText1} >{item.date}</Text> */}
              </View>
              <Text style={styles.signUpText002} >Dependent:{item.dependencyTitle}</Text>

            </View>


            <View
              style={{
                borderBottomColor: '#C0C0C0',
                // borderBottomWidth: 0.2,
                marginBottom: 10,
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
      open: false,
      ProjectTitle: "",
      ProjectDescription: "",
      role: '',
      userToken: '',
      empData: [],
      dependencyData: [],
      subTask: '',
      description: '',
      days: '',
      time: '',
      modifyTask: 'modify',
      dependencyid: '',
      LevelId: '',

    }
    this.arrayholder = [];
  }
  handleTabFocus = () => {
    this.onRefresh();
  };
  //Get List Based o  Task Level
  GetLevel() {
    log("Info", "to get level no");
    AsyncStorage.getItem("levelno", (err, res) => {
      this.setState({ LevelId: res });

    });
  }

  componentDidMount() {
    log("Debug", "user completed manage tasks screen is loaded");
    // this.GetLevel();
    this.userCompletedMyTasks()
  }

  //to refresh the data in user completed main tasks
  onRefresh() {
    this.setState({
      dataSource: [],
    })
    this.userCompletedMyTasks();

  }



  componentWillReceiveProps(nextProps) {
    // console.log(nextProps);
    // console.log("re loading...........")
    // this.manageTasksCompleted();
  }


  //to get the all the user completed data list
  userCompletedMyTasks() {
    log("Info", "UserCompletedMyTask:userCompletedMyTasks() method is used to get completed my tasks at user side");
    AsyncStorage.getItem("cropcode", (err, res) => {
      const cropcode = res;

      AsyncStorage.getItem("empId", (err, res) => {
        const empId = res;

        AsyncStorage.getItem("emp_role", (err, res) => {
          const emp_role = res;
          //Checking the Internet Connection
          NetInfo.fetch().then(state => {
            if (state.type == "none" || state.type == 'unknown') {
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
                    userType: emp_role,
                    empId: empId
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
                    this.arrayholder = responseJson.data;
                  } else {
                    log("Info", "no completed my tasks at user side");
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
                  log("Error", "Error in getting of completed my tasks at user side");
                });

            }
          });

        });

      });

    });
  }

  _listEmptyComponent = () => {
    return (
      <View>
        <Text></Text>

      </View>
    )
  }

  //to filter the search data in search are 
  SearchFilterFunction(text) {
    log("Info", "UserCompletedMyTasks:SearchFilterFunction(text) for search functionality");
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
      // const timeLeft = item.timeLeft.toUpperCase()
      // const timeLeft1 = text.toUpperCase()
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
        // timeLeft.indexOf(timeLeft1) > -1 ||
        dependencyId.indexOf(dependencyId1) > -1 ||
        dependencyTitle.indexOf(dependencyTitle1) > -1

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
          <NavigationEvents
            onDidFocus={() => this.onRefresh()}
          />
          {/* <Icon name="ios-search" /> */}
          <Input placeholder="Search" onChangeText={(text) => this.SearchFilterFunction(text)} />
          <Icon name="search" size={20} />

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

  MainContainer:
  {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height
    // width: '90%',
    // paddingLeft: hp('2%'),
  },
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
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
    // paddingTop: 20,
    // fontWeight: 'bold',
    color: 'green',
    paddingLeft: 10,
    fontWeight: "bold",
  },
  signUpText1: {
    fontSize: 14,
    // paddingTop: 20,
    // fontWeight: 'bold',
    color: 'green',
    fontWeight: "bold",
    // paddingLeft: 23,
  },

  signUpText00: {
    fontSize: 14,
    // paddingTop: 20,
    // fontWeight: 'bold',
    // color: 'green',
    paddingLeft: 10,
  },
  signUpText11: {
    fontSize: 14,
    // paddingBottom: 10,
    width: wp('60%'),
    //  paddingTop: 20,
    // fontWeight: 'bold',
    color: '#000000',
    // fontWeight: "bold",
    // paddingLeft: 23,
  },
  signUpText000: {
    fontSize: 12,
    // paddingTop: 20,
    // fontWeight: 'bold',
    // color: 'green',
    // paddingBottom: 10,
    paddingLeft: 10,
  },
  signUpText111: {
    fontSize: 12,
    // paddingBottom: 10,
    //  paddingTop: 20,
    // fontWeight: 'bold',
    color: 'black',
    // paddingLeft: 23,
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
    paddingRight: 10,
    // paddingTop: 20,
    paddingLeft: 23,
    color: 'blue',
    //paddingBottom: 5,
    // fontWeight: 'bold',
    justifyContent: 'center',

  },
  signUpText002: {
    fontSize: 12,
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
    // paddingLeft: 23,
    fontSize: 14,
    // paddingRight:hp('-10%'),
    paddingRight: 13,
    // fontWeight: "bold",
    // fontWeight: 'bold',
    color: 'green',
    alignItems: 'center',
  },
  signUpText4: {
    //  paddingBottom: 5,
    paddingLeft: 10,
    // fontWeight: 'bold',
    //color: 'black',
    fontSize: 14,
    color: 'green',
    alignItems: 'center',
  },


  signUpText33: {

    // paddingBottom: 5,
    // paddingLeft: 23,
    fontSize: 12,
    // paddingRight:hp('-10%'),
    paddingRight: 13,
    // fontWeight: 'bold',
    // paddingTop: -15,
    alignItems: 'center',
  },
  signUpText44: {
    //paddingBottom: 5,
    paddingLeft: 10,
    // fontWeight: 'bold',
    // paddingTop: -15,
    //color: 'black',
    fontSize: 12,
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
    fontSize: 20,
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