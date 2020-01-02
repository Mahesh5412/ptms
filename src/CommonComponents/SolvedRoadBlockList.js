/*
FileName:SolvedRoadBlockList.js
Version:1.0.0
Purpose:Getting the List SolvedRoadBlock list
Devloper:Mahesh
*/


import React, { Component } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import { Platform, StyleSheet, Text, View, Dimensions, TouchableOpacity, FlatList, Image, Alert } from 'react-native';
import { Icon, Left, Button, Container, Header, Content, Item, Input } from 'native-base';
import { Collapse, CollapseHeader, CollapseBody } from "accordion-collapse-react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { API } from "../WebServices/RestClient";
import NetInfo from '@react-native-community/netinfo';
import Snackbar from 'react-native-snackbar';
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
import log from '../LogFile/Log';
class ListItem extends React.Component {
  render() {
    const { item } = this.props;
    return (
      <View>
        <Collapse style={item.cDate < (item.targetDate) ? styles.container : styles.container1}>
          <CollapseHeader style={styles.boxheader}>
            <View style={{ flexDirection: 'row' }}>
              <Text style={styles.signUpText0} >Task_no:</Text>
              <Text style={styles.signUpText1} >{item.subTaskId}</Text>
            </View>
            <View style={{ flexDirection: 'row', paddingRight: 25, paddingTop: 10 }}>
              <Text style={styles.signUpText4} >Project Title:</Text>
              <Text style={styles.signUpText3} >{item.ideaTitle}</Text>
              <Text style={styles.signUpText02} >{item.status}  </Text>
            </View>
            <View style={styles.box1}>
              <View style={{ flexDirection: 'row', width: wp('90%') }}>
                <Text style={styles.signUpText00} >Task Title:</Text>
                <Text style={styles.signUpText11} >{item.taskTitle}</Text>
                <View style={{ paddingLeft: 60 }}>
                </View>
              </View>
            </View>
          </CollapseHeader>
          <CollapseBody>
            <View style={{ flexDirection: 'row', paddingRight: 25, }}>
              <Text style={styles.signUpText44} >Description : </Text>
              <Text style={styles.signUpText33} >{item.taskDesc}</Text>
            </View>
            <View style={styles.box1}>
              <View style={{ flexDirection: 'row', width: wp('52%') }}>
                <Text style={styles.signUpText000} >Target Time:</Text>
                <Text style={styles.signUpText111} >{item.targetDate}</Text>
              </View>
              <Text style={styles.signUpText002} >Task Status:{item.taskStatus}%Completed</Text>
            </View>
            <View style={styles.box1}>
              <View style={{ flexDirection: 'row' }}>
                <Text style={styles.signUpText000} >Assigned on :</Text>
                <Text style={styles.signUpText111} >{item.assignedDate}</Text>
              </View>
            </View>
            <View style={{ flexDirection: 'row', paddingRight: 25, }}>
              <Text style={styles.signUpText44} >Assigned By :</Text>
              <Text style={styles.signUpText33} >{item.assignedby}</Text>
            </View>
            <View style={{ flexDirection: 'row', paddingRight: 25, }}>
              <Text style={styles.signUpText44} >Task status Description :</Text>
              <Text style={styles.signUpText33} >{item.taskStatusDesc}</Text>
            </View>
            {/* <View style={styles.box1}>
                  <View style={{ flexDirection: 'row' }}>
                      <Text style={styles.signUpText000} >Time Left:</Text>
                      <Text style={styles.signUpText111} >{item.timeLeft}</Text>
                  </View>
              </View> */}
            <View style={styles.box1}>
              <View style={{ flexDirection: 'row', width: wp('50%') }}>
                <Text style={styles.signUpText000} >Dependency:</Text>
                <Text style={styles.signUpText111} >{item.dependencyId}</Text>
              </View>
              {/* <Text style={styles.signUpText002} >Dependent:{item.dependencyTitle}</Text> */}
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
              <TouchableOpacity onPress={this.props.RoadBlock} style={{ width: 20, backgroundColor: 'black' }}><Text style={{ color: '#fff', textAlign: 'center' }}>?</Text></TouchableOpacity>
              <Icon size={22} style={{ paddingLeft: 10, paddingTop: 4 }} name="chatboxes" onPress={() => { this.props.TaskChat() }}></Icon>
            </View>
            <View
              style={{
                borderBottomColor: '#C0C0C0',
                marginBottom: 10,
              }}
            />
          </CollapseBody>
        </Collapse>
        <View style={{ backgroundColor: '#fff', height: 5 }}>
        </View>
      </View>
    )
  }
}
export default class SolvedRoadBlockList extends Component {
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

    }
    this.arrayholder = [];
  }
  handleTabFocus = () => {
    this.onRefresh();
  };


  componentDidMount() {
    log("Debug", "Solved Road Blocks loaded");
    //to get the all the user completed data list
    this.userCompletedMyTasks()
  }

  //Navigates to RoadBlock Screen
  RoadBlock(item, index) {
    this.props.navigation.navigate("RoadBlocks", { subtaskid: item.subTaskId });
  }

  //Navigates to TaskChat Screen
  TaskChat(item, index) {
    this.props.navigation.navigate("TaskChat", { taskid: item.subTaskId, action: "subtask" });
  }

  //to refresh the data
  onRefresh() {
    this.setState({
      dataSource: [],
    })
    this.userCompletedMyTasks();
  }

  componentWillReceiveProps(nextProps) {
    console.log(nextProps);
    console.log("re loading...........")
    this.userCompletedMyTasks();
  }


  //to get the all the user completed data list
  userCompletedMyTasks() {
    log("Info", " userCompletedMyTasks(cropcode) is used to get the all the user completed data list");

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

          fetch(API + 'roadBlock.php',
            {
              method: 'POST',
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                crop: cropcode,
                action: "noncritical",
              })
            })
            .then((response) => response.json())
            .then((responseJson) => {
              console.log(responseJson);
              console.log(JSON.stringify(responseJson))
              if (responseJson.status === 'True') {
                this.setState({
                  isLoading: false,
                  dataSource: responseJson.data,
                  isFetching: false
                }, function () {
                });
                this.arrayholder = responseJson.data;
              } else {
                this.arrayholder = [];
                this.setState({
                  isLoading: false,
                })
                Snackbar.show({
                  title: 'No Road Blocks',
                  backgroundColor: '#3BB9FF',
                  duration: Snackbar.LENGTH_LONG,
                });
              }

            })
            .catch((error) => {
              console.error(error);
              log("Error", "Solved Road Blocks error");
            });
        }
      });
    });

  }
  //Seperate the list data
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

  _listEmptyComponent = () => {
    return (
      <View>
        <Text></Text>
        {/* <Image
          style={{ width: '100%', height: 200 }}
          source={{ uri: 'https://cdn.dribbble.com/users/2370289/screenshots/6150406/no_items_found.jpg' }} /> */}

      </View>
    )
  }

  //to filter the search data in search are 
  SearchFilterFunction(text) {
    log("Info", "SearchFilterFunction(text) method  used for searching");
    console.log(text);
    const newData = this.arrayholder.filter(function (item) {
      const subTaskId = item.subTaskId.toUpperCase()
      const subTaskId1 = text.toUpperCase()
      const ideaTitle = item.ideaTitle.toUpperCase()
      const ideaTitle1 = text.toUpperCase()

      const status = item.status.toUpperCase()
      const status1 = text.toUpperCase()
      const taskTitle = item.taskTitle.toUpperCase()
      const taskTitle1 = text.toUpperCase()
      const taskDesc = item.taskDesc.toUpperCase()
      const taskDesc1 = text.toUpperCase()
      const targetDate = item.targetDate.toUpperCase()
      const targetDate1 = text.toUpperCase()

      const taskStatus = item.taskStatus.toUpperCase()
      const taskStatus1 = text.toUpperCase()
      const assignedDate = item.assignedDate.toUpperCase()
      const assignedDate1 = text.toUpperCase()
      const assignedby = item.assignedby.toUpperCase()
      const assignedby1 = text.toUpperCase()

      const taskStatusDesc = item.taskStatusDesc.toUpperCase()
      const taskStatusDesc1 = text.toUpperCase()
      const dependencyId = item.dependencyId.toUpperCase()
      const dependencyId1 = text.toUpperCase()


      return subTaskId.indexOf(subTaskId1) > -1 ||
        ideaTitle.indexOf(ideaTitle1) > -1 ||

        status.indexOf(status1) > -1 ||
        taskDesc.indexOf(taskDesc1) > -1 ||
        targetDate.indexOf(targetDate1) > -1 ||
        taskStatus.indexOf(taskStatus1) > -1 ||
        assignedDate.indexOf(assignedDate1) > -1 ||
        assignedby.indexOf(assignedby1) > -1 ||
        taskStatusDesc.indexOf(taskStatusDesc1) > -1 ||
        dependencyId.indexOf(dependencyId1) > -1 ||

        taskTitle.indexOf(taskTitle1) > -1
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
        <NavigationEvents
          onDidFocus={() => this.onRefresh()}
        />
        <Item>
          {/* <Icon name="ios-search" /> */}
          <Input placeholder="Search"
            onChangeText={(text) => this.SearchFilterFunction(text)} />
          <Icon name="ios-search" />

        </Item>
        <Content>
          <View style={styles.Container}>
            <View></View>
            <View >

            </View>
            <View style={styles.end1}>

              <FlatList
                // data={this.props.data}
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
                      RoadBlock={() => this.RoadBlock(item, index)}
                      TaskChat={() => this.TaskChat(item, index)}
                    />
                  </View>
                }
                keyExtractor={item => item.id}
                ListEmptyComponent={this._listEmptyComponent}
              />
            </View>
          </View>

        </Content>
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
    height: Dimensions.get('window').height,
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
    width: wp('100%'),
    alignSelf: 'baseline',
    color: '#d2691e',
    backgroundColor: '#fadbd8',
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
    color: 'black',
    paddingLeft: 10,

  },
  signUpText11: {
    fontSize: 13,
    paddingBottom: 10,
    color: 'black',

    width: wp('55%')

  },
  signUpText000: {
    fontSize: 12,
    color: 'black',
    paddingBottom: 10,
    paddingLeft: 10,
  },
  signUpText111: {
    fontSize: 12,
    paddingBottom: 10,

    color: 'black',

    paddingLeft: -20,
    width: '55%'
  },
  end: {
    alignItems: 'flex-end',
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
    paddingLeft: 13,
    color: 'black',
    justifyContent: 'center',

  },
  signUpText02: {
    fontSize: 13,
    paddingRight: 5,
    color: 'red',
    paddingBottom: 10,

  },
  signUpText022: {
    fontSize: 13,
    paddingLeft: 13,
    color: 'green',
    paddingBottom: 10,
    justifyContent: 'center',

  },
  signUpText002: {
    fontSize: 13,
    paddingLeft: 13,
    paddingBottom: 10,
    color: 'black'

  },
  signUpText0002: {
    fontSize: 13,
    paddingRight: 45,
    paddingLeft: 13,
    paddingBottom: 10,
    justifyContent: 'center',

  },
  signUpText3: {

    paddingBottom: 10,
    fontSize: 13,
    paddingRight: 13,
    width: '70%',
    alignItems: 'center',
    color: 'black'
  },
  signUpText4: {
    paddingBottom: 10,
    paddingLeft: 10,
    color: 'black',
    fontSize: 13,
    alignItems: 'center',
  },


  signUpText33: {

    paddingBottom: 10,
    fontSize: 13,
    paddingRight: 35,
    alignItems: 'center',
    width: wp('80%'),
    color: 'black'

  },
  signUpText44: {
    paddingBottom: 10,
    paddingLeft: 10,
    paddingTop: -10,
    fontSize: 14,
    alignItems: 'center',
    color: 'black'
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


  },
  box1: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    position: 'relative',
    paddingRight: 25,
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
  },

});
