/*
FileName:ModifySubTask.js
Version:1.0.0
Purpose:Modify the existing Subtask based on TaskId
Devloper:Raju,Mahesh,Naveen
*/
import React, { Component } from 'react';
import Requesteddata from '../AdminComponets/AdminRequestedDataProjects';
import { Platform, StyleSheet, Text, View, Dimensions, FlatList, TouchableHighlight, Image, TouchableOpacity, TextInput, Alert } from 'react-native';
import { Left, Button, Container, Header, Content, Item, Input } from 'native-base';
import AsyncStorage from '@react-native-community/async-storage';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Modal from "react-native-simple-modal";
import { API } from "../WebServices/RestClient";
import NetInfo from '@react-native-community/netinfo';
import Snackbar from 'react-native-snackbar';
import SearchableDropdown from 'react-native-searchable-dropdown';
import Toast from 'react-native-simple-toast';
import log from '../LogFile/Log';

export default class ModifySubTask extends React.Component {

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
      days: this.props.navigation.state.params.days,
      hours: '',
      time: this.props.navigation.state.params.hours,
      person: '',
      subTaskId: this.props.navigation.state.params.subTaskId,
      dependencyid: '',
      action: this.props.navigation.state.params.action,//getting action
      subTask: this.props.navigation.state.params.subTask,//idea id
      name: this.props.navigation.state.params.name,
      // person:this.props.navigation.state.params.person,

      description: this.props.navigation.state.params.description,
      error1: '', error2: '', error3: '', error4: '', error5: '',
      itemPressedDisabled:false,
    };

  }
  modalDidOpen = () => console.log("Modal did open.");

  modalDidClose = () => {
    this.props.navigation.goBack();
    this.setState({ open: false }); this.setState({ open: false });
    console.log("Modal did close.");

  };

  //Dialog actions start
  moveUp = () => this.setState({ offset: -100 });

  resetPosition = () => {
    this.setState({ offset: 0 });
    this.props.navigation.goBack();
  }

  //open the dialog 
  openModal = () => {
    this.setState({ open: true })

  };
  //Close the dialog
  closeModal = () => {
    this.setState({
      open: false,
      error1: '', error2: '', error3: '', error4: '', error5: '',
    });
    // this.props.navigation.goBack();
    const { params } = this.props.navigation.state;
    const { goBack } = this.props.navigation;
    params.callHome();
    goBack();
  }
  //Dialog actions end
  componentDidMount() {
    log("Debug", "modify Sub Task screen is loaded");
    this.empSearch();//Getting the Employees List
    this.dependencySearch();//Getting the Dependency Task List
    this.openModal();//open dialog

    // alert(this.props.navigation.state.params.person);

  }

  //Refresh data
  onRefresh() {
    this.setState({ isFetching: true }, function () { this.add() });
  }

  //Text field validation method
  isValid() {
    const { person, subTask, description, days, time, } = this.state;
    let valid = false;

    if (subTask.length === 0) {
      log("Warn", " subTask should not be empty");
      this.setState({ error1: 'Enter sub Task ' });
    }
    else if (description.length === 0) {
      log("Warn", " description should not be empty");
      this.setState({ error2: 'Enter Description ' });
    }
    else if (days.length === 0) {
      log("Warn", " days should not be empty");
      this.setState({ error3: 'Enter Days' });
    }
    else if (time.length === 0) {
      log("Warn", " time should not be empty");
      this.setState({ error4: 'Enter Time ' });
    }
    else if (person.length === 0) {
      log("Warn", " person should not be empty");
      this.setState({ error5: 'Enter Source ' });
    }

    else {
      valid = true;
    }
    return valid;
  }//isValid method close

  isUpdatedSucess() {
    Toast.show("Sub Task Updated", Toast.LONG);
  }

  //Add the subtask start
  addSubTask = () => {
    log("Info", " addSubTask( person, item, dependencyid, subTask, description, days, time, ) is used to Add the subtask");
    const { person, item, dependencyid, subTask, description, days, time, } = this.state;
    console.log(person);
    // console.log(dependency);
    console.log(subTask);
    console.log(item);
 
    let EstHours = Number(days * 24) + Number(time);

    //employee id
    AsyncStorage.getItem("empId", (err, res) => {
      const empId = res;

      //cropcode
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
            if (this.isValid()) {
              this.setState({ itemPressedDisabled: true })
              fetch(API + 'manageSubtasks.php', {
                method: 'POST',
                headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({

                  title: this.state.subTask,
                  description: description,
                  days: days,
                  assignedBy: empId,
                  assignedTo: person,
                  dependencyId: this.state.dependencyid,
                  action: "modify",
                  days: this.state.days,
                  hours: this.state.time,
                  subtaskid: this.state.subTaskId,
                  empId: empId,
                  crop: cropcode,

                })
              }).then((response) => response.json())
                .then((responseJson) => {
                  // alert(JSON.stringify(responseJson));
                  console.log(days);
                  console.log(description);
                  console.log(person);
                  console.log(responseJson);
                  if (responseJson.status === 'true') {
                    this.setState({ itemPressedDisabled: false })
                    console.log("done")
                    this.setState({ open: false })
                  } else {
                    log("Warn", "task not modified");
                    alert("task not modified");
                  }
                }).catch((error) => {
                  console.error(error);
                  log("Error", "Add the subtask error");
                });
              this.closeModal();
              this.isUpdatedSucess();
            }
          }
        });
      });
    });

  };
  //Getting the Employees List start
  empSearch() {
    log("Info", " empSearch(cropcode) is used to Getting the Employees List");
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
          fetch(API + 'getEmployees.php', {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              action: "add",
              crop: crop //Async
            })
          })
            .then((response) => response.json())
            .then((responseJson) => {

              this.setState({
                empData: [...responseJson.data],
              });
            }
            )
            .catch((error) => {
              console.error(error);
              log("Error", "Getting the Employees error");
            });
        }
      });
    });
  }
  //Getting Employees List end

  //Getting dependency task list start
  dependencySearch() {
    log("Info", " dependencySearch(cropcode) is used to Getting the Dependency List");
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
          fetch(API + 'getSubtasks.php', {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              action: "setdependency",
              crop: crop //Async
            })
          })
            .then((response) => response.json())
            .then((responseJson) => {

              this.setState({
                dependencyData: [...responseJson.data],
              });
            }
            )
            .catch((error) => {
              console.error(error);
              log("Error", "Getting the Dependency error");
            });
        }
      });
    });
  }


  render() {

    return (
      <Modal
        offset={this.state.offset}
        open={this.state.open}
        modalDidOpen={this.modalDidOpen}
        modalDidClose={this.modalDidClose}
        style={{ alignItems: "center", backgroundColor: 'white' }} >

        <View style={{ alignItems: "center", backgroundColor: 'white' }}>

          <View style={{ marginLeft: 10, width: '100%', backgroundColor: 'white' }}>
            <Text style={{ color: 'red' }}>{this.state.error1}</Text>
            <TextInput placeholder="Sub Task Title" style={{ width: '90%', borderBottomWidth: 0.5 }}
              value={this.state.subTask}
              onChangeText={(text) => this.setState({ subTask: text })}></TextInput>
            <Text style={{ color: 'red' }}>{this.state.error2}</Text>
            <TextInput placeholder="Description" style={{ width: '90%', borderBottomWidth: 0.5 }}
              value={this.state.description}
              onChangeText={(text) => this.setState({ description: text })}></TextInput>
          </View>

          <View style={{ marginLeft: 10, width: '100%', }}>
            <Text style={{ paddingTop: 10 }}>Estimated Time</Text>
            <View style={{ flexDirection: 'row', marginTop: 10, }}>
              <Text style={{ color: 'red' }}>{this.state.error3}</Text>
              <Text style={{ color: 'red', marginLeft: 50 }}>{this.state.error4}</Text>
            </View>
            <View style={{ flexDirection: 'row', marginTop: 10 }}>

              <TextInput style={{ width: '20%', height: '80%', borderWidth: 0.2 }}
                numeric value keyboardType={'numeric'}
                value={this.state.days.toString()}
                onChangeText={(text) => this.setState({ days: text })}></TextInput>
              <Text style={{ paddingLeft: 10, paddingTop: 10 }}>Days</Text>

              <TextInput style={{ marginLeft: 10, width: '20%', height: '80%', borderWidth: 0.2 }}
                // value={this.state.hours}
                numeric value keyboardType={'numeric'}
                value={this.state.time.toString()}
                onChangeText={(text) => this.setState({ time: text })}></TextInput>
              <Text style={{ paddingLeft: 10, paddingTop: 10 }}>Hours</Text>

            </View>
          </View>
          <Text style={{ paddingTop: 10 }}>Select Resources</Text>
          <Text style={{ color: 'red' }}>{this.state.error5}</Text>
          <SearchableDropdown
            onTextChange={this.state.name}
            // value={this.props.navigation.state.params.name}
            items={this.state.name}
            // onItemSelect={item =>item.name}
            onItemSelect={item => this.setState({ person: item.id })}

            containerStyle={{ padding: 5, color: 'black', }}

            textInputStyle={{
              color: 'black',
              padding: 12,
              borderWidth: 1,
              borderColor: '#ccc',
              // backgroundColor: '#FAF7F6',
              justifyContent: 'center',
              width: wp('85%'),
              // borderRadius:10,

            }}
            itemStyle={{

              padding: 10,
              marginTop: 2,
              // backgroundColor: '#FAF9F8',
              borderColor: '#bbb',
              borderWidth: 1,
              // borderRadius:10,

            }}
            itemTextStyle={{
              color: 'black',
            }}
            itemsContainerStyle={{
              maxHeight: '80%',
            }}
            items={this.state.empData}
            // onTextChange={(text)=>this.props.navigation.state.params.name}
            //  defaultIndex={this.props.navigation.state.params.name}        
            placeholder="          SELECT RESOURCE"

            underlineColorAndroid="transparent"
          />

          <Text style={{ paddingTop: 10 }}>Add Dependency</Text>

          <SearchableDropdown

            onTextChange={text => console.log(text)}
            // onItemSelect={item =>(JSON.stringify(item.name))}
            onItemSelect={(item) => { this.setState({ dependencyid: item.id }) }}

            containerStyle={{ padding: 5, color: 'black', }}

            textInputStyle={{
              color: 'black',
              padding: 12,
              borderWidth: 1,
              borderColor: '#ccc',
              // backgroundColor: '#FAF7F6',
              justifyContent: 'center',
              width: wp('85%'),
              // borderRadius:10,

            }}
            itemStyle={{

              padding: 10,
              marginTop: 2,
              // backgroundColor: '#FAF9F8',
              borderColor: '#bbb',
              borderWidth: 1,
              // borderRadius:10,

            }}
            itemTextStyle={{
              color: 'black',
            }}
            itemsContainerStyle={{
              maxHeight: '80%',
            }}
            value={this.state.subTask}
            items={this.state.dependencyData}
            // defaultIndex={1}

            placeholder="          ADD DEPENDENCY"

            underlineColorAndroid="transparent"
          />


          <View style={{ flexDirection: 'row', marginTop: 30 }}>
            <TouchableOpacity style={styles.opencancel} onPress={this.closeModal}>
              <Text style={{ color: 'white' }}>CANCEL</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.opensave} onPress={this.addSubTask} disabled={this.state.itemPressedDisabled}>
              <Text style={{ color: 'white' }}>SAVE</Text>

            </TouchableOpacity>
          </View>

        </View>

      </Modal>
    );
  }
}
//Styles for UI
const styles = StyleSheet.create(
  {
    MainContainer:
    {
      flex: 1,
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height
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

    textStyle: {
      color: '#fff',
      fontSize: 18
    },
    container: {
      flex: 1,
      width: '90%',
      paddingLeft: hp('2%'),
    },
    footer: {
      position: 'absolute',
      flex: 0.1,
      left: 0,
      right: 0,
      bottom: -10,
      backgroundColor: 'green',
      flexDirection: 'row',
      height: 80,
      alignItems: 'center',
    },
    bottomButtons: {
      alignItems: 'center',
      justifyContent: 'center',
      flex: 1,
    },
    footerText: {
      color: 'white',
  
      alignItems: 'center',
      fontSize: 18,
    },
    buttonContainer: {
      width: wp('90%'),
      alignSelf: 'baseline',
      marginBottom: 25,
      color: '#d2691e',
      marginLeft: 4,



    },
    signupButton: {

      backgroundColor: '#ffffff',
    },
    subcontainer: {
      flex: 2,
      flexDirection: 'row',
      paddingTop: 40
    },
    signUpText0: {
      fontSize: 13,
      color: 'green',
      paddingTop: 10,

    },
    signUpText1: {
      fontSize: 13,
      color: 'green',
      paddingTop: 10,

      paddingLeft: 10,
    },
    end: {

      alignItems: 'flex-end',

    },
    end1: {
      flex: 2,
      height: '50%',
      paddingTop: 20,
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

    },
    signUpText2: {
      fontSize: 10,
      marginLeft: 200,
      fontSize: 13,
      color: 'green',
      paddingTop: 10,

    },
    signUpText3: {

      fontSize: 12,
      paddingTop: 10,
      paddingLeft: 10,

      alignItems: 'center',
    },
    signUpText4: {
      fontSize: 12,
      paddingTop: 10,


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
      flexDirection: 'row',
      position: 'relative',
      marginBottom: 10,


    },
    signUpText: {
      fontSize: 20,
      justifyContent: 'center',


      color: 'white',
      alignSelf: 'center',
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



