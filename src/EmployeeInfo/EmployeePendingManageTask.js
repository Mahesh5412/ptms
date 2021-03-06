/*
FileName:UserPendingManageTask.js
Version:1.0.0
Purpose:Getting the List of user pending manage tasks list 
Devloper:Rishitha,Naveen,Mahesh
*/

import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, TextInput, Dimensions, TouchableOpacity, FlatList, Image, Alert } from 'react-native';
import { Icon, Left, Button, Container, Header, Content, Item, Input } from 'native-base';
import AsyncStorage from '@react-native-community/async-storage';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Modal from "react-native-simple-modal";
import SearchableDropdown from 'react-native-searchable-dropdown';
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
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
    }
  }
  render() {
    const { item } = this.props;

    return (
      <View>
        <Collapse style={[item.cDate >= item.targettime ? styles.container : styles.container1]}>

          <CollapseHeader style={styles.boxheader}>

            <View style={{ flexDirection: 'row' }}>
              <Text style={styles.signUpText0} >#TASK ID:</Text>
              <Text style={styles.signUpText1} >{item.taskid}</Text>
              {/* <Text style={styles.signUpText1} >{item.date}</Text> */}
            </View>
            {/* <Text style={styles.signUpText2} >{item.date}</Text> */}




            <View style={{ flexDirection: 'row', paddingRight: 25, }}>
              <Text style={styles.signUpText4} >Project Title:</Text>
              <Text style={styles.signUpText3} >{item.projectitle}</Text>
            </View>


            <View style={styles.box1}>

              <View style={{ flexDirection: 'row' }}>
                <Text style={styles.signUpText00} >Task Title:</Text>
                <Text style={styles.signUpText11} >{item.tasktitle}</Text>
                {/* <Text style={styles.signUpText1} >{item.date}</Text> */}
              </View>
              <Text style={styles.signUpText02} >Pending </Text>


            </View>
          </CollapseHeader>

          <CollapseBody>


            <View style={{ flexDirection: 'row', paddingRight: 35, }}>
              <Text style={styles.signUpText44} >Description</Text>
              <Text style={styles.signUpText33} >{item.taskdescription}</Text>
              {/* <Text style={styles.signUpText33} >{item.recipeNames}</Text> */}
            </View>


            <View style={styles.box1}>

              <View style={{ flexDirection: 'row', paddingRight: 35, width: wp('50%') }}>
                <Text style={styles.signUpText44} >Target Time:</Text>
                <Text style={styles.signUpText33} >{item.targettime}</Text>
              </View>
              <View styles={{ paddingRight: 40 }}>
                <Text style={styles.signUpText111} >Task Status:{item.taskStatus}% completed </Text>
              </View>

            </View>
            <View style={styles.box1}>

              <View style={{ flexDirection: 'row', width: wp('50%') }}>
                <Text style={styles.signUpText44} >Assigned To:</Text>
                <Text style={styles.signUpText33} >{item.assigntto}</Text>
                {/* <Text style={styles.signUpText1} >{item.date}</Text> */}
              </View>
              <Text style={styles.signUpText002} >Assigned By:{item.assignby} </Text>


            </View>

            <View style={{ flexDirection: 'row', paddingRight: 25, }}>
              <Text style={styles.signUpText44} >Assigned On:</Text>
              <Text style={styles.signUpText33} >{item.assignedon}</Text>
              {/* <Text style={styles.signUpText33} >{item.recipeNames}</Text> */}
            </View>


            <View style={styles.box1}>

              <View style={{ flexDirection: 'row', width: wp('45%'), paddingRight: 50, }}>
                <Text style={styles.signUpText44} >Time Left:</Text>
                <Text style={styles.signUpText33} >{item.timeLeft}</Text>
                {/* <Text style={styles.signUpText1} >{item.date}</Text> */}
              </View>
              <Text style={styles.signUpText000} >Updated On:{item.taskEndDate} </Text>

            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', marginBottom: 5 }}>
              {/* <TouchableOpacity style={{ width: 50, backgroundColor: 'red', marginLeft: 10, }}><Text style={{ color: '#fff', textAlign: 'center' }}>Delete</Text></TouchableOpacity> */}
              <TouchableOpacity style={{ width: 90, backgroundColor: 'black', marginLeft: 10, }} onPress={() => this.props.AddSubTask()}><Text style={{ color: '#fff', textAlign: 'center', fontSize: 13 }}>Add Subtask</Text></TouchableOpacity>
              <TouchableOpacity style={{ width: 110, backgroundColor: '#00A2C1', marginLeft: 10, }} onPress={() => this.props.Module()}>
                <Text style={{ color: '#fff', textAlign: 'center', fontSize: 13 }}>View Subtask</Text></TouchableOpacity>
              <TouchableOpacity onPress={this.props.ModifyMaintask} style={{ width: 50, backgroundColor: 'black', marginLeft: 10, }}><Text style={{ color: '#fff', textAlign: 'center', fontSize: 13 }}>Modify</Text></TouchableOpacity>
              <Icon size={22} style={{ paddingLeft: 10, paddingTop: 4 }} name="chatboxes" onPress={() => { this.props.TaskChat() }}></Icon>
            </View>


          </CollapseBody>
        </Collapse>

        <View style={{ backgroundColor: '#fff', height: 5 }}>

        </View>
      </View>
    )
  }
}


export default class EmployeePendingManageTask extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      dataSource: [],
      isFetching: false,
      open: false,
      ProjectTitle: "",
      ProjectDescription: "",
      role: this.props.navigation.state.params.emp_role,
      userToken: this.props.navigation.state.params.empId,
      empData: [],
      dependencyData: [],

      subTask: '',
      description: '',
      days: '',
      time: '',
      modifyTask: 'modify',
      dependencyid: 'NA',
      person: '',
      LevelId: ''
    };
    this.arrayholder = [];
  }

  //Getting the Levels
  GetLevel() {
    log("Info", "to get level no");
    AsyncStorage.getItem("levelno", (err, res) => {
      const level = res;
      // alert(level)
      this.setState({
        LevelId: level
      });
      //  alert(typeof(this.state.LevelId));
    });

  }

  componentDidMount() {
    log("Debug", "user pending manage tasks screen is loaded");
    this.UserPendingManagetasks();
    //this.GetLevel();

  }

  componentWillMount() {

    this.UserPendingManagetasks();
    //this.GetLevel();
  }

  //Navigates to TaskChat Screen
  TaskChat(item, index) {
    log("Info", "UserPendingManageTasks:TaskChat(item, index) used to navigate to taskchat");
    this.props.navigation.navigate("TaskChat", { taskid: item.taskid, action: "maintask" });
  }

  //to refresh the pending manage tasks list 
  onRefresh() {
    { this.UserPendingManagetasks() };
  }
  componentWillReceiveProps(nextProps) {
    this.UserPendingManagetasks();
  }

  //UserPendingManagetasks Getting
  UserPendingManagetasks() {
    log("Info", "userPendingManageTasks:DeleteMaintask(maintaskid) method is used to delete maintask");
    AsyncStorage.getItem("cropcode", (err, res) => {
      const cropcode = res;

      AsyncStorage.getItem("empId", (err, res) => {
        //const empId = res;


        AsyncStorage.getItem("emp_role", (err, res) => {
          //const emp_role = res;
          AsyncStorage.getItem("nodays", (err, res) => {
            const ptime = res;
            //Checking the Internet Connection
            NetInfo.fetch().then(state => {
              if (state.type == "none") {
                console.log(state.type);
                Snackbar.show({
                  title: 'No Internet Connection',
                  backgroundColor: '#3BB9FF',
                  duration: Snackbar.LENGTH_LONG,
                });
              } else {


                fetch(API + 'getManageMaintasks.php',
                  {
                    method: 'POST',
                    headers: {
                      Accept: 'application/json',
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      crop: cropcode,
                      action: "pending",
                      userType: this.state.role,
                      empId: this.state.userToken
                    })
                  })
                  .then((response) => response.json())
                  .then((responseJson) => {
                    console.log(responseJson);
                    let viewitemsList = [];
                    // if (this.state.isLoading) {
                      // return (
                      //   <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                      //     <DotIndicator color='#283B53' />
                      //   </View>
                      // );


                      if (responseJson.status === 'true')
                      // alert(JSON.stringify(responseJson.data[0].ptime));
                      {
                       // isLoading: false

                        for (let i = 0; i < JSON.stringify(responseJson.data.length); i++) {

                          let time = JSON.stringify(responseJson.data[i].ptime) / 24;
                          let comparetime = Number(ptime);
                          let countTime = Math.round(time);
                          if (comparetime > 0) {
                            if (countTime === comparetime) {
                              console.log("intoo for");
                              viewitemsList.push(responseJson.data[i]);
                              this.setState({
                                // alert(JSON.stringify(responseJson.data[i]));
                                isLoading: false,
                                dataSource: viewitemsList,

                                isFetching: false
                              },

                                function () {


                                });
                              this.arrayholder = viewitemsList;

                            }
                            // else{
                            //   alert('no data on this days');
                            // }
                          }
                          else {
                            log("Info", "no pending manage tasks at user side");
                            console.log("else ptime");
                            this.setState({
                              isLoading: false,
                              dataSource: responseJson.data,
                              isFetching: false
                            },
                              function () {

                              });
                            this.arrayholder = responseJson.data;

                          }
                        }

                      } else {

                        console.log("else" + responseJson.status);
                        this.setState({ isLoading: false });
                        Snackbar.show({
                          title: 'No Pending Maintasks',
                          backgroundColor: '#3BB9FF',
                          duration: Snackbar.LENGTH_LONG,
                        });
                      }

                    // }
                  })

                  .catch((error) => {
                    console.error(error);
                    log("Error", "error in  pending manage tasks at user side");
                  });
              }
            });
          });
        });
      });

    });
  }


  //Modify Maintask
  ModifyMaintask(item, index) {
    log("Info", "UsrePendingManageTasks:ModifyMaintask(item, index) used to navigate to modify maintask screen");
    const { modifyTask } = this.state;
    this.props.navigation.navigate("AddTask", { maintaskid: item.taskid, IdeaId: item.ideano, modifyTask: modifyTask });

  }
  // Navigate to Add or Modify Subtask
  AddSubTask(item, index) {
    log("Info", "UsrePendingManageTasks:AddSubTask(item, index) used to navigate to modify addsubtask screen");
    this.props.navigation.navigate('AddSubTaskModal', { action: 'modify', moduleId: item.moduleId, taskid: item.taskid });

  }
  //Seperate the list data
  FlatListItemSeparator = () => {
    return (
      <View
        style={{
          width: "100%",
          backgroundColor: "red",
        }}
      />
    );
  }
  //Navigate to View the Subtasks
  Module = (item, index) => {

    console.log(item.taskid);
    console.log(index);
    this.props.navigation.navigate("ViewSubTasks", { taskId: item.taskid });

  }

  //For empty data
  _listEmptyComponent = () => {
    return (
      <View>
        <Text></Text>

      </View>
    )
  }

  //to filter the search data in search area 
  SearchFilterFunction(text) {
    log("Info", "UserPendingManageTasks:DeleteMaintask(maintaskid) method is used to delete maintask");
    console.log(text);
    const newData = this.arrayholder.filter(function (item) {

      const taskid = item.taskid.toUpperCase()
      const taskid1 = text.toUpperCase()
      const projectitle = item.projectitle.toUpperCase()
      const projectitle1 = text.toUpperCase()
      const tasktitle = item.tasktitle.toUpperCase()
      const tasktitle1 = text.toUpperCase()
      const taskdescription = item.taskdescription.toUpperCase()
      const taskdescription1 = text.toUpperCase()
      const targettime = item.targettime.toUpperCase()
      const targettime1 = text.toUpperCase()
      const assigntto = item.assigntto.toUpperCase()
      const assigntto1 = text.toUpperCase()
      const assignedon = item.assignedon.toUpperCase()
      const assignedon1 = text.toUpperCase()
      const timeLeft = item.timeLeft.toUpperCase()
      const timeLeft1 = text.toUpperCase()
      const taskEndDate = item.taskEndDate.toUpperCase()
      const taskEndDate1 = text.toUpperCase()


      return taskid.indexOf(taskid1) > -1 ||
        //  date.indexOf(date1) > -1 || 
        projectitle.indexOf(projectitle1) > -1 ||
        tasktitle.indexOf(tasktitle1) > -1 ||
        taskdescription.indexOf(taskdescription1) > -1 ||
        targettime.indexOf(targettime1) > -1 ||
        assigntto.indexOf(assigntto1) > -1 ||
        assignedon.indexOf(assignedon1) > -1 ||
        timeLeft.indexOf(timeLeft1) > -1 ||
        taskEndDate.indexOf(taskEndDate1) > -1

    })
    this.setState({
      dataSource: newData,
      text: text
    });
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
          <Icon style={{ marginRight: 10, color: '#c0c0c0' }} size={20} name="search" />
        </Item>
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
            <View style={styles.container2} >
              <ListItem navigation={this.props.navigation}
                item={item}
                AddSubTask={() => this.AddSubTask(item, index)}
                ModifyMaintask={() => this.ModifyMaintask(item, index)}
                Module={() => this.Module(item, index)}
                AddSubTask={() => this.AddSubTask(item, index)}
                TaskChat={() => this.TaskChat(item, index)}
              />
            </View>
          }
          keyExtractor={item => item.id}
          ListEmptyComponent={this._listEmptyComponent} />
      </View>
      </View>

    );
  }
}
//Styles for UI
const styles = StyleSheet.create({
  MainContainer:
  {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    backgroundColor: '#f8f8f8',
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
    color: 'green',
    paddingLeft: 10,
  },
  signUpText1: {
    fontSize: 13,
    color: 'green',
  },

  signUpText00: {
    fontSize: 13,
    paddingBottom: 5,
    paddingLeft: 10,
  },
  signUpText11: {
    fontSize: 13,
    paddingBottom: 5,
    color: '#000000',
  },
  signUpText000: {
    fontSize: 13,
    paddingBottom: 5,
    paddingLeft: 20,
  },
  signUpText111: {
    fontSize: 13,
    paddingBottom: 5,
    color: 'black',
    paddingLeft: 23,
  },
  end: {

    alignItems: 'flex-end',

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
    paddingLeft: 23,
    color: 'black',
    justifyContent: 'center',

  },
  signUpText02: {
    fontSize: 13,
    paddingRight: 10,
    paddingLeft: 23,
    color: 'red',
    paddingBottom: 5,
    // fontWeight: 'bold',
    justifyContent: 'center',

  },
  signUpText002: {
    fontSize: 13,
    paddingRight: 10,
    paddingLeft: 23,
    paddingBottom: 5,
    justifyContent: 'center',

  },
  signUpText3: {
    fontSize: 13,
    paddingRight: 13,
    alignItems: 'center',
    color: '#000000'
  },
  signUpText4: {
    paddingLeft: 10,
    fontSize: 13,
    alignItems: 'center',
  },


  signUpText33: {

    paddingBottom: 5,
    fontSize: 13,
    paddingRight: 13,
    paddingTop: -15,
    alignItems: 'center',
  },
  signUpText44: {
    paddingBottom: 5,
    paddingLeft: 10,
    paddingTop: -15,
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
    marginBottom: 5,

  },
  box1: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    position: 'relative',
    // marginBottom: 10,

  },
  signUpText: {
    fontSize: 13,
    justifyContent: 'center',


    color: 'white',
    alignSelf: 'center',
  },
  boxheader: {
    justifyContent: 'space-between',
    flexDirection: 'column',
    position: 'relative',
    // marginBottom: 5,

  },
});