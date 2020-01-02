/*
FileName:ViewSubTasks.js
Version:1.0.0
Purpose:View the subtasks list and also verify subtask
Devloper:Raju,Harsha,Rishitha
*/
import React, { Component } from 'react';
import Requesteddata from '../AdminComponets/AdminRequestedDataProjects';
import { Platform, StyleSheet, Text, View, Dimensions, FlatList, TouchableHighlight, Image, TouchableOpacity, TextInput, Alert } from 'react-native';
import { Left, Button, Container, Header, Body, Title, Content, Item, Input, Right } from 'native-base';
import AsyncStorage from '@react-native-community/async-storage';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Modal from "react-native-simple-modal";
import { Collapse, CollapseHeader, CollapseBody } from "accordion-collapse-react-native";
import RadioGroup from 'react-native-radio-button-group';
import SearchableDropdown from 'react-native-searchable-dropdown';
import Icon from 'react-native-vector-icons/FontAwesome';
import { API } from "../WebServices/RestClient";
import NetInfo from '@react-native-community/netinfo';
import Snackbar from 'react-native-snackbar';
import log from '../LogFile/Log';
import { NavigationEvents } from 'react-navigation';


FOOTER_MAX_HEIGHT = 50
FOOTER_MIN_HEIGHT = 40

class ListItem extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      days: '',
      hours: '',
      deletevisibility: false
    }

  }

  componentDidMount() {
    log("Debug", "View SubTask screen is loaded");
    this.VisibleActions();
  }
  //Visable Actions Based on Rolle
  async VisibleActions() {
    AsyncStorage.getItem("emp_role", (err, res) => {
      if (res == 'Emp' || res == 'Manager' || res == 'Approver') {
        this.setState({ deletevisibility: true });
      } else {
        this.setState({ deletevisibility: false });
      }
    });
  }

  //Alert for Verify the Subtasks 
  SubtaskVerify() {
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
        { text: 'OK', onPress: () => this.SubtaskVerification(item.subTaskId) },
      ],
      { cancelable: false },
    );

  }

  //verifying the subtask start
  SubtaskVerification(subtaskid) {
    log("Info", " SubtaskVerification(cropcode) is used to verifying the subtask");
    AsyncStorage.getItem("cropcode", (err, res) => {
      const cropcode = res;
      NetInfo.fetch().then(state => {
        if (state.type == "none") {
          console.log(state.type);
          log("Warn", "No internet connection");
          Snackbar.show({
            title: 'No Internet Connection',
            backgroundColor: 'red',
            duration: Snackbar.LENGTH_LONG,
          });
        } else {
          fetch(API + 'manageSubtasks.php',
            {
              method: 'POST',
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                crop: cropcode,
                subtaskid: subtaskid,
                action: 'verify'

              })
            })
            .then((response) => response.json())
            .then((responseJson) => {
              if (responseJson.status == 'True') {

              } else if (responseJson.status == 'false') {

                Alert.alert("you can not verify tasks untill subtasks are completed");

              } else { }
            })
            .catch((error) => {
              console.error(error);
              log("Error", "verifying the subtask error");
            });
        }
      });
    });
  }

  //verifying the subtask close

  render() {
    const { item } = this.props;

    let button;
    let button1;
    let colors;

    if (this.state.deletevisibility === false) {
      button =
        <TouchableOpacity style={{ width: 55, backgroundColor: 'red', paddingRight:10 }} onPress={this.props.deleteAction}>
          <Text style={{ color: '#fff', textAlign: 'center', }}>Delete</Text></TouchableOpacity>
    } else {
      button = null;
    }
    
   // let colors;

  //  if (role==='Approver' || 'Admin') {
    AsyncStorage.getItem("emp_role", (err, res) => {
      if (res == 'Approver' || res == 'Admin' ) {
        this.setState({ deletevisibility: true });
      
    button1 =
      // <TouchableOpacity style={{ width: 70, backgroundColor: 'red', paddingRight: 10 }} onPress={this.props.deleteAction}>
      <TouchableOpacity onPress={() => { this.SubtaskVerify()  }}>
        {/* <Text style={{ color: '#fff', textAlign: 'center', }}>Delete</Text> */}
        </TouchableOpacity>
  } else {
    button = null;
  }
});
    return (

      // <Collapse   style={[item.cDate>=item.targetDate?styles.container:styles.container1]}>
<View>
      <Collapse style={[item.taskstatus == 'pending' ? [item.cDate >= item.targetDate ? styles.container : styles.container1] : styles.container1]}>
        <CollapseHeader style={styles.boxheader}>

          <View style={{ flexDirection: 'row', }}>
            <Text style={styles.signUpText0} >Task-Id:</Text>
            <Text style={styles.signUpText1} >{item.subTaskId}</Text>
          </View>
          {/* <Text style={styles.signUpText2} >{item.date}</Text> */}
          <View style={{ flexDirection: 'row', }}>
            <Text style={styles.signUpText4} >Main Task Title:</Text>
            <Text style={styles.signUpText3} >  {item.mainTaskTitle}</Text>
            {/* <View style={{ marginLeft: 80, }}> */}
              {/* <RadioGroup
                horizontal
                options={[
                  {
                    id: 'ux',
                    labelView: (
                      <Text>
                        <Text style={{ color: 'black' }}>
                        </Text>
                      </Text>
                    ),
                  },

                ]}
                circleStyle={{ fillColor: 'black', borderColor: 'black' }}
              /> */}
            {/* </View> */}


          </View>

          <View style={styles.box1}>

            <View style={{ flexDirection: 'row',marginBottom:10 }}>
              <Text style={styles.signUpText00} >Task Title:</Text>
              <Text style={styles.signUpText11} >{item.taskTitle}</Text>
              {button1}
              {/* <TouchableOpacity onPress={() => { this.SubtaskVerify() }}> */}
                <Text style={styles.signUpText03} >{item.taskstatus}</Text>
              {/* </TouchableOpacity> */}
            </View>
          </View>

        </CollapseHeader>
        <CollapseBody>

          <View style={{ flexDirection: 'row', paddingRight: 35, }}>
            <Text style={styles.signUpText44} >Description :</Text>
            <Text style={styles.signUpText33} >{item.taskDesc}</Text>
            {/* <Text style={styles.signUpText33} >{item.recipeNames}</Text> */}
          </View>




          <View style={styles.box1}>

            <View style={{ flexDirection: 'row', width: wp('45%'),paddingRight:50 }}>
              <Text style={styles.signUpText000} >Target Time:</Text>
              <Text style={styles.signUpText111} >{item.targetDate}</Text>
           
            </View>
            {/* <View styles={{ paddingRight: 40, width: '40%' }}> */}
              <Text style={styles.signUpText002} >Task Status:{item.taskStatusPercentage}% completed  </Text>
              {/* <Text style={styles.signUpText111} >{item.taskStatusPercentage}% completed </Text> */}
            {/* </View> */}

          </View>
          <View style={styles.box1}>

            <View style={{ flexDirection: 'row', width: wp('50%'), paddingRight: 50, }}>
              <Text style={styles.signUpText000text} >Assigned To:{item.assignedTo}</Text>
              {/* <Text style={styles.signUpText111} ></Text> */}
              {/* <Text style={styles.signUpText1} >{item.date}</Text> */}
            </View>
            <Text style={styles.signUpText000} >Assigned By:{item.assignedBy}</Text>
            {/* <Text style={styles.signUpText111} >{item.assignedBy}</Text> */}

          </View>

          <View style={{ flexDirection: 'row', paddingRight: 25, }}>
            <Text style={styles.signUpText44} >Assigned On:</Text>
            <Text style={styles.signUpText33} >{item.assignedDate}</Text>
            {/* <Text style={styles.signUpText33} >{item.recipeNames}</Text> */}
          </View>


          <View style={styles.box1}>

            <View style={{ flexDirection: 'row', width: wp('50%'), paddingRight: 50, }}>
              <Text style={styles.signUpText000} >Time Left:</Text>
              <Text style={styles.signUpText111} >{item.timeLeft}</Text>
              {/* <Text style={styles.signUpText1} >{item.date}</Text> */}
            </View>
            <Text style={styles.signUpText000text} >Updated On:{item.taskEndDate} </Text>

          </View>

          <View style={styles.box1}>

            <View style={{ flexDirection: 'row', width: wp('50%'), paddingRight: 50, }}>
              <Text style={styles.signUpText000} >Dependency:</Text>
              <Text style={styles.signUpText111} >{item.dependencyTitle}</Text>
              {/* <Text style={styles.signUpText1} >{item.date}</Text> */}
            </View>
            <View style={{width:wp('40%'),paddingRight:20,}}>
            <Text style={styles.signUpText000text} >Dependent:{item.dependencyUser}</Text>
            {/* <Text style={styles.signUpText111} >{item.assignedBy}</Text> */}
            </View>
          </View>


          <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' ,}}>
            {/* <TouchableOpacity style={{ width: 120, backgroundColor: '#6cbb3f', marginLeft: 10, }}><Text style={{ color: '#fff', textAlign: 'center' }}>VIEW SUB TASK</Text></TouchableOpacity> */}
            <Icon size={22} style={{ paddingLeft: 10, paddingTop: 4, paddingRight: 10, }} name="comments-o" onPress={() => { this.props.TaskChat() }}></Icon>
            <TouchableOpacity onPress={this.props.RoadBlock} style={{ width: 20, backgroundColor: 'black',marginRight:10 }}><Text style={{ color: '#fff', textAlign: 'center' }}>?</Text></TouchableOpacity>
            <TouchableOpacity style={{ width: 65, backgroundColor: 'black', paddingRight: 10, marginRight:10 }} onPress={() => this.props.Module()}>
              <Text style={{ color: '#fff', textAlign: 'center', marginLeft: 10 }}>Modify</Text></TouchableOpacity>

            {button}
          </View>
<View style={{height:hp('1%')}}>
  <Text></Text>
</View>
        </CollapseBody>

      </Collapse>
      <View style={{ backgroundColor: '#f8f8f8', height: 3 }}></View>
</View>
    )
  }
}

export default class ViewSubTasks extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      open: false,
      ProjectTitle: "",
      ProjectDescription: "",
      role: '',
      userToken: '',
      isLoading: true,
      dataSource: [],
      isFetching: false,
      modalVisible: false,
      taskttitle: '',
      days: '',
      hours: '',
      subTaskId: '',

      //   moduleId:this.props.navigation.state.params.moduleId,
      taskId: this.props.navigation.state.params.taskId,
    };
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
  //Close the Dialog
  modalDidClose = () => {

    this.setState({ open: false });

  };
  //Dialog actions start
  moveUp = () => this.setState({ offset: -1200 });

  resetPosition = () => this.setState({ offset: 0 });

  openModal = (item, index) => {
    //Estimated Hours split into days and hours
    const time = item.estimatedHours;
    const days = Number(time / 24);
    const hours = Number(time % 24);
    console.log(item);
    console.log(index);

    this.setState({ days: days, hours: hours })

    console.log(item.taskid);

    this.setState({
      subTask: item.taskTitle,
      description: item.taskDesc,
      person: item.assignedTo,
      name: item.assignedBy,
      // time:item.estimatedHours,
    })
    this.setState({ item: item });
    this.setState({ open: true });
  }
  closeModal = () => this.setState({ open: false });
  //Dialog actions close
  componentWillMount() {
    // alert(this.props.navigation.state.params.taskId)
    this.getSubTasksList();//subtasks list
    // this.openModal();
  }

  //refresh subtasktasks list
  onRefresh() {
    this.setState({
      dataSource: [],
    })
        this.getSubTasksList();
  }
  Module(item, index) {
    let time = item.estimatedHours;

    let days1 = (Number(time / 24)).toString().split(".");
    days = days1[0];
    //alert(days1[0]);
    hours = Number(time % 24);
    console.log(item);
    console.log(index);
    // alert(days+"    "+hours+"     "+item.estimatedHours);

    //navigate to ModifySubtask
    this.props.navigation.navigate('ModifySubTask', {
      callHome: this.getSubTasksList.bind(this),
      action: 'modify', subTask: item.taskTitle, description: item.taskDesc, person: item.assignedTo,
      name: item.assignedBy, subTaskId: item.subTaskId, days: days, hours: hours
    });

  }

  componentWillReceiveProps(nextProps) {
    console.log(nextProps);
    console.log("re loading...........")

    this.getSubTasksList();
  }
  //Navigate to RoadBlock Screen
  RoadBlock(item, index) {
    this.props.navigation.navigate("RoadBlocks", { subtaskid: item.subTaskId });
  }
  //Navigates to TaskChat Screen
  TaskChat(item, index) {
    this.props.navigation.navigate("TaskChat", { taskid: item.subTaskId, action: "subtask" });
  }

  //Getting the subtasks list
  getSubTasksList() {
    const { taskId } = this.state;
    log("Info", "getSubTasksList(taskId) method is used to Getting the subtasks ");
    //alert("ideaid" + taskId);

    AsyncStorage.getItem("cropcode", (err, res) => {

      const cropcode = res;

      console.log(cropcode)
      NetInfo.fetch().then(state => {
        if (state.type == "none") {
          console.log(state.type);
          log("Warn", "No internet connection");
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
                mainTaskId: taskId,
                action: "getsubtasks"
              })
            })
            .then((response) => response.json())
            .then((responseJson) => {
              if (responseJson.status == 'true') {
                //alert(JSON.stringify(responseJson));
                console.log(responseJson)
                this.setState({
                  isLoading: false,
                  dataSource: responseJson.data,
                  isFetching: false
                }, function () {

                });
                this.arrayholder = responseJson.data;
              }
              else {
                log("Warn", "no Subtasks found");
                this.arrayholder = [];
                this.setState({
                  isLoading: false
                })
                Snackbar.show({
                  title: 'No SubTasks',
                  backgroundColor: '#3bb9ff',
                  duration: Snackbar.LENGTH_LONG,
                });
              }
            })
            .catch((error) => {
              console.error(error);
              log("Error", "Getting the subtasks list error");
            });
        }
      });

    });
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


  //delete alert for subtask start
  deleteAction(item, index) {
    Alert.alert(
      'Alert..!',
      'Do you want to delete Subtask',
      [
        {
          text: 'NO',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        { text: 'YES', onPress: () => this.deleteSubtask(item) },
      ],
      { cancelable: false },
    );
  }
  //delete alert for subtask end

  //Delete Subtask strat
  deleteSubtask = (item) => {
    log("Info", " deleteSubtask(item) is used to Delete Subtask");
    AsyncStorage.getItem("cropcode", (err, res) => {
      const crop = res;
      NetInfo.fetch().then(state => {
        if (state.type == "none") {
          console.log(state.type);
          log("Warn", "No internet connection");
          Snackbar.show({
            title: 'No Internet Connection',
            backgroundColor: 'red',
            duration: Snackbar.LENGTH_LONG,
          });
        } else {
          fetch(API + 'manageSubtasks.php', {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({


              subtaskid: item.subTaskId,
              action: "deletesubtask",
              crop: crop, //Async
            })
          }).then((response) => response.json())
            .then((responseJson) => {
              console.log(JSON.stringify(responseJson));

              console.log(responseJson);
              if (responseJson.status === 'true') {
                console.log("done")
                this.setState({ open: false })
                // this.props.navigation.navigate('AdminManageProjects');
              }

            }).catch((error) => {
              console.error(error);
              log("Error", "Delete Subtask  error");
            });
        }
      });
    });
  };
  //delete Subtask end

  _listEmptyComponent = () => {
    return (
      <View>
        <Text></Text>

      </View>
    )
  }


  //For Search 
  SearchFilterFunction(text) {
    log("Info", "SearchFilterFunction(text) method  used for searching");
    console.warn(this.arrayholder);
    const newData = this.arrayholder.filter(function (item) {

      const subTaskId = item.subTaskId.toUpperCase()
      const subTaskId1 = text.toUpperCase()
      // const date = item.date.toUpperCase()
      // const date1 = text.toUpperCase()

      const mainTaskTitle = item.mainTaskTitle.toUpperCase()
      const mainTaskTitle1 = text.toUpperCase()



      const taskTitle = item.taskTitle.toUpperCase()
      const taskTitle1 = text.toUpperCase()
      const taskstatus = item.taskstatus.toUpperCase()
      const taskstatus1 = text.toUpperCase()
      const taskDesc = item.taskDesc.toUpperCase()
      const taskDesc1 = text.toUpperCase()


      const targetDate = item.targetDate.toUpperCase()
      const targetDate1 = text.toUpperCase()
      const taskStatusPercentage = item.taskStatusPercentage.toUpperCase()
      const taskStatusPercentage1 = text.toUpperCase()
      const assignedTo = item.assignedTo.toUpperCase()
      const assignedTo1 = text.toUpperCase()

      const assignedBy = item.assignedBy.toUpperCase()
      const assignedBy1 = text.toUpperCase()
      const assignedDate = item.assignedDate.toUpperCase()
      const assignedDate1 = text.toUpperCase()
      const timeLeft = item.timeLeft.toUpperCase()
      const timeLeft1 = text.toUpperCase()
      const taskEndDate = item.taskEndDate.toUpperCase()
      const taskEndDate1 = text.toUpperCase()
      // const dependencyTitle = item.dependencyTitle.toUpperCase()
      // const dependencyTitle1 = text.toUpperCase()
      // const dependencyUser = item.dependencyUser.toUpperCase()
      // const dependencyUser1 = text.toUpperCase()

      return taskTitle.indexOf(taskTitle1) > -1 ||
        taskstatus.indexOf(taskstatus1) > -1 ||
        taskDesc.indexOf(taskDesc1) > -1 ||

        // date.indexOf(date1) > -1 ||
        subTaskId.indexOf(subTaskId1) > -1 ||
        mainTaskTitle.indexOf(mainTaskTitle1) > -1 ||

        targetDate.indexOf(targetDate1) > -1 ||
        taskStatusPercentage.indexOf(taskStatusPercentage1) > -1 ||

        assignedTo.indexOf(assignedTo1) > -1 ||
        assignedBy.indexOf(assignedBy1) > -1 ||
        assignedDate.indexOf(assignedDate1) > -1 ||
        timeLeft.indexOf(timeLeft1) > -1 ||

        taskEndDate.indexOf(taskEndDate1) > -1
      // dependencyTitle.indexOf(dependencyTitle1) > -1 ||
      // dependencyUser.indexOf(dependencyUser1) > -1 


    })
    this.setState({
      dataSource: newData,
      text: text
    })
  }




  render() {


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
          <Left>
            <Icon size={25} name="arrow-left" style={{ color: '#fff' }} onPress={() =>
              this.props.navigation.goBack(null)} />

          </Left>
          <Body>
            <Title style={{ color: '#fff', fontWeight: '600' }}>Subtasks List</Title>
          </Body>
          <Right></Right>
        </Header>
        <Item>
        <NavigationEvents
                            onDidFocus={() => this.onRefresh()}
                        />
          <Input placeholder="Search"
            onChangeText={(text) => this.SearchFilterFunction(text)} />
          <Icon style={{ marginRight: 5 }} size={25} name="search" />
        </Item>
        <View style={styles.MainContainer}>

          <View style={{ height: '98%' }}>

            <FlatList

              extraData={this.state}
              keyExtractor={this._keyExtractor}
              renderItem={this._renderItem}

              data={this.state.dataSource}

              onRefresh={() => this.onRefresh()}
              refreshing={this.state.isFetching}

              ItemSeparatorComponent={this.FlatListItemSeparator}
              renderItem={({ item, index }) =>
                <View>

                  <ListItem navigation={this.props.navigation}
                    item={item}
                    Module={() => this.Module(item, index)}
                    openModal={() => this.openModal(item, index)}//Add Subtask
                    deleteAction={() => this.deleteAction(item, index)}//Delete Subtask

                    RoadBlock={() => this.RoadBlock(item, index)}
                    TaskChat={() => this.TaskChat(item, index)}//For Chat

                  />
                </View>
              }
              keyExtractor={item => item.id}
              ListEmptyComponent={this._listEmptyComponent}
            />

          </View>
        </View>
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
    width: wp('95%'),


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
    fontSize: 14,

  //  fontWeight: 'bold',
    color: 'green',
    paddingLeft: 10,
  },
  signUpText1: {

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

    width: wp('65%'),
    color: 'black',

  },
  signUpText000: {
    fontSize: 14,
    color: 'black',

    paddingLeft: 10,
  },
  signUpText000text: {
    fontSize: 14,
    color: 'black',
    paddingLeft: 10,
    width:wp('40%'),
    // paddingRight:80
  },
  signUpText000text1: {
    fontSize: 14,
    paddingLeft: 10,
  },
  textStyle: {

    color: '#fff',
    fontSize: 14,
  },
  signUpText111: {
    fontSize: 14,

    color: 'black',
    paddingLeft: 6,
  },
  end: {

    alignItems: 'flex-end',

  },
  end1: {
    flex: 1,



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
    color: 'blue',

    justifyContent: 'center',

  },
  signUpText002: {
    fontSize: 14,
    paddingRight: 10,

    paddingLeft: 23,

//    justifyContent: 'center',

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

  signUpText3: {


    fontSize: 14,
   // width: wp('90%'),
   // fontWeight: 'bold',

    width: wp('60%'),
  },
  signUpText4: {
    color: 'black',
    paddingLeft: 10,

    fontSize: 14,

  },


  signUpText33: {


    fontSize: 14,
    width: '80%',
    alignItems: 'center',
  },
   signUpText33: {


    fontSize: 14,
    width: '80%',
    alignItems: 'center',
  },
  signUpText44: {

    paddingLeft: 10,
    color: 'black',
    fontSize: 14,
    alignItems: 'center',
  },

  signup: {

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

    flexDirection: 'row',



  },
  box1: {

    flexDirection: 'row',



  },
  signUpText: {
    fontSize: 14,
    justifyContent: 'center',


    color: 'white',
    alignSelf: 'center',
  },
  signUpText03: {

    fontSize: 14,
    color: 'red',
    paddingLeft: -10,
    alignSelf: 'flex-end',
  //  fontWeight: 'bold',


    alignItems: 'center',
  },
  boxheader: {

    flexDirection: 'column',


  },
});