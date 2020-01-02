/*
FileName:AdminApprovedProjects.js
Version:1.0.0
Purpose:Getting the List of ApprovedProjects and also verify the project by role
Devloper:Rishitha,Naveen,Harsha
*/
import React, { Component } from 'react';
import { Alert, Platform, StyleSheet, Text, View, TouchableOpacity, Dimensions, FlatList, TouchableHighlight, Image } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { Container, Content, Item, Input } from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { API } from "../WebServices/RestClient";
import NetInfo from '@react-native-community/netinfo';
import Snackbar from 'react-native-snackbar';
import log from '../LogFile/Log';
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

  //alert for project verification
  ProjectVerify() {
    log("Info", "ProjectVerify() method is used to give alert");
    const { item } = this.props;

    Alert.alert(
      'Alert..!',
      'Do you want to Verify the Project ?',
      [
        {
          text: 'NO',
          onPress: () => console.log('Cancel Pressed'),
          style: 'NO',
        },
        { text: 'YES', onPress: () => this.ProjectVerification(item.idea_id) },
      ],
      { cancelable: false },
    );

  }


  //project verification 
  ProjectVerification(projectid) {
    log("Info", "ProjectVerification(projectid) method is used to verify approved project");
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
          fetch(API + 'manageIdeas.php',
            {
              method: 'POST',
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                crop: cropcode,
                idea_id: projectid,
                action: 'verify'

              })
            })
            .then((response) => response.json())
            .then((responseJson) => {
              if (responseJson.status == 'True') {
                alert("Project Verified")
              } else if (responseJson.status == 'false') {
                alert(responseJson.message);
              } else {
                alert(responseJson.message);
              }
            })
            .catch((error) => {
              console.error(error);
              log("Error", "ProjectVerification Error");
            });
        }
      });
    });
  }


  render() {
    const { item } = this.props;
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={this.props.Module}>
          <View style={styles.signup}>
            <View style={[styles.buttonContainer, styles.signupButton]} >
              <View style={styles.box}>

                <View style={{ flexDirection: 'row', width: wp('68%') }}>
                  <Text style={styles.signUpText0} >Project No:</Text>
                  <Text style={styles.signUpText1} >{item.idea_id}</Text>
                </View>
                <Text style={styles.signUpText2} >{item.acceptedDate}</Text>
              </View>
              <View
                style={{
                  borderBottomColor: '#C0C0C0',
                  borderBottomWidth: 0.3,
                }}
              />

              <View style={{ flexDirection: 'row', paddingRight: 25, }}>
                <Text style={styles.signUpText4title} >Title:</Text>
                <Text style={styles.signUpText3title} >{item.idea_title}</Text>
                <Text style={styles.listgap} >ReleaseOwner :</Text>
                <Text style={styles.signUpText3} >{item.releaseOwner}</Text>
              </View>

              <View style={{ flexDirection: 'row', paddingRight: 25 }}>
                <Text style={styles.signUpText4} >Requested By:</Text>
                <Text style={styles.signUpText3} >{item.userName}</Text>
              </View>

              <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
                <TouchableOpacity onPress={() => { this.ProjectVerify() }} style={{ width: 58, backgroundColor: 'green' }}><Text style={{ color: '#fff', textAlign: 'center' }}>VERIFY</Text></TouchableOpacity>
                <TouchableOpacity onPress={() => { this.props.ReleaseOwner() }} style={{ width: 30, backgroundColor: 'black', marginLeft: 5 }}><Text style={{ color: '#fff', textAlign: 'center' }}>RO</Text></TouchableOpacity>
                <TouchableOpacity onPress={() => this.props.deleteAction()} style={{ width: 55, backgroundColor: 'red', marginLeft: 5 }}><Text style={{ color: '#fff', textAlign: 'center' }}>DELETE</Text></TouchableOpacity>
              </View>

            </View>

          </View>
          <View style={{ backgroundColor: '#fff', height: 5 }}>

          </View>
        </TouchableOpacity>
      </View>

    )
  }
}
export default class Aproved1 extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      dataSource: [],
      isFetching: false,
      role: '',
      userToken: '',
      idea_id: '',
      empId: '',
    }
    this.arrayholder = [];
  }

  //For getting emp role , emp id and corpcode
  async componentDidMount() {

    log("Debug", "Admin Approved projects screen is loaded");

    await AsyncStorage.getItem("emp_role", (err, res) => {
      console.log(res);
      this.setState({ role: res });
  
    });

    await AsyncStorage.getItem("userToken", (err, res) => {
      console.log(res);
      this.setState({ userToken: res });
    });
    await AsyncStorage.getItem("cropcode", (err, res) => {
      console.log(res);
      this.setState({ cropcode: res });
    });
    //alert("hello");
    console.log(this.state.userToken);
    console.log(this.state.role);
    this.adminApprovedProjects()//AdminApproved 
  }
  componentDidMount() {
    this.adminApprovedProjects()
  }

  //Refresh the adminApprovedProjects List
  onRefresh() {
    // this.setState({ isFetching: true }, function () { this.adminApprovedProjects(this.state.role, this.state.userToken, this.state.cropcode) });
    this.adminApprovedProjects();
  }
  //get AdminApprovedProjects list start
  adminApprovedProjects() {
    AsyncStorage.multiGet(["cropcode", "userToken", "emp_role"], (err, response) => {
      const cropcode = response[0][1];
      const userToken = response[1][1];
      const role = response[2][1];
      log("Info", "adminApprovedProjects(role, userToken, cropcode) method is used to get all approved projects list");

      NetInfo.fetch().then(state => {
        if (state.type == "none") {
          console.log(state.type);
          Snackbar.show({
            title: 'No Internet Connection',
            backgroundColor: 'red',
            duration: Snackbar.LENGTH_LONG,
          });
        } else {
          fetch(API + 'getIdeas.php',
            {
              method: 'POST',
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                crop: cropcode,
                action: 'approved',
                empId: userToken,
                userType: role
              })
            })
            .then((response) => response.json())
            .then((responseJson) => {


              if (responseJson.status == 'True') {
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
                this.arrayholder = [];
                this.setState({
                  isLoading: false,
                })
                Snackbar.show({
                  title: 'No ApprovedProjects',
                  backgroundColor: '#3BB9FF',
                  duration: Snackbar.LENGTH_LONG,
                });
              }
            })
            .catch((error) => {
              //console.error(error);
              log("Error", "Approved project getting error");
            });
        }
      });
    });
  }
  //get AdminApprovedProjects list end

  //Relese the owner
  ReleaseOwner = (item, index) => {
    log("Info", "ReleaseOwner() method used to navigate to release owner screen");
    this.props.navigation.navigate('ReleaseOwner', { idea_id: item.idea_id });
  }

  //alert for delete project start
  deleteAction(item, index) {
    log("Info", "deleteAction() method used to give delete alert");
    Alert.alert(
      'Alert..!',
      'Do you want to delete project',
      [
        {
          text: 'NO',
          onPress: () => console.log('Cancel Pressed'),
          style: 'NO',
        },
        { text: 'YES', onPress: () => this.deleteProject(item) },
      ],
      { cancelable: false },
    );
  }
  //alert for delete project end

  //delete the project
  deleteProject = (item) => {
    log("Info", "deleteAction() method used delete approved project,if maintasks are there we can not delete project");
    AsyncStorage.getItem("cropcode", (err, res) => {
      const crop = res;
      AsyncStorage.getItem("userToken", (err, res) => {
        const empId = res;
        NetInfo.fetch().then(state => {
          if (state.type == "none") {
            console.log(state.type);
            Snackbar.show({
              title: 'No Internet Connection',
              backgroundColor: 'red',
              duration: Snackbar.LENGTH_LONG,
            });
          } else {
            fetch(API + 'manageIdeas.php', {
              method: 'POST',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                idea_id: item.idea_id,
                empId: empId,
                action: "delete",
                crop: crop,
              })
            }).then((response) => response.json())
              .then((responseJson) => {
                console.log(JSON.stringify(responseJson));
                console.log(responseJson);
                if (responseJson.status === 'True') {
                  console.log("done")
                  this.setState({ open: false })
                  this.props.navigation.navigate('AdminApprovedProjects');
                }
                else {
                  alert("Having maintasks,you cannot delete this project");
                  log("Info", "Having maintasks,you cannot delete this project");
                }
              }).catch((error) => {
                console.error(error);
                log("Error", "Project deletion error");
              });
          }
        });
      });
    });
  };


  //Navigate to Add Module screen for add module
  Module = (item, index) => {
    log("Info", "Module() method is used to move module listing screen");
    console.log(item);
    console.log(index);
    this.props.navigation.navigate("AddModule", { idea_id: item.idea_id, idea_title: item.idea_title });

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
      <View style={{ width: '90%', height: '80%' }}>
        <Text></Text>
      </View>
    )
  }

  //For Search 
  SearchFilterFunction(text) {
    console.log(text);
    log("Info", "SearchFilterFunction(text) method is used for search functionality ");
    const newData = this.arrayholder.filter(function (item) {
      const idea_id = item.idea_id.toUpperCase()
      const idea_id1 = text.toUpperCase()
      const idea_title = item.idea_title.toUpperCase()
      const idea_title1 = text.toUpperCase()
      const userName = item.userName.toUpperCase()
      const userName1 = text.toUpperCase()

      return idea_id.indexOf(idea_id1) > -1 ||
        idea_title.indexOf(idea_title1) > -1 ||
        userName.indexOf(userName1) > -1

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
          <Input placeholder="Search"
            onChangeText={(text) => this.SearchFilterFunction(text)} />
          <Icon style={{ marginRight: 5 }} size={15} name="search" />
        </Item>
     
          <View>
            <View style={{ height: '96%' }}>

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
                      Module={() => this.Module(item, index)}//For Add the Module
                      ReleaseOwner={() => this.ReleaseOwner(item, index)}//For Release owner
                      deleteAction={() => this.deleteAction(item, index)}//For delete the Project
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

// StyleSheet Creation 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '98%',
    paddingLeft: hp('2%'),
    backgroundColor: '#f8f8f8'
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
    // fontWeight: 'bold',
    alignItems: 'center',
    fontSize: 18,
  },
  buttonContainer: {
    width: wp('90%'),
    alignSelf: 'baseline',
    marginBottom: 10,
    color: '#d2691e',
    marginLeft: 4,
    backgroundColor: '#f8f8f8'



  },
  signupButton: {

    backgroundColor: '#f8f8f8',
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
    // fontWeight: 'bold'

  },
  signUpText1: {
    fontSize: 13,
    color: 'green',
    paddingTop: 10,
    // fontWeight: 'bold',
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
    // fontSize: 10,
    //  marginLeft: 200,
    fontSize: 13,
    color: 'black',
    paddingTop: 10,
  },
  signUpText3title: {

    fontSize: 12,
    paddingTop: 10,
    width: wp('45%'),
    color: 'black',
    alignItems: 'center',
  },
  signUpText4title: {
    fontSize: 13,
    paddingTop: 10,
    color: 'black',
    alignItems: 'center',
  },
  listgap: {
    fontSize: 13,
    paddingTop: 10,
    alignItems: 'center',
  },
  signUpText3: {

    fontSize: 13,
    paddingTop: 10,
    paddingLeft: 10,
    color: 'black',

    alignItems: 'center',
  },
  signUpText4: {
    fontSize: 13,
    paddingTop: 10,
    color: 'black',
    alignItems: 'center',
  },
  signup: {
    color: "#FFF",
    backgroundColor: '#f8f8f8'
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
});
