/*
FileName:AddTask.js
Version:1.0.0
Purpose: Add or Modify the Maintask 
Devloper:Rishitha,Naveen,Harsha
*/
import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, StatusBar, Dimensions, TouchableOpacity, Linking, TextInput, Alert } from 'react-native';
import { Title, Button, Container, Content, Header, Right, Left, Body, Tab, Tabs, TabHeading, Footer, Item, Input, FooterTab } from 'native-base';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import SearchableDropdown from 'react-native-searchable-dropdown';
import AsyncStorage from '@react-native-community/async-storage';
import { tsMethodSignature } from '@babel/types';
import { API } from "../WebServices/RestClient";
import NetInfo from '@react-native-community/netinfo';
import Snackbar from 'react-native-snackbar';
import log from '../LogFile/Log';
import Toast from 'react-native-whc-toast';

export default class AddTask extends Component {

  constructor(props) {
    super(props);

    this.state = {
      tasktitle: '',
      taskdescription: '',
      modalVisible: false,
      resource: [],
      name: "",
      assignedto: '',
      ModuleId: this.props.navigation.state.params.moduleid,//ModuleId
      ideaid: this.props.navigation.state.params.IdeaId,//Idea Id
      addTask: this.props.navigation.state.params.addTask,//action for add task
      modifyTask: this.props.navigation.state.params.modifyTask,//action for modify task
      maintaskid: this.props.navigation.state.params.maintaskid,//maintaskId
      error1: '', error2: '', error: '',
      maintasktitle: this.props.navigation.state.params.maintasktitle,//maintaskId,
      maintaskdesc: this.props.navigation.state.params.maintaskdesc,//maintaskId
      itemPressedDisabled: false,
    };
  }

  //getting the Employees list for addind maintask
  getEmployees() {
    log("Info", " getEmployees(cropcode) is used for getting the Employees list for addind maintask");
    const { ModuleId } = this.state;
    const { ideaid } = this.state;

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
          fetch(API + 'getEmployees.php',
            {
              method: 'POST',
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                crop: cropcode
              })
            })
            .then((response) => response.json())
            .then((responseJson) => {
              if (responseJson.status === 'True') {
                this.setState({
                  resource: responseJson.data
                });
              }
            })
            .catch((error) => {
              console.error(error);
              log("Error", "requested projects error");
            });
        }
      });
    });
  }
  //Checking the Validations
  isValid() {
    const { tasktitle, taskdescription, assignedto } = this.state;
    let valid = false;

    if (tasktitle.length === 0) {
      log("Warn", "tasktitle title should not be empty");
      this.setState({ error1: 'Enter Task Title ' });
    }
    else if (taskdescription.length === 0) {
      // alert("Enter Description");
      log("Warn", "taskdescription title should not be empty");
      this.setState({ error2: 'Enter Description ' });
    }
    else if (assignedto.length === 0) {
      log("Warn", "taskdescription title should not be empty");
      this.setState({ error3: 'Select Source ' });
    }

    else {
      valid = true;
    }
    return valid;
  }

  IsValid() {
    const { maintasktitle, maintaskdesc, assignedto } = this.state;
    let valid = false;

    if (maintasktitle.length === 0) {
      log("Warn", "maintasktitle title should not be empty");
      this.setState({ error1: 'Enter Task Title ' });
    }
    else if (maintaskdesc.length === 0) {
      log("Warn", "maintaskdesc title should not be empty");
      this.setState({ error2: 'Enter Description ' });
    }
    else if (assignedto.length === 0) {
      log("Warn", "assignedto title should not be empty");
      this.setState({ error3: 'Select Source ' });
    }

    else {
      valid = true;
    }
    return valid;
  }

  //Add or Modify the Maintask start
  addMainTask() {

    log("Info", " addMainTask(addTask, modifyTask,) is used to add maintask");
    const { addTask } = this.state;
    const { modifyTask } = this.state;

    const { ModuleId } = this.state;
    const { ideaid } = this.state;

    if (modifyTask == 'modify') {

      const { ModuleId } = this.state;
      const { ideaid } = this.state;
      const { maintaskid } = this.state;
      //Getting the role and id
      AsyncStorage.multiGet(["cropcode", "userToken"], (err, response) => {
        const cropcode = response[0][1];
        const userToken = response[1][1];
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
            if (this.IsValid()) {

              this.setState({ itemPressedDisabled: true })
              fetch(API + 'manageMaintasks.php',
                {
                  method: 'POST',
                  headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    action: "modify",
                    crop: cropcode,
                    title: this.state.maintasktitle,
                    description: this.state.maintaskdesc,
                    module_id: ModuleId,
                    idea_id: ideaid,
                    added_to: this.state.assignedto,
                    added_by: userToken,
                    mainTaskId: maintaskid
                  })
                })
                .then((response) => response.json())
                .then((responseJson) => {
                  this.setState({ itemPressedDisabled: false })
                  this.props.navigation.goBack();
                  console.log("modify" + responseJson);
                })
                .catch((error) => {
                  console.error(error);
                  log("Error", "requested projects error");
                });
            }
          }
        });
        this.refs.toast.showCenter('Main Task Modified');
      });

    } else if (addTask == 'add') { //Add subtask

      const { ModuleId } = this.state;
      const { ideaid } = this.state;
      AsyncStorage.multiGet(["cropcode", "userToken"], (err, response) => {
        const cropcode = response[0][1];
        const userToken = response[1][1];
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
              fetch(API + 'manageMaintasks.php',
                {
                  method: 'POST',
                  headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    action: "add",
                    crop: cropcode,
                    title: this.state.tasktitle,
                    description: this.state.taskdescription,
                    module_id: ModuleId,
                    idea_id: ideaid,
                    added_to: this.state.assignedto,
                    added_by: userToken,
                  })
                })
                .then((response) => response.json())
                .then((responseJson) => {
                  this.props.navigation.goBack();
                  console.log(responseJson);
                })
                .catch((error) => {
                  console.error(error);
                });
            }
          }
        });
        this.refs.toast.showCenter('Main Task Added');
      });

    } else {

      Alert.alert("No Action");
    }
  }
  //Add or Mpdify the Maintask close
  componentDidMount() {
    //Getting Employees List
    log("Debug", "Add Task screen is loaded");
    this.getEmployees();
  }

  render() {
    let button;
    const { addTask } = this.state;
    const { modifyTask } = this.state;
    if (addTask == 'add') {
      button = <View>
        <View style={{ paddingLeft: 10, }}>

          <TextInput style={{ width: wp('95%'), height: 45, color: 'black', borderBottomWidth: 1, }}
            placeholder='Main Task Title'
            underlineColorAndroid='transparent'
            // selectionColor='white'
            onChangeText={(maintask) => this.setState({ tasktitle: maintask })}
          >
          </TextInput>

          <Text style={{ color: 'red' }}>{this.state.error1}</Text>
        </View>

        <View style={{ paddingLeft: 10, }}>


          <TextInput style={{ width: wp('95%'), height: 45, color: 'black', borderBottomWidth: 1, }}
            placeholder='Description:'
            underlineColorAndroid='transparent'
            // selectionColor='white'
            onChangeText={(description) => this.setState({ taskdescription: description })}>
          </TextInput>
          <Text style={{ color: 'red' }}>{this.state.error2}</Text>
        </View>
      </View>
    } else if (modifyTask == 'modify') {

      button = <View>
        <View style={{ paddingLeft: 10, }}>

          <TextInput style={{ width: wp('95%'), height: 45, color: 'black', borderBottomWidth: 1, }}
            placeholder='Main Task Title'
            underlineColorAndroid='transparent'
            // selectionColor='white'
            value={this.state.maintasktitle}
            onChangeText={(maintask) => this.setState({ maintasktitle: maintask })}

          >
          </TextInput>

          <Text style={{ color: 'red' }}>{this.state.error1}</Text>
        </View>

        <View style={{ paddingLeft: 10, }}>


          <TextInput style={{ width: wp('95%'), height: 45, color: 'black', borderBottomWidth: 1, }}
            placeholder='Description:'
            underlineColorAndroid='transparent'
            // selectionColor='white'
            value={this.state.maintaskdesc}
            onChangeText={(description) => this.setState({ maintaskdesc: description })}>

          </TextInput>
          <Text style={{ color: 'red' }}>{this.state.error2}</Text>
        </View>
      </View>

    } else {
      button = null;
    }

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
            <Icon name="arrow-left" size={25} style={{ color: '#fff', }} onPress={() =>
              this.props.navigation.goBack(null)} />
          </Left>
          <Body>
            <Title style={{ color: '#fff', fontWeight: '600' }}>MainTask Info</Title>
          </Body>
          <Right></Right>
        </Header>

        <Content>
        <Toast ref="toast" />
          <View style={{ paddingTop: 80, }}>
            {/* <View style={{ paddingLeft: 10, }}>

              <TextInput style={{ width: wp('95%'), height: 45, color: 'black', borderBottomWidth: 1, }}
                placeholder='Main Task Title'
                underlineColorAndroid='transparent'
                // selectionColor='white'
                onChangeText={(maintask) => this.setState({ tasktitle: maintask })}
              >
              </TextInput>

              <Text style={{ color: 'red' }}>{this.state.error1}</Text>
            </View> */}

            {/* <View style={{ paddingLeft: 10, }}>


              <TextInput style={{ width: wp('95%'), height: 45, color: 'black', borderBottomWidth: 1, }}
                placeholder='Description:'
                underlineColorAndroid='transparent'
                // selectionColor='white'
                onChangeText={(description) => this.setState({ taskdescription: description })}>
              </TextInput>
              <Text style={{ color: 'red' }}>{this.state.error2}</Text>
            </View> */}{button}
            <View style={{ paddingTop: 20, }}>
              <SearchableDropdown
                placeholder="select resource"
                onTextChange={text => console.log(text)}
                // onItemSelect={item => item.name}
                onItemSelect={(item) => this.setState({ assignedto: item.id })}
                containerStyle={{ padding: 5 }}
                textInputStyle={{
                  padding: 12,
                  borderWidth: 1,
                  borderColor: '#ccc',
                  backgroundColor: '#FAF7F6',
                }}
                itemStyle={{
                  padding: 10,
                  marginTop: 2,
                  backgroundColor: '#FAF9F8',
                  borderColor: '#bbb',
                  borderWidth: 1,
                }}
                itemTextStyle={{

                  color: '#222',
                }}
                itemsContainerStyle={{

                  // maxHeight: '60%',
                }}
                items={this.state.resource}

                defaultIndex={2}

                // placeholder=""

                resetValue={false}

                underlineColorAndroid="transparent"

              />
              <Text style={{ color: 'red' }}>{this.state.error3}</Text>
            </View>

            <View style={{ flexDirection: 'row', marginTop: 10, justifyContent: "space-between" }}>
              <TouchableOpacity style={styles.opensave} onPress={() => { this.addMainTask() }} disabled={this.state.itemPressedDisabled}>
                <Text style={{ color: 'white' }}>SAVE</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.opencancel} onPress={() => this.props.navigation.goBack()}>
                <Text style={{ color: 'white' }}>CANCEL</Text>

              </TouchableOpacity>

            </View>

          </View>
        </Content>
      </Container>
    );
  }
}
//Styles for UI
const styles = StyleSheet.create({
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