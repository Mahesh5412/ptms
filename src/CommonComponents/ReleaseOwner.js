/*
FileName:ReleaseOwner.js
Version:1.0.0
Purpose:Adding the ReleaseOwner for project
Devloper:Rishitha,Harsha
*/
import React, { Component } from 'react';
import { Text, TouchableHighlight, View, Alert, Button, TextInput, TouchableOpacity } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import SearchableDropdown from 'react-native-searchable-dropdown';
import AsyncStorage from '@react-native-community/async-storage';
import Modal from "react-native-simple-modal";
import {API }from "../WebServices/RestClient";
import NetInfo from '@react-native-community/netinfo';
import Snackbar from 'react-native-snackbar';
import Toast from 'react-native-whc-toast';

export default class ReleaseOwner extends Component {

  constructor(props) {
    super(props)
    this.state = {
      open: false,
      resource: [],
      idea_id: this.props.navigation.state.params.idea_id,
      selectedRo: '',

    }

  }

  //Dialog actions start
  moveUp = () => this.setState({ offset: -100 });

  resetPosition = () => this.setState({ offset: 0 });

  openModal = () => this.setState({ open: true });

  closeModal = () => {
    this.props.navigation.goBack();
    this.setState({ open: false });
  }
  //Dialog actions close

  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }
  componentDidMount() {
    this.getEmployeesList();//getting Emloyees List
    this.openModal();
  }


  //Getting Employees List for adding releaseowner
  getEmployeesList() {
    //crop code
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

  //Adding ReleaseOwner for Project start
  selectRO() {

    const { idea_id } = this.state;

    // Alert.alert(ideaid);
    //cropcode,userToken(empId),role of Employee 
    AsyncStorage.multiGet(["cropcode", "userToken", "emp_role"], (err, response) => {
      const cropcode = response[0][1];
      const userToken = response[1][1];
      const role = response[2][1];
      NetInfo.fetch().then(state => {
        if (state.type == "none") {
          console.log(state.type);
          Snackbar.show({
            title: 'No Internet Connection',
            backgroundColor: 'red',
            duration: Snackbar.LENGTH_LONG,
          });
        }else{
      fetch(API+'manage_ideas.php',
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            crop: cropcode,
            action: 'ro',
            empId: this.state.selectedRo,
            userType: role,
            ideaId: idea_id,
          })
        })
        .then((response) => response.json())
        .then((responseJson) => {
          this.refs.toast.show('RO Selected', Toast.Duration.long, Toast.Position.center);
         

          if (responseJson.status === 'True') {
           // this.refs.toast.show('RO Selected', Toast.Duration.long, Toast.Position.center);
           
            // this.props.navigation.goBack();
            this.closeModal();
            // this.setState({
            //   resource:responseJson.data
            // });
          }
        })
        .catch((error) => {
          console.error(error);
        });
      }
    });
    });

  
  }
  //Adding ReleaseOwner for Project end
  //Close the dialog
  modalDidClose = () => {
    // this.props.navigation.goBack();
    this.props.navigation.navigate("UserManageProjects",{idea_id:this.state.idea_id});
    this.setState({ open: false }); this.setState({ open: false });
  };

  render() {
    return (
      <Modal
        offset={this.state.offset}
        open={this.state.open}
        modalDidOpen={this.modalDidOpen}
        modalDidClose={this.modalDidClose}
        style={{ alignItems: "center",backgroundColor:'#fff' }} >

        <View style={{ alignItems: "center", paddingBottom: 40,backgroundColor:'#fff' }}>
        <Toast ref="toast"/>
          <View style={{ marginTop: 30, marginLeft: 10, width: '100%', }}>
            <Text style={{paddingLeft:5,color:'#c0c0c0'}} >Select Resources</Text>
            <View style={{ justifyContent: 'center', marginRight: 15 }}>

              <SearchableDropdown
                onTextChange={text => console.log(text)}
                onItemSelect={item => this.setState({ selectedRo: item.id })}
                containerStyle={{ padding: 5 }}
                textInputStyle={{
                  padding: 12,
                  borderWidth: 1,
                  borderColor: '#000',
                  backgroundColor: '#fff',
                }}
                itemStyle={{
                  padding: 10,
                  marginTop: 2,
                  borderWidth: 1,
                }}
                itemTextStyle={{
                  color: '#000',
                }}
                itemsContainerStyle={{
                  //items container style you can pass maxHeight
                  //to restrict the items dropdown hieght
                  // maxHeight: '60%',
                }}
                items={this.state.resource}
                defaultIndex={0}
                placeholder="Select RO"
                resetValue={false}
                underlineColorAndroid="transparent" />
            </View>
          </View>

          <View style={{ flexDirection: 'row', marginTop: 30 }}>
            <TouchableOpacity style={{
              margin: 5,borderRadius:5, backgroundColor: '#00A2C1', padding: 19, height: 30, alignItems: "center",
              justifyContent: 'center'
            }} onPress={this.closeModal}>
              <Text style={{ color: 'white',fontWeight:'bold' }}>CANCEL</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.selectRO()} style={{
              margin: 5,borderRadius:5, backgroundColor: '#00A2C1', padding: 20, height: 30, alignItems: "center",
              justifyContent: 'center'
            }} >
              <Text style={{ color: 'white',fontWeight:'bold' }}>SAVE</Text>
            </TouchableOpacity>
          </View>

        </View>
      </Modal>
    );
  }
}