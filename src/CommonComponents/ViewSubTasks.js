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
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { API } from "../WebServices/RestClient";
import NetInfo from '@react-native-community/netinfo';
import Snackbar from 'react-native-snackbar';

FOOTER_MAX_HEIGHT = 50
FOOTER_MIN_HEIGHT = 40

class ListItem extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      days:'',
      hours:'',

      deletevisibility: false
    }
  }

  componentDidMount() {

    this.VisibleActions();
  }

  async VisibleActions() {

    AsyncStorage.getItem("emp_role", (err, res) => {

      //Alert.alert(res);

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
          fetch(API + 'managesubtasks.php',
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
            });
        }
      });
    });
  }
  //verifying the subtask close

  render() {
    const { item } = this.props;

    let button;

    if (this.state.deletevisibility === false) {
      button =
        <TouchableOpacity style={{ width: 60, backgroundColor: 'red',  }} onPress={this.props.deleteAction}>
          <Text style={{ color: '#fff', textAlign: 'center', }}>DELETE</Text></TouchableOpacity>
    } else {
      button = null;
    }

    return (

      <Collapse style={styles.container}>
        <CollapseHeader style={styles.boxheader}>

          <View style={{ flexDirection: 'row' }}>
            <Text style={styles.signUpText0} >TASK ID:</Text>
            <Text style={styles.signUpText1} >{item.subTaskId}</Text>
            {/* <Text style={styles.signUpText1} >{item.date}</Text> */}
          </View>
          <Text style={styles.signUpText2} >{item.date}</Text>




          <View style={{ flexDirection: 'row',}}>
            <Text style={styles.signUpText4} >Main Task Title:</Text>
            <Text style={styles.signUpText3} >{item.mainTaskTitle}</Text>
            <View style={{ marginLeft: 80 }}
            >
              <RadioGroup
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
                //activeButtonId={'user'}
                circleStyle={{ fillColor: 'black', borderColor: 'black' }}
              //  onChange={(option) => this.setState({usertype: option.id})}
              />
            </View>


          </View>




          <View style={styles.box1}>

            <View style={{ flexDirection: 'row' }}>
              <Text style={styles.signUpText00} >Task Title:</Text>
              <Text style={styles.signUpText11} >{item.taskTitle}</Text>
              <TouchableOpacity onPress={() => { this.SubtaskVerify() }}>
                <Text style={styles.signUpText03} >{item.taskstatus}</Text>
              </TouchableOpacity>
            </View>
            </View>

            
      

            <View style={{ flexDirection: 'row', paddingRight: 35, }}>
              <Text style={styles.signUpText44} >Description :</Text>
              <Text style={styles.signUpText33} >{item.taskDesc}</Text>
              {/* <Text style={styles.signUpText33} >{item.recipeNames}</Text> */}
            </View>

            </CollapseHeader>

<CollapseBody>
            <View style={styles.box1}>

              <View style={{ flexDirection: 'row', width: wp('50%'), paddingRight: 50, }}>
                <Text style={styles.signUpText000} >Target Time:</Text>
                <Text style={styles.signUpText111} >{item.targetDate}</Text>
                {/* <Text style={styles.signUpText1} >Task Status:0% completed</Text>  */}
              </View>
              <View styles={{ paddingRight: 40, width: '40%' }}>
                <Text style={styles.signUpText000text} >Task Status:{item.taskStatusPercentage}% completed  </Text>
                {/* <Text style={styles.signUpText111} >{item.taskStatusPercentage}% completed </Text> */}
              </View>

            </View>
            <View style={styles.box1}>

              <View style={{ flexDirection: 'row', width: wp('50%'), paddingRight: 50, }}>
                <Text style={styles.signUpText000text} >Assigned To:</Text>
                <Text style={styles.signUpText111} >{item.assignedTo}</Text>
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
              <Text style={styles.signUpText000text} >Dependent:{item.dependencyUser}</Text>
              {/* <Text style={styles.signUpText111} >{item.assignedBy}</Text> */}

            </View>


            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
              {/* <TouchableOpacity style={{ width: 120, backgroundColor: '#6cbb3f', marginLeft: 10, }}><Text style={{ color: '#fff', textAlign: 'center' }}>VIEW SUB TASK</Text></TouchableOpacity> */}
              <TouchableOpacity style={{ width: 60, backgroundColor: 'black', marginLeft: 10, }} onPress={() => this.props.Module()}>
                <Text style={{ color: '#fff', textAlign: 'center', }}>MODIFY</Text></TouchableOpacity>
              
              {button}
              </View>

              </CollapseBody>

</Collapse>

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

  };
  //Dialog actions start
  moveUp = () => this.setState({ offset: -1200 });

  resetPosition = () => this.setState({ offset: 0 });

  openModal = (item, index) => {
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
    this.setState({ isFetching: true }, function () { this.getSubTasksList() });
  }
  Module(item, index) {
    let time = item.estimatedHours;
    
    let days1 = (Number(time / 24)).toString().split(".");
    days=days1[0];
     //alert(days1[0]);
     hours = Number(time % 24);
    console.log(item);
    console.log(index);
    // alert(days+"    "+hours+"     "+item.estimatedHours);
    

    this.props.navigation.navigate('ModifySubTask', { callHome: this.getSubTasksList.bind(this),
      action: 'modify', subTask: item.taskTitle, description: item.taskDesc,person:item.assignedTo,
  name:item.assignedBy,subTaskId:item.subTaskId,days:days,hours:hours });

  }

  componentWillReceiveProps(nextProps) {
    console.log(nextProps);
    console.log("re loading...........")

    this.getSubTasksList();
  }

  RoadBlock(item, index) {
    this.props.navigation.navigate("RoadBlocks", { subtaskid: item.subTaskId });
  }

  //Getting the subtasks list
  getSubTasksList() {
    const { taskId } = this.state;

    //alert("ideaid" + taskId);

    AsyncStorage.getItem("cropcode", (err, res) => {

      const cropcode = res;

      console.log(cropcode)
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
                mainTaskId: taskId,
                action: "getsubtasks"
              })
            })
            .then((response) => response.json())
            .then((responseJson) => {
              //alert(JSON.stringify(responseJson));
              console.log(responseJson)
              this.setState({
                isLoading: false,
                dataSource: responseJson.data,
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
          fetch(API + 'managesubtasks.php', {
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
            <Title style={{ color: '#fff', fontWeight: '600' }}>Sub Tasks List</Title>
          </Body>
          <Right></Right>
        </Header>
        <Item>
          <Input placeholder="Search"
            onChangeText={(text) => this.SearchFilterFunction(text)} />
          <Icon style={{marginRight:5}} size={25} name="magnify" />
        </Item>
        <View style={styles.MainContainer}>

          <View style={{ height: '100%' }}>

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
const styles = StyleSheet.create({
  MainContainer:
  {
 
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height
  
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
   
     fontWeight: 'bold',
    color: 'green',
    paddingLeft: 10,
  },
  signUpText1: {
  
     fontWeight: 'bold',
    color: 'green',
 
  },

  signUpText00: {
    fontSize: 14,
     color: '#C0C0C0',
    
    paddingLeft: 10,
  },
  signUpText11: {
    fontSize: 14,
   
    width: wp('60%'),
    color: 'black',
   
  },
  signUpText000: {
    fontSize: 12,
  color:'#C0C0C0',

    paddingLeft: 10,
  },
  signUpText000text: {
    fontSize: 12,
     color:'#c0c0c0',
    paddingLeft: 10,
  },
  signUpText000text1: {
    fontSize: 12,
    paddingLeft: 10,
  },
  textStyle: {

    color: '#fff',
    fontSize: 22
  },
  signUpText111: {
    fontSize: 12,

    color: 'black',
    paddingLeft: 23,
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
    fontSize: 12,
    paddingRight: 10,
  
    paddingLeft: 23,
  
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

  signUpText3: {

   
    fontSize: 14,
    width: wp('90%'),
     fontWeight: 'bold',
 
    width: wp('40%'),
  },
  signUpText4: {
  color:'#C0C0C0',
    paddingLeft: 10,

    fontSize: 14,
   
  },


  signUpText33: {

 
    fontSize: 12,
width:'80%',
    alignItems: 'center',
  },
  signUpText44: {
 
    paddingLeft: 10,
  color:'#C0C0C0',
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
    fontSize: 20,
    justifyContent: 'center',


    color: 'white',
    alignSelf: 'center',
  },
  signUpText03: {

    fontSize: 14,
    color: 'red',
    paddingLeft: -10,
    alignSelf: 'flex-end',
    fontWeight:'bold',


    alignItems: 'center',
  },
  boxheader: {
    
    flexDirection: 'column',


  },
});