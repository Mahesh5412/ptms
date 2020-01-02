/*
FileName:AdminCompletedManageTasks.js
Version:1.0.0
Purpose:Getting the List of AdminCompletedManageTasks and also MainTaskVerify by role
Devloper:Rishitha,Harsha
*/
import React, { Component } from 'react';
import { TextInput, Platform, StyleSheet, Text, View, Dimensions, TouchableOpacity, FlatList, Alert, Image } from 'react-native';
import { Icon, Left, Button, Container, Header, Content, Item, Input } from 'native-base';
import AsyncStorage from '@react-native-community/async-storage';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
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
  //Alert for verifying Maintask start
  MaintaskVerify() {
    log("Info", "MaintaskVerify() method is used to give alert");
    const { item } = this.props;

    Alert.alert(
      'Alert..!',
      'Do you want to Verify Task',
      [
        {
          text: 'NO',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        { text: 'YES', onPress: () => this.MaintaskVerification(item.taskid) },
      ],
      { cancelable: false },
    );

  }
  //Alert for verifying Maintask end
  //MainTask Verification by role start
  MaintaskVerification(maintaskid) {
    log("Info", "MaintaskVerification(maintaskid) method is used to verify maintask");
    AsyncStorage.getItem("cropcode", (err, res) => {
      const cropcode = res;


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
  //MainTask Verify end

  render() {
    const { item } = this.props;
    let collapseSelection1=<CollapseBody>


    <View style={{ flexDirection: 'row', paddingRight: 25, }}>
      <Text style={styles.signUpText44} >Description</Text>
      <Text style={styles.signUpText33} >{item.taskdescription}</Text>
    </View>


    <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'space-between' }}>
      <TouchableOpacity style={{ width: 90, backgroundColor: '#6cbb3f', marginRight: 10 }} onPress={() => this.props.Module()}>
        <Text style={{ color: '#fff', textAlign: 'center' }}>View Subtask</Text></TouchableOpacity>
      <TouchableOpacity style={{ width: 90, backgroundColor: 'black', marginRight: 10 }} onPress={() => this.props.AddSubTask()}>
        <Text style={{ color: '#fff', textAlign: 'center' }}>Add Subtask</Text></TouchableOpacity>

    </View>
  </CollapseBody>
  let collapseSelection2=<CollapseBody>


  <View style={{ flexDirection: 'row', paddingRight: 25, }}>
    <Text style={styles.signUpText44} >Description</Text>
    <Text style={styles.signUpText33} >{item.taskdescription}</Text>
    {/* <Text style={styles.signUpText33} >{item.recipeNames}</Text> */}
  </View>


  <View style={styles.box1}>

    <View style={{ flexDirection: 'row' }}>
      <Text style={styles.signUpText000} >Target Time:</Text>
      <Text style={styles.signUpText111} >{item.targettime};</Text>

    </View>
    <Text style={styles.signUpText002} >Task Status:{item.completeStatus}% completed </Text>


  </View>
  <View style={styles.box1}>

    <View style={{ flexDirection: 'row' }}>
      <Text style={styles.signUpText000} >Assigned on:</Text>
      <Text style={styles.signUpText111} >{item.assignedon}</Text>

    </View>



  </View>

  <View style={{ flexDirection: 'row', paddingRight: 25, }}>
    <Text style={styles.signUpText44} >Assigned By:</Text>
    <Text style={styles.signUpText33} >{item.assignby}</Text>

  </View>

  <View style={{ flexDirection: 'row', paddingRight: 25, }}>
    <Text style={styles.signUpText44} >Task status Description:</Text>
    <Text style={styles.signUpText33} >{item.taskStatusDesc}</Text>

  </View>

  <View style={styles.box1}>

    <View style={{ flexDirection: 'row' }}>
      <Text style={styles.signUpText000} >Extra Hours:</Text>
      <Text style={styles.signUpText111} >{item.extraHours}</Text>

    </View>


  </View>

  <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'space-between' }}>
    <TouchableOpacity style={{ width: 90, backgroundColor: '#6cbb3f', marginRight: 10 }} onPress={() => this.props.Module()}>
      <Text style={{ color: '#fff', textAlign: 'center' }}>View Subtask</Text></TouchableOpacity>
    <TouchableOpacity style={{ width: 90, backgroundColor: 'black', marginRight: 10 }} onPress={() => this.props.AddSubTask()}>
      <Text style={{ color: '#fff', textAlign: 'center' }}>Add Subtask</Text></TouchableOpacity>

  </View>
</CollapseBody>

let collapseSelection3=<CollapseBody>


<View style={{ flexDirection: 'row', paddingRight: 25, }}>
  <Text style={styles.signUpText44} >Description</Text>
  <Text style={styles.signUpText33} >{item.taskdescription}</Text>
  {/* <Text style={styles.signUpText33} >{item.recipeNames}</Text> */}
</View>


<View style={styles.box1}>

  <View style={{ flexDirection: 'row' }}>
    <Text style={styles.signUpText000} >Target Time:</Text>
    <Text style={styles.signUpText111} >{item.targettime};</Text>

  </View>
  <Text style={styles.signUpText002} >Task Status:%{item.completeStatus}</Text>


</View>
<View style={styles.box1}>

  <View style={{ flexDirection: 'row' }}>
    <Text style={styles.signUpText000} >Assigned on:</Text>
    <Text style={styles.signUpText111} >{item.assignedon}</Text>

  </View>



</View>

<View style={{ flexDirection: 'row', paddingRight: 25, }}>
  <Text style={styles.signUpText44} >Assigned By:</Text>
  <Text style={styles.signUpText33} >{item.assignby}</Text>

</View>

<View style={{ flexDirection: 'row', paddingRight: 25, }}>
  <Text style={styles.signUpText44} >Task status Description:</Text>
  <Text style={styles.signUpText33} >{item.taskStatusDesc}</Text>

</View>

<View style={styles.box1}>

  <View style={{ flexDirection: 'row' }}>
    <Text style={styles.signUpText000} >Extra Hours:</Text>
    <Text style={styles.signUpText1111} >{item.extraHours}</Text>

  </View>


</View>


<View style={styles.box1}>

  <View style={{ flexDirection: 'row' }}>
    <Text style={styles.signUpText000} >Dependency:</Text>
    <Text style={styles.signUpText111} >{item.assignby}</Text>

  </View>
 

</View>

<View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'space-between' }}>
  <TouchableOpacity style={{ width: 90, backgroundColor: '#6cbb3f', marginRight: 10 }} onPress={() => this.props.Module()}>
    <Text style={{ color: '#fff', textAlign: 'center' }}>View Subtask</Text></TouchableOpacity>
  <TouchableOpacity style={{ width: 90, backgroundColor: 'black', marginRight: 10 }} onPress={() => this.props.AddSubTask()}>
    <Text style={{ color: '#fff', textAlign: 'center' }}>Add Subtask</Text></TouchableOpacity>

</View>
</CollapseBody>
    return (

      <View>
        <Collapse style={styles.container}>


          <CollapseHeader style={styles.boxheader}>

            <View style={{ flexDirection: 'row' }}>
              <Text style={styles.signUpText0} >Task_ID:</Text>
              <Text style={styles.signUpText1} >{item.taskid}</Text>
              {/* <Text style={styles.signUpText1} >{item.date}</Text> */}

              <Text style={styles.signUpText2} >{item.assignedon}</Text>


            </View>





            <View style={{ flexDirection: 'row', paddingRight: 25, }}>
              <Text style={styles.signUpText4} >Project Title:</Text>
              <Text style={styles.signUpText3} >{item.projectitle}</Text>
            </View>




            <View style={styles.box1}>

              <View style={{ flexDirection: 'row', width: wp('60%') }}>

                <Text style={styles.signUpText00} >Task Title:</Text>
                <Text style={styles.signUpText11} >{item.tasktitle}</Text>
                {/* <Text style={styles.signUpText1} >{item.date}</Text> */}
              </View>
              <TouchableOpacity onPress={() => { this.MaintaskVerify() }}>
                <Text style={styles.signUpText02} >{item.completeStatus} </Text>
              </TouchableOpacity>


            </View>

          </CollapseHeader>
          
          {this.state.LevelId === '1' ? collapseSelection1 : this.state.LevelId === '2' ? collapseSelection2 : this.state.LevelId === '3' ? collapseSelection3 : collapseSelection3}

        </Collapse>
        <View style={{ backgroundColor: '#f8f8f8', height: 5 }}/>
      </View>
    )
  }
}
export default class AdminCompletedManageTasks extends Component {
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
      LevelId: '',

    }
    this.arrayholder = [];
  }
  handleTabFocus = () => {
    this.onRefresh();
  };

  componentDidMount() {
    log("Debug", "Admin completed manage tasks screen is loaded");
    this.manageTasksCompleted();
    //this.GetLevel();
  }
  //refresh list 
  onRefresh() {
    this.setState({
      dataSource:[],
    })
     this.manageTasksCompleted() ;
  }
  //Getting the list of completed ManageTasks start
  manageTasksCompleted() {
    log("Info", "AdminCompletedManageTasks:manageTasksCompleted() method is used to get completed manage tasks at admin side");
    AsyncStorage.getItem("cropcode", (err, res) => {
      const cropcode = res;

      AsyncStorage.getItem("empId", (err, res) => {
        const empId = res;

        AsyncStorage.getItem("nodays", (err, res) => {
          const ptime = res;

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


                fetch(API + 'getManageMaintasks.php',
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
                    let viewitemsList = [];
                    if (responseJson.status === 'true') {

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
                          log("Info", "No completed manage tasks at admin side");
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
                      this.setState({
                        isLoading: false,
                      })
                      Snackbar.show({
                        title: 'No Completed ManageTasks',
                        backgroundColor: '#3BB9FF',
                        duration: Snackbar.LENGTH_LONG,
                      });
                    }

                  })

                  .catch((error) => {
                    console.error(error);
                    log("Error", "Error in getting of completed manage tasks at admin side");
                  });
              }
            });
          });
        })
      });

    });

  };
  //Navigate to  AddSubTaskModal

  AddSubTask(item, index) {
    log("Info", "AdminCompletedManageTasks:AddSubTask()To navigate to add subtask modal");
    console.log(item);
    console.log(index);

    this.props.navigation.navigate('AddSubTaskModal', { action: 'modify', moduleId: item.moduleId, taskid: item.taskid });

  }
  //Action for View the list of subtasks
  Module = (item, index) => {
    log("Info", "AdminCompletedManageTasks:Module()To navigate to viewsubtask");
    console.log(item.taskid);
    console.log(index);
    this.props.navigation.navigate("ViewSubTasks", { taskId: item.taskid });

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

  //if data is empty in flatlist we will use _listEmptyComponent method


  _listEmptyComponent = () => {
    return (
      <View>
        <Text></Text>

      </View>
    )
  }

  //For Search data 

  SearchFilterFunction(text) {
    log("Info", "AdminCompletedManageTasks:SearchFilterFunction(text) for search functionality");
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
      const assignby = item.assignby.toUpperCase()
      const assignby1 = text.toUpperCase()
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
        assignby.indexOf(assignby1) > -1 ||
        taskEndDate.indexOf(taskEndDate1) > -1

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
          <Input placeholder="Search"
            onChangeText={(text) => this.SearchFilterFunction(text)} />
          <Icon name="ios-search" />
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
              />
            </View>
          }
          keyExtractor={item => item.id}
          ListEmptyComponent={this._listEmptyComponent} />
      </View>
      </Container>

    );
  }
}
const styles = StyleSheet.create({

  MainContainer:
  {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height
  },
  container: {
    flex: 1,
    paddingLeft: hp('1%'),
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
    // fontWeight: 'bold',
    color: 'green',
    paddingLeft: 10,
  },
  signUpText1: {
    fontSize: 13,
    width: '80%',
    // fontWeight: 'bold',
    color: 'green',

  },

  signUpText00: {
    fontSize: 13,
    color: 'black',
    paddingLeft: 10,
  },
  signUpText11: {
    fontSize: 13,
   // fontWeight: 'bold',
    color: 'black',
  },
  signUpText000: {
    fontSize: 13,
    color: 'black',

    paddingLeft: 10,
  },
  signUpText111: {
    fontSize: 13,
width:wp('35%'),

    paddingLeft: 5,
  },
  signUpText1110: {
    fontSize: 13,
width:wp('30%'),

    paddingLeft: 5,
  },
  signUpText1111: {
    fontSize: 13,
width:wp('55%'),

    paddingLeft: 5,
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
    paddingRight: 50,
    //   paddingTop: 20,
    paddingLeft: 120,
    color: 'black',

    // fontWeight: 'bold',
    justifyContent: 'center',

  },
  signUpText02: {
    fontSize: 13,
    paddingRight: 10,
    // paddingTop: 20,
    paddingLeft: 23,
    color: 'blue',
    justifyContent: 'center',

  },
  signUpText002: {
    fontSize: 13,
    // paddingRight: 10,
    // paddingTop: 20,
    paddingLeft: 4,
    // fontWeight: 'bold',
    justifyContent: 'center',
    // width:wp('20%')

  },
  signUpText3: {



    fontSize: 13,

    paddingRight: 13,
    color: 'black',
    alignItems: 'center',
    width: wp('70%')
  },
  signUpText4: {
    paddingLeft: 10,
    // fontWeight: 'bold',
    color: 'black',
    fontSize: 13,
    alignItems: 'center',
  },


  signUpText33: {

    paddingLeft: 5,
    fontSize: 13,
    // paddingRight:hp('-10%'),
    paddingRight: 13,
    width: '80%',

    alignItems: 'center',
  },
  signUpText44: {

    paddingLeft: 10,
    color: 'black',
    fontSize: 13,


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
    marginBottom: 5,

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
