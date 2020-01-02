/*
FileName:UserApprovedProjects.js
Version:1.0.0
Purpose:Getting the List of ApprovedProjects and also verify the project by role and Add RO
Devloper:Rishitha,Harsha
*/
import React, { Component } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Platform, StyleSheet, Text, View, Dimensions, FlatList, TouchableHighlight, Image, TouchableOpacity, Alert } from 'react-native';
import { Left, Button, Container, Header, Content, Item, Input } from 'native-base';
import AsyncStorage from '@react-native-community/async-storage';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Modal from "react-native-simple-modal";
import SearchableDropdown from 'react-native-searchable-dropdown';
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

  // to verify the project in user based like approver 
  // it just validation 
  ProjectVerify() {
    log("Info", "ProjectVerify() method is used to give alert");
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
        { text: 'OK', onPress: () => this.ProjectVerification(item.idea_id) },
      ],
      { cancelable: false },
    );

  }

  //to verify the project in user based projects
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

              } else if (responseJson.status == 'false') {

                Alert.alert(responseJson.message);

              } else { }
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
                <View style={{ flexDirection: 'row' ,width:wp('75%')}}>
                  <Text style={styles.signUpText0} >Project No : </Text>

                  <Text style={styles.signUpText1} >{item.idea_id}</Text>

                </View>
                <Text style={styles.signUpText2} > {item.acceptedDate}</Text>
              </View>
              <View
                style={{
                  borderBottomColor: '#C0C0C0',
                  borderBottomWidth: 0.3,
                }}
              />

              {/* <View style={{ flexDirection: 'row', paddingRight: 25, }}>
                <Text style={styles.signUpText4} >Title:</Text>
                <Text style={styles.signUpText3} >{item.idea_title}</Text>
                <View >
                  <Text style={styles.signUpText4} >ReleaseOwner:</Text>
                  <Text style={styles.signUpText3} >{item.idea_title}</Text>
                </View>

              </View> */}

<View style={{ flexDirection: 'row', paddingRight: 25,  }}>
              {/* <View style={{width:'45%'}}> */}
              <Text style={styles.signUpText4} >Title:</Text>
              <Text style={styles.signUpText9} >{item.idea_title}</Text>
              {/* </View> */}
              <Text style={styles.listgap} >ReleaseOwner :</Text>
              <Text style={styles.signUpText3} >{item.releaseOwner}</Text>
            </View>


              <View style={{ flexDirection: 'row', paddingRight: 25 }}>
                <Text style={styles.signUpText444} >Requested By:</Text>
                <Text style={styles.signUpText333} >{item.userName}</Text>
              </View>

              <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
                <TouchableOpacity onPress={() => { this.ProjectVerify() }} style={{ width: 60, backgroundColor: 'green' }}><Text style={{ color: '#fff', textAlign: 'center' }}>VERIFY</Text></TouchableOpacity>
                <TouchableOpacity onPress={() => { this.props.ReleaseOwner() }} style={{ width: 40, backgroundColor: 'black', marginLeft: 10 }}><Text style={{ color: '#fff', textAlign: 'center' }}>RO</Text></TouchableOpacity>

              </View>

            </View>
            <View style={{ backgroundColor: '#fff', height: 5 }}>

</View>
          </View>
        </TouchableOpacity>
      </View>

    )
  }
}
export default class Aproved extends Component {
  constructor(props) {

    super(props);
    this.state = {
      isLoading: true,
      dataSource: [],
      isFetching: false,
      open: false,
      resource: [],
      ideaid: '',

    }
    this.arrayholder = [];
  }

  moveUp = () => this.setState({ offset: -110 });

  resetPosition = () => this.setState({ offset: 0 });

  openModal = () => this.setState({ open: true });

  closeModal = () => {
    //this.props.navigation.goBack();
    this.setState({ open: false });
  }

  //lifecycle method to call api methods 
  componentDidMount() {
    log("Debug", "User Approved projects screen is loaded");
    //userApprovedProjects getting
    this.userApprovedProjects()
    this.getResource()

   
  }

  //to get the user approved projects in to the list 
  getResource() {
    log("Info", "UserApprovedProjects:getResource() method is used to get all employee list");
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
              log("Error", "error in listing employees");
            });
        }
      });
    });
  }

  //to refreshthe data in user apprroved projects
  onRefresh() {
  this.userApprovedProjects() ;
  }


  //Set the RO
  setRO(ideaid) {
    log("Info", "UserApprovedProjects:setRO(ideaid) method is used to set release owner");
    AsyncStorage.multiGet(["cropcode", "userToken", "emp_role"], (err, response) => {
      const cropcode = response[0][1];
      const userToken = response[1][1];
      const role = response[2][1];
      // alert(cropcode+userToken+role)
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
                action: 'ro',
                empId: userToken,
                userType: role,
                ideaId: ideaid,
              })
            })
            .then((response) => response.json())
            .then((responseJson) => {
              //    alert(JSON.stringify(responseJson));
              console.log(responseJson)
              if (responseJson.setState == "True") {

                this.setState({ open: false });
                this.setState({
                  isLoading: false,

                  isFetching: false
                }, function () {

                });
              }


            })
            .catch((error) => {
              console.error(error);
              log("Error", "error in Release owner setting");
            });
        }
      });
    });
  }

  componentWillReceiveProps(nextProps) {

    this.userApprovedProjects();
  }
  //userApprovedProjects getting
  userApprovedProjects() {
    log("Info", "UserApprovedProjects:setRO(userApprovedProjects() method is used to list the user approved projects");
    AsyncStorage.multiGet(["cropcode", "userToken", "emp_role"], (err, response) => {
      const cropcode = response[0][1];
      const userToken = response[1][1];
      const role = response[2][1];
      // alert(cropcode+userToken+role)
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
              //    alert(JSON.stringify(responseJson));
              if (responseJson.status === 'True') {
              console.log(responseJson)
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
                title: 'No UserApproved Projects',
                backgroundColor: '#3BB9FF',
                duration: Snackbar.LENGTH_LONG,
              });
            }
          
          })
            .catch((error) => {
              console.error(error);
              log("Error", "error in listing approved projects at user side");
            });
        }
      });
    });
  }



  //Relese the owner Navigation
  ReleaseOwner = (item, index) => {
    log("Info", "UserApprovedProjects:ReleaseOwner = (item, index) method used to navigate to Release owner screen");
    this.props.navigation.navigate('ReleaseOwner', { idea_id: item.idea_id });

  }

//Navigate to AddModule sctreen
  Module = (item, index) => {
    log("Info", "UserApprovedProjects:Module() method is used to move module listing screen");
    console.log(item);
    console.log(index);
    this.props.navigation.navigate("AddModule", { idea_id: item.idea_id,idea_title:item.idea_title });

  }
  //list seperator
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
  //List data for Empty
  _listEmptyComponent = () => {
    return (
      <View style={{ width: '90%', height: '80%' }}>
        <Text></Text>
      </View>
    )
  }


  //to filter the search in put by user 
  SearchFilterFunction(text) {
    log("Info", "UserApprovedProjects:SearchFilterFunction(text) method is used for search functionality");
    console.log(text);
    const newData = this.arrayholder.filter(function (item) {
      const idea_id = item.idea_id.toUpperCase()
      const idea_id1 = text.toUpperCase()
      // const created_on = item.created_on.toUpperCase()
      // const created_on1 = text.toUpperCase()
      const idea_title = item.idea_title.toUpperCase()
      const idea_title1 = text.toUpperCase()
      const userName = item.userName.toUpperCase()
      const userName1 = text.toUpperCase()

      return idea_id.indexOf(idea_id1) > -1 ||
        idea_title.indexOf(idea_title1) > -1 ||
        //  created_on.indexOf(created_on1) > -1 ||
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
          <Icon size={20} name="search" />
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

                  <ListItem
                    item={item}
                    Module={() => this.Module(item, index)}
                    ReleaseOwner={() => this.ReleaseOwner(item, index)}

                  />
                </View>
              }
              keyExtractor={item => item.id}
              ListEmptyComponent={this._listEmptyComponent}
            />

          </View>

          <Modal
            offset={this.state.offset}
            open={this.state.open}
            modalDidOpen={this.modalDidOpen}
            modalDidClose={this.modalDidClose}
            style={{ alignItems: "center", }}
          >

            <View style={{ alignItems: "center", paddingBottom: 40 }}>

              <View style={{ marginTop: 30, marginLeft: 10, width: '100%', }}>
                <Text >Select Resources</Text>
                <View style={{ justifyContent: 'center', marginRight: 15 }}>

                  <SearchableDropdown
                    onTextChange={text => console.log(text)}
                    //On text change listner on the searchable input
                    onItemSelect={item => console.log(text)}
                    //onItemSelect called after the selection from the dropdown
                    containerStyle={{ padding: 5 }}
                    //suggestion container style
                    textInputStyle={{
                      //inserted text style
                      padding: 12,
                      borderWidth: 1,
                      borderColor: '#ccc',
                      backgroundColor: '#FAF7F6',
                    }}
                    itemStyle={{
                      //single dropdown item style
                      padding: 10,
                      marginTop: 2,
                      backgroundColor: '#FAF9F8',
                      borderColor: '#bbb',
                      borderWidth: 1,
                    }}
                    itemTextStyle={{
                      //text style of a single dropdown item
                      color: '#222',
                    }}
                    itemsContainerStyle={{
                      //items container style you can pass maxHeight
                      //to restrict the items dropdown hieght
                      // maxHeight: '60%',
                    }}
                    items={this.state.resource}
                    //mapping of item array
                    defaultIndex={0}
                    //default selected item index
                    placeholder="select RO"
                    //place holder for the search input
                    resetValue={false}
                    //reset textInput Value with true and false state
                    underlineColorAndroid="transparent"
                  //To remove the underline from the android input
                  />
                </View>
              </View>

              <View style={{ flexDirection: 'row', marginTop: 30,justifyContent:"space-between" }}>
                <TouchableOpacity style={styles.opencancel} onPress={this.closeModal}>
                  <Text style={{ color: 'white' }}>CANCEL</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { this.setRO(this.state.ideaid) }} style={styles.opensave} >
                  <Text style={{ color: 'white' }}>SAVE</Text>
                </TouchableOpacity>
              </View>

            </View>
          </Modal>

        </View>
      </Container>
    );
  }
}
//Styles for UI
const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    backgroundColor:'#f8f8f8', 
   // paddingLeft: hp('1%'),
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
    width: wp('98%'),
    alignSelf: 'baseline',
    marginBottom: 10,
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
   // fontWeight:"bold",

  },
  signUpText1: {
    fontSize: 13,
    color: 'green',
    paddingTop: 10,
    // fontWeight:"bold",
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
    fontSize: 13,
 //marginLeft: 200,
    // fontSize: 13,
    color: 'black',
    paddingTop: 10,

    //  marginRight: 10,
    //textAlign: "right"

  },
  listgap: {
    fontSize: 13,
    paddingTop: 10,
// paddingLeft: 130,


    alignItems: 'center',
  },
  signUpText03: {
    width: '25%',
    fontSize: 13,
    paddingTop: 10,
    paddingLeft: 10,

    alignItems: 'center',
  },
  signUpText3: {

    fontSize: 13,
    paddingTop: 10,
     paddingLeft: 10,
    // fontWeight:"bold",
    alignItems: 'center',
  },
  signUpText4: {
    fontSize: 13,
    paddingTop: 10,

    color:'black',
    // fontWeight:"bold",
    alignItems: 'center',
  },
  signUpText9: {
    fontSize: 13,
    paddingTop: 10,
width:wp('45%'),
    color:'black',
    // fontWeight:"bold",
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
    fontSize: 13,
    justifyContent: 'center',


    color: 'white',
    alignSelf: 'center',
  },
   //Based ON Platform
   opencancel: {
    flex: 1,
    ...Platform.select({
      ios: {
        backgroundColor: 'red', margin:20,height:30, alignItems:
        "center", justifyContent: 'center'
      },
      android: {
         backgroundColor: 'red',margin:20,height:30, alignItems:
      "center", justifyContent: 'center'
      },
    }),
  },
  opensave: {
    flex: 1,
    ...Platform.select({
      ios: {
        backgroundColor: 'green',margin:20,height:30,  alignItems:
        "center", justifyContent: 'center'
      },
      android: {
         backgroundColor: 'green',margin:20,height:30, alignItems:
      "center", justifyContent: 'center'
      },
    }),
  },
});
