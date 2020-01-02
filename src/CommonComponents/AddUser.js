/*
FileName:AddUser.js
Version:1.0.0
Purpose:Add The new user
Devloper:MaheshReddy
*/
import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, StatusBar, Dimensions, TouchableOpacity, Linking, TextInput } from 'react-native';
import { Title, Button, Container, Content, Header, Right, Left, Body, Tab, Tabs, TabHeading, Footer, Item, Input, FooterTab, Subtitle } from 'native-base';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/FontAwesome';
import SearchableDropdown from 'react-native-searchable-dropdown';
import AsyncStorage from '@react-native-community/async-storage';
import { API } from "../WebServices/RestClient";
import NetInfo from '@react-native-community/netinfo';
import Snackbar from 'react-native-snackbar';
import log from '../LogFile/Log';
export default class AddUser extends Component {

    constructor(props) {
        super(props);

        this.state = {
            empId: '',
            fullname: '',
            email: '',
            username: '',
            mobile: '',


            modalVisible: false,
        };
    }
    //Checking the Validations start
    isValid() {
        var { empId, fullname, email, username, mobile } = this.state;
        let valid = false;

        if (empId.length === 0) {
            log("Warn", "empId should not be empty");
            alert("Enter Employee Id");
        }

        else if (fullname.length === 0) {
            log("Warn", "fullname should not be empty");
            alert("Enter Fullname");
        }
        else if (email.length === 0) {
            log("Warn", "email should not be empty");
            alert("Enter email");
        }
        else if (!this.verifyEmail(email)) {
            log("Warn", "email Validaton should not be empty");
            alert("Invalid Email");
        }
        else if (username.length === 0) {
            log("Warn", "username should not be empty");
            alert("Enter User name");
        }

        else if (mobile.length === 0) {
            log("Warn", "mobile should not be empty");
            alert("Enter phonenumber");
        }
        else if (mobile.length > 10) {
            log("Warn", "mobile should not be greater than 10");
            alert("Invalid phonenumber");
        }
        else if (mobile.length < 10) {
            log("Warn", "mobile should not be less than 10");
            alert("Invalid phonenumber");
        }

        else {
            valid = true;
        }
        return valid;
    }
    verifyEmail(email) {
        var reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return reg.test(email);
    }
    //Checking the Validations end

    // nav(){
    //     console.log("dvcdwvciuwdviwu");
    //     alert("mahesh");
    //     this.props.navigation.navigate("AddUser1");
    // }

    //Add Employee
    onSignIn() {
        log("Info", " onSignIn(empId, fullname, email,username,mobile) is used to add user");
        if (this.isValid()) {
            console.log("staredt.,.................");
            console.log(this.state.empId);
            console.log(this.state.fullname);
            console.log(this.state.email);
            console.log(this.state.username);
            console.log(this.state.mobile);

            const { empId, fullname, email, username, mobile } = this.state;

            //  const username = "text";
            //  const password = "text";
            //  const cropcode = "ptmsreact";
            //  const usertype = "aadmin";

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
                    } else {
                        fetch(API + 'addEditEmployee.php', {
                            method: 'POST',
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                empId: empId,
                                fullname: fullname,
                                action: "check",
                                crop: cropcode,
                                email: email,
                                username: username,
                                mobile: mobile,
                            })
                        }).then((response) => response.json())
                            .then((responseJson) => {
                                //alert(responseJson);
                                console.log(JSON.stringify(responseJson));
                                console.log(responseJson);

                                if (responseJson.status === 'True') {
                                    //Navigate to UpdateEmployee screen for update employee
                                    this.props.navigation.navigate('UpdateEmployee', {
                                        fullname: fullname,
                                        email: email,
                                        empId: empId,
                                        username: username,
                                        mobile: mobile,
                                    });

                                }
                                else {
                                    log("Warn", "this user already exits");
                                    alert("this user already exits")

                                    console.log(JSON.stringify(responseJson));
                                    //alert(responseJson);
                                }

                            }).catch((error) => {
                                console.error(error);
                                log("Error", "Adding User error");
                            });
                    }
                });
            });

        }
    }
    //For Adding the New Employee start
    save() {
        log("Info", " save(empId, fullname, email,username,mobile) is used to add user");
        if (this.isValid()) {
            console.log("staredt.,.................");
            console.log(this.state.empId);
            console.log(this.state.fullname);
            console.log(this.state.email);
            console.log(this.state.username);
            console.log(this.state.mobile);

            const { empId, fullname, email, username, mobile, } = this.state;
            AsyncStorage.getItem("cropcode", (err, res) => {
                const cropcode = res;
                //Internet
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
                        fetch(API + 'addEditEmployee.php', {
                            method: 'POST',
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                empId: empId,
                                fullname: fullname,
                                action: "save",
                                crop: cropcode,
                                email: email,
                                username: username,
                                mobile: mobile,
                                password: "1213",
                                team: "react",
                                designation: "react",
                                userType: "Emp",
                                user_status: 1,
                                created_by: "admin",
                            })
                        }).then((response) => response.json())
                            .then((responseJson) => {
                                //alert(responseJson);
                                console.log(JSON.stringify(responseJson));
                                console.log(responseJson);
                                alert(JSON.stringify(responseJson));
                                if (responseJson.status == 'True') {
                                    this.props.navigation.navigate('UpdateEmployee', {
                                        fullname: fullname,
                                        email: email,
                                        empId: empId,
                                        username: username,
                                        mobile: mobile,
                                    });
                                }
                                else {
                                    alert("User exits");

                                    console.log(JSON.stringify(responseJson));
                                }

                            }).catch((error) => {
                                console.error(error);
                                log("Error", "Adding User error");
                            });
                    }
                });
            });

        }
    }
    //Adding the new Employee close

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

                    <Icon name="arrow-left" size={25} style={{ color: '#fff', paddingTop: 17 }} onPress={() =>
                        this.props.navigation.navigate('AdminManageEmployees')} />

                    <Body style={{ paddingLeft: 30, }}>
                        <Title style={{ color: '#fff', fontWeight: '600', }}>Add Employee</Title>
                        <Subtitle></Subtitle>
                    </Body>
                </Header>
                <View style={{ paddingTop: 30, }}>

                    <View style={{ paddingLeft: 10, }}>
                        <Text style={{ fontSize: 20, color: 'black' }}>Enter Employee Details </Text>
                    </View>
                    <View style={{ paddingLeft: 10, }}>

                        <TextInput style={{ width: wp('95%'), height: 45, borderBottomWidth: 1, }}
                            placeholder='Employee ID *'
                            underlineColorAndroid='transparent'
                         //   selectionColor='white'
                            onChangeText={(empId) => this.setState({ empId })}
                        />
                    </View>

                    <View style={{ paddingLeft: 10, }}>

                        <TextInput style={{ width: wp('95%'), height: 45, borderBottomWidth: 1, }}
                            placeholder='Full Name *'
                            underlineColorAndroid='transparent'
                          //  selectionColor='white'
                            onChangeText={(fullname) => this.setState({ fullname })}

                        />
                    </View>
                    <View style={{ paddingLeft: 10, }}>


                        <TextInput style={{ width: wp('95%'), height: 45, borderBottomWidth: 1, }}
                            placeholder='Email *'
                            underlineColorAndroid='transparent'
                           // selectionColor='white'
                            onChangeText={(email) => this.setState({ email })}

                        />
                    </View>
                    <View style={{ paddingLeft: 10, }}>


                        <TextInput style={{ width: wp('95%'), height: 45, borderBottomWidth: 1, }}
                            placeholder='Username *'
                            underlineColorAndroid='transparent'
                           // selectionColor='white'
                            onChangeText={(username) => this.setState({ username })}

                        />
                    </View>
                    <View style={{ paddingLeft: 10, }}>


                        <TextInput style={{ width: wp('95%'), height: 45, borderBottomWidth: 1, }}
                            placeholder='Mobile *'
                            maxLength={10}
                            keyboardType={"number-pad"}
                            underlineColorAndroid='transparent'
                           // selectionColor='white'
                            onChangeText={(mobile) => this.setState({ mobile })}

                        />
                    </View>

                </View>
                <View style={{ paddingTop: 20, }}>

                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingTop: 40 }}>
                        <TouchableOpacity onPress={this.onSignIn.bind(this)} style={styles.next}>
                            <Text style={{ color: 'white',fontSize:15 }}> Next</Text>
                        </TouchableOpacity>

                    </View>

                </View>

            </Container>
        );
    }
}
//Styles for UI
const styles = StyleSheet.create(
    {
    
    next: {
        flex: 1,
        ...Platform.select({
          ios: {
            backgroundColor: '#00A2C1', borderRadius: 5, marginLeft:130,marginRight:130,
            width:'30%', height: 40, alignItems: "center", justifyContent: 'center' 
          },
          android: {
             backgroundColor: '#00A2C1', borderRadius: 5, marginLeft:130,marginRight:130,
            width:'30%', height: 40, alignItems: "center", justifyContent: 'center' 
          },
        }),
      },
  
    });