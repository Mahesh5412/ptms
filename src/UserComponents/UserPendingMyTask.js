/*
FileName:UserPendingMyTask.js
Version:1.0.0
Purpose:Getting the List of user pending my task list
Devloper:Rishitha,Harsha,Mahesh 
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
  //check Task active status 
  userActiveTaskStatusUpdate = () => {
    const { item } = this.props;
    const activeStatus = item.activeStatus;

    if (activeStatus == 0) {
      this.updateActiveTaskStatus();

    } else {
      alert("You can't update until your dependency task completed");
    }
  }
  // if dependency not exit this method will executes
  updateActiveTaskStatus = () => {
    const { item, taskStatus, description, taskcompleteStatus, } = this.props;

    console.log(item.taskid);
    console.log(taskStatus);
    console.log(description);
    console.log(taskcompleteStatus);
    // alert(this.props.item.subTaskId);
    //alert(item.mainTaskid);
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
            fetch(API + 'managesubtasks.php',
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
                console.log(responseJson);
                //alert(JSON.stringify(responseJson))

                if (responseJson.status === 'true') {

                  alert("Activated successfully");

                } else {
                  alert("You not able active this task untill complete your activated task");

                }


              })
              .catch((error) => {
                console.error(error);
              });
          });
        });
      }
    });
  }
  render() {
    const { item } = this.props;
    return (
      <View>
        <Collapse style={styles.container}>
          <CollapseHeader style={styles.boxheader}>

            <View style={{ flexDirection: 'row' }}>
              <Text style={styles.signUpText0} >Task_no:</Text>
              <Text style={styles.signUpText1} >{item.subTaskId}</Text>
            </View>

            <View style={{ flexDirection: 'row', paddingRight: 25, paddingTop: 10 }}>
              <Text style={styles.signUpText4} >Project Title:</Text>
              <Text style={styles.signUpText3} >{item.mainTaskTitle}</Text>
              <Text style={styles.signUpText02} >{item.status}  </Text>



            </View>

            <View style={styles.box1}>

              <View style={{ flexDirection: 'row', width: wp('90%') }}>
                <Text style={styles.signUpText00} >Task Title:</Text>
                <Text style={styles.signUpText11} >{item.taskTitle}</Text>
                <View style={{ paddingLeft: 60 }}>
                  <RadioGroup

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
                    // circleStyle={{ fillColor: 'black', borderColor: 'black' }} 
                    onChange={(options) => this.userActiveTaskStatusUpdate()}

                  // onChange={(options) => this.setState({ workingStatus: options.id })}
                  />
                </View>
              </View>
            </View>

          </CollapseHeader>

          <CollapseBody>
            <View style={{ flexDirection: 'row', paddingRight: 25, }}>
              <Text style={styles.signUpText44} >Description : </Text>
              <Text style={styles.signUpText33} >{item.subTaskDesc}</Text>
            </View>


            {/* <View style={styles.box1}>

              <View style={{ flexDirection: 'row' }}>
                <Text style={styles.signUpText000} >Target Time :</Text>
                <Text style={styles.signUpText111} >{item.targetDate}</Text>
              </View>
              <Text style={styles.signUpText002} >Task Status:{item.taskStatus}%completed</Text>



            </View> */}
            <View style={styles.box1}>

              <View style={{ flexDirection: 'row', width: wp('52%') }}>
                <Text style={styles.signUpText000} >Target Time:</Text>
                <Text style={styles.signUpText111} >{item.targetDate}</Text>
                {/* <Text style={styles.signUpText1} >{item.date}</Text> */}
              </View>
              <Text style={styles.signUpText002} >Task Status:{item.taskStatus}%Completed</Text>


            </View>

            <View style={styles.box1}>

              <View style={{ flexDirection: 'row' }}>
                <Text style={styles.signUpText000} >Assigned on :</Text>
                <Text style={styles.signUpText111} >{item.assignedDate}</Text>
                {/* <Text style={styles.signUpText1} >{item.date}</Text> */}
              </View>
              {/* <Text style={styles.signUpText002} >Assigned By:Rishitha </Text> */}


            </View>

            <View style={{ flexDirection: 'row', paddingRight: 25, }}>
              <Text style={styles.signUpText44} >Assigned By :</Text>
              <Text style={styles.signUpText33} >{item.assignedBy}</Text>
              {/* <Text style={styles.signUpText33} >{item.recipeNames}</Text> */}
            </View>

            <View style={{ flexDirection: 'row', paddingRight: 25, }}>
              <Text style={styles.signUpText44} >Task status Description :</Text>
              <Text style={styles.signUpText33} >{item.taskStatusDesc}</Text>
              {/* <Text style={styles.signUpText33} >{item.recipeNames}</Text> */}
            </View>

            <View style={styles.box1}>

              <View style={{ flexDirection: 'row' }}>
                <Text style={styles.signUpText000} >Extra Hours:</Text>
                <Text style={styles.signUpText111} >{item.timeLeft}</Text>
                {/* <Text style={styles.signUpText1} >{item.date}</Text> */}
              </View>
              {/* <Text style={styles.signUpText002} >Updated On:0000-00-00 00:00:00 </Text> */}

            </View>


            <View style={styles.box1}>

              <View style={{ flexDirection: 'row', width: wp('50%') }}>
                <Text style={styles.signUpText000} >Dependency:</Text>
                <Text style={styles.signUpText111} >{item.dependencyId}</Text>
                {/* <Text style={styles.signUpText1} >{item.date}</Text> */}
              </View>
              <Text style={styles.signUpText002} >Dependent:{item.dependencyTitle}</Text>

            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
              <TouchableOpacity onPress={this.props.RoadBlock} style={{ width: 20, backgroundColor: 'black' }}><Text style={{ color: '#fff', textAlign: 'center' }}>?</Text></TouchableOpacity>
              <TouchableOpacity onPress={() => this.props.openModal()} style={{ width: 130, backgroundColor: 'black', marginLeft: 10, }}><Text style={{ color: '#fff', textAlign: 'center' }}>UPDATE STATUS</Text></TouchableOpacity>
              {/* <TouchableOpacity style={{ width: 120, backgroundColor: '#6cbb3f', marginLeft: 10, }}><Text style={{ color: '#fff', textAlign: 'center' }}>VIEW SUB TASK</Text></TouchableOpacity> */}
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
export default class Pending extends Component {
  constructor(props) {

    super(props);
    this.state = {
      isLoading: true,
      dataSource: [],
      isFetching: false,
      result: '',
      description: '',
      taskcompleteStatus: '',
      error1: '',
      error2: ''


    }
    this.arrayholder = [];
  }

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
    // this.setState({ taskcompleteStatus: 0,
    // error1:'',error2:'',
    //  })

  };

  moveUp = () => this.setState({ offset: -1200 });

  resetPosition = () => this.setState({ offset: 0 });

  openModal = (item, index) => {
    console.log(item.subTaskId);
    console.log(index);
    this.setState({ item: item });
    this.setState({ open: true });
  }

  RoadBlock(item, index) {
    this.props.navigation.navigate("RoadBlocks", { subtaskid: item.subTaskId });
  }


  closeModal = () => this.setState({
    open: false,
    taskcompleteStatus: '',
    error1: '', error2: '',
  });


  componentDidMount() {

    this.getdata()

  }

  //to refresh the pending my task list 
  onRefresh() {
    this.setState({ isFetching: true }, function () { this.getdata() });
  }



  componentWillReceiveProps(nextProps) {
    console.log(nextProps);
    console.log("re loading...........")
    this.getdata();
  }

  isValid() {
    const { taskcompleteStatus, description } = this.state;
    let valid = true;
    console.log(taskcompleteStatus);

    if (taskcompleteStatus.length === 0) {

      this.setState({ error1: 'Enter Status ' });
    }
    else if (description.length === 0) {

      this.setState({ error2: 'Enter Description', taskcompleteStatus: '', });
    }

    else {
      // valid = true;
      return valid;
    }
    //return valid;
  }

  //to get the user pending my task list 
  getdata() {

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

              fetch(API + 'get_subtasks.php',
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
                  if (responseJson.status === 'True') {
                    
                  this.setState({
                    isLoading: false,
                    dataSource: responseJson.data,
                    isFetching: false
                  }, function () {
                  });
                }else{
                  this.setState({
                    isLoading: false,
                  })
                  Snackbar.show({
                    title: 'No Pending Subtasks',
                    backgroundColor: '#3BB9FF',
                    duration: Snackbar.LENGTH_LONG,
                  });
                }
                  this.arrayholder = responseJson.data;
                })
                .catch((error) => {
                  console.error(error);
                });
            }
          });
        });

      });

    });

  }
  //check dependency 
  userTaskUpdate = () => {
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
    console.log(item.taskid);
    console.log(taskStatus);
    console.log(description);
    console.log(taskcompleteStatus);
    // alert("taskcompleteStatus"+taskcompleteStatus);
    //alert(item.mainTaskid);
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
          //  alert(this.state.taskStatus+"     "+this.state.taskcompleteStatus)
          AsyncStorage.getItem("cropcode", (err, res) => {
            const cropcode = res;

            fetch(API + 'get_subtasks.php',
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
                console.log(responseJson);
                console.log(JSON.stringify(responseJson))

                if (responseJson.status === 'True') {
                  
                  this.getdata();

                  this.setState({
                    isLoading: false,
                    dataSource: responseJson.data,
                    isFetching: false
                  }, function () {
                  });

                } else {

                }

              })
              .catch((error) => {
                console.error(error);
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

      return alert("Status upto 100 % only");
    }
  }


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



  _listEmptyComponent = () => {
    return (
      <View>
        <Text></Text>


      </View>
    )
  }


  //to filter the search data in search area
  SearchFilterFunction(text) {
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
          <Input placeholder="Search"
            onChangeText={(text) => this.SearchFilterFunction(text)} />
          <Icon size={20} name="search" />
        </Item>


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
                <ListItem navigation={this.props.navigation}
                  item={item}
                  openModal={() => this.openModal(item, index)}
                  RoadBlock={() => this.RoadBlock(item, index)}
                />
              </View>
            }
            keyExtractor={item => item.id}
            ListEmptyComponent={this._listEmptyComponent}
          />
        </View>


        {/* <View style={styles.MainContainer}> */}


        <Modal
          offset={this.state.offset}
          open={this.state.open}
          modalDidOpen={this.modalDidOpen}
          modalDidClose={this.modalDidClose}
          style={{ alignItems: "center", backgroundColor: 'white' }} >
          <View style={{ alignItems: "center", backgroundColor: 'white' }}>

            <View style={{ width: '100%', }}>
              <Text style={{ fontSize: 25, justifyContent: 'center', alignSelf: 'center', justifyContent: 'center' }}>Update Task Status</Text>
              <Text style={{ marginLeft: 10, marginTop: 15 }}>Enter task status percentage</Text>
              <View style={{ flexDirection: 'row' }}>
                <View >
                  <TextInput style={{ paddingTop: 10, marginLeft: 10, width: 80, height: '35%', borderWidth: 0.6 }}
                    value={this.state.taskcompleteStatus}
                    onChangeText={(text) => this.setState({ taskcompleteStatus: this.move1(text) })}>
                  </TextInput>

                  <Text style={{ color: 'red', marginLeft: 10 }}>{this.state.error1}</Text>



                  {/* <Text style={{ color: '#00A2C1' }}> status:%1$s</Text> */}
                </View>
                <View style={{ paddingTop: 10, marginLeft: 15, }}>
                  <Progress.Bar progress={this.state.taskcompleteStatus} width={200} height={15} />
                  <Text>Enter 100 to  status update</Text>
                </View>
              </View>
              <TextInput placeholder="Enter Status" style={{ width: '90%', borderBottomWidth: 2, marginLeft: 10 }}
                onChangeText={(text) => this.setState({ description: text })}></TextInput>
              <Text style={{ color: 'red', marginLeft: 10 }}>{this.state.error2}</Text>
            </View>

            <View style={{ justifyContent: 'center', marginLeft: 20 }}>
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
                circleStyle={{ fillColor: 'black', borderColor: 'black' }}
                onChange={(option) => this.setState({ taskcompleteStatus: option.id })}
              />
            </View>

            <View style={{ flexDirection: 'row', marginTop: 10 }}>
              <TouchableOpacity style={{
                margin: 5, backgroundColor: 'red', padding: 19, height: 30, alignItems:
                  "center", justifyContent: 'center'
              }} onPress={this.closeModal}>
                <Text style={{ color: 'white' }}>CANCEL</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{
                margin: 5, backgroundColor: 'green', padding: 20, height: 30, alignItems:
                  "center", justifyContent: 'center'
              }} onPress={this.userTaskUpdate}>
                <Text style={{ color: 'white' }}>SAVE</Text>

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
    //width: '90%',
    // paddingLeft: hp('0%'),
    // paddingRight: 20,
  },
  container: {
    //flex: 1,
    backgroundColor: '#f8f8f8',
    paddingTop: 5,
    // justifyContent:'center',
    // alignItems:'center',
    // paddingLeft: hp('-1%'),
    paddingRight: 20,
  },
  buttonContainer: {
    width: wp('100%'),
    alignSelf: 'baseline',
    //  marginBottom: 10,
    color: '#d2691e',
    backgroundColor: '#fadbd8',
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
    // paddingTop: 40
  },
  signUpText0: {
    fontSize: 13,
    //paddingTop: 20,
    // fontWeight: 'bold',
    color: 'green',
    paddingLeft: 10,
    fontWeight: "bold",
  },
  signUpText1: {
    fontSize: 13,
    // paddingTop: 20,
    // fontWeight: 'bold',
    color: 'green',
    fontWeight: "bold",
    // paddingLeft: 13,
  },

  signUpText00: {
    fontSize: 13,
    // paddingTop: 20,
    // fontWeight: 'bold',
    color: '#c0c0c0',
    //  paddingBottom:20,
    paddingLeft: 10,

  },
  signUpText11: {
    fontSize: 13,
    paddingBottom: 10,
    //  paddingTop: 20,
    // fontWeight: 'bold',
    color: '#000000',
    // paddingLeft: 23,
    fontWeight: "bold",
    width: wp('55%')

  },
  signUpText000: {
    fontSize: 12,
    // paddingTop: 20,
    // fontWeight: 'bold',
    color: '#c0c0c0',
    paddingBottom: 10,
    paddingLeft: 10,
  },
  signUpText111: {
    fontSize: 12,
    paddingBottom: 10,

    color: 'black',

    paddingLeft: -20,
    width: '55%'
  },
  end: {

    alignItems: 'flex-end',

  },
  end1: {
    flex: 1,
    //  paddingTop: 20,
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
    //  paddingTop: 20,
    paddingLeft: 13,
    color: 'black',

    // fontWeight: 'bold',
    justifyContent: 'center',

  },
  signUpText02: {
    fontSize: 13,
    paddingRight: 5,
    // paddingTop: 20,
    color: 'red',
    paddingBottom: 10,
    fontWeight: 'bold',
    // justifyContent: 'center',

  },
  signUpText022: {
    fontSize: 13,
    //paddingRight: 10,
    // paddingTop: 20,
    paddingLeft: 13,
    color: 'green',
    paddingBottom: 10,
    // fontWeight: 'bold',
    justifyContent: 'center',

  },
  signUpText002: {
    fontSize: 13,
    //paddingRight: 35,
    // paddingTop: 20,
    paddingLeft: 13,
    // color: 'red',
    paddingBottom: 10,
    // fontWeight: 'bold',

    color: '#194D33'

  },
  signUpText0002: {
    fontSize: 13,
    paddingRight: 45,
    // paddingTop: 20,
    paddingLeft: 13,
    // color: 'red',
    paddingBottom: 10,
    // fontWeight: 'bold',
    justifyContent: 'center',

  },
  signUpText3: {

    paddingBottom: 10,
    // paddingLeft: 10,
    fontSize: 13,
    // paddingRight:hp('-10%'),
    paddingRight: 13,
    width: '70%',
    fontWeight: "bold",
    alignItems: 'center',
    color: '#000000'
  },
  signUpText4: {
    paddingBottom: 10,
    paddingLeft: 10,
    // fontWeight: 'bold',
    color: '#c0c0c0',
    fontSize: 13,
    alignItems: 'center',
  },


  signUpText33: {

    paddingBottom: 10,
    // paddingLeft: 13,
    fontSize: 13,
    // paddingRight:hp('-10%'),
    paddingRight: 35,
    // fontWeight: 'bold',
    // paddingTop: -10,
    alignItems: 'center',
    width: wp('80%'),
    color: '#194D33'

  },
  signUpText44: {
    paddingBottom: 10,
    paddingLeft: 10,
    // fontWeight: 'bold',
    paddingTop: -10,
    //color: 'black',
    fontSize: 14,
    alignItems: 'center',
    color: '#c0c0c0'
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
});
