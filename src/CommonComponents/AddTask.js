/*
FileName:AddTask.js
Version:1.0.0
Purpose: Add or Modify the Maintask 
Devloper:Rishitha,Harsha
*/
import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, StatusBar, Dimensions, TouchableOpacity, Linking, TextInput, Alert } from 'react-native';
import { Title, Button, Container, Content, Header, Right, Left, Body, Tab, Tabs, TabHeading, Footer, Item, Input, FooterTab } from 'native-base';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import SearchableDropdown from 'react-native-searchable-dropdown';
import AsyncStorage from '@react-native-community/async-storage';
import { tsMethodSignature } from '@babel/types';
import {API }from "../WebServices/RestClient";
import NetInfo from '@react-native-community/netinfo';
import Snackbar from 'react-native-snackbar';;

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
      error1:'',error2:'',error:'',
    };
  }

  //getting the Employees list for addind maintask
  getEmployees() {

    const { ModuleId } = this.state;
    const { ideaid } = this.state;

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
      fetch(API+'getEmployees.php',
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
        });
      }
    });
    });
  }

  isValid() {
    const { tasktitle, taskdescription,assignedto} = this.state;
    let valid = false;
  
     if(tasktitle.length===0){
      // ToastAndroid.showWithGravity('"Enter sub Task', ToastAndroid.SHORT,ToastAndroid.CENTER);
      this.setState({ error1: 'Enter Task Title ' });
    }
    else if (taskdescription.length === 0) {
      // alert("Enter Description");
      // ToastAndroid.showWithGravity('"Enter Description', ToastAndroid.SHORT,ToastAndroid.CENTER);
      this.setState({ error2: 'Enter Description ' });
    }
    else if (assignedto.length === 0) {
      // ToastAndroid.showWithGravity('"Enter Description', ToastAndroid.SHORT,ToastAndroid.CENTER);
      this.setState({ error3: 'Select Source ' });
    }
  
    else {
      valid = true;
    }
    return valid;
  }
  //Add or Modify the Maintask start
  addMainTask() {


    const { addTask } = this.state;
    const { modifyTask } = this.state;

    const { ModuleId } = this.state;
    const { ideaid } = this.state;

    if (modifyTask == 'modify') {

      const { ModuleId } = this.state;
      const { ideaid } = this.state;
      const { maintaskid } = this.state;

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
          }else{
            if(this.isValid()){
        fetch(API+'manageMaintasks.php',
          {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              action: "modify",
              crop: cropcode,
              title: this.state.tasktitle,
              description: this.state.taskdescription,
              module_id: ModuleId,
              idea_id: ideaid,
              added_to: this.state.assignedto,
              added_by: userToken,
              mainTaskId: maintaskid
            })
          })
          .then((response) => response.json())
          .then((responseJson) => {
            this.props.navigation.goBack();
            console.log("modify" + responseJson);
          })
          .catch((error) => {
            console.error(error);
          });
        }
      }
      });
      });

    } else if (addTask == 'add') {

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
          }else{
            if(this.isValid()){
        fetch(API+'manageMaintasks.php',
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
      });

    } else {

      Alert.alert("No Action");
    }
  }
  //Add or Mpdify the Maintask close
  componentDidMount() {

    this.getEmployees();
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
            <Icon name="arrow-left" size={25} style={{ color: '#fff', }} onPress={() =>
             this.props.navigation.goBack(null)} />
          </Left>
          <Body>
                        <Title style={{ color: '#fff', fontWeight: '600' }}>Add Main Task</Title>
                    </Body>
                    <Right></Right>
        </Header>

        <Content>
          <View style={{ paddingTop: 80, }}>
            <View style={{ paddingLeft: 10, }}>

              <TextInput style={{ width: wp('95%'), height: 45, color: 'black', borderBottomWidth: 1, }}
                placeholder='Main Task Title'
                underlineColorAndroid='transparent'
                // selectionColor='white'
                onChangeText={(maintask) => this.setState({ tasktitle: maintask })}
              >
              </TextInput>
              
              <Text style={{color:'red'}}>{this.state.error1}</Text>
            </View>

            <View style={{ paddingLeft: 10, }}>


              <TextInput style={{ width: wp('95%'), height: 45, color: 'black', borderBottomWidth: 1, }}
                placeholder='Description:'
                underlineColorAndroid='transparent'
                // selectionColor='white'
                onChangeText={(description) => this.setState({ taskdescription: description })}>
                </TextInput>
              <Text style={{color:'red'}}>{this.state.error2}</Text>
            </View>
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
              <Text style={{color:'red'}}>{this.state.error3}</Text>
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingTop: 50 }}>
              <TouchableOpacity style={{
                margin: 5, backgroundColor: '#00A2C1', borderRadius: 5, padding: 19, height: 30, alignItems: "center",
                justifyContent: 'center'
              }} onPress={() => { this.addMainTask() }}>
                <Text style={{ color: 'white' }}>SAVE</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{
                margin: 5, backgroundColor: '#00A2C1', borderRadius: 5, padding: 20, height: 30, alignItems: "center",
                justifyContent: 'center'
              }} onPress={() => this.props.navigation.goBack()}>
                <Text style={{ color: 'white' }}>CANCEL</Text>

              </TouchableOpacity>
            </View>

          </View>
        </Content>
      </Container>
    );
  }
}