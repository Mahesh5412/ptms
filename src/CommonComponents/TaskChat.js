/*
FileName:TaskChat.js
Version:1.0.0
Purpose:Getting the List of task messages with GroupName and List of Group Members and also send Message
Devloper:Rishitha,Naveen
*/

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
  TextInput,
  FlatList,
  Button,
  Dimensions,
  KeyboardAvoidingView
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-community/async-storage';

import { Title, Container,Content, Header, Right, Left, Body, Tab, Tabs, TabHeading, Footer, Item, Input, FooterTab, Subtitle } from 'native-base';

import NetInfo from '@react-native-community/netinfo';
import { API } from "../WebServices/RestClient";
import log from '../LogFile/Log';


export default class TaskChat extends Component {

  constructor(props) {
    super(props);
    this.state = {
      message: '',
      dataSource: [],
      subtaskId: this.props.navigation.state.params.taskid,
      action: this.props.navigation.state.params.action,
      userid: '',
      groupName: '',
      groupList: '',
    };
  }

  componentDidMount() {
    log("Debug", "Task Chat screen is loaded");
    this.groupMembersList();//Getting the List of GroupMembers
    this.getMessages();//Getting the List of Messages based pn Task
  }
  //getting task related group members added by naveen
  groupMembersList() {
    log("Info", " groupMembersList(role, userToken, cropcode) is used getting task related group members");
    //alert(this.state.action)
    const groupId = this.state.subtaskId;
    AsyncStorage.multiGet(["cropcode", "userToken"], (err, response) => {
      const cropcode = response[0][1];
      const userToken = response[1][1];
      this.setState({ userid: userToken });

      NetInfo.fetch().then(state => {
        if (state.type == "none") {
          log("Warn", "No internet connection");
          Snackbar.show({
            title: 'No Internet Connection',
            backgroundColor: 'red',
            duration: Snackbar.LENGTH_LONG,
          });
        }
        else {
          fetch(API + 'groupDetails.php',
            {
              method: 'POST',
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                action: this.state.action,
                corp_code: cropcode,
                groupId: groupId

              })
            })
            .then((response) => response.json())
            .then((responseJson) => {
              //Getting the Group details for Subtask start
              if (responseJson.status === 'True' && responseJson.task == 'subtask') {

                const al = [];
                al.push(responseJson.ideaByName);
                al.push(responseJson.acceptedByName);
                al.push(responseJson.ideaModfiedName);
                al.push(responseJson.releaseOwner);
                al.push(responseJson.rejectedByName);
                al.push(responseJson.moduleCreatedBy);
                al.push(responseJson.moduleModifiedBy);
                al.push(responseJson.mainAssignedBy);
                al.push(responseJson.mainAssignedTo);
                al.push(responseJson.mainModifiedBy);
                al.push(responseJson.subAssignedBy);
                al.push(responseJson.subAssignedTo);
                al.push(responseJson.subModifiedBy);
                this.setState({
                  groupName: responseJson.subTaskId
                })

                const k = (al);
                function getUnique(array) {

                  var uniqueArray = [];

                  // Loop through array values

                  for (var value of array) {

                    if (uniqueArray.indexOf(value) === -1) {

                      uniqueArray.push(value);
                    }
                  }

                  return uniqueArray;
                }
                console.warn(k);
                var uniqueNames = getUnique(k);
                console.warn(uniqueNames)
                var h = uniqueNames;

                var details = "admin";
                for (var i = 0; i < h.length; i++) {//Checking the group list
                
                  if (h[i] === "NA"|| h[i]=="admin") { //Remove Duplicate list
                    h.splice(i, 2);
                  }

                  //Concat List of Group Members
                  details = details + "," + h[i];
                  this.setState({
                    groupList: details
                  })
                  //alert(details);
                }

                this.setState({
                  groupName: responseJson.subTaskId,
                });

              }
              //Getting the Group details for Subtask end

              //Getting the Group details for Maintask start
              else if (responseJson.status === 'True' && responseJson.task == 'maintask') {
                const al = [];
                al.push(responseJson.ideaByName);
                al.push(responseJson.acceptedByName);
                al.push(responseJson.ideaModfiedName);
                al.push(responseJson.releaseOwner);
                al.push(responseJson.rejectedByName);
                al.push(responseJson.moduleCreatedBy);
                al.push(responseJson.moduleModifiedBy);
                al.push(responseJson.mainAssignedBy);
                al.push(responseJson.mainAssignedTo);
                al.push(responseJson.mainModifiedBy);
                this.setState({
                  groupName: responseJson.subTaskId
                })

                const k = (al);
                function getUnique(array) {

                  var uniqueArray = [];

                  // Loop through array values

                  for (var value of array) {

                    if (uniqueArray.indexOf(value) === -1) {

                      uniqueArray.push(value);
                    }
                  }

                  return uniqueArray;
                }
                console.warn(k);
                var uniqueNames = getUnique(k);
                console.warn(uniqueNames)
                var h = uniqueNames;

                var details = "admin";
                for (var i = 0; i < h.length; i++) {//Checking the group list
                  if (h[i] === "NA" || h[i] == "admin") {//Remove duplicate list
                    h.splice(i, 2);
                  }

                  //Concat List of Group Members
                  details = details + "," + h[i];
                  this.setState({
                    groupList: details
                  })
                  // alert(details);
                }

                this.setState({
                  groupName: responseJson.subTaskId,
                });
              }//Getting the Group details for maintask end
              else {

              }
            })
            .catch((error) => {
              console.error(error);
              log("Error", "Task Chat maintask group Menbers error");
            });

        }
      });
    });

  }
  //getting task related messages
  getMessages() {
    log("Info", " getMessages(role, userToken, cropcode) is used getting task related messages");
    const groupId = this.state.subtaskId;

    AsyncStorage.multiGet(["cropcode", "userToken"], (err, response) => {
      const cropcode = response[0][1];
      const userToken = response[1][1];
      this.setState({ userid: userToken });

      NetInfo.fetch().then(state => {
        if (state.type == "none") {
          log("Warn", "No internet connection");
          Snackbar.show({
            title: 'No Internet Connection',
            backgroundColor: 'red',
            duration: Snackbar.LENGTH_LONG,
          });
        }
        else {
          fetch(API + 'taskChat.php',
            {
              method: 'POST',
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                action: 'getmessages',
                corp_code: cropcode,
                groupId: groupId

              })
            })
            .then((response) => response.json())
            .then((responseJson) => {

              if (responseJson.status === 'True') {
                console.warn(responseJson);
                this.setState({
                  dataSource: responseJson.data,
                });
              } else {
                this.setState({
                  dataSource: '',
                });
              }
            })
            .catch((error) => {
              console.error(error);
              log("Error", "getting task related messages error");
            });

        }
      });
    });
  }
  //Sending Message without empty data added by naveen on 11 Nov
  sendMessageText(){
    if(this.state.message==0){
      alert("please type message")
      log("Warn", "message should not be empty");
    }
    else{
      this.sendMessage()
    }
  }
  //send messages
  sendMessage() {
    log("Info", " sendMessage(role, userToken, cropcode) is used to send messages");
    const message = this.state.message;
    const groupId = this.state.subtaskId;

    AsyncStorage.multiGet(["cropcode", "userToken"], (err, response) => {
      const cropcode = response[0][1];
      const userToken = response[1][1];

      fetch(API + 'taskChat.php', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({

          action: 'send',
          groupId: groupId,
          corp_code: cropcode,
          message: message,
          messagedBy: userToken,

        })
      }).then((response) => response.json())
        .then((responseJson) => {
          this.getMessages();
          this.setState({
            message: ''
          });
          //message:this.state.message=''
        }).catch((error) => {
          console.error(error);
          log("Error", "send message error");
        });

    });
  }

  renderDate = (date) => {
    return (
      <Text style={styles.time}>
        {date}
      </Text>
    );
  }

  render() {

    return (
      <Container>
        <Header
          androidStatusBarColor="#00A2C1"
          style={{
            backgroundColor: '#00A2C1',
            height: 60,
            width: Dimensions.get('window').width,
            borderBottomColor: '#ffffff',
            justifyContent: 'space-between',
          }}>

          <Icon name="arrow-left" size={25} style={{ color: '#fff', paddingTop: 15 }} onPress={() =>
            this.props.navigation.goBack()} />
          <Body style={{ paddingLeft: 10, }}>
            <Title>{this.state.groupName}</Title>
            <Subtitle>{this.state.groupList}</Subtitle>
          </Body>

        </Header>
{/* <KeyboardAvoidingView> */}
        <View style={styles.container}>
          <ScrollView ref="scrollView"
            onContentSizeChange={(width, height) => this.refs.scrollView.scrollTo({ y: height })}>



            <FlatList style={styles.list}


              data={this.state.dataSource}
              keyExtractor={(item) => {
                return item.id;
              }}
              renderItem={(message) => {
                const item = message.item;
                let inMessage = item.messagedBy === this.state.userid;
                let itemStyle = !inMessage ? styles.itemIn : styles.itemOut;
                const left = <Text style={{ fontSize: 12, color: 'orange' }}>{item.username}</Text>
                const right = <Text style={{ fontSize: 12, color: 'blue' }}>{item.username}</Text>
                return (
                  <View style={[styles.item, itemStyle]}>
                    <View style={{ paddingLeft: 15, }}>
                      {/* <Text style={{fontSize:12,color:'orange'}}>{item.username}</Text> */}
                      {itemStyle === styles.itemOut ? left : right}
                    </View>
                    {/* /  {!inMessage && this.renderDate(item.date)} */}
                    <View style={[styles.balloon]}>
                      <Text>{item.message}</Text>

                      {!inMessage && this.renderDate(item.date)}
                    </View>
                    {inMessage && this.renderDate(item.date)}
                  </View>
                )
              }} />
          </ScrollView>

         

          <View style={styles.footer}>
            <View style={styles.inputContainer}>
              <TextInput style={styles.inputs}
                placeholder="Write a message..."
                underlineColorAndroid='transparent'
                multiline={true}

                onChangeText={(value) => this.setState({ message: value })}
                value={this.state.message} />
            </View>

            <TouchableOpacity style={styles.btnSend} onPress={() => { this.sendMessageText() }}>
              {/* <Image source={{uri:"https://png.icons8.com/small/75/ffffff/filled-sent.png"}} style={styles.iconSend}  /> */}
              <Image source={require('../Images/sent.png')} style={styles.iconSend} />
            </TouchableOpacity>
          </View>
         
        </View>
        {/* </KeyboardAvoidingView> */}
      </Container>

    );
  }
}
//Styles fro UI
const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  list: {
    paddingHorizontal: 17,
  },
  footer: {
    flexDirection: 'row',
    height: 60,
    backgroundColor: '#eeeeee',
    paddingHorizontal: 10,
    padding: 5,
  },
  btnSend: {
    backgroundColor: "#00BFFF",
    width: 40,
    height: 40,
    borderRadius: 360,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconSend: {
    width: 30,
    height: 30,
    alignSelf: 'center',
  },
  inputContainer: {
    borderBottomColor: '#F5FCFF',
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    borderBottomWidth: 1,
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  inputs: {
    height: 40,
    marginLeft: 16,
    borderBottomColor: '#FFFFFF',
    flex: 1,
  },
  balloon: {
    maxWidth: 200,
    padding: 10,
    borderRadius: 20,
  },
  itemIn: {

    alignSelf: 'flex-start',
    maxWidth: '98%',
    //  flexDirection:'row'
  },
  itemOut: {
    alignSelf: 'flex-end',
    //paddingLeft:10,
    maxWidth: '98%',
    // flexDirection:'row'
  },
  time: {
    alignSelf: 'flex-end',
    // margin: 15,
    fontSize: 12,
    color: "#808080",
    paddingRight: 50
  },
  item: {
    marginVertical: 14,
    flex: 1,
    flexDirection: 'row',
    // paddingLeft:50,
    backgroundColor: "#eeeeee",
    borderRadius: 300,
    padding: 5,
  },
});  