/*
FileName:UserPendingMyTask.js
Version:1.0.0
Purpose:Getting the List of user pending my task list
Devloper:Rishitha,Naveen,Harsha,Mahesh 
*/

import React, { Component } from 'react';
import { ToastAndroid, Platform, StyleSheet, TextInput, Text, View, Dimensions, TouchableOpacity, FlatList, Image } from 'react-native';
import { Icon, Left, Button, Container, Header, Content, Item, Input } from 'native-base';
import AsyncStorage from '@react-native-community/async-storage';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import RadioGroup from 'react-native-radio-button-group';
import Modal from "react-native-simple-modal";
import { Collapse, CollapseHeader, CollapseBody } from "accordion-collapse-react-native";
import { API } from "../WebServices/RestClient";
import * as Progress from 'react-native-progress';
import NetInfo from '@react-native-community/netinfo';
import Snackbar from 'react-native-snackbar';
import Toast from 'react-native-whc-toast';
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

// var today = new Date();
// date=today.getDate() + "/"+ parseInt(today.getMonth()+1) +"/"+ today.getFullYear();
// console.log(date);

//alert(date);
class ListItem extends React.Component {


  //check Task active status 
  userActiveTaskStatusUpdate = () => {
    log("Info", "userActiveTaskStatusUpdate() method is used to check the active status of subtask");
    const { item } = this.props;
    const activeStatus = item.activeStatus;

    if (activeStatus == 0) {
      this.updateActiveTaskStatus();

    } else {

      alert("You can't update until your dependency task completed");

      log("Warn", "You can't update until your dependency task completed");
    }
  }

  // if dependency not exit this method will executes
  updateActiveTaskStatus = () => {
    log("Info", "updateActiveTaskStatus() method is used to make subtask as active");
    const { item, taskStatus, description, taskcompleteStatus, } = this.props;
    //Time();
    NetInfo.fetch().then(state => {
      if (state.type == "none") {
        console.log(state.type);
        Snackbar.show({
          title: 'No Internet Connection',
          backgroundColor: 'red',
          duration: Snackbar.LENGTH_LONG,
        });
      } else {
        AsyncStorage.getItem("cropcode", (err, res) => {
          const cropcode = res;
          AsyncStorage.getItem("empId", (err, res) => {
            const empId = res;
            fetch(API + 'manageSubtasks.php',
              {
                method: 'POST',
                headers: {
                  Accept: 'application/json',
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  crop: cropcode,
                  action: "activetask",
                  subtaskid: this.props.item.subTaskId,
                  empId: empId,
                })
              })
              .then((response) => response.json())
              .then((responseJson) => {
                if (responseJson.status === 'true') {
                  alert("Activated successfully");
                } else {

                  new Pending().onRefresh();

                  alert("You not able active this task untill complete your activated task");

                  log("Warn", "You not able active this task untill complete your activated task");
                }
              })
              .catch((error) => {
                console.error(error);
                log("Error", "Error in making subtask as active");
              });
          });
        });
      }
    });
  }

  render() {
    const { item } = this.props;

    console.log("datecurrent" + item.cDate)

    console.log("target date" + item.targetDate);

    var currentdate = new Date();
    var datetime = currentdate.getFullYear() + "-"
      + (currentdate.getMonth() + 1) + "-"
      + currentdate.getDate() + "  "
      + currentdate.getHours() + ":"
      + currentdate.getMinutes() + ":"
      + currentdate.getSeconds();
    // console.warn("date" + item.cDate + "update" + item.targetDate);
    //console.warn(datetime > item.targetDate);
    //console.warn("Numbers"+item.activeStatus);
    const radio1 = <RadioGroup
      options={[
        {
          id: '1',
          labelView: (
            <Text>
              <Text style={{ color: 'Green' }}></Text>
            </Text>
          ),
        },

      ]}
      activeButtonId={item.activeStatus}
      value={item.activeStatus}
      onChange={(options) => this.userActiveTaskStatusUpdate()}
    />
    const radio2 = <RadioGroup
      options={[
        {
          id: '0',
          labelView: (
            <Text>
              <Text style={{ color: 'white' }}></Text>
            </Text>
          ),
        },

      ]}
      activeButtonId={item.activeStatus}
      value={item.activeStatus}
      onChange={(options) => this.userActiveTaskStatusUpdate()}
    />

    return (

      <View>

        <Collapse style={[item.cDate >= item.targetDate ? styles.container : styles.container1]}>

          <CollapseHeader style={styles.boxheader}>
            {/* <CollapseHeader style={[item.timeLeft<0?styles.boxheader:styles.boxheader1]} > */}


            <View style={{ flexDirection: 'row' }}>
              <View style={{ flexDirection: 'row', width: wp('80%') }}>
                <Text style={styles.signUpText0} >Task:</Text>
                <Text style={styles.signUpText1} >  {item.subTaskId} -  {item.mainTaskTitle}</Text>
              </View>
              <View>
                <Text style={styles.signUpText02} >{item.status}  </Text>
              </View>

            </View>


            <View style={styles.box1}>
              <View style={{ flexDirection: 'row', width: wp('90%') }}>
                <Text style={styles.signUpText00} >Title:</Text>
                <Text style={styles.signUpText11} >{item.taskTitle}</Text>
              </View>
              <View>
                {item.activeStatus === 1 ? radio2 : radio1}


              </View>
            </View>

          </CollapseHeader>

          <CollapseBody>
            <View style={{ flexDirection: 'row', paddingRight: 25, }}>
              <Text style={styles.signUpText44} >Description : </Text>
              <Text style={styles.signUpText33} >{item.subTaskDesc}</Text>
            </View>
            <View style={styles.box1}>
              <View style={{ flexDirection: 'row', width: wp('52%') }}>
                <Text style={styles.signUpText000} >Target Time:</Text>
                <Text style={styles.signUpText111} >{item.targetDate}</Text>
              </View>
              <Text style={styles.signUpText002} >Task Status:{item.taskStatus}%Completed</Text>
            </View>
            <View style={styles.box1}>
              <View style={{ flexDirection: 'row' }}>
                <Text style={styles.signUpText000} >Assigned on :</Text>
                <Text style={styles.signUpText111} >{item.assignedDate}</Text>
              </View>
            </View>
            <View style={{ flexDirection: 'row', paddingRight: 25, }}>
              <Text style={styles.signUpText44} >By :</Text>
              <Text style={styles.signUpText33} >{item.assignedBy}</Text>
            </View>
            <View style={{ flexDirection: 'row', paddingRight: 25, }}>
              <Text style={styles.signUpText44} >Status:</Text>
              <Text style={styles.signUpText33} >{item.taskStatusDesc}</Text>
            </View>
            <View style={styles.box1}>
              <View style={{ flexDirection: 'row' }}>
                <Text style={styles.signUpText000} >TimeLeft:</Text>
                <Text style={styles.signUpText111} >{item.timeLeft}</Text>
              </View>
            </View>
            <View style={styles.box1}>
              <View style={{ flexDirection: 'row', width: wp('50%') }}>
                <Text style={styles.signUpText000} >Dependency:</Text>
                <Text style={styles.signUpText111} >{item.dependencyId}</Text>
              </View>
              <Text style={styles.signUpText002} >Dependent:{item.dependencyTitle}</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
              <TouchableOpacity onPress={this.props.RoadBlock} style={{ width: 20, backgroundColor: 'black' }}><Text style={{ color: '#fff', textAlign: 'center' }}>?</Text></TouchableOpacity>
              <TouchableOpacity onPress={() => this.props.openModal()} style={{ width: 130, backgroundColor: 'black', marginLeft: 10, }}><Text style={{ color: '#fff', textAlign: 'center' }}>UPDATE STATUS</Text></TouchableOpacity>
              <Icon size={22} style={{ paddingLeft: 10, paddingTop: 4 }} name="chatboxes" onPress={() => { this.props.TaskChat() }}></Icon>
            </View>
            <View
              style={{
                borderBottomColor: '#C0C0C0',
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
export default class Pending extends Component {
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
      description: '',
      taskcompleteStatus: '',
      activeStatus: '',
      error1: '',
      error2: '',
      date: ''
    }
    this.arrayholder = [];
  }
  handleTabFocus = () => {
    this.onRefresh();
  };
  //Dialog Actions start
  modalDidOpen = () => {
    AsyncStorage.getItem("role", (err, res) => {
      this.setState({ role: res });

    });
    AsyncStorage.getItem("userToken", (err, res) => {
      this.setState({ userToken: res });

    });

  }

  modalDidClose = () => {
    this.setState({ open: false });
  };

  moveUp = () => this.setState({ offset: -1200 });

  resetPosition = () => this.setState({ offset: 0 });

  openModal = (item, index) => {
    this.setState({ item: item });
    this.setState({ open: true });
  }
  //Dialog Actions end

  //Navigates to RoadBlock Screen
  RoadBlock(item, index) {
    log("Info", "UserPendingMyTasks:RoadBlock(item, index) used to navigate to RoadBlock")
    this.props.navigation.navigate("RoadBlocks", { subtaskid: item.subTaskId });
  }

  //Navigates to TaskChat Screen
  TaskChat(item, index) {
    log("Info", "UserPendingMyTasks:TaskChat(item, index) used to navigate to taskchat")
    this.props.navigation.navigate("TaskChat", { taskid: item.subTaskId, action: "subtask" });
  }

  //close the dialog
  closeModal = () => this.setState({
    open: false,
    taskcompleteStatus: '',
    error1: '', error2: '',
  });

  componentDidMount() {
    log("Debug", "user pending mytask tasks screen is loaded at user side");
    //to get the user pending my task list
    this.getdata();
  }

  //to refresh the pending my task list 
  onRefresh() {
    this.setState({
      dataSource: [],
    })
    this.getdata();

  }


  componentWillReceiveProps(nextProps) {
    //to get the user pending my task list
    this.getdata();
  }
  //Checking the Validations
  isValid() {
    const { taskcompleteStatus, description } = this.state;
    let valid = true;
    if (taskcompleteStatus.length === 0) {
      this.setState({ error1: 'Enter Status ' });
    }
    if (taskcompleteStatus.length === 0) {
      this.setState({ error1: 'Enter Status ' });
    }
    else if (description.length === 0) {
      this.setState({ error2: 'Enter Description', taskcompleteStatus: '', });
    }
    else {
      return valid;
    }
  }

  //to get the user pending my task list 
  getdata() {

    log("Info", "UserPendingMyTask:getdata() method is used to get pending my tasks at user side");
    AsyncStorage.getItem("cropcode", (err, res) => {
      const cropcode = res;
      AsyncStorage.getItem("empId", (err, res) => {
        const empId = res;
        AsyncStorage.getItem("emp_role", (err, res) => {
          const emp_role = res;
          //Checking the Internet Connections
          NetInfo.fetch().then(state => {
            if (state.type == "none") {
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
                    action: "pending",
                    userType: emp_role,
                    empId: empId
                  })
                })
                .then((response) => response.json())
                .then((responseJson) => {
                  //console.warn(JSON.stringify(responseJson))
                  if (responseJson.status === 'True') {
                    this.setState({
                      isLoading: false,
                      dataSource: responseJson.data,
                      isFetching: false
                    }, function () {
                    });
                    this.arrayholder = responseJson.data;
                  } else {
                    log("Info", "no pending my tasks at user side");
                    this.arrayholder = [];
                    this.setState({
                      isLoading: false,
                    })
                    Snackbar.show({
                      title: 'No Pending Subtasks',
                      backgroundColor: '#3BB9FF',
                      duration: Snackbar.LENGTH_LONG,
                    });
                  }

                })
                .catch((error) => {
                  console.error(error);
                  log("Error", "Error in getting of pending my tasks at user side");
                });
            }
          });
        });

      });

    });

  }

  //check dependency 
  userTaskUpdate = () => {
    log("Info", "UserPendingMyTask:userTaskUpdate() method is used to check dependency");
    const { item, } = this.state;
    const dependency = item.dependencyId;
    if (dependency == "NA") {
      this.updateStatus();
    } else {
      alert("You can't update until your dependency task completed");
    }
  }

  // if dependency not exit this method will executes
  updateStatus = () => {
    log("Info", "UserPendingMyTask:userTaskUpdate() method is used to update  pending subtasks tasks at user side");
    const { item, taskStatus, description, taskcompleteStatus } = this.state;
    //task completed status 
    if (taskcompleteStatus == 100) {
      this.setState({
        taskStatus: (Number(taskcompleteStatus)),
        taskcompleteStatus: (Number(taskcompleteStatus) / 100).toString(),
      })
    }
    else {
      this.setState({
        taskStatus: (Number(taskcompleteStatus) * 100)
      })
    }
    //Checking the Internet Connections
    NetInfo.fetch().then(state => {
      if (state.type == "none") {
        console.log(state.type);
        Snackbar.show({
          title: 'No Internet Connection',
          backgroundColor: 'red',
          duration: Snackbar.LENGTH_LONG,
        });
      } else {
        if (this.isValid()) {
          const taskcomplete = this.state.taskcompleteStatus;
          AsyncStorage.getItem("cropcode", (err, res) => {
            const cropcode = res;
            fetch(API + 'getSubtasks.php',
              {
                method: 'POST',
                headers: {
                  Accept: 'application/json',
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  crop: cropcode,
                  action: "update",
                  task_id: item.subTaskId,
                  dependencyId: item.dependencyId,
                  task_status: this.state.taskStatus,
                  task_status_desc: description,
                  task_complete_status: taskcomplete,
                  mainTaskId: item.mainTaskid,
                })

              })
              .then((response) => response.json())
              .then((responseJson) => {
                console.log(JSON.stringify(responseJson))

                if (responseJson.status === 'True') {
                  alert("Your Task is Updated Successfully");
                  this.getdata();//to get the user pending my task list

                  this.setState({
                    isLoading: false,
                    dataSource: responseJson.data,
                    isFetching: false
                  }, function () {
                  });

                } else {
                  log("Info", "no pending my tasks at user side");
                }

              })
              .catch((error) => {
                console.error(error);
                log("Error", "Error in getting of pending my tasks at user side");
              });
          });
          this.closeModal();
        }
      }
    });
  }

  move1(text) {
    if (Number(text) >= 1 && Number(text) <= 100) {
      let actionbar = Number(text / 100);
      return actionbar;
    }
    else {

      return alert("Status upto 100 % only"),
        this.setState({
          taskcompleteStatus: ''
        }),
        this.state.taskcompleteStatus;

    }
  }

  FlatListItemSeparator = () => {
    return (
      <View
        style={{
          width: "100%",
          backgroundColor: "#000",
        }}
      />
    );
  }

  _listEmptyComponent = () => {
    return (
      <View>
        <Text></Text>
      </View>
    )
  }

  //to filter the search data in search area
  SearchFilterFunction(text) {
    log("Info", "UserPendingMyTask:SearchFilterFunction(text) for search functionality");
    console.log(text);
    try {
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
        // const dependencyTitle = item.dependencyTitle.toUpperCase()
        // const dependencyTitle1 = text.toUpperCase()

        return subTaskId.indexOf(subTaskId1) > -1 ||
          mainTaskTitle.indexOf(mainTaskTitle1) > -1 ||
          taskTitle.indexOf(taskTitle1) > -1 ||
          subTaskDesc.indexOf(subTaskDesc1) > -1 ||
          targetDate.indexOf(targetDate1) > -1 ||
          taskStatus.indexOf(taskStatus1) > -1 ||
          assignedDate.indexOf(assignedDate1) > -1 ||
          assignedBy.indexOf(assignedBy1) > -1 ||
          timeLeft.indexOf(timeLeft1) > -1 ||
          dependencyId.indexOf(dependencyId1) > -1
        //   dependencyTitle.indexOf(dependencyTitle1) > -1

      })

      this.setState({
        dataSource: newData,
        text: text
      })
    }
    catch (error) {
      this.refs.toast.showBottom('No Results Found');
    }
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
      <View style={styles.MainContainer}>


        <Item>
          <NavigationEvents
            onDidFocus={() => this.onRefresh()}
          />
          <Input placeholder="Search"
            onChangeText={(text) => this.SearchFilterFunction(text)} />
          <Icon size={20} name="search" />
        </Item>
        <Toast ref="toast" />
        <View style={styles.end1}>

          <FlatList

            extraData={this.state}
            keyExtractor={this._keyExtractor}
            renderItem={this._renderItem}
            style={{ flex: 1, }}
            data={this.state.dataSource}
            onRefresh={() => this.onRefresh()}
            refreshing={this.state.isFetching}

            ItemSeparatorComponent={this.FlatListItemSeparator}
            renderItem={({ item, index }) =>
              // <View style={[item.timeLeft<0?styles.container1:styles.container]} >
              <View>
                <ListItem navigation={this.props.navigation}
                  item={item}
                  openModal={() => this.openModal(item, index)}
                  RoadBlock={() => this.RoadBlock(item, index)}//For Roadblock
                  TaskChat={() => this.TaskChat(item, index)}//For TaskLevel Chat
                />
              </View>
            }
            keyExtractor={item => item.id}
            ListEmptyComponent={this._listEmptyComponent}
          />
        </View>

        <Modal

          offset={this.state.offset}
          open={this.state.open}
          modalDidOpen={this.modalDidOpen}
          modalDidClose={this.modalDidClose}
          style={{ alignItems: "center", backgroundColor: 'white' }} >
          <View style={{ backgroundColor: 'white' }}>

            <View style={{ width: '100%', }}>

              <Text style={{ fontSize: 18, justifyContent: 'center', alignSelf: 'center', justifyContent: 'center' }}>UPDATE TASK STATUS</Text>
              <Text style={{ marginLeft: 10, marginTop: 15, }}>Enter task status percentage</Text>
              <View style={{ flexDirection: 'row',paddingTop:5 }}>
                <View >
                  <TextInput style={{ paddingTop: 15, marginLeft: 10, width:wp('10%'), height: hp('7%') , borderWidth: 0.6 }}
                    maxLength={3}
                    keyboardType={"numeric"}
                    value={this.state.taskcompleteStatus}
                    onChangeText={(text) => this.setState({ taskcompleteStatus: this.move1(text) })}>
                  </TextInput>

                  <Text style={{ color: 'red', marginLeft: 10 }}>{this.state.error1}</Text>

                </View>
                <View style={{ paddingTop: 10, marginLeft: 15, }}>
                  <Progress.Bar progress={this.state.taskcompleteStatus} width={250} height={15} color={'#00A2C1'} />
                  <Text>Enter 100 to  status update</Text>
                </View>
              </View>
              <TextInput placeholder="Enter Status" style={{ width: '90%', borderBottomWidth: 2, marginLeft: 10 }}
                onChangeText={(text) => this.setState({ description: text })}></TextInput>
              <Text style={{ color: 'red', marginLeft: 10 }}>{this.state.error2}</Text>
            </View>

            <View style={{justifyContent:'flex-start',marginLeft: 15,}}>
              <RadioGroup
                horizontal
                options={[
                  {
                    id: '100',
                    labelView: (
                      <View>
                        <Text style={{ color: 'black' }}>Task Complete Status
          </Text>
                      </View>
                    ),
                  },

                ]}
                //activeButtonId={'user'}
                circleStyle={{ fillColor: '#00A2C1', borderColor: 'black' }}
                onChange={(option) => this.setState({ taskcompleteStatus: option.id })}
              />
            </View>

            <View style={{ flexDirection: 'row', marginTop: 10, justifyContent: "space-between" }}>
              <TouchableOpacity style={styles.opensave} onPress={this.userTaskUpdate}>
                <Text style={{ color: 'white' }}>SAVE</Text>

              </TouchableOpacity>
              <TouchableOpacity style={styles.opencancel} onPress={this.closeModal}>
                <Text style={{ color: 'white' }}>CANCEL</Text>
              </TouchableOpacity>

            </View>

          </View>

        </Modal>



      </View>
    );
  }
}
const styles = StyleSheet.create({
  MainContainer:
  {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  container: {
    backgroundColor: '#ffcccc',
    paddingTop: 5,
    paddingRight: 20,
  },
  container1: {
    backgroundColor: '#ffffff',
    paddingTop: 5,
    paddingRight: 20,
  },
  buttonContainer: {
    width: wp('100%'),
    alignSelf: 'baseline',
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
    color: 'green',
    paddingLeft: 10,
    //fontWeight: "bold",
  },
  signUpText1: {
    fontSize: 14,
    color: 'green',
    // fontWeight: "bold",
  },

  signUpText00: {
    fontSize: 13,
    color: '#323233',
    paddingLeft: 10,

  },
  signUpText11: {
    fontSize: 13,
    // paddingBottom: 10,
    color: '#000000',
    //fontWeight: "bold",
    width: wp('55%')

  },
  signUpText000: {
    fontSize: 12,
    color: 'black',
    // paddingBottom: 10,
    paddingLeft: 10,
  },
  signUpText111: {
    fontSize: 12,
    // paddingBottom: 10,

    color: 'black',

    paddingLeft: -20,
    width: '65%'
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

    backgroundColor: '#ed7070',
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
    paddingLeft: 13,
    color: 'black',
    justifyContent: 'center',

  },
  signUpText02: {
    fontSize: 13,
    paddingRight: 5,
    color: 'red',
    paddingLeft: 13,

    // paddingBottom: 10,
    // fontWeight: 'bold',
  },
  signUpText022: {
    fontSize: 13,
    paddingLeft: 13,
    color: 'green',
    // paddingBottom: 10,
    justifyContent: 'center',

  },
  signUpText002: {
    fontSize: 13,
    paddingLeft: 12,
    // paddingBottom: 10,
    color: 'black'

  },
  signUpText0002: {
    fontSize: 13,
    paddingRight: 45,
    // paddingTop: 20,
    paddingLeft: 13,
    // color: 'red',
    // paddingBottom: 10,
    // fontWeight: 'bold',
    justifyContent: 'center',

  },
  signUpText3: {

    // paddingBottom: 10,
    // paddingLeft: 10,
    fontSize: 13,
    // paddingRight:hp('-10%'),
    paddingRight: 13,
    width: '70%',
    // fontWeight: "bold",
    alignItems: 'center',
    color: '#000000'
  },
  signUpText4: {
    // paddingBottom: 10,
    paddingLeft: 10,
    // fontWeight: 'bold',
    color: '#323233',
    fontSize: 13,
    alignItems: 'center',
  },


  signUpText33: {

    // paddingBottom: 10,
    // paddingLeft: 13,
    fontSize: 13,
    // paddingRight:hp('-10%'),
    paddingRight: 35,
    // fontWeight: 'bold',
    // paddingTop: -10,
    alignItems: 'center',
    width: wp('80%'),
    color: 'black'

  },
  signUpText44: {
    // paddingBottom: 10,
    paddingLeft: 10,
    // fontWeight: 'bold',
    paddingTop: -10,
    //color: 'black',
    fontSize: 13,
    alignItems: 'center',
    color: 'black'
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
    // marginBottom: 10,

  },
  box1: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    position: 'relative',
    // marginBottom: 10,
    paddingRight: 25,
  },
  signUpText: {
    fontSize: 20,
    justifyContent: 'center',


    color: 'white',
    alignSelf: 'center',
  },
  boxheader: {
    //  backgroundColor:'green',
    justifyContent: 'space-between',
    flexDirection: 'column',
    position: 'relative',
    //marginBottom: 15,

  },
  opencancel: {
    flex: 1,
    ...Platform.select({
      ios: {
        backgroundColor: 'red', margin: 20, height: 30, alignItems:
          "center", justifyContent: 'center'
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
