/*
FileName:AdminProjectInfo.js
Version:1.0.0
Purpose:Edit and Approve the Project
Devloper:Naveen,Harsha
*/
import React, { Component } from 'react';
import { Platform, Alert, TextInput, StyleSheet, Text, styles, View, StatusBar, TouchableOpacity, Dimensions, ScrollView, Image, checked, CheckBox, TouchableHighlight } from 'react-native';
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

var radiogroup_options = [
  { id: 0, label: 'UX' },
  { id: 1, label: 'FrontEnd' },
  { id: 2, label: 'BackEnd' },
];


export default class AdminProjectInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      dataSource: [],
      isFetching: false,
      open: false,
      idea_id: "",
      role: '',
      empId: '',
      action: '',
      userToken: '',
      modifyvisibility: false,
      ProjectTitle:'',
      ProjectDescription:'',
      error1:'',error2:'',
    };
  }

  Disabling() {


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

    this.Disabling();
  }

  //For Modifying the Project
  modalDidOpen = () => {

  }
  modalDidClose = () => {

    this.setState({ open: false });

  };
  //Dialog Moves for open,close,moveup,resetposition
  moveUp = () => this.setState({ offset: -100 });

  resetPosition = () => this.setState({ offset: 0 });

  openModal = () => this.setState({ open: true });

  closeModal = () => {
    this.setState({ open: false,error1:'',error2:''
   });
    this.props.navigation.goBack();
  }

  render() {

    let button;

    if (this.state.modifyvisibility === true) {
      button =
        <View style={{ alignContent: 'flex-end', marginLeft: 200, paddingTop: 20, shadowOffset: 3, shadowColor: '#fff' }}>

          <Icon style={{ paddingLeft: 20, paddingTop: 14, backgroundColor: '#fff', borderWidth: 1, borderRadius: 30, width: 60, height: 60 }} name="pencil" size={30} color="black" onPress={() =>
            this.openModal()} disabled={this.state.disable} />

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
            height: 100,
            width: Dimensions.get('window').width,
            borderBottomColor: '#ffffff',
            justifyContent: 'space-between',
          }}>
          {/* <View style ={{marginLeft:10,flexDirection:'row'}}  > */}

          <Left>
            <Icon name="arrow-left" size={30} color="#fff" onPress={() =>
              this.props.navigation.navigate('AdminManageProjects')} />
          </Left>

          <Right>
            <Icon name="delete" size={30} color="red" onPress={this.deleteAction.bind(this)} />
          </Right>

        </Header>
        <View style={{ height: 60, backgroundColor: '#00A2C1', flexDirection: 'row' }}>
          <Text style={{ fontSize: 30, color: '#fff', marginLeft: 10 }}>{this.props.navigation.state.params.projectTitle}</Text>
          {/* <View style={{ alignContent: 'flex-end', marginLeft: 200, paddingTop: 20, shadowOffset: 3, shadowColor: '#fff' }}>
            <Icon style={{ paddingLeft: 20, paddingTop: 14, backgroundColor: '#fff', borderWidth: 1, borderRadius: 30, width: 60, height: 60 }} name="pencil" size={30} color="black" onPress={() =>
              this.openModal()} />
          </View> */}
          {button}
        </View>
        <Content>
          

          <View style={{ paddingTop: 40 }}>

          <Toast ref="toast"/>
            <View style={{ flexDirection: 'row'}}>
              <Text style={{paddingLeft:7,color:'#707070',width:'75%'}}> Requested By  :   {this.props.navigation.state.params.userName}    </Text>
              <Text style={{color:'#707070' }}>  {this.props.navigation.state.params.createdOn} </Text>
            </View>
            <View style={{ flexDirection: 'row', paddingRight: 40 }}>

              <Text style={{ paddingLeft: 10,color:'#707070',paddingTop:10 }}>
                Description :
    </Text>
              <ScrollView style={{ paddingRight: 40,paddingTop:10 }}>
                <Text style={{ paddingLeft: 25, alignSelf: "baseline", paddingRight: 25 }}>
                  {this.props.navigation.state.params.ideaDescription}
                </Text>
              </ScrollView>
            </View>
            <View style={{ marginBottom: 50 }}>
              <View style={{
                marginTop: 250, flexDirection: 'row', justifyContent: 'center'
              }}>
                <RadioGroup
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
                />
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                <TouchableOpacity style={{ margin: 5, backgroundColor: '#00A2C1',borderRadius:5, padding: 19, height: 30, alignItems: "center", justifyContent: 'center' }} onPress={this.approveIdea}>
                  <Text style={{ color: 'white' }}>Accept</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ margin: 5, backgroundColor: '#00A2C1',borderRadius:5, padding: 20, height: 30, alignItems: "center", justifyContent: 'center' }} onPress={this.rejectIdea}>
                  <Text style={{ color: 'white' }}>REJECT</Text>

                </TouchableOpacity>


              </View>
            </View>

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
                  onChangeText={(text) => this.setState({ ProjectTitle: text })}
                  value={this.state.text} />
                  <Text style={{color:'red',alignItems:'flex-start',alignSelf:'flex-start',justifyContent:'flex-start', marginLeft:25}}>{this.state.error1}</Text>


                <TextInput placeholder='Project Description'
                  style={{ height: 40, borderBottomWidth: 1, borderBottomColor: 'black', width: 300, marginTop: 30 }}
                  onChangeText={(text) => this.setState({ ProjectDescription: text })}
                  value={this.state.text} />
               <Text style={{color:'red',alignItems:'flex-start',alignSelf:'flex-start',justifyContent:'flex-start', marginLeft:25}}>{this.state.error2}</Text>


                <View style={{ flexDirection: 'row', marginTop: 30 }}>
                  <TouchableOpacity style={{ margin: 5, backgroundColor: 'red', padding: 19, height: 30, alignItems: "center", justifyContent: 'center' }} onPress={this.closeModal}>
                    <Text style={{ color: 'white' }}>CANCEL</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={{ margin: 5, backgroundColor: 'green', padding: 20, height: 30, alignItems: "center", justifyContent: 'center' }} onPress={this.modifyProject}>
                    <Text style={{ color: 'white' }}>SAVE</Text>

                  </TouchableOpacity>
                </View>

              </View>
            </Modal>
            {/*For Modifying the project dialog close */}

          </View>
        </Content>

      </Container>
    );
  }

//Textfield validation method
  isValid() {
    const { ProjectTitle,ProjectDescription,assignedto} = this.state;
    let valid = false;
  
     if(ProjectTitle.length===0){
      // ToastAndroid.showWithGravity('"Enter sub Task', ToastAndroid.SHORT,ToastAndroid.CENTER);
      this.setState({ error1: 'Enter Project Title ' });
    }
    else if (ProjectDescription.length === 0) {
      // alert("Enter Description");
      // ToastAndroid.showWithGravity('"Enter Description', ToastAndroid.SHORT,ToastAndroid.CENTER);
      this.setState({ error2: 'Enter Project Description ' });
    }
    
  
    else {
      valid = true;
    }
    return valid;
  }//isValid method end

  //delete project start
  deleteAction() {
    Alert.alert(
      'Alert..!',
      'Do you want to delete project',
      [
        {
          text: 'NO',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        { text: 'OK', onPress: () => this.deleteProject() },
      ],
      { cancelable: false },
    );
  }
  //delete project end

  //Approved Idea
  approveIdea = () => {
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
        }else{
      fetch(API + 'manage_ideas.php', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          idea_id: this.props.navigation.state.params.ideaId,
          empId: this.props.navigation.state.params.empId,
          action: "accept",
          crop: crop, //Async
        })
      }).then((response) => response.json())
        .then((responseJson) => {
          console.log(JSON.stringify(responseJson));
          console.log(responseJson);
          this.refs.toast.showCenter('Approved Idea');
          if (responseJson.status === 'True') {

            console.log("done")
            this.setState({ open: false })
            this.props.navigation.navigate('AdminManageProjects')
          }
        }).catch((error) => {
          console.error(error);
        });
      }
    });
    });
  };

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
        }else{
          if(this.isValid()){
      fetch(API + 'manage_ideas.php', {
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
          if (responseJson.status === 'True') {
            console.log("done")
            this.setState({ open: false })
            this.props.navigation.navigate('AdminManageProjects')
          }
        }).catch((error) => {
          console.error(error);
        });
      }
    }
    });
    });
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
        }else{
      fetch(API + 'manage_ideas.php', {
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
            console.log("done")
            this.setState({ open: false })
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
        }else{
      fetch(API + 'manage_ideas.php', {
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
            this.props.navigation.navigate('AdminManageProjects');
          } else {
            alert("Having maintasks,you cannot delete this project");
          }
        }).catch((error) => {
          console.error(error);
        });
      }
    });
    });
  };

}