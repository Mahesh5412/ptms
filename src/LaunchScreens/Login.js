/*
FileName:Login.js
Version:1.0.0
Purpose:Navgate to all Admin classes from Here and logout
Devloper:Mahesh
*/import React, { Component } from 'react';
import { Text, View,TextInput,Image,StyleSheet,TouchableOpacity,ImageBackground} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import MyTask from '../UserComponents/UserMyTask';
import AsyncStorage from '@react-native-community/async-storage';
import RadioGroup from 'react-native-radio-button-group';
import {API }from "../WebServices/RestClient";
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
var radiogroup_options = [
  {id: 0, label: 'admin' },
  {id: 1, label: 'user' },
];
export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      username: '',
      password: '',
      cropcode: '',  
      showPass:true,
      press:false,
      usertype:'',
    };
  }

  showPass = () => {
    if (this.state.press == false) {
      this.setState({ showPass: false, press: true, })
    }
    else {
      this.setState({ showPass: true, press: false, })
    }
  }

  componentDidMount(){
   
  }

  isValid() {
    const { username,password,cropcode, usertype} = this.state;
    let valid = false;
    if (username.length === 0) {
      alert("Enter username");
    } else if(!isNaN(username)){
      alert("Please Enter Only Characters");
    }
    // else if(username.length<3 || username.length>15){
    //   alert("Username must be 3 to 15 Characters");
    // }  
    else if (password.length === 0) {
      alert("Enter Password");
    }
     else if(cropcode.length === 0)
    {
       alert("Enter cropcode");
     }
     else if(usertype.length === 0)
    {
       alert("Enter usertype");
     }

    else{
      valid=true;
    }
    return valid;
  }
//User /Admin Login 
onSignIn() {

  console.log("staredt.,.................");
  console.log(this.state.username);
  console.log(this.state.password) ;
  console.log(this.state.usertype);
  console.log(this.state.cropcode);

   const { username,password,cropcode,usertype } = this.state;
    if (this.isValid()) {

  fetch(API+'reactlogin.php', {
  method: 'POST',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    username: username,
    password: password,
    crop: cropcode,
    utype: usertype,
  })
}).then((response) => response.json())
      .then((responseJson) => {
console.log(JSON.stringify(responseJson));
console.log(responseJson);
         if(responseJson.status==='TRUE')
        {

            if(responseJson.role ==="admin"){
              console.log("admin......")
              AsyncStorage.setItem('userToken',responseJson.empId);
              AsyncStorage.setItem('userName',responseJson.userName);
              AsyncStorage.setItem('cropcode',cropcode);
              AsyncStorage.setItem('empId',responseJson.empId);
              AsyncStorage.setItem('emp_role',responseJson.role);
              this.props.navigation.navigate("ManageTask1");
          }
          else{
            console.log("user....");
            AsyncStorage.setItem('userToken',responseJson.empId);
            AsyncStorage.setItem('userName',responseJson.userName);
            AsyncStorage.setItem('emp_role',responseJson.role);
            AsyncStorage.setItem('cropcode',cropcode);
            AsyncStorage.setItem('empId',responseJson.empId);
            this.props.navigation.navigate("MyTask");
          }

        }
        else{
          console.log(JSON.stringify(responseJson));
          alert("Login Details are Invalid")
        }
 
      }).catch((error) => {
        console.error(error);
      });
      
    };
  }

 
  render() {
    if (this.state.isLoading) {
      return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <DotIndicator color='#283B53' />
        </View>
      );

    }
   
    return (
      <View style={styles.container}>
       <View style={styles.form}> 
      <View style={styles.logoView}>
       <ImageBackground
        style={styles.logoContainer}
        source={require('../Images/cloud.png')}
        imageStyle={{ resizeMode: 'cover' }} >
        <Image style={styles.logo} source={require('../Images/cptms.png')} /> 
     </ImageBackground>
     </View>
      
        <View style={styles.inputContainer}>
        <Icon style={styles.inputIcon} 
                name='user'
                color='white'
                type='MaterialCommunityIcons'
                size={30}
              />
      <TextInput style={{width:265,height:45,color:'white'}}
              selectionColor='white'
              placeholder="Username *"
              autoCapitalize='none'
             placeholderTextColor={'rgba(255,255,255,0.3)'}
              keyboardType="email-address"
              underlineColorAndroid='transparent'
              onChangeText={(username) => this.setState({username})}/>
              </View>
              <View style={styles.inputContainer}>
              <Icon style={styles.inputIcon} 
                name='lock'
                color='white'
                type='MaterialCommunityIcons'
                size={30}
              />
          {/* <Ionicons name="ios-lock" size={32} color="white" style={styles.inputIcon} /> */}
          <TextInput style={styles.inputs}
              selectionColor='white'
              placeholder="Password *"
              autoCapitalize='none'
              placeholderTextColor={'rgba(255,255,255,0.3)'}
              secureTextEntry={this.state.showPass}
              underlineColorAndroid='transparent'
              onChangeText={(password) => this.setState({password})}/>
          <TouchableOpacity style={styles.eyeIcon} 
          onPress={this.showPass.bind(this)}>
               <Icon 
               name={this.state.press== false?'eye-slash':'eye'}
               size={22} color="white" /> 
          </TouchableOpacity>
        </View>
        <View style={styles.inputContainer}>
        <Icon style={styles.inputIcon} 
                name='lock'
                color='white'
                type='MaterialCommunityIcons'
                size={30}
              />
          {/* <Ionicons name="ios-lock" size={32} color="white" style={styles.inputIcon} /> */}
          <TextInput style={styles.inputs}
              selectionColor='white'
              placeholderTextColor={'rgba(255,255,255,0.3)'}
              placeholder="crop code *"
              autoCapitalize='none'
              underlineColorAndroid='transparent'
              onChangeText={(cropcode) => this.setState({cropcode})}/>    
        </View>
        <View style={styles.radioContainer}>
        <RadioGroup
      horizontal 
      options={[
        {
              id: 'admin',
              labelView: (
                <Text>
                   <Text style={{ color: 'white' }}>Admin
                  </Text>
                </Text>
              ),
        },
         {
              id: 'user',
              labelView: (
                <Text>
                   <Text style={{ color: 'white' }}>User
                  </Text>
                </Text>
              ),
        },
      ]}
      activeButtonId={''}
      circleStyle={{ fillColor: 'white', borderColor: 'white' }}     
      onChange={(option) => this.setState({usertype: option.id})}/>
      </View>
        <TouchableOpacity style={[styles.buttonContainer, styles.signupButton]} 
        onPress={this.onSignIn.bind(this)} >
          <Text style={styles.signUpText}>Login</Text>
        </TouchableOpacity>

      </View>
        </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems:'center',
  },
  logoContainer:{
    marginLeft:95,
    height: 150,
    width: 150,
  },
  stretch: {
    width: 200,
    height: 200,
    marginLeft:80
  },
  logo: {
    top:40,
    marginLeft:38, 
    height: 80,
    width: 100,
  },
  logoView:{
    position:'absolute',
    top:-80,
  },
  form:{  
    backgroundColor: '#00A2C1', 
    padding:25, 
    paddingTop:60,
    borderRadius:15,       
  },
  radioContainer:{ 
    marginTop:-4,   
    marginBottom:20,
    marginLeft:3, 
    width:250,
  },
  inputContainer: {
      borderBottomColor: '#FFFFFF',
      backgroundColor: '#00A2C1',
      borderBottomWidth: 1.8,
      width:290,
      height:38,
      marginBottom:40,
      flexDirection: 'row',
      alignItems:'center',
  },
  inputs:{
      width:235,
      height:45, 
      color:'white',          
  },
  eyeIcon:{
     
  },
  inputIcon:{
    width:30,
    height:30,
    marginLeft:1,
    justifyContent: 'center'
  },

  buttonContainer: {
    height:45,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom:10,
    width:290,
    borderRadius:30,
  },
  signupButton: {
    backgroundColor: "#ffffff",
  },
  signUpText: {
    fontSize:20,
    fontWeight: 'bold',
    color: '#00A2C1',
  },
  TextComponentStyle: {
   fontSize: 20,
  color: "#000",
  textAlign: 'center', 
  marginBottom: 15
 },
});