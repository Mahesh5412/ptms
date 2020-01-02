/*
FileName:UserProjectInfo.js
Version:1.0.0
Purpose:Getting the detrails of user profile data
Devloper:Rishitha,Harsha,Mahesh
*/

import React, { Component } from 'react';
import { Platform, Alert, TextInput, StyleSheet, Text, View, StatusBar, TouchableOpacity, Dimensions, ScrollView, Image, checked, CheckBox, TouchableHighlight, TouchableWithoutFeedback } from 'react-native';
import { Title, Button, Container, Content, Header, Right, Left, Body, Tab, Tabs, TabHeading, Footer, Item, Input, FooterTab, Row } from 'native-base';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import RadioGroup from 'react-native-radio-button-group';
import Modal from "react-native-simple-modal";
import AsyncStorage from '@react-native-community/async-storage';
import { API } from "../WebServices/RestClient";
import NetInfo from '@react-native-community/netinfo';
import Snackbar from 'react-native-snackbar';
import Toast from 'react-native-whc-toast';
import log from '../LogFile/Log';
var radiogroup_options = [
  { id: 0, label: 'UX' },
  { id: 1, label: 'FrontEnd' },
  { id: 2, label: 'BackEnd' },
];


export default class ProjectInfo extends Component {


  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      dataSource: [],
      isFetching: false,
      open: false,
      idea_id: '',
      role: '',
      empId: '',
      action: '',
      userToken: '',
      modifyvisibility: false,
      acceptvisibility: false,
      ProjectDescription: this.props.navigation.state.params.ideaDescription,
      ProjectTitle: this.props.navigation.state.params.projectTitle,
    };
  }
  //To get VisibleActions for Approver
  async VisibleActions() {

    AsyncStorage.getItem("emp_role", (err, res) => {

      //Alert.alert(res);

      if (res == 'Approver') {

        this.setState({ acceptvisibility: true });
      } else {

        this.setState({ acceptvisibility: false });
      }

    });

  }

  //For Modifying the Project
  modalDidOpen = () => {

  }
  modalDidClose = () => {

    this.setState({ open: false });

  };
  //Visible Actions based on employee id
  Disabling() {

    log("Info", "UserProjectInfo:Disabling() method is used to diable accept button based on condition");
    const requestedBy = this.props.navigation.state.params.empId;
    AsyncStorage.getItem("userToken", (err, res) => {

      if (res == requestedBy) {

        this.setState({ modifyvisibility: true });

      } else {
        this.setState({ modifyvisibility: false });
      }
    });

  }
  componentDidMount() {
    log("Debug", "user project info screen is loaded");
    this.Disabling();
    this.VisibleActions();
  }

  //Dialog Moves for open,close,moveup,resetposition
  moveUp = () => this.setState({ offset: -100 });

  resetPosition = () => this.setState({ offset: 0 });

  openModal = () => this.setState({ open: true });

  closeModal = () => this.setState({ open: false });

  render() {


    let button;

    if (this.state.modifyvisibility === true) {
      button =
        <View style={{ paddingTop: 20, shadowOffset: 3, shadowColor: '#fff', marginLeft: 10 }}>

          <Icon style={{ paddingLeft: 18, paddingTop: 14, backgroundColor: '#fff', borderWidth: 1, borderRadius: 30, width: 60, height: 60 }} name="pencil" size={30} color="black" onPress={() =>
            this.openModal()} disabled={this.state.disable} />

        </View>
    } else {
      button = null;
    }

    let acceptbutton;

    if (this.state.acceptvisibility === true) {
      acceptbutton =
        <TouchableOpacity style={styles.opensave1} onPress={this.approveIdea}>
          <Text style={{ color: 'white',fontSize:15 }}>Accept</Text>
        </TouchableOpacity>
    } else {
      acceptbutton = null;
    }


    return (
      <Container>
        <Header
          androidStatusBarColor="#00A2C1"

          style={{
            backgroundColor: '#00A2C1',
            height: 100,
            width: Dimensions.get('window').width,
            borderBottomColor: '#ffffff',
            justifyContent: 'space-between',
          }}>
          {/* <View style ={{marginLeft:10,flexDirection:'row'}}  > */}

          <Left>
            <Icon name="arrow-left" size={30} color="#fff" onPress={() =>
              this.props.navigation.navigate('UserManageProjects')} />
          </Left>

          {/* <Right>
          <Icon name="trash-o" size={30} color="red" onPress={this.deleteAction.bind(this)} />
        </Right> */}

        </Header>
        <View style={{ backgroundColor: '#00A2C1', flexDirection: 'row',alignSelf: 'baseline'  }}>
          <Text style={{ fontSize: 25, color: '#fff', marginLeft: 10, width: wp('75%'),}}>{this.props.navigation.state.params.projectTitle}</Text>

          {/* <View style={{ alignContent: 'flex-end', marginLeft: 200, paddingTop: 20, shadowOffset: 3, shadowColor: '#fff' }}>

          <Icon style={{ paddingLeft: 20, paddingTop: 14, backgroundColor: '#fff', borderWidth: 1, borderRadius: 30, width: 60, height: 60 }} name="pencil" size={30} color="black" onPress={() =>
            this.openModal()}  disabled={this.state.disable}/>
         
        </View> */}
        <View style={{ backgroundColor: '#00A2C1', width: wp('25%'),}}>
          {button}
          </View>

        </View>
        <Content>
          <Toast ref="toast" />
          <View style={{ paddingTop: 40 }}>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
              <View style={{ width: wp('70%') }}>
                <Text> Requested By   :   {this.props.navigation.state.params.userName}    </Text>
              </View>
              <Text style={{ paddingRight: 20 }}>  {this.props.navigation.state.params.createdOn} </Text>
            </View>
            <View style={{ flexDirection: 'row', paddingRight: 40 }}>

              <Text style={{ paddingLeft: 7 }}>
                Description      :
  </Text>
              <ScrollView style={{ paddingRight: 40 }}>
                <Text style={{ paddingLeft: 25, alignSelf: "baseline", paddingRight: 25 }}>
                  {this.props.navigation.state.params.ideaDescription}
                </Text>
              </ScrollView>
            </View>
            <View style={{ marginBottom: 50 }}>
              <View style={{
                marginTop: 150, flexDirection: 'row', justifyContent: 'center'
              }}>
                {/* <RadioGroup
                  horizontal
                  options={[
                    {
                      id: 'ux',
                      labelView: (
                        <Text>
                          <Text style={{ color: 'black' }}>UX
                </Text>
                        </Text>
                      ),
                    },
                    {
                      id: 'FrontEnd',
                      labelView: (
                        <Text>
                          <Text style={{ color: 'black' }}>FrontEnd
                </Text>
                        </Text>
                      ),
                    },
                    {
                      id: 'BackEnd',
                      labelView: (
                        <Text>
                          <Text style={{ color: 'black' }}>BackEnd
                </Text>
                        </Text>
                      ),
                    },
                  ]}
                  //activeButtonId={'user'}
                  circleStyle={{ fillColor: 'black', borderColor: 'black' }}
                //  onChange={(option) => this.setState({usertype: option.id})}
                /> */}
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                {/* <TouchableOpacity style={{ margin: 5, backgroundColor: 'green', padding: 19, height: 30, alignItems: "center", justifyContent: 'center' }} onPress={this.approveIdea}>
                  <Text style={{ color: 'white' }}>Accept</Text>
                </TouchableOpacity> */}
                {acceptbutton}
                {/* <TouchableOpacity style={{ margin: 5, backgroundColor: 'red', padding: 20, height: 30, alignItems: "center", justifyContent: 'center' }} onPress={this.rejectIdea}>
                  <Text style={{ color: 'white' }}>REJECT</Text>

                </TouchableOpacity> */}


              </View>
            </View>



          </View>
        </Content>
       

        {/*For Modifying the project dialog start*/}
        <Modal
          offset={this.state.offset}
          open={this.state.open}
          modalDidOpen={this.modalDidOpen}
          modalDidClose={this.modalDidClose}
          style={{ alignItems: "center" }} >

          <View style={{ alignItems: "center", paddingBottom: 40 }}>

            <Text>Project Info</Text>

            <TextInput placeholder='Project Title'
              style={{ height: 40, borderBottomWidth: 1, borderBottomColor: 'black', width: 300, marginTop: 10 }}
              value={this.state.ProjectTitle}
              onChangeText={(text) => this.setState({ ProjectTitle: text })} />

            <TextInput placeholder='Project Description'
              style={{ height: 40, borderBottomWidth: 1, borderBottomColor: 'black', width: 300, marginTop: 30 }}
              value={this.state.ProjectDescription}
              onChangeText={(text) => this.setState({ ProjectDescription: text })} />


            <View style={{ flexDirection: 'row', marginTop: 30 }}>
              <TouchableOpacity style={styles.opensave} onPress={this.modifyProject}>
                <Text style={{ color: 'white' }}>SAVE</Text>

              </TouchableOpacity>
              <TouchableOpacity style={styles.opencancel} onPress={this.closeModal}>
                <Text style={{ color: 'white' }}>CANCEL</Text>
              </TouchableOpacity>

            </View>

          </View>
        </Modal>
        {/*For Modifying the project dialog close */}
      </Container>
    );
  }
  // Alert for delete action
  deleteAction() {
    Alert.alert(
      'Alert..!',
      'Do you want to delete project',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        { text: 'OK', onPress: () => this.deleteProject() },
      ],
      { cancelable: false },
    );
  }

  //Approved Idea
  approveIdea = () => {
    AsyncStorage.multiGet(["cropcode", "userToken"], (err, response) => {
      const cropcode = response[0][1];
      const userToken = response[1][1];
      console.log("userToken" + userToken);
      console.log("cropcode" + cropcode);
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
              idea_id: this.props.navigation.state.params.ideaId,
              empId: userToken,
              action: "accept",
              crop: cropcode, //Async
            })
          }).then((response) => response.json())
            .then((responseJson) => {
              console.log(JSON.stringify(responseJson));
              console.log(responseJson);
              if (responseJson.status === 'True') {
                this.setState({ open: false, error1: '', error2: '', ProjectDescription: '', ProjectTitle: '' })
                console.log("done")
                this.setState({ open: false })
               // this.refs.toast.showCenter('Project Is Accepted', Toast.Duration.long, Toast.Position.center);
                this.props.navigation.navigate('UserManageProjects')
              }
            }).catch((error) => {
              console.error(error);
            });
        }
      });
      this.refs.toast.showCenter('Approved Successfully');
    });
  };

  toastmsg() {
    this.refs.toast.show('Project Modified', Toast.Duration.long, Toast.Position.center);
    setTimeout(
      () => {
        this.props.navigation.navigate('UserManageProjects')

      },
      1000
    );

  }

  //Modify the project
  modifyProject = () => {
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
          fetch(API + 'manageIdeas.php', {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              proj_title: this.state.ProjectTitle,
              proj_desc: this.state.ProjectDescription,
              idea_id: this.props.navigation.state.params.ideaId,
              empId: this.props.navigation.state.params.empId,
              action: "modify",
              crop: crop, //Async
            })
          }).then((response) => response.json())
            .then((responseJson) => {
              console.log(JSON.stringify(responseJson));
              console.log(responseJson);

              // this.refs.toast.show('Project Modified', Toast.Duration.long, Toast.Position.center);

              // this.refs.toast.showBottom('Project Modified');
              if (responseJson.status === 'True') {
                console.log("done")
             //   this.refs.toast.show('Project Accepted', Toast.Duration.long, Toast.Position.center);
                this.setState({ open: false })
                //  this.refs.toast.show('Project Modified', Toast.Duration.long, Toast.Position.center);
                // this.props.navigation.navigate('UserManageProjects')
              }
            }).catch((error) => {
              console.error(error);
            });
        }
      });
    });
    this.toastmsg();

  };


  //Reject Idea
  rejectIdea = () => {
    AsyncStorage.getItem("cropcode", (err, res) => {
      const crop = res;
      //alert(this.props.navigation.state.params.ideaId+"sff"+this.props.navigation.state.params.empId)
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
              idea_id: this.props.navigation.state.params.ideaId,
              empId: this.props.navigation.state.params.empId, //Async
              action: "reject",
              crop: crop, //Async
            })
          }).then((response) => response.json())
            .then((responseJson) => {
              console.log(JSON.stringify(responseJson));
              console.log(responseJson);
              if (responseJson.status === 'True') {
                this.setState({ open: false })
                this.refs.toast.showCenter('Project Is Rejected');
                this.props.navigation.navigate('UserManageProjects');
                console.log("done")
              }
            }).catch((error) => {
              console.error(error);
            });
        }
      });
    });
  };
  //delete the project
  deleteProject = () => {
    AsyncStorage.getItem("cropcode", (err, res) => {
      const crop = res;
      //alert(crop+"crop"+this.props.navigation.state.params.empId+"idea"+this.props.navigation.state.params.ideaId)
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
              idea_id: this.props.navigation.state.params.ideaId,
              empId: this.props.navigation.state.params.empId,
              action: "delete",
              crop: crop, //Async
            })
          }).then((response) => response.json())
            .then((responseJson) => {
              console.log(JSON.stringify(responseJson));
              console.log(responseJson);
              if (responseJson.status === 'True') {
                console.log("done")
                this.setState({ open: false })
                this.refs.toast.showCenter('Project Is Deleted');
                this.props.navigation.navigate('UserManageProjects');
              }
            }).catch((error) => {
              console.error(error);
            });
        }
      });
    });
  };

}
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
  opensave1: {
    flex: 1,
    ...Platform.select({
      ios: {
        backgroundColor: 'green', borderRadius: 5, marginLeft:130,marginRight:130,
        width:'30%', height: 40, alignItems: "center", justifyContent: 'center' 
      },
      android: {
        backgroundColor: 'green', borderRadius: 5, marginLeft:130,marginRight:130,
       width:'30%', height: 40, alignItems: "center", justifyContent: 'center' 
     },
    }),
  },
});