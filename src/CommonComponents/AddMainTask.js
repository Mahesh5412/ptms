/*
FileName:AddMainTask.js
Version:1.0.0
Purpose:Modify the existing module
Devloper:Rishitha,Raju,Naveen,Harsha
*/
import React, { Component } from 'react';
import Requesteddata from '../AdminComponets/AdminRequestedDataProjects';
import { Platform, StyleSheet, Text, View, Dimensions, FlatList, TouchableHighlight, Image, TouchableOpacity, TextInput, Alert, TouchableWithoutFeedback } from 'react-native';
import { Left, Button, Container, Header, Body, Title, Content, Item, Input, Right } from 'native-base';
import AsyncStorage from '@react-native-community/async-storage';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Modal from "react-native-simple-modal";
import SearchableDropdown from 'react-native-searchable-dropdown';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { API } from "../WebServices/RestClient";
import { Collapse, CollapseHeader, CollapseBody } from "accordion-collapse-react-native";
import NetInfo from '@react-native-community/netinfo';
import Snackbar from 'react-native-snackbar';
import Toast from 'react-native-whc-toast';
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

    this.VisibleActions();
  }

  async VisibleActions() {

    AsyncStorage.getItem("emp_role", (err, res) => {

      //Alert.alert(res);

      if (res == 'Emp' || res == 'Manager' || res == 'Approver') {

        this.setState({ deletevisibility: true });
      } else {

        this.setState({ deletevisibility: false });
      }

    });

  }



  render() {
    const { item } = this.props;

    let button;

    // if (this.state.deletevisibility === false) {
    //   button =
    //     <TouchableWithoutFeedback onPress={this.props.DeleteMainTaskAction}>
    //       <View style={{ width: 55, backgroundColor: 'red', marginRight: 15 }}>
    //         <Text style={{ color: '#fff', textAlign: 'center' }}>DELETE</Text>
    //       </View>
    //     </TouchableWithoutFeedback>;
    // } else {
    //   button = null;
    // }

    return (
<View>
      <Collapse style={styles.container}>
      <CollapseHeader style={styles.boxheader}>

    

              <View style={{ flexDirection: 'row'}}>
                <Text style={styles.signUpText0} >Task No:</Text>
                <Text style={styles.signUpText1} >{item.id}</Text>
                <Text style={styles.signUpText2}> {item.assignedDate}</Text>
              </View>
              
         
          

            <View style={{ flexDirection: 'row', paddingRight: 25, }}>
              <Text style={styles.signUpText4} >Task Title:</Text>
              <Text style={styles.signUpText3text} >{item.taskTitle}</Text>
            </View>

            </CollapseHeader>

<CollapseBody>

            <View style={styles.box1}>

            <View style={{ flexDirection: 'row', paddingRight: 25, width:'84%'}}>
              <Text style={styles.signUpText4} >Description:</Text>
              <Text style={styles.signUpText3} >{item.taskDesc}</Text>
              <Text style={styles.listgap} >Task Status:</Text>
              <Text style={styles.signUpText3} >{item.taskStatus}%completed</Text>
            </View>

            </View>
   

            <View style={{ flexDirection: 'row',  }}>

              <Text style={styles.signUpText4} >Assigned To:</Text>
              <Text style={styles.signUpText03} >{item.toEmp} </Text>
              <Text style={styles.listgap1} >Assigned By:</Text>
              <Text style={styles.signUpText3} >{item.byEmp}</Text>
            </View>

            {/* <View style={{ flexDirection: 'row', paddingRight: 25, }}>
              <Text style={styles.signUpText4} >Time Left:</Text>
              <Text style={styles.signUpText3} >{item.timeleft}</Text>
            </View> */}

            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', paddingTop: 15 }}>

            
              {button}


              <TouchableOpacity onPress={() => this.props.AddSubTask()} style={{ width: 98, backgroundColor: 'black',  }}>
                <Text style={{ color: '#fff', textAlign: 'center' }}>Add Subtask</Text></TouchableOpacity>
              {/* <TouchableOpacity onPress={() => this.props.ViewSubTasks()} style={{
                width: 100, backgroundColor: '#33adff',
                marginLeft: 10
              }}>
                <Text style={{ color: '#fff', textAlign: 'center' }}>VIEWSUBTASK</Text></TouchableOpacity> */}



              <TouchableOpacity onPress={this.props.ModifyMaintask} style={{ width: 55, backgroundColor: 'black' , marginLeft: 10 }}>
                <Text style={{ color: '#fff', textAlign: 'center',marginRight:5 }}>Modify</Text></TouchableOpacity>      

</View>
</CollapseBody>

</Collapse>
<View style={{ backgroundColor: '#fff', height: 5 }}>

</View>
</View>
    )
  }
}

export default class AddMainTask extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      open: false,
      ProjectTitle: "",
      ProjectDescription: "",
      role: '',
      userToken: '',
      isLoading: true,
      dataSource: [],
      isFetching: false,
      modalVisible: false,
      addTask: 'add',
      modifyTask: 'modify',
      moduleId: this.props.navigation.state.params.moduleId,//getting module id
      ideaid: this.props.navigation.state.params.ideaid,//getting idea id
      dependencyid:'NA',
      person:'',
      subTask:'',
      description:'',
      days:'',         
      time:'',
      error1:'',error2:'',error3:'',error4:'',error5:'',
      
    };
  }


  modalDidOpen = () => {
    AsyncStorage.getItem("role", (err, res) => {
      this.setState({ role: res });

    });
    AsyncStorage.getItem("userToken", (err, res) => {
      this.setState({ userToken: res });

    });

  }

  
  componentDidMount() {
    this.add();
    
  }
  //Dialog actions end

  //get ModuleList
  add() {

    this.getModulesList();
  }

  onRefresh() {
    this.setState({ isFetching: true }, function () { this.add() });
  }

  componentWillReceiveProps(nextProps) {
    // console.log(nextProps);
    // console.log("re loading...........")
    //this.getModulesList();
  }

  //getModulesList for Projects
  getModulesList() {

    const { moduleId } = this.state;
    const { ideaid } = this.state;

    console.log("moduleid" + moduleId + "ideaid" + ideaid);

    AsyncStorage.getItem("cropcode", (err, res) => {

      const cropcode = res;

      console.log(cropcode)
      console.log(moduleId)
      NetInfo.fetch().then(state => {
        if (state.type == "none") {
          console.log(state.type);
          Snackbar.show({
            title: 'No Internet Connection',
            backgroundColor: 'red',
            duration: Snackbar.LENGTH_LONG,
          });
        } else {
          fetch(API + 'get_modulemaintasks.php',
            {
              method: 'POST',
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({

                moduleId: moduleId,
                crop: cropcode
              })
            })
            .then((response) => response.json())
            .then((responseJson) => {
              //    alert(JSON.stringify(responseJson));
           
            //  this.refs.toast.showBottom('Project Added Succesfully');
              console.log(responseJson)
              // this.refs.toast.showBottom('Main Task Added');
              this.setState({
                isLoading: false,
                dataSource: responseJson.data,
                isFetching: false
              }, function () {

              });
            })
            .catch((error) => {
              console.error(error);
            });
        }
      });
    });

  }
  AddSubTask(item, index) {
    console.log(item);
    console.log(index);

    this.props.navigation.navigate('AddSubTaskModal', { action: 'modify', moduleId: item.moduleId, taskid: item.id});

  }

  
  // Navigaete ViewSubTasks screen
  ViewSubTasks = (item, index) => {
    const { id } = this.state;
    console.log(item.id);
    console.log(index);
    //alert(item.id);
    this.props.navigation.navigate("ViewSubTasks", { taskId: item.id });

  }

  //Modify Maintask start
  ModifyMaintask(item, index) {

    const { moduleId } = this.state;
    const { ideaid } = this.state;
    const { modifyTask } = this.state;
    console.log("moduleid" + moduleId + "ideaid" + ideaid + "action" + modifyTask + "mid" + item.id);

    this.props.navigation.navigate("AddTask", { moduleid: moduleId, IdeaId: ideaid, modifyTask: modifyTask, maintaskid: item.id });

  }
  //Modify Maintask close

  //Delete MainTask alert start
  DeleteMainTaskAction(item, index) {

    Alert.alert(
      'Alert..!',
      'Do you want to delete Task',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        { text: 'OK', onPress: () => this.DeleteMaintask(item.id) },
      ],
      { cancelable: false },
    );

  }
  //Delete MainTask  alert end

  //Delete MainTask start
  DeleteMaintask(maintaskid) {

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
          fetch(API + 'manageMaintasks.php',
            {
              method: 'POST',
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({

                action: 'maintaskdelete',
                mainTaskId: maintaskid,
                crop: cropcode
              })
            })
            .then((response) => response.json())
            .then((responseJson) => {
              console.log(responseJson)

              if (responseJson.status === 'True') {

                this.setState({
                  isLoading: false,
                  isFetching: false
                }, function () {

                });

              } else if (responseJson.status === 'false') {

                Alert.alert(responseJson.message);
              } else {

              }


            })
            .catch((error) => {
              console.error(error);
            });
        }
      });
    });

  }
  //Delete MainTask end


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
        <Title style={{color: '#fff', fontWeight: '600' }}>Main Task</Title>
      </Body>
      <Right></Right>
    </Header>
      <View style={styles.MainContainer}>
      <Toast ref="toast"/>
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
                  ModifyMaintask={() => this.ModifyMaintask(item, index)}//modify maintask
                  AddSubTask={() => this.AddSubTask(item, index)}//add subtask
                  ViewSubTasks={() => this.ViewSubTasks(item, index)}//view subtasks list
                  DeleteMainTaskAction={() => this.DeleteMainTaskAction(item, index)}//delete the maintask
                />
              </View>
            }
            keyExtractor={item => item.id}
            ListEmptyComponent={this._listEmptyComponent}
          />

        </View>
        
        {/* <Modal
          offset={this.state.offset}
          open={this.state.open}
          modalDidOpen={this.modalDidOpen}
          modalDidClose={this.modalDidClose}
          style={{ alignItems: "center" }} >

          <View style={{ alignItems: "center", paddingBottom: 40 }}>

            <Text>Add Module</Text>

            <TextInput placeholder='Module Title'
              style={{ height: 40, borderBottomWidth: 1, borderBottomColor: 'black', width: 300, marginTop: 10 }}
              onChangeText={(text) => this.setState({ text })}
              value={this.state.text} />

            <View style={{ flexDirection: 'row', marginTop: 30 }}>
              <TouchableOpacity style={{
                margin: 5, backgroundColor: 'red', padding: 19, height: 30, alignItems: "center",
                justifyContent: 'center'
              }} onPress={this.closeModal}>
                <Text style={{ color: 'white' }}>CANCEL</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{
                margin: 5, backgroundColor: 'green', padding: 20, height: 30, alignItems: "center",
                justifyContent: 'center'
              }} onPress={this.closeModal}>
                <Text style={{ color: 'white' }}>SAVE</Text>
              </TouchableOpacity>
            </View>

          </View>
        </Modal> */}
          <TouchableOpacity onPress={() => this.props.navigation.navigate("AddTask", { moduleid: this.state.moduleId, IdeaId: this.state.ideaid, addTask: this.state.addTask })} style={styles.bottomView}>
            <View style={styles.bottomView} >
              <Text style={styles.textStyle}>ADD MAINTASK</Text>
            </View>
          </TouchableOpacity>
        </View>
      </Container>

    );

  }

}
const styles = StyleSheet.create(
  {
    MainContainer:
    {
      paddingTop:15,
      flex: 1,
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height,
      backgroundColor:'#F8F8F8'
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
      backgroundColor:'#00a2c1',
      paddingLeft:10,
      paddingRight:10,
      paddingBottom:5,
      paddingTop:5,
      borderRadius: 5,
    },
    container: {
      flex: 1,
      width: '100%',
      paddingLeft: hp('2%'),
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
      fontWeight:'bold'

    },
    signUpText1: {
      fontSize: 13,
      color: 'green',
      paddingTop: 10,
      fontWeight:'bold',
      width:'50%',
      
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
      color:'#c0c0c0'

      //  marginRight: 10,
      //textAlign: "right"

    },
    signUpText3: {

      fontSize: 12,
      paddingTop: 10,
      paddingLeft: 5,
      width:'55%',

      alignItems: 'center',
    },
    signUpText3text: {

      fontSize: 12,
      paddingTop: 10,
      paddingLeft: 10,
      fontWeight:'bold',


      alignItems: 'center',
    },


    signUpText03: {
      width: '25%',
      fontSize: 12,
      paddingTop: 10,
      paddingLeft: 10,

      alignItems: 'center',
    },
    signUpText4: {
      fontSize: 12,
      paddingTop: 10,
      color:'#c0c0c0',


      alignItems: 'center',
    },
    listgap: {
      fontSize: 12,
      paddingTop: 10,


      alignItems: 'center',
    },


    listgap1: {
      fontSize: 12,
      paddingTop: 10,
 paddingLeft: 80,
// paddingRight:40,

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
    box1: {
      justifyContent: 'space-between',
      flexDirection: 'row',
      position: 'relative',
      // marginBottom: 10,
  
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
    boxheader: {
      justifyContent: 'space-between',
      flexDirection: 'column',
      position: 'relative',
      marginBottom: 5,
  
    },
  });