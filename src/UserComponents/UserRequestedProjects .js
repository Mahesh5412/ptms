/*
FileName:UserRequestedProjects.js
Version:1.0.0
Purpose:Getting the List of RejectedProjects list 
Devloper:Rishitha,Harsha,Mahesh
*/

import React, {Component} from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import Modal from "react-native-simple-modal";
import { ToastAndroid,Platform, StyleSheet, Text, View, Dimensions, FlatList,TouchableHighlight, Image,TouchableOpacity, TextInput } from 'react-native';
import { Left, Button, Container,Header, Content, Item, Input } from 'native-base';
import AsyncStorage from '@react-native-community/async-storage';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import {API }from "../WebServices/RestClient";
import NetInfo from '@react-native-community/netinfo';
import Snackbar from 'react-native-snackbar';
import Toast from 'react-native-whc-toast';
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

FOOTER_MAX_HEIGHT=50
FOOTER_MIN_HEIGHT=40


class ListItem extends React.Component {
  render() {
    const { item } = this.props;
    return (

      <View style={styles.container}>
       <TouchableOpacity onPress={this.props.UserProjectInfo}>
        <View style={styles.signup}>
          <View style={[styles.buttonContainer, styles.signupButton]} >
            <View style={styles.box}>
              <View style={{ flexDirection: 'row',width:wp('70%') }}>
                <Text style={styles.signUpText0} >Project No :</Text>

                <Text style={styles.signUpText1} >{item.idea_id}</Text>
              
              </View>
              <Text style={styles.signUpText2} > {item.created_on}</Text>
            </View>
            <View
            style={{
              borderBottomColor: '#C0C0C0',
              borderBottomWidth: 0.3,
            }}
            />
           
            <View style={{ flexDirection: 'row', paddingRight: 25, }}>
              <Text style={styles.signUpText4} >Title:</Text>
              <Text style={styles.signUpText3} >{item.idea_title}</Text>
            </View>

            <View style={{ flexDirection: 'row', paddingRight: 25}}>
              <Text style={styles.signUpText5} >Requested By:</Text>
              <Text style={styles.signUpText6} >{item.userName}</Text>
            </View>

            <View style={{flexDirection: 'row',justifyContent: 'flex-end',alignItems:'center'}}>
            {/* <TouchableOpacity style={{width:60,backgroundColor:'green'}}><Text style={{color:'#fff',textAlign:'center'}}>Approve</Text></TouchableOpacity>
              <TouchableOpacity style={{width:40,backgroundColor:'black',marginLeft:10}}><Text style={{color:'#fff',textAlign:'center'}}>Reject</Text></TouchableOpacity> */}

              </View>

          </View>

        </View>
        </TouchableOpacity>
      </View>
    
    )
  }
}

export default class Requested extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      ProjectTitle: "",
      ProjectDescription: "",
      role: '',
      userToken : '',
      isLoading: true,
      dataSource: [],
      isFetching: false,
      error1:'',
      error2:''
    };
    this.arrayholder = [] ;
  }

  async componentDidMount() {
    this.getdata();
  }

  onRefresh() {
    this.setState({ isFetching: true }, function () { this.getdata() });
  }

  action(item,index){

    this.props.navigation.navigate('Module');

  }

modalDidOpen = () => {
  AsyncStorage.getItem("role",(err ,res)=>{
    this.setState({role:res});
  
  });
  AsyncStorage.getItem("userToken",(err ,res)=>{
    this.setState({userToken:res});
  
  });
 
}
modalDidClose = () => {

  this.setState({ open: false });
  
};

moveUp = () => this.setState({ offset: -100 });

resetPosition = () => this.setState({ offset: 0 });

openModal = () => this.setState({ open: true });

closeModal = () => this.setState({ open: false,error1:'',error2:''
 });

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
    <View style={{width:'90%',height:'80%'}}>
      <Text></Text>
    </View>
  )
}
//Text Field Validation method
isValid() {
  const { ProjectTitle, ProjectDescription} = this.state;
  let valid = false;

   if(ProjectTitle.length===0){
    // ToastAndroid.showWithGravity('"Enter sub Task', ToastAndroid.SHORT,ToastAndroid.CENTER);
    this.setState({ error1: 'Project Title ' });
  }
  else if (ProjectDescription.length === 0) {
    // alert("Enter Description");
    // ToastAndroid.showWithGravity('"Enter Description', ToastAndroid.SHORT,ToastAndroid.CENTER);
    this.setState({ error2: 'Project Description ' });
  }

  else {
    valid = true;
  }
  return valid;
}//isValid method end

//to get the user requested project list
getdata() {
 
       AsyncStorage.multiGet(["cropcode", "userToken","emp_role"],(err ,response)=>{
          const cropcode = response[0][1];
          const userToken = response[1][1];
          const role= response[2][1];

          console.log("c"+cropcode+"u"+userToken+"r"+role);
          NetInfo.fetch().then(state => {
            if (state.type == "none") {
              console.log(state.type);
              Snackbar.show({
                title: 'No Internet Connection',
                backgroundColor: 'red',
                duration: Snackbar.LENGTH_LONG,
              });
            }else{
        fetch(API+'ReactgetIdeas.php',
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            
            action:'requested',
            empId: userToken, 
            crop:cropcode,
            userType:role 
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
          this.arrayholder = responseJson.data ;
        })
        .catch((error) => {
          console.error(error);
        });
      }
    });
      });

  }

  //to passt he user profile data to next screen 

  UserProjectInfo=(item,index)=>{
  this.props.navigation.navigate("UserProjectInfo",{ideaId:item.idea_id,
    empId:item.emp_id,
    projectTitle:item.idea_title,
    ideaDescription:item.idea_description,
    userName:item.userName,
    createdOn:item.created_on,
  }); 
 }

 

 //to add the new project from user 
addProject = () => {
  NetInfo.fetch().then(state => {
    if (state.type == "none") {
      console.log(state.type);
      Snackbar.show({
        title: 'No Internet Connection',
        backgroundColor: 'red',
        duration: Snackbar.LENGTH_LONG,
      });
    }
    else{
      if(this.isValid()){

       AsyncStorage.multiGet(["cropcode", "userToken","emp_role"],(err ,response)=>{
        const cropcode = response[0][1];
        const userToken = response[1][1];
        const role= response[2][1];
  fetch(API+'manage_ideas.php', {
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
      crop: cropcode //Async
    }) 
  }).then((response) => response.json())
    .then((responseJson) => {
      console.log(JSON.stringify(responseJson));
      console.log(responseJson);

      if(responseJson.status==='True')
        {
          this.refs.toast.showBottom('Project Added Succesfully'); 
          console.log("done")
          this.setState({ open: false,
            ProjectTitle:'',
            ProjectDescription:'' 
           })
          this.getdata()
        
        }
    }).catch((error) => {
       console.error(error);
    });
  });  
    this.closeModal();
  }
}

});     

  };

  //to filter the search data in search area 
  SearchFilterFunction(text){
    console.log(text);
    const newData = this.arrayholder.filter(function(item){
        const idea_id = item.idea_id.toUpperCase()
        const idea_id1 = text.toUpperCase()
        const created_on = item.created_on.toUpperCase()
        const created_on1 = text.toUpperCase()
        const idea_title = item.idea_title.toUpperCase()
        const idea_title1 = text.toUpperCase()
        const userName = item.userName.toUpperCase()
        const userName1 = text.toUpperCase()
       
        return idea_id.indexOf(idea_id1) > -1 || 
        idea_title.indexOf(idea_title1) > -1 || 
        created_on.indexOf(created_on1) > -1 || 
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
      onChangeText={(text) => this.SearchFilterFunction(text)}/>
       <Icon style={{marginRight:10,color:'#c0c0c0'}} size={20} name="search" />
     </Item> 
      
   
            <View style = { styles.MainContainer }>          

            <Toast ref="toast"/>
<View style={{height:'96%'} }>

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
        UserProjectInfo={()=>this.UserProjectInfo(item,index)}
      />
    </View>
  }
  keyExtractor={item => item.id}
  ListEmptyComponent={this._listEmptyComponent}
/> 

</View>


     <TouchableOpacity onPress={this.openModal} style={ styles.bottomView}>               
               <View style={ styles.bottomView} >
               <Icon
      
              name='lightbulb-o'
              color='white'
              type='MaterialCommunityIcons'
              size={30}
            />
 
                  <Text style={styles.textStyle}>ADD PROJECT</Text>

 
               </View>
               </TouchableOpacity>
  <Modal
          offset={this.state.offset}
          open={this.state.open}
          modalDidOpen={this.modalDidOpen}
          modalDidClose={this.modalDidClose}
          style={{ alignItems: "center" }} >

          <View style={{ alignItems: "center",paddingBottom:40 }}>
            
            <Text>Project Info</Text>
            
                <TextInput placeholder='Project Title'
                  style={{height: 40,  borderBottomWidth: 1,borderBottomColor:'black',width:300,marginTop:10}}
                  onChangeText={(text) => this.setState({ProjectTitle:text})}
                  value={this.state.text}/>
                  <Text style={{color:'red',alignItems:'flex-start',alignSelf:'flex-start',justifyContent:'flex-start', marginLeft:25}}>{this.state.error1}</Text>

                
                  <TextInput placeholder='Project Description'
                  style={{height: 40,  borderBottomWidth: 1,borderBottomColor:'black',width:300,marginTop:30}}
                  onChangeText={(text) => this.setState({ProjectDescription:text})}
                  value={this.state.text}/>
                   <Text style={{color:'red',alignItems:'flex-start',alignSelf:'flex-start',justifyContent:'flex-start', marginLeft:25}}>{this.state.error2}</Text>
     

          
           
          </View>
          <View style={{flexDirection:'row',marginTop:20,alignItems:'center',justifyContent:'center',alignSelf:'center',}}>
                    <TouchableOpacity style={{ margin: 5,backgroundColor:'red',padding:19,height:30,alignItems:"center" ,justifyContent:'center'}} onPress={this.closeModal}>
                      <Text style={{color:'white'}}>CANCEL</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ margin: 5,backgroundColor:'green',padding:20,height:30 ,alignItems:"center",justifyContent:'center'}} onPress={this.addProject}>
                      <Text style={{color:'white'}}>SAVE</Text>
                      
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
 
    bottomView:{
 flexDirection:'row',
 justifyContent:'center',
   position:'absolute',
   height:FOOTER_MAX_HEIGHT,
   bottom:0,
   left:0,
   right:0,
   backgroundColor:'black',
   alignItems:'center'
    },
 
    textStyle:{
 
      color: '#fff',
      fontSize:22,
      justifyContent:'center',
      backgroundColor:'#00A2C1',
      paddingBottom:5,
      paddingLeft:5,
      paddingRight:5,
      paddingTop:5,
      borderRadius:5,
      marginLeft:5
      

    },
    container: {
      flex: 1,
      width: '90%',
      paddingLeft: hp('2%'),
    },
    footer: {
      position: 'absolute',
      flex:0.1,
      left: 0,
      right: 0,
      bottom: -10,
      backgroundColor:'green',
      flexDirection:'row',
      height:80,
      alignItems:'center',
    },
    bottomButtons: {
      alignItems:'center',
      justifyContent: 'center',
      flex:1,
    },
    footerText: {
      color:'white',
      fontWeight:'bold',
      alignItems:'center',
      fontSize:18,
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
      color:'green',
      paddingTop:10,
      fontWeight:"bold",
  
    },
    signUpText1: {
      fontSize: 13,
      color:'green',
      paddingTop:10,
      fontWeight:"bold",
      // paddingLeft: 10,
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
    //marginLeft:200,
      fontSize: 13,
      color:'green',
      paddingTop:10,
     fontWeight:"bold",
   //  marginRight: 10,
    //textAlign: "right"
  
    },
    signUpText3: {
  
      fontSize: 12,
      paddingTop:10,
      paddingLeft: 10,
      fontWeight:"bold",

      alignItems: 'center',
    },
    signUpText4: {
      fontSize: 12,
      paddingTop:10,
     fontWeight:"bold",
      alignItems: 'center',
    },
    signUpText5: {
      fontSize: 12,
      color: '#545756',
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
      fontSize: 20,
      justifyContent: 'center',
  
  
      color: 'white',
      alignSelf: 'center',
    },

   
});
