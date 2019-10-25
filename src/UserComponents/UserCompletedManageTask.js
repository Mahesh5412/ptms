/*
FileName:UserCompletedManageTasks.js
Version:1.0.0
Purpose:Getting the List of completedProjects and also verify the project by role
Devloper:Rishitha,Harsha
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

class ListItemLevel1 extends React.Component {

  //to verify the main task 
  // to validate the user
  MaintaskVerify() {

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
        }else{
      fetch(API+'manageMaintasks.php',
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

          }
        })
        .catch((error) => {
          console.error(error);
        });
      }
    });
    });
  }

  render() {
    const { item } = this.props;
    if (this.state.isLoading) {
      return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <DotIndicator color='#00A2C1' />
        </View>
      );

    }
    return (

      <View>
        <Collapse style={styles.container}>


          <CollapseHeader style={styles.boxheader}>

            <View style={{ flexDirection: 'row' }}>
              <Text style={styles.signUpText0} >Task_ID:</Text>
              <Text style={styles.signUpText1} >{item.taskid}</Text>
            </View>
            <Text style={styles.signUpText2} >{item.assignedon}</Text>


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
              <TouchableOpacity onPress={() => { this.MaintaskVerify() }}>
                <Text style={styles.signUpText02} >{item.completeStatus} </Text>
              </TouchableOpacity>

            </View>

          </CollapseHeader>
          <CollapseBody>


            <View style={{ flexDirection: 'row', paddingRight: 25, }}>
              <Text style={styles.signUpText44} >Description</Text>
              <Text style={styles.signUpText33} >{item.taskdescription}</Text>
              {/* <Text style={styles.signUpText33} >{item.recipeNames}</Text> */}
            </View>


            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
              <TouchableOpacity style={{ width: 100, backgroundColor: 'red' }} onPress={() => this.props.AddSubTask()}>
                <Text style={{ color: '#fff', textAlign: 'center' }}>ADD SUB TASk</Text></TouchableOpacity>
              <TouchableOpacity style={{ width: 120, backgroundColor: '#6cbb3f', marginLeft: 10, }} onPress={() => this.props.Module()}>
                <Text style={{ color: '#fff', textAlign: 'center' }}>VIEW SUB TASK</Text></TouchableOpacity>

            </View>


          </CollapseBody>

        </Collapse>

      </View>
    )
  }
}
class ListItemLevel2 extends React.Component {

  //to verify the main task 
  // to validate the user
  MaintaskVerify() {

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
        }else{
      fetch(API+'manageMaintasks.php',
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

          }
        })
        .catch((error) => {
          console.error(error);
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

            <View style={{ flexDirection: 'row',pad }}>
              <Text style={styles.signUpText0} >Task_ID:</Text>
              <Text style={styles.signUpText1} >{item.taskid}</Text>
              {/* <Text style={styles.signUpText1} >{item.date}</Text> */}
            </View>
            <Text style={styles.signUpText2} >{item.assignedon}</Text>


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
              <TouchableOpacity onPress={() => { this.MaintaskVerify() }}>
                <Text style={styles.signUpText02} >{item.completeStatus} </Text>
              </TouchableOpacity>

            </View>

          </CollapseHeader>
          <CollapseBody>


            <View style={{ flexDirection: 'row', paddingRight: 25 }}>
              <Text style={styles.signUpText44} >Description</Text>
              <Text style={styles.signUpText33} >{item.taskdescription}</Text>
              {/* <Text style={styles.signUpText33} >{item.recipeNames}</Text> */}
            </View>


            <View style={styles.box1}>

              <View style={{ flexDirection: 'row' }}>
                <Text style={styles.signUpText000} >Target Time:</Text>
                <Text style={styles.signUpText111} >{item.targettime}</Text>
                {/* <Text style={styles.signUpText1} >{item.date}</Text> */}
              </View>
              <Text style={styles.signUpText002} >Task Status:{item.completeStatus}% completed </Text>


            </View>
            <View style={styles.box1}>

              <View style={{ flexDirection: 'row' }}>
                <Text style={styles.signUpText000} >Assigned on:</Text>
                <Text style={styles.signUpText111} >{item.assignedon}</Text>
                {/* <Text style={styles.signUpText1} >{item.date}</Text> */}
              </View>
              {/* <Text style={styles.signUpText002} >Assigned By:Rishitha </Text> */}
            </View>

            <View style={{ flexDirection: 'row', paddingRight: 25, }}>
              <Text style={styles.signUpText44} >Assigned By:</Text>
              <Text style={styles.signUpText33} >{item.assignby}</Text>
              {/* <Text style={styles.signUpText33} >{item.recipeNames}</Text> */}
            </View>

            <View style={{ flexDirection: 'row', paddingRight: 25, }}>
              <Text style={styles.signUpText44} >Task status Description:</Text>
              <Text style={styles.signUpText33} >{item.taskStatusDesc}</Text>
              {/* <Text style={styles.signUpText33} >{item.recipeNames}</Text> */}
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
              <TouchableOpacity style={{ width: 100, backgroundColor: 'red' }} onPress={() => this.props.AddSubTask()}>
                <Text style={{ color: '#fff', textAlign: 'center' }}>ADD SUB TASk</Text></TouchableOpacity>
              <TouchableOpacity style={{ width: 120, backgroundColor: '#6cbb3f', marginLeft: 10, }} onPress={() => this.props.Module()}>
                <Text style={{ color: '#fff', textAlign: 'center' }}>VIEW SUB TASK</Text></TouchableOpacity>

            </View>


          </CollapseBody>

        </Collapse>

      </View>
    )
  }
}
class ListItem extends React.Component {

  //to verify the main task 
  // to validate the user
  MaintaskVerify() {

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

              }
            })
            .catch((error) => {
              console.error(error);
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
              <Text style={styles.signUpText0} >#Task_ID:</Text>
              <Text style={styles.signUpText1} >{item.taskid}</Text>
              {/* <Text style={styles.signUpText1} >{item.date}</Text> */}
            </View>


            <View style={{ flexDirection: 'row', paddingRight: 25, }}>
              <Text style={styles.signUpText4} >Project Title :</Text>
              <Text style={styles.signUpText3} >{item.projectitle}</Text>
            </View>




            <View style={styles.box1}>

              <View style={{ flexDirection: 'row' }}>
                <Text style={styles.signUpText00} >Task Title :</Text>
                <Text style={styles.signUpText11} >{item.tasktitle}</Text>
                {/* <Text style={styles.signUpText1} >{item.date}</Text> */}
              </View>
              <TouchableOpacity onPress={() => { this.MaintaskVerify() }}>
                <Text style={styles.signUpText02} >{item.completeStatus} </Text>
              </TouchableOpacity>

            </View>

          </CollapseHeader>
          <CollapseBody>


            <View style={{ flexDirection: 'row', paddingRight: 25, }}>
              <Text style={styles.signUpText44} >Description :</Text>
              <Text style={styles.signUpText33} >{item.taskdescription}</Text>
              {/* <Text style={styles.signUpText33} >{item.recipeNames}</Text> */}
            </View>


            <View style={styles.box1}>

              <View style={{ flexDirection: 'row' }}>
                <Text style={styles.signUpText000} >Target Time:</Text>
                <Text style={styles.signUpText111} >{item.targettime}</Text>
                {/* <Text style={styles.signUpText1} >{item.date}</Text> */}
              </View>
              <Text style={styles.signUpText002} >Task Status:{item.completeStatus}% completed </Text>


            </View>
            <View style={styles.box1}>

              <View style={{ flexDirection: 'row' }}>
                <Text style={styles.signUpText000} >Assigned on:</Text>
                <Text style={styles.signUpText111} >{item.assignedon}</Text>
                {/* <Text style={styles.signUpText1} >{item.date}</Text> */}
              </View>
              {/* <Text style={styles.signUpText002} >Assigned By:Rishitha </Text> */}
            </View>

            <View style={{ flexDirection: 'row', paddingRight: 25, }}>
              <Text style={styles.signUpText44} >Assigned By:</Text>
              <Text style={styles.signUpText33} >{item.assignby}</Text>
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
                <Text style={styles.signUpText111} >{item.assignby}dependency</Text>
                {/* <Text style={styles.signUpText1} >{item.date}</Text> */}
              </View>
              <Text style={styles.signUpText002} >Dependent:NA</Text>

            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
              <TouchableOpacity style={{ width: 100, backgroundColor: 'red' }} onPress={() => this.props.AddSubTask()}>
                <Text style={{ color: '#fff', textAlign: 'center' }}>ADD SUB TASk</Text></TouchableOpacity>
              <TouchableOpacity style={{ width: 120, backgroundColor: '#6cbb3f', marginLeft: 10, }} onPress={() => this.props.Module()}>
                <Text style={{ color: '#fff', textAlign: 'center' }}>VIEW SUB TASK</Text></TouchableOpacity>

            </View>


          </CollapseBody>

        </Collapse>

        <View style={{ backgroundColor: '#fff', height: 5 }}>

        </View>

      </View>
    )
  }
}
export default class UserCompletedManageTask extends Component {
  constructor(props) {

    super(props);
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
      LevelId:'',

    }
    this.arrayholder = [];
  }

  GetLevel(){
    AsyncStorage.getItem("levelno",(err ,res)=>{
      this.setState({LevelId:res});
    
    });
   }
  //  componentWillUpdate(){
  //   this.GetLevel();
  //  }
  componentDidMount() {
    this.GetLevel();
    this.manageTasksCompleted()
  }

  //to refresh the data in user completed main tasks
  onRefresh() {
    this.setState({ isFetching: true }, function () { this.manageTasksCompleted() });
  }



  componentWillReceiveProps(nextProps) {
    // console.log(nextProps);
    // console.log("re loading...........")
    // this.manageTasksCompleted();
  }


  //get all the mian task in user role
  manageTasksCompleted() {

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

              fetch(API + 'getmanagemaintasks.php',
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
                    // alert(JSON.stringify(responseJson));
                   // console.log(JSON.stringify(responseJson))
                    //alert(JSON.stringify(responseJson.data));
                     let viewitemsList=[];
                     if (this.state.isLoading) {
                      // return (
                      //   <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                      //     <DotIndicator color='#283B53' />
                      //   </View>
                      // );
                
                    
                    if (responseJson.status === 'true')
                      // alert(JSON.stringify(responseJson.data[0].ptime));
                    {
                      isLoading:false

                      for (let i = 0; i < JSON.stringify(responseJson.data.length); i++) {
                    
                      let time=JSON.stringify(responseJson.data[i].ptime)/24;
                      let comparetime=Number(ptime);
                      let countTime=Math.round(time);
                      if(comparetime >0){
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

                     }
                  })
                  
                  .catch((error) => {
                    console.error(error);
                  });
            }
          });
        });

        });

      });

    });



  }
  AddSubTask(item, index) {
    console.log(item);
    console.log(index);

    this.props.navigation.navigate('AddSubTaskModal', { action: 'modify', moduleId: item.moduleId, taskid: item.taskid });

  }



  //to navigate to next screeen
  Module = (item, index) => {

    console.log(item.taskid);
    console.log(index);
    this.props.navigation.navigate("ViewSubTasks", { taskId: item.taskid });

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

      const taskid = item.taskid.toUpperCase()
      const taskid1 = text.toUpperCase()
      const completeStatus = item.completeStatus.toUpperCase()
      const completeStatus1 = text.toUpperCase()
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
        completeStatus.indexOf(completeStatus1) > -1 ||
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

  render() {

    let ListDisplay
    if(this.state.LevelId=='1'){
 
     ListDisplay=<View style={styles.end1}>
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
                           <ListItemLevel1 navigation={this.props.navigation}
                             item={item}
                            //  openModal={() => this.openModal(item, index)}
                             ModifyMaintask={() => this.ModifyMaintask(item, index)}
                             Module={()=>this.Module(item,index)}
                             AddSubTask={()=>this.AddSubTask(item,index)}
                           />
                         </View>
                       }
                       keyExtractor={item => item.id}
                       ListEmptyComponent={this._listEmptyComponent}/>
                     </View>
 }
     else if(this.state.LevelId=='2'){
       ListDisplay=<View style={styles.end1}>
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
                     <ListItemLevel2 navigation={this.props.navigation}
                       item={item}
                      //  openModal={() => this.openModal(item, index)}
                       ModifyMaintask={() => this.ModifyMaintask(item, index)}
                       Module={()=>this.Module(item,index)}
                       AddSubTask={()=>this.AddSubTask(item,index)}
                     />
                   </View>
                 }
                 keyExtractor={item => item.id}
                 ListEmptyComponent={this._listEmptyComponent}/>
               </View>
 
   }else if(this.state.LevelId=='3'){
 
     ListDisplay=<View style={styles.end1}>
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
                  //  openModal={() => this.openModal(item, index)}
                   ModifyMaintask={() => this.ModifyMaintask(item, index)}
                   Module={()=>this.Module(item,index)}
                   AddSubTask={()=>this.AddSubTask(item,index)}
                 />
               </View>
             }
             keyExtractor={item => item.id}
             ListEmptyComponent={this._listEmptyComponent}/>
           </View>
 
   }else{
     ListDisplay=<View style={styles.end1}>
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
                //  openModal={() => this.openModal(item, index)}
                 ModifyMaintask={() => this.ModifyMaintask(item, index)}
                 Module={()=>this.Module(item,index)}
                 AddSubTask={()=>this.AddSubTask(item,index)}
               />
             </View>
           }
           keyExtractor={item => item.id}
           ListEmptyComponent={this._listEmptyComponent}/>
         </View>
   }

    return (
      <Container style={{ height: Dimensions.get('window').height }}>
        <Item>
          {/* <Icon name="ios-search" /> */}
          <Input placeholder="Search" />
          <Icon style={{marginRight:10, color:'#c0c0c0'}} size={20} name="search" />

        </Item>
        {ListDisplay}
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
    // width: '90%',
    // paddingLeft: hp('2%'),
  },
  container: {
    flex: 1,
    backgroundColor:'#f8f8f8',
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
    paddingBottom: 10,
    //  paddingTop: 20,
    // fontWeight: 'bold',
    color: '#000000',
    fontWeight: "bold",
    // paddingLeft: 23,
  },
  signUpText000: {
    fontSize: 12,
    // paddingTop: 20,
    // fontWeight: 'bold',
    // color: 'green',
    paddingBottom: 10,
    paddingLeft: 10,
  },
  signUpText111: {
    fontSize: 12,
    paddingBottom: 10,
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
    paddingBottom: 5,
    // fontWeight: 'bold',
    justifyContent: 'center',

  },
  signUpText002: {
    fontSize: 12,
    paddingRight: 10,
    // paddingTop: 20,
    paddingLeft: 23,
    // color: 'red',
    paddingBottom: 5,
    // fontWeight: 'bold',
    justifyContent: 'center',

  },
  signUpText3: {

    paddingBottom: 5,
    // paddingLeft: 23,
    fontSize: 14,
    // paddingRight:hp('-10%'),
    paddingRight: 13,
    fontWeight: "bold",
    // fontWeight: 'bold',
    color: '#000000',
    alignItems: 'center',
  },
  signUpText4: {
    paddingBottom: 5,
    paddingLeft: 10,
    // fontWeight: 'bold',
    //color: 'black',
    fontSize: 14,
    alignItems: 'center',
  },


  signUpText33: {

    paddingBottom: 5,
    // paddingLeft: 23,
    fontSize: 12,
    // paddingRight:hp('-10%'),
    paddingRight: 13,
    // fontWeight: 'bold',
    // paddingTop: -15,
    alignItems: 'center',
  },
  signUpText44: {
    paddingBottom: 5,
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