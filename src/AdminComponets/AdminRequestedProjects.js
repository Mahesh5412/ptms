/*
FileName:AdminRequestedrojects.js
Version:1.0.0
Purpose:List of Projects or ideas and shows list of projects
Devloper:Rishitha,Naveen,Harsha
*/
import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, Dimensions, TouchableOpacity, FlatList, TextInput, Alert, ToastAndroid } from 'react-native';
import { Container, Content, Item, Input } from 'native-base';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/FontAwesome';
import Modal from "react-native-simple-modal";
import AsyncStorage from '@react-native-community/async-storage';
import { API } from "../WebServices/RestClient";
import NetInfo from '@react-native-community/netinfo';
import Snackbar from 'react-native-snackbar';
import Toast from 'react-native-whc-toast';
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
FOOTER_MAX_HEIGHT = 50
FOOTER_MIN_HEIGHT = 40

class ListItem extends React.Component {
  render() {
    const { item } = this.props;
    return (

      <View style={styles.container}>
        <TouchableOpacity onPress={this.props.AdminProjectInfo}>
          <View style={styles.signup}>
            <View style={[styles.buttonContainer, styles.signupButton]} >
              <View style={styles.box}>
                <View style={{ width: wp('68%'), flexDirection: 'row' }}>
                  <Text style={styles.signUpText0} >Project No:</Text>
                  <Text style={styles.signUpText1} >{item.idea_id}</Text>
                </View>
                <Text style={styles.signUpText2} > {item.created_on}</Text>
              </View>
              <View style={{ backgroundColor: '#f8f8f8', height: 2 }}>

              </View>

              <View style={{ flexDirection: 'row', paddingRight: 25, }}>
                <Text style={styles.signUpText4} >Title:</Text>
                <Text style={styles.signUpText3} >{item.idea_title}</Text>
              </View>

              <View style={{ flexDirection: 'row', paddingRight: 25, marginTop: 5 }}>
                <Text style={{ fontSize: 12, paddingTop: 10, color: 'black', alignItems: 'center', }} >Requested By:</Text>
                <Text style={{ fontSize: 12, paddingTop: 10, color: 'black', alignItems: 'center', }} >{item.userName}</Text>
              </View>
            </View>
          </View>
          <View style={{ backgroundColor: '#f8f8f8', height: 5 }}>

          </View>
        </TouchableOpacity>
      </View>
    )
  }
}

export default class Requested1 extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      dataSource: [],
      isFetching: false,
      open: false,
      ProjectTitle: "",
      ProjectDescription: "",
      role: '',
      userToken: '',
      error1: '', error2: '',
      itemPressedDisabled: false,
    };
    this.arrayholder = [];
  }
  modalDidOpen = () => {

  }
  modalDidClose = () => {
    this.setState({ open: false });
  };

  //dialog actions start
  moveUp = () => this.setState({ offset: -100 });

  resetPosition = () => this.setState({ offset: 0 });

  openModal = () => this.setState({ open: true });

  closeModal = () => this.setState({
    open: false, error1: '', error2: ''
  });
  //dialog actions close

  componentDidMount() {
    log("Debug", "admin request projects screen is loaded");
    this.ideas();
    this.getRequestedIdeas();
  }

  // Text Field validation method
  isValid() {
    const { ProjectTitle, ProjectDescription } = this.state;
    let valid = false;

    if (ProjectTitle.length === 0) {
      log("Warn", "project title should not be empty");
      this.setState({ error1: 'Project Title ' });
    }
    else if (ProjectDescription.length === 0) {
      log("Warn", "project description should not be empty");
      this.setState({ error2: 'Project Description ' });
    }

    else {
      valid = true;
    }
    return valid;
  }//isValid method close

  //get the IdeasList or projects
  async ideas() {

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

    this.getRequestedIdeas(this.state.role, this.state.userToken, this.state.cropcode);
  }
  //Refresh the data
  onRefresh() {
    this.setState({
      dataSource:[],
    })

  this.getRequestedIdeas() ;
  }
  componentWillReceiveProps(nextProps) {
    this.getRequestedIdeas();
  }
  //getting the Requested projects List
  getRequestedIdeas(role, userToken, cropcode) {
    log("Info", " getRequestedIdeas(role, userToken, cropcode) is used to get all requested projects at admin side");
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
        fetch(API + 'getIdeas.php',
          {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              crop: cropcode,
              action: 'requested',
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
              log("Warn", "no requested projects found");
              this.setState({
                isLoading: false,
              })


              Snackbar.show({

                title: 'No RequestedProjects',

                backgroundColor: '#3BB9FF',
                duration: Snackbar.LENGTH_LONG,
              });
            }
          })
          .catch((error) => {
            console.error(error);
            log("Error", "requested projects error");
          });
      }
    });

  }
  //getting the Requested projects List end

  //navigate for Edit the project ,approve and reject project
  AdminProjectInfo = (item, index) => {
    log("Info", "AdminProjectInfo method is used to move requested project to project info screen");
    this.props.navigation.navigate("AdminProjectInfo", {
      ideaId: item.idea_id,
      empId: item.emp_id,
      projectTitle: item.idea_title,
      ideaDescription: item.idea_description,
      userName: item.userName,
      createdOn: item.created_on,
    });
  }

  //Adding the new Project
  addProject = () => {
    log("Info", "addProject() method is used to add new project at admin side");
    AsyncStorage.getItem("cropcode", (err, res) => {
      const crop = res;
      if (this.isValid()) {
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
            this.setState({ itemPressedDisabled: true })
            fetch(API + 'manageIdeas.php', {
              method: 'POST',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                proj_title: this.state.ProjectTitle,
                proj_desc: this.state.ProjectDescription,
                empId: this.state.userToken, //Async
                action: "add",
                crop: crop, //Async
              })
            }).then((response) => response.json())
              .then((responseJson) => {
                console.log(JSON.stringify(responseJson));
                console.log(responseJson);
                this.refs.toast.show('Project Added', Toast.Duration.long, Toast.Position.center);

                if (responseJson.status === 'True') {
                  console.log("done")

                  this.setState({ itemPressedDisabled: false })
                  this.setState({ open: false, error1: '', error2: '', ProjectDescription: '', ProjectTitle: '' })
                  this.getRequestedIdeas(this.state.role, this.state.userToken, this.state.cropcode);
                }
              }).catch((error) => {
                console.error(error);
                log("Error", "error in project adding");
              });
          }

        });
      }
      //  this.getRequestedIdeas();
    });
  };
  //Adding the new Project end

  componentWillUnmount() {
    this.setState({
      text: "",
    })
  }

  componentWillUpdate() {
    console.log("update..........")
  }

  //Searh based on task id ,name,description,and user
  SearchFilterFunction(text) {
    log("Info", "SearchFilterFunction(text) method  used for searching");
    console.log(text);

    const newData = this.arrayholder.filter(function (item) {
      const idea_id = item.idea_id.toUpperCase()
      const idea_id1 = text.toUpperCase()
      const created_on = item.created_on.toUpperCase()
      const created_on1 = text.toUpperCase()
      const idea_title = item.idea_title.toUpperCase()
      const idea_title1 = text.toUpperCase()
      const userName = item.userName.toUpperCase()
      const userName1 = text.toUpperCase()

      return idea_id.indexOf(idea_id1) > -1 ||
        created_on.indexOf(created_on1) > -1 ||
        idea_title.indexOf(idea_title1) > -1 ||
        userName.indexOf(userName1) > -1

    })
    this.setState({
      dataSource: newData,
      text: text
    })
  }
  //Search data end

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
        <View style={styles.MainContainer}>
          <Toast ref="toast" />
          <View style={{ height: '91%' }}>
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
                    AdminProjectInfo={() => this.AdminProjectInfo(item, index)}
                  />
                </View>
              }
              keyExtractor={item => item.id}
              ListEmptyComponent={this._listEmptyComponent}
            />
          </View>
          <TouchableOpacity onPress={this.openModal} style={styles.bottomView}>
            <View style={styles.bottomView} >
              <Icon
                name='lightbulb-o'
                color='white'
                type='MaterialCommunityIcons'
                size={30}
              />
              <Text style={styles.textStyle}>  ADD PROJECT</Text>
            </View>
          </TouchableOpacity>
          <Modal
            offset={this.state.offset}
            open={this.state.open}
            modalDidOpen={this.modalDidOpen}
            modalDidClose={this.modalDidClose}
            style={{ alignItems: "center" }} >
            <View style={{ paddingBottom: 40 }}>
              <Text style={{ color: 'black', fontSize: 20 }}> Project Information</Text>

              <TextInput placeholder='Project Title'
                style={{ height: 40, borderBottomWidth: 1, borderBottomColor: '#00A2C1', width: '98%', marginTop: 30, color: '#C0C0C0' }}
                style={{ height: 40, borderBottomWidth: 1, borderBottomColor: '#00A2C1', width: '98%', marginTop: 10, }}
                onChangeText={(text) => this.setState({ ProjectTitle: text })}
                value={this.state.text}
                maxLength={50} />
              <Text style={{ color: 'red', alignItems: 'flex-start', alignSelf: 'flex-start', justifyContent: 'flex-start', }}>{this.state.error1}</Text>


              <TextInput placeholder='Project Description'
                style={{ height: 40, borderBottomWidth: 1, borderBottomColor: '#00A2C1', width: '98%', marginTop: 30, color: '#C0C0C0' }}
                style={{ height: 40, borderBottomWidth: 1, borderBottomColor: '#00A2C1', width: '98%', marginTop: 10, }}

                onChangeText={(text) => this.setState({ ProjectDescription: text })}
                value={this.state.text}
                maxLength={1021} />
              <Text style={{ color: 'red', alignItems: 'flex-start', alignSelf: 'flex-start', justifyContent: 'flex-start', }}>{this.state.error2}</Text>

            </View>
            <View style={{ flexDirection: 'row', marginTop: 20, alignItems: 'center', justifyContent: 'center', alignSelf: 'center', }}>

              <TouchableOpacity style={styles.opensave} onPress={this.addProject} disabled={this.state.itemPressedDisabled}>
                <Text style={{ color: 'white' }}>SAVE</Text>

              </TouchableOpacity>
              <TouchableOpacity style={styles.opencancel} onPress={this.closeModal}>
                <Text style={{ color: 'white' }}>CANCEL</Text>
              </TouchableOpacity>
            </View>
          </Modal>



        </View>


      </Container>
    );
  }
}

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
      paddingLeft: 5,
      paddingRight: 5,
      backgroundColor: '#00A2C1',
      fontSize: 22,
      marginLeft: 5,
      borderRadius: 5

    },
    container: {
      flex: 1,
      width: '98%',
      paddingLeft: hp('2%'),
      backgroundColor: '#fff'
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




    },
    signupButton: {


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
      //  fontWeight:'bold'

    },
    signUpText1: {
      fontSize: 13,
      color: 'green',
      paddingTop: 10,
      //  fontWeight:'bold',
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
      // marginLeft: 200,
      fontSize: 13,
      color: 'black',
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
      // backgroundColor:'#C0C0C0'

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
    bodytext: {
      margin: 5,
      backgroundColor: 'green',
      padding: Platform.OS === 'ios' ? 0 : 20,
      height: 30,
      alignItems: "center",
      justifyContent: 'center',
      width: Platform.OS === 'ios' ? 100 : 0,


    },
    bodytext1: {
      margin: 5,
      backgroundColor: 'red',
      padding: Platform.OS === 'ios' ? 0 : 20,
      height: 30,
      alignItems: "center",
      justifyContent: 'center',
      width: Platform.OS === 'ios' ? 100 : 0,


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