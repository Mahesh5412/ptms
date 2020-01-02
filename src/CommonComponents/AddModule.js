/*
FileName:AddModule.js
Version:1.0.0
Purpose:Modify the existing module
Devloper:Naveen,Rishitha,Harsha
*/
import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, Dimensions, FlatList, TouchableHighlight, Image, TouchableOpacity, TextInput, Alert } from 'react-native';
import { Left, Button, Container, Header,Body,Title, Content, Item, Input, Right } from 'native-base';
import AsyncStorage from '@react-native-community/async-storage';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Modal from "react-native-simple-modal";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {API }from "../WebServices/RestClient";
import NetInfo from '@react-native-community/netinfo';
import Snackbar from 'react-native-snackbar';
import Toast from 'react-native-whc-toast';
import log from '../LogFile/Log';



FOOTER_MAX_HEIGHT = 50
FOOTER_MIN_HEIGHT = 40

class ListItem extends React.Component {

  constructor(props) {
    super(props)

    this.state = {

      deletevisibility: false
    }
  }

  componentDidMount() {
    log("Debug", "Add Module screen is loaded");
    this.VisibleActions();
  }
  //Visable actions based on role start
  async VisibleActions() {

    AsyncStorage.getItem("emp_role", (err, res) => {

      //Alert.alert(res);

      if (res == 'Emp' || res == 'Manager'||res == 'Approver') {

        this.setState({ deletevisibility: true });
      } else {

        this.setState({ deletevisibility: false });
      }

    });

  }
  //Visable actions based on role close

  render() {
    const { item } = this.props;

    let button;

    if (this.state.deletevisibility === false) {
      button =
      <TouchableOpacity onPress={() => this.props.deleteAction()} style={{ width: 60, backgroundColor: 'red', marginLeft: 5 }}>
      <Text style={{ color: '#fff', textAlign: 'center' }}>DELETE</Text></TouchableOpacity>
    } else {
      button = null;
    }


    return (

      <View style={styles.container}>
        <TouchableOpacity onPress={this.props.MainTask}>
       
              <View style={styles.box}>

                <View style={{ flexDirection: 'row',width:wp('70%')}}>
                  <Text style={styles.signUpText0} >MODULE ID:</Text>
                  <Text style={styles.signUpText1} >{item.moduleId}</Text>
                  <Text style={styles.signUpText2} > {item.created_on}</Text>
                </View>
                
              </View>
              <View
                style={{
                  borderBottomColor: '#C0C0C0',
                  borderBottomWidth: 0.3,
                }}
              />

              <View style={{ flexDirection: 'row', paddingRight: 25, }}>
                <Text style={styles.signUpText4} >Title:</Text>
                <Text style={styles.signUpText3} >{item.moduleDesc}</Text>
              </View>


              <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center',paddingBottom:10 }}>
                <TouchableOpacity onPress={() => this.props.ModifyModule()} style={{ width: 60, backgroundColor: 'black' }}>
                  <Text style={{ color: '#fff', textAlign: 'center' }}>MODIFY</Text></TouchableOpacity>

                {/* <TouchableOpacity onPress={() => this.props.deleteAction()} style={{ width: 60, backgroundColor: 'red', marginLeft: 5 }}>
                  <Text style={{ color: '#fff', textAlign: 'center' }}>DELETE</Text></TouchableOpacity> */}
                     {button}
              </View>
              <View style={{height:5,backgroundColor:'#f8f8f8'}}>

              </View>

         

        </TouchableOpacity>

      </View>

    )
  }
}

export default class AddModule extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      open: false,
      modulename: '',
      role: '',
      userToken: '',
      isLoading: true,
      dataSource: [],
      isFetching: false,
      modalVisible: false,
      idea_id: this.props.navigation.state.params.idea_id,
      idea_title: this.props.navigation.state.params.idea_title,
      action: '',
      moduleid: '',
      error1:'',
      itemPressedDisabled:false,
    };

  }
  //open the Modal 
  modalDidOpen = () => console.log("Modal did open.");
  //close the Modal
  modalDidClose = () => {

    this.setState({ open: false }); this.setState({ open: false });
    console.log("Modal did close.");

  };

  //Dialog Actions start
  moveUp = () => this.setState({ offset: -100 });

  resetPosition = () => this.setState({ offset: 0 });

  openModal = () => this.setState({ open: true });

//close dialog
  closeModal = () => {
    this.setState({ open: false,error1:''
   });
    this.setState({modulename:''})
}
  //Dialog Actions close

  componentDidMount() {
    log("Debug", " getModules screen is loaded");
    this.getModules();
    // this.setModalVisible(!this.state.modalVisible);
  }

  //list of Modules getting
  add() {

    this.getModules();
  }

  //refresh data
  onRefresh() {
    this.setState({ isFetching: true }, function () { this.add() });
  }

  componentWillReceiveProps(nextProps) {
    console.log(nextProps);
    console.log("re loading...........")
    this.getModules();
  }

  //get Module list start
  getModules() {

    const { idea_id } = this.state;

    console.log(idea_id);

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
        }else{
      fetch(API+'getModules.php',
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            action: 'get',
            idea_id: idea_id,
            crop: cropcode
          })
        })
        .then((response) => response.json())
        .then((responseJson) => {
          //    alert(JSON.stringify(responseJson));
          console.log(responseJson)
          this.setState({
            isLoading: false,
            dataSource: responseJson.data,
            isFetching: false
          }, function () {

          });
        })
        .catch((error) => {
          console.error(error);
          log("Error", "Add Module error");
        });
      }
    });
    });
  }
  //get Module list end

 //Validatios
  isValid() {
    const {modulename} = this.state;
    let valid = false;

    if(modulename.length===0){
      log("Warn", "module name should not be empty");
      // ToastAndroid.showWithGravity('"Enter sub Task', ToastAndroid.SHORT,ToastAndroid.CENTER);
      this.setState({ error1: 'Module Title ' });
    }
    
    else {
      valid = true;
    }
    return valid;
  }
   //Add the new Module
  addModule() {

    const { modulename } = this.state;
    const { idea_id } = this.state;
    console.log("idea_id" + idea_id);
    console.log("modulename" + modulename);

    //getting cropcode,usertoken(emp id)
    AsyncStorage.multiGet(["cropcode", "userToken"], (err, response) => {
      const cropcode = response[0][1];
      const userToken = response[1][1];
      console.log("userToken" + userToken);
      console.log("cropcode" + cropcode);
      NetInfo.fetch().then(state => {
        if (state.type == "none") {
          console.log(state.type);
          log("Warn", "No internet connection");
          Snackbar.show({
            title: 'No Internet Connection',
            backgroundColor: 'red',
            duration: Snackbar.LENGTH_LONG,
          });
        }
        else{

          if(this.isValid()){
            this.setState({ itemPressedDisabled: true })
      fetch(API+'manageModule.php',
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            action: 'add',
            idea_id: idea_id,
            crop: cropcode,
            module_Name: modulename,
            empId: userToken

          })
        })
        .then((response) => response.json())
        .then((responseJson) => {
          console.log(responseJson)
          this.refs.toast.show('Module Added', Toast.Duration.long, Toast.Position.center);
          if (responseJson.status == 'True') {
            this.setState({ itemPressedDisabled: false })
            this.setState({ open: false,error1: '', });
            this.getModules();
          }

        })
        .catch((error) => {
          console.error(error);
          log("Error", "error in project adding");
        });
        this.closeModal();
      }
    }
    });
    });

  }

  //delete Module Alert start
  deleteAction(item, index) {
    Alert.alert(
      'Alert..!',
      'Do you want to delete Module',
      [
        {
          text: 'NO',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        { text: 'YES', onPress: () => this.deleteModule(item) },
      ],
      { cancelable: false },
    );
  }
  //delete Module  Alert end

  //delete the Module start
  deleteModule = (item) => {
    //cropcode getting
    AsyncStorage.getItem("cropcode", (err, res) => {
      const crop = res;
      //empid getting
      AsyncStorage.getItem("userToken", (err, res) => {
        const empId = res;
       // alert(item.moduleId + empId)
        NetInfo.fetch().then(state => {
          if (state.type == "none") {
            console.log(state.type);
            log("Warn", "No internet connection");
            Snackbar.show({
              title: 'No Internet Connection',
              backgroundColor: 'red',
              duration: Snackbar.LENGTH_LONG,
            });
          }else{
        fetch(API+'manageModule.php', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            moduleid: item.moduleId,
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
              this.props.navigation.navigate("AddModule", { idea_id: this.state.idea_id });
            } else {
              log("Warn", "You can't delete this module");
              alert("Having maintasks,you cannot delete this module");
            }
          }).catch((error) => {
            console.error(error);
            log("Error", "error in delete Module ");
          });
        }
      });
      });
    });
  };
  //delete the Module start

  //Navigate to maintask screen
  MainTask(item, index) {

    console.log(item);
    console.log(index);

    console.log(item.ideaId + item.moduleId);
    log("Info", "MainTask() method is used to move Add Module to Add MainTask screen");

    this.props.navigation.navigate('AddMainTask', { moduleId: item.moduleId, ideaid: item.ideaId,moduledesc:item.moduleDesc,idea_title:this.state.idea_title});

  }

  //Navigate to Module Modify Screen
  ModifyModule(item, index) {
    console.log(item);
    console.log(index);
    log("Info", "ModifyModule() method is used to move Add Module to Add ModuleAdd screen");
    this.props.navigation.navigate('ModuleAdd', { action: 'modify', moduleId: item.moduleId, ideaid: item.ideaId,moduledesc:item.moduleDesc });

  }

  //Seperate the list of data
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


//For empty data(No list available)
  _listEmptyComponent = () => {
    return (
      <View style={{ width: '90%', height: '80%' }}>
        <Text></Text>
      </View>
    )
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
          <Icon size={25} name="arrow-left" style={{color: '#fff'}}onPress={() =>
            this.props.navigation.goBack(null)}  />
          
      </Left>
      <Body>
        <Title style={{color: '#fff', fontWeight: '600' }}>{this.state.idea_title}</Title>
      </Body>
      <Right></Right>
    </Header>

      <View style={styles.MainContainer}>
      <Toast ref="toast"/>
        <View style={{ height: '90%' }}>

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
                  MainTask={() => this.MainTask(item, index)}//For Add Maintask
                  // openModal={() => this.openModal(item, index)}//For Add Module
                  ModifyModule={() => this.ModifyModule(item, index)}//For Modify Module
                  deleteAction={() => this.deleteAction(item, index)}//For delete module
                />
              </View>
            }
            keyExtractor={item => item.id}
            ListEmptyComponent={this._listEmptyComponent}
          />

        </View>
        {/* <View style={{height:hp('15%')}}></View> */}
        <View style={styles.bottomView} >
          <TouchableOpacity onPress={this.openModal} >
            {/* <Icon name='lightbulb-o'color='white' type='MaterialCommunityIcons' size={30} /> */}
            <Text style={styles.textStyle}>ADD MODULE</Text>
            </TouchableOpacity>
          </View>

        <Modal
          offset={this.state.offset}
          open={this.state.open}
          modalDidOpen={this.modalDidOpen}
          modalDidClose={this.modalDidClose}
          style={{ alignItems: "center" }} >

          <View style={{ alignItems: "center", paddingBottom: 40 }}>

            <Text>MODULE INFO</Text>

            <TextInput placeholder='Module Title'
              style={{ height: 40, borderBottomWidth: 1, borderBottomColor: 'black', width: 300, marginTop: 10 }}
              onChangeText={(text) => this.setState({ modulename: text })}
              value={this.state.modulename} />
               <Text style={{color:'red',alignItems:'flex-start',alignSelf:'flex-start',justifyContent:'flex-start', marginLeft:25}}>{this.state.error1}</Text>

               
          </View>
          <View style={{flexDirection:'row',marginTop:20,alignItems:'center',justifyContent:'center',alignSelf:'center',}}>
          <TouchableOpacity style={styles.opensave} onPress={this.addModule.bind(this)}  disabled={this.state.itemPressedDisabled}>
                <Text style={{ color: 'white' }}>SAVE</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.opencancel} onPress={this.closeModal} >
                <Text style={{ color: 'white' }}>CANCEL</Text>
              </TouchableOpacity>
              
            </View>

        </Modal>
        
     
      </View>
      {/* <Content> */}

     
       
      {/* </Content> */}
      </Container>
      

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
      height: Dimensions.get('window').height,
      backgroundColor:'#f8f8f8'
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
      fontSize: 18,
     // backgroundColor:'#00a2c1',
      paddingLeft:10,
      paddingRight:10,
      paddingBottom:5,
      paddingTop:5,
      borderRadius: 5,
      
    },
    container: {
      flex: 1,
      width: '98%',
      backgroundColor:'#fff'
   
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
      fontWeight: 'bold',
      alignItems: 'center',
      fontSize: 18,
    },
    buttonContainer: {
      width: wp('90%'),
      alignSelf: 'baseline',
      marginBottom: 25,
      color: '#d2691e',
      marginLeft: 4,
      backgroundColor:'#f8f8f8',



    },
    signupButton: {

      backgroundColor:'#f8f8f8',
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
      paddingLeft:5,
      fontWeight:"bold",

    },
    signUpText1: {
      fontSize: 13,
      color: 'green',
      paddingTop: 10,
    fontWeight:"bold",
    width:'80%'
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
      paddingLeft:5,
     // backgroundColor:'#f8f8f8',


      alignItems: 'center',
    },
    signup: {
      
      color: "#FFF",

    },
    boxone: {
      flex: 1,


    },
    boxtwo: {
      flex: 1,

    },
    boxthree: {
      flex: 1,

    },
    box: {
      flexDirection: 'row'
     


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
