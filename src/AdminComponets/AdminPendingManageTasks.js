/*
FileName:AdminPendingManageTasks.js
Version:1.0.0
Purpose:Shows the list of PendingMaintask list
Devloper:Rishitha,Harsha
*/
import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, TextInput, Dimensions, TouchableOpacity, FlatList, Image, Alert } from 'react-native';
import {Icon, Item, Input } from 'native-base';
import AsyncStorage from '@react-native-community/async-storage';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Modal from "react-native-simple-modal";
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import SearchableDropdown from 'react-native-searchable-dropdown';
import { Collapse, CollapseHeader, CollapseBody } from "accordion-collapse-react-native";
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

class ListItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
    }
    this.GetLevel();
  }
  GetLevel() {
    log("Info", "to get level no");
    AsyncStorage.getItem("level", (err, res) => {
      const level = res;

    console.warn(level+"hdhjdjehwdehjehrjherjehreh")
      this.setState({
        LevelId: level
      });
    });
  }
  render() {
    const { item } = this.props;
   console.warn(this.state.LevelId+"Naveen")
    //for getting current date and time.
    var currentdate = new Date(); 
    var datetime = currentdate.getFullYear() + "-"
                + (currentdate.getMonth()+1)  + "-" 
                + currentdate.getDate()+ "  "  
                + currentdate.getHours() + ":"  
                + currentdate.getMinutes() + ":" 
                + currentdate.getSeconds();

                let collapseSelection1=<CollapseBody>
                <View style={{ flexDirection: 'row', paddingRight: 35, }}>
                  <Text style={styles.signUpText44} >Description</Text>
                  <Text style={styles.signUpText33} >{item.taskdescription}</Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
                  <TouchableOpacity onPress={()=> this.props.DeleteMainTaskAction()} style={{ width: 50, backgroundColor: 'red' }}><Text style={{ color: '#fff', textAlign: 'center' }}>Delete</Text></TouchableOpacity>
                  <TouchableOpacity style={{ width: 90, backgroundColor: '#97f362', marginLeft: 8, }} onPress={() => this.props.AddSubTask()}><Text style={{ color: '#fff', textAlign: 'center' }}>Add Subtask</Text></TouchableOpacity>
                  <TouchableOpacity style={{ width: 90, backgroundColor: '#6cbb3f', marginLeft: 8, }} onPress={() => this.props.Module()}>
                    <Text style={{ color: '#fff', textAlign: 'center' }}>View Subtask</Text></TouchableOpacity>
                  <TouchableOpacity style={{ width: 55, backgroundColor: 'black', marginLeft: 8, }} onPress={this.props.ModifyMaintask}><Text style={{ color: '#fff', textAlign: 'center', }}>Modify</Text></TouchableOpacity>
                  <Icon size={22} style={{ paddingLeft: 10, paddingTop: 4 }} name="chatboxes" onPress={() => { this.props.TaskChat() }}></Icon>
    
                </View>
    
    
              </CollapseBody>
                let collapseSelection2=<CollapseBody>
                <View style={{ flexDirection: 'row', paddingRight: 35, }}>
                  <Text style={styles.signUpText44} >Description</Text>
                  <Text style={styles.signUpText33} >{item.taskdescription}</Text>
                </View>
                 <View style={styles.box1}>
                 <View style={{ flexDirection: 'row', width: wp('56%'), paddingRight: 50, }}>
                    <Text style={styles.signUpText000} >Target Time:</Text>
                    <Text style={styles.signUpText111} >{item.targettime}</Text>
                  </View>
                  <View styles={{ paddingRight: 40,width:wp('50%') }}>
                    <Text style={styles.signUpText111} >Task Status:0% completed </Text>
                  </View>
                </View> 
              <View style={styles.box1}>
    
                  <View style={{ flexDirection: 'row' }}>
                    <Text style={styles.signUpText000} >Assigned To:</Text>
                    <Text style={styles.signUpText111assign} >{item.assigntto}</Text>
                  </View>
                  <Text style={styles.signUpText002} >Assignd By:{item.assignby}</Text>
                </View> 
    
                <View style={{ flexDirection: 'row', paddingRight: 25, }}>
                  <Text style={styles.signUpText44} >Assigned On:</Text>
                  <Text style={styles.signUpText33} >{item.assignedon}</Text>
                </View>
    
    
                <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
                  <TouchableOpacity onPress={()=> this.props.DeleteMainTaskAction()} style={{ width: 50, backgroundColor: 'red' }}><Text style={{ color: '#fff', textAlign: 'center' }}>Delete</Text></TouchableOpacity>
                  <TouchableOpacity style={{ width: 90, backgroundColor: '#97f362', marginLeft: 8, }} onPress={() => this.props.AddSubTask()}><Text style={{ color: '#fff', textAlign: 'center' }}>Add Subtask</Text></TouchableOpacity>
                  <TouchableOpacity style={{ width: 90, backgroundColor: '#6cbb3f', marginLeft: 8, }} onPress={() => this.props.Module()}>
                    <Text style={{ color: '#fff', textAlign: 'center' }}>View Subtask</Text></TouchableOpacity>
                  <TouchableOpacity style={{ width: 55, backgroundColor: 'black', marginLeft: 8, }} onPress={this.props.ModifyMaintask}><Text style={{ color: '#fff', textAlign: 'center', }}>Modify</Text></TouchableOpacity>
                  <Icon size={22} style={{ paddingLeft: 10, paddingTop: 4 }} name="chatboxes" onPress={() => { this.props.TaskChat() }}></Icon>
    
                </View>
    
              </CollapseBody>
                let collapseSelection3=<CollapseBody>


                <View style={{ flexDirection: 'row', paddingRight: 35,paddingBottom:5 }}>
                  <Text style={styles.signUpText44} >Description</Text>
                  <Text style={styles.signUpText33} >{item.taskdescription}</Text>
                  {/* <Text style={styles.signUpText33} >{item.recipeNames}</Text> */}
                </View>
    
    
                <View style={styles.box1}>
    
                  {/* <View style={{ flexDirection: 'row', paddingRight: 35,paddingBottom:5 }}> */}
                  <View style={{ flexDirection: 'row', width: wp('56%'), paddingRight: 50, }}>
                    <Text style={styles.signUpText000} >Target Time:</Text>
                    <Text style={styles.signUpText111} >{item.targettime}</Text>
    
                  </View>
                  {/* <View styles={{ paddingRight: 40 }}> */}
                    <Text style={styles.signUpText111} >Task Status:0% completed </Text>
                  {/* </View> */}
    
                </View>
                <View style={styles.box1}>
    
                  <View style={{ flexDirection: 'row' }}>
                    <Text style={styles.signUpText000} >Assigned To:</Text>
                    <Text style={styles.signUpText111assign} >{item.assigntto}</Text>
                  </View>
                  <Text style={styles.signUpText002} >Assigned By:{item.assignby}</Text>
    
    
                </View>
    
                <View style={{ flexDirection: 'row', paddingRight: 25, }}>
                  <Text style={styles.signUpText44} >Assigned On:</Text>
                  <Text style={styles.signUpText33} >{item.assignedon}</Text>
                </View>
    
    
                <View style={styles.box1}>
    
                  <View style={{ flexDirection: 'row', width: wp('50%'), paddingRight: 50, }}>
                    <Text style={styles.signUpText000} >Time Left:</Text>
                    <Text style={styles.signUpText111} >{item.timeLeft}</Text>
                  </View>
                  <Text style={styles.signUpText000} >Updated On:{item.taskEndDate} </Text>
    
                </View>
    
                <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
                  <TouchableOpacity onPress={()=> this.props.DeleteMainTaskAction()} style={{ width: 50, backgroundColor: 'red' }}><Text style={{ color: '#fff', textAlign: 'center' }}>Delete</Text></TouchableOpacity>
                  <TouchableOpacity style={{ width: 90, backgroundColor: '#97f362', marginLeft: 8, }} onPress={() => this.props.AddSubTask()}><Text style={{ color: '#fff', textAlign: 'center' }}>Add Subtask</Text></TouchableOpacity>
                  <TouchableOpacity style={{ width: 90, backgroundColor: '#6cbb3f', marginLeft: 8, }} onPress={() => this.props.Module()}>
                    <Text style={{ color: '#fff', textAlign: 'center' }}>View Subtask</Text></TouchableOpacity>
                  <TouchableOpacity style={{ width: 55, backgroundColor: 'black', marginLeft: 8, }} onPress={this.props.ModifyMaintask}><Text style={{ color: '#fff', textAlign: 'center', }}>Modify</Text></TouchableOpacity>
                  <Icon size={22} style={{ paddingLeft: 10, paddingTop: 4 }} name="chatboxes" onPress={() => { this.props.TaskChat() }}></Icon>
    
                </View>
    
    
              </CollapseBody>
    return (

      <View>
        <Collapse   style={[item.cDate>=item.targettime?styles.container:styles.container1]}>
    
            <CollapseHeader style={styles.boxheader}>

              <View style={{ flexDirection: 'row' }}>
                <Text style={styles.signUpText0} ># TASK ID:</Text>
                <Text style={styles.signUpText1} >{item.taskid}</Text>
                {/* <Text style={styles.signUpText1} >{item.date}</Text> */}
              </View>
 



            <View style={{ flexDirection: 'row', paddingRight: 25,paddingBottom:5 }}>
              <Text style={styles.signUpText4} >Project Title:</Text>
              <Text style={styles.signUpText3} >{item.projectitle}</Text>
            </View>




            <View style={styles.box1}>

              <View style={{ flexDirection: 'row' }}>
                <Text style={styles.signUpText00} >Task Title:</Text>
                <Text style={styles.signUpText11} >{item.tasktitle}</Text>
                {/* <Text style={styles.signUpText1} >{item.date}</Text> */}
              </View>
              <Text style={styles.signUpText02} >pending </Text>


            </View>

          </CollapseHeader>

          {this.state.LevelId === '1' ? collapseSelection1 : this.state.LevelId === '2' ? collapseSelection2 : this.state.LevelId === '3' ? collapseSelection3 : collapseSelection3}

        </Collapse>
        <View style={{ backgroundColor: '#fff', height: 5 }}>

        </View>
      </View>
    )
  }
}


export default class Pending1 extends Component {
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
      LevelId: '',
    };
    this.arrayholder = [];
  }
  // handleTabFocus = () => {
  //   this.onRefresh();
  // };
  handleTabFocus = () => {
    this.onRefresh();
  };

  componentWillMount() {

    this.adminPendingManageTasks();
    //this.GetLevel();
  }
//For Refresh data
  onRefresh() {
    this.setState({
      dataSource:[],
    })
     this.adminPendingManageTasks() ;
  }
  // componentWillReceiveProps(nextProps) {

  //   setInterval( this.adminPendingManageTasks(),2000);
  // }

  // Navigation from Add subtask to AddSubTaskModal screen
  AddSubTask(item, index) {
    log("Info", "AdminPendingManageTasks:AddSubTask()To navigate to add subtask modal");
    console.log(item);
    console.log(index);

    this.props.navigation.navigate('AddSubTaskModal', { action: 'modify', moduleId: item.moduleId, taskid: item.taskid });

  }

  //adminPendingManageTasks getting start
  adminPendingManageTasks() {
    log("Info", "AdminPendingManageTasks:adminPendingManageTasks() method is used to get pending manage tasks at admin side");
    AsyncStorage.getItem("cropcode", (err, res) => {
      const cropcode = res;

      AsyncStorage.getItem("empId", (err, res) => {
        const empId = res;

        AsyncStorage.getItem("emp_role", (err, res) => {
          const emp_role = res;

          AsyncStorage.getItem("nodays", (err, res) => {
            const ptime = res;
          // alert(ptime);
            NetInfo.fetch().then(state => {
              if (state.type == "none") {
                console.log(state.type);
                Snackbar.show({
                  title: 'No Internet Connection',
                  backgroundColor: 'red',
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
                      userType: emp_role,
                      empId: empId
                    })
                  })
                  .then((response) => response.json())
                  .then((responseJson) => {
                    console.log(responseJson);
                    let viewitemsList = [];
                    if (responseJson.status === 'true')
                    {
                      AsyncStorage.setItem('levelno', '');

                      for (let i = 0; i < JSON.stringify(responseJson.data.length); i++) {

                        let time = JSON.stringify(responseJson.data[i].ptime) / 24;
                        let comparetime = Number(ptime);
                        let countTime = Math.round(time);
                        if (comparetime > 0) {
                          if (countTime === comparetime) {
                            console.log("intoo for");
                            viewitemsList.push(responseJson.data[i]);
                            this.setState({
                              isLoading: false,
                              dataSource: viewitemsList,

                              isFetching: false
                            },

                              function () {


                              });
                              this.arrayholder = viewitemsList;

                          }

                        }
                        else {
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

                    }
                    else{
                      this.setState({
                        isLoading: false,
                      })
                      Snackbar.show({
                        title: 'No Pending ManageTasks',
                        backgroundColor: '#3BB9FF',
                        duration: Snackbar.LENGTH_LONG,
                      });
                    }
                    {this.state.isLoading}


                   
                  })
                  .catch((error) => {
                    console.error(error);
                    log("Error", "Error in getting of pending manage tasks at admin side");
                  });
              }
            });
          });

        });
      });

    });

  }
//adminPendingManageTasks getting end

//Navigating Module to ViewSubTasks Screen

  Module = (item, index) => {
    log("Info", "AdminPendingManageTasks:Module()To navigate to viewsubtask");
    console.log(item.taskid);
    console.log(index);
    this.props.navigation.navigate("ViewSubTasks", { taskId: item.taskid });
  }

  //Navigates to TaskChat Screen
  TaskChat(item, index) {
    log("Info", "AdminPendingManageTasks:TaskChat(item, index) used to navigate to taskchat");
    this.props.navigation.navigate("TaskChat", {taskid: item.taskid,action:"maintask" });
  }

  //Alert for DeleteMainTaskAction
  DeleteMainTaskAction(item, index) {
    log("Info", "DeleteMainTaskAction(item, index) method is used to give alert");

    Alert.alert(
      'Alert..!',
      'Do you want to delete Task',
      [
        {
          text: 'NO',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        { text: 'YES', onPress: () => this.DeleteMaintask(item.taskid) },
      ],
      { cancelable: false },
    );

  }

  //DeleteMaintask of user start
  DeleteMaintask(maintaskid) {
    log("Info", "AdminPendingManageTasks:DeleteMaintask(maintaskid) method is used to delete maintask");
    AsyncStorage.getItem("cropcode", (err, res) => {
      const cropcode = res;

      //  Alert.alert("mai"+maintaskid+"c"+cropcode);

      NetInfo.fetch().then(state => {
        if (state.type == "none") {
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

                action: 'maintaskdelete',
                mainTaskId: maintaskid,
                crop: cropcode
              })
            })
            .then((response) => response.json())
            .then((responseJson) => {
              console.log(responseJson)
              this.setState({
                isLoading: false,
                isFetching: false
              }, function () {

              });
            })
            .catch((error) => {
              console.error(error);
            });
        }
      });
    });

  }
 //DeleteMaintask of user end 

  //Modify Maintask
  ModifyMaintask(item, index) {
    log("Info", "AdminPendingManageTasks:ModifyMaintask(item, index) used to navigate to modify maintask screen");
    const { modifyTask } = this.state;
    console.log("mid" + item.taskid + "id" + item.ideano);

    this.props.navigation.navigate("AddTask", { maintaskid: item.taskid, IdeaId: item.ideano, modifyTask: modifyTask ,maintaskdesc:item.taskdescription,maintasktitle:item.tasktitle});

  }

  FlatListItemSeparator = () => {
    return (
      <View
        style={{
          //  height: .5,
          width: "100%",
          backgroundColor: "red",
        }}
      />
    );
  }

  person(item) {
    console.log(item);
    this.setState({
      person: item.name
    });
  }

  dependency(item) {
    console.log(item);
    this.setState({
      dependency: item.name

    });
    // AsyncStorage.setItem('',dependency);
  }

//if data is empty in flatlist we will use _listEmptyComponent method
  _listEmptyComponent = () => {
    return (
      <View>
        <Text></Text>

      </View>
    )
  }

  //search the tasks based on id,task name,description and user
  SearchFilterFunction(text) {
    log("Info", "AdminPendingManageTasks:SearchFilterFunction(text) method is used for searching functionality");
    console.log(text);

    const newData = this.arrayholder.filter(function (item) {
      const taskid = item.taskid.toUpperCase()
      const taskid1 = text.toUpperCase()
      // const date = item.date.toUpperCase()
      // const date1 = text.toUpperCase()
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
        // date.indexOf(date1) > -1 || 
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
    })
  }

//Search end

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
          <Icon  size={20} name="search" />
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
                TaskChat={() => this.TaskChat(item, index)}
                DeleteMainTaskAction={() => this.DeleteMainTaskAction(item, index)}
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

const styles = StyleSheet.create({
  MainContainer:
  {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height
    // width: '90%',
    // paddingLeft: hp('2%'),
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
    //paddingTop: 40
  },
  signUpText0: {
    fontSize: 13,
    //fontWeight: 'bold',
    color: 'green',
    paddingLeft: 5,
  },
  signUpText1: {
    fontSize: 13,

    //fontWeight: 'bold',
    color: 'green',

  },

  signUpText00: {
    fontSize: 13,
    color: 'black',
    paddingLeft: 5,
  },
  signUpText11: {
    fontSize: 13,

    //fontWeight: 'bold',
    color: 'black',

    width: wp('65%')
  },
  signUpText000: {
    fontSize: 13,
    color: 'black',
    paddingLeft: 5,
  },
  signUpText111: {
    fontSize: 13,
    // paddingBottom: 5,
    //  paddingTop: 20,
    // fontWeight: 'bold',
    color: 'black',
    paddingLeft: 10,
  },
  signUpText111assign: {
    fontSize: 13,
    color: 'black',
    paddingLeft: 4,
    width:'40%'
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
    fontSize: 13,
    paddingRight: 10,
    //   paddingTop: 20,
    paddingLeft: 23,
    color: 'black',

    // fontWeight: 'bold',
    justifyContent: 'center',

  },
  signUpText02: {
    fontSize: 13,
   
    color: 'red',
  
    justifyContent: 'center',

  },
  signUpText002: {
    fontSize: 13,
    color: 'black',
    paddingRight: 10,
    // paddingTop: 20,
    paddingLeft: 23,
    // color: 'red',
    // paddingBottom: 5,
    // fontWeight: 'bold',
    justifyContent: 'center',

  },
  signUpText3: {
    fontSize: 13,
    paddingLeft:5,
    color: 'black',
     //fontWeight: 'bold',
    alignItems: 'center',
  },
  signUpText4: {

    paddingLeft: 5,
    color: 'black',
    fontSize: 13,
    alignItems: 'center',
  },


  signUpText33: {

    paddingLeft: 5,
    fontSize: 13,
    color: 'black',
    // paddingRight:hp('-10%'),
    paddingRight: 13,
    // fontWeight: 'bold',
    // paddingTop: -15,
    paddingBottom: 5

  },
  signUpText44: {
    paddingLeft: 5,
    color: 'black',
    fontSize: 13,
    paddingBottom: 5


  },

  signup: {
    //paddingTop:20,
    color: "#FFF",
  },
  boxone: {
    flex: 1,

  },
  boxtwo: {
    flex: 1,

  },
  boxthree: {
    flex: 1,

  },
  box: {
    //justifyContent: 'space-between',
    flexDirection: 'row',
    position: 'relative',

  },
  box1: {
    //justifyContent: 'space-between',
    flexDirection: 'row',
    position: 'relative',
    paddingBottom:5

  },
  signUpText: {
    fontSize: 13,
    justifyContent: 'center',


    color: 'white',
    alignSelf: 'center',
  },
  boxheader: {

    flexDirection: 'column',


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

  bodytext: {
    margin: 5,
    backgroundColor: 'green',
    padding: Platform.OS === 'ios' ? 0 : 20,
    height: 30,
    alignItems: "center",
    justifyContent: 'center',
    width: Platform.OS === 'ios' ? 100 : 0,


  },
  bodytext1: {
    margin: 5,
    backgroundColor: 'red',
    padding: Platform.OS === 'ios' ? 0 : 20,
    height: 30,
    alignItems: "center",
    justifyContent: 'center',
    width: Platform.OS === 'ios' ? 100 : 0,


  },
});