/*
FileName:UserProfile.js
Version:1.0.4
Purpose:Edit and update the profile Description
Devloper:Mahesh,Rishitha
*/
import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, Image, StatusBar, Dimensions, TextInput, Alert } from 'react-native';
import { Icon, Title, Button, Container, Content, Header, Right, Left, Body, Tab, Tabs, TabHeading, Footer, Item, Input, FooterTab } from 'native-base';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { TouchableOpacity } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-community/async-storage';
import { API } from "../WebServices/RestClient";
import NetInfo from '@react-native-community/netinfo';
import Snackbar from 'react-native-snackbar';
import { Dropdown } from 'react-native-material-dropdown';
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
export default class UserProfile extends Component {

    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,

            data2: [],
            status: '',
            mobile: '',
        }
    }

    componentDidMount() {
        log("Debug", "UserProfile screen is loaded");
        this.profile();
        this.GetStatus();
    }

    // componentDidUpdate() {

    //     // this.profile();
    // }

    //validation For Mobile Number
    isValid() {
        const { mobile } = this.state;
        let valid = false;
        if (mobile.length === 0) {
            alert("Enter Mobile Number");
            log("Warn", "Mobile number should not be empty");
        }

        else if (mobile.length > 10) {
            alert("Enter Valid Number");
            log("Warn", "Mobile number should  be valid");
        }
        else if (mobile.length < 10) {
            alert("Enter Valid Number");
            log("Warn", "Mobile number should be valid");
        }
        else if (!this.mobilevalidate(mobile)) {
            alert('Invalid Phonenumber');
      
          }


        else {
            valid = true;
        }
        return valid;
    }
    mobilevalidate(mobile) {
        const reg = /^[0]?[6789]\d{9}$/;
        return reg.test(mobile);
      }

    //Getting the profile details of User
    profile() {
        log("Info", "UserProfile:profile() method is used get employee profile data");
        AsyncStorage.getItem("cropcode", (err, res) => {
            const cropcode = res;

            AsyncStorage.getItem("empId", (err, res) => {
                const empId = res;
                NetInfo.fetch().then(state => {
                    if (state.type == "none") {
                        console.log(state.type);
                        Snackbar.show({
                            title: 'No Internet Connection',
                            backgroundColor: 'red',
                            duration: Snackbar.LENGTH_LONG,
                        });
                    } else {

                        fetch(API + 'getProfile.php', {
                            method: 'POST',
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                crop: cropcode,
                                action: "get",
                                //  userType: emp_role,
                                empId: empId
                            })
                        }).then((response) => response.json())
                            .then((responseJson) => {
                                console.log(responseJson);
                                console.log(JSON.stringify(responseJson))
                                console.log(JSON.stringify(responseJson))

                                this.setState({
                                    isLoading: false,
                                    empid: responseJson.data[0].empid,
                                    fullName: responseJson.data[0].fullname,
                                    team: responseJson.data[0].team,
                                    email: responseJson.data[0].email,
                                    username: responseJson.data[0].username,
                                    mobile: responseJson.data[0].mobile,
                                    role: responseJson.data[0].role,
                                    empStatus: responseJson.data[0].empStatus,
                                },


                                    function () {

                                    });
                            }).catch((error) => {
                                console.error(error);
                                log("Error", "Error in getting profile data");

                            });
                    }
                });
            });

        });
    }

    //Update the User Profile
    save() {
        log("Info", "UserProfile:save() method is used to update mobile number");
        const { mobile } = this.state;
        console.log(mobile);
        if (this.isValid()) {

            AsyncStorage.getItem("userToken", (err, res) => {
                const empId = res;
                console.log(res);


                AsyncStorage.getItem("cropcode", (err, res) => {
                    const cropcode = res;
                    console.log(cropcode);
                    //alert(res + mobile);
                    NetInfo.fetch().then(state => {
                        if (state.type == "none") {
                            console.log(state.type);
                            Snackbar.show({
                                title: 'No Internet Connection',
                                backgroundColor: 'red',
                                duration: Snackbar.LENGTH_LONG,
                            });
                        } else {

                            fetch(API + 'getProfile.php', {
                                method: 'POST',
                                headers: {
                                    Accept: 'application/json',
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                    action: 'update',
                                    // idea_id:idea_id, 
                                    crop: cropcode,
                                    // module_Name:modulename,
                                    number: mobile,
                                    empId: empId

                                })
                            })
                                .then((response) => response.json())
                                .then((responseJson) => {
                                    console.log(responseJson)
                                    console.warn(JSON.stringify(responseJson))
                                    if (responseJson.status == 'True') {
                                        alert("Updated Successfully")


                                    } else {
                                       // alert("user already exist");
                                        log("Warn", "user number already exist");
                                    }

                                })
                                .catch((error) => {
                                    console.error(error);
                                    log("Error", "Error in updating mobile number");
                                });
                        }
                    });
                });
            });
        }
    }

    //get status dropdown data
    GetStatus() {
        log("Info", "UserProfile:GetStatus() method is used to get status of employee");
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

                    fetch(API + 'spinner.php', {
                        method: 'POST',
                        headers: {
                            Accept: 'application/json',
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            action: 'status',
                            crop: cropcode,


                        })
                    })
                        .then((response) => response.json())
                        .then((responseJson) => {
                            console.log(responseJson)
                            if (responseJson.status == 'True') {

                                this.setState({
                                    data2: responseJson.data
                                });
                                console.log(this.state.data2);
                            } else {
                                log("Warn", "status of employee is not available");
                            }
                        })
                        .catch((error) => {
                            console.error(error);
                            log("Error", "error in  getting status of employee");
                        });
                }
            });
        });

    }
    
    // Update Status of Employee
    UpdateStatus(status) {
        log("Info", "UserProfile:UpdateStatus(status) method is used to update status of employee");
        console.log(status);

        AsyncStorage.getItem("userToken", (err, res) => {
            const empId = res;
            console.log(res);


            AsyncStorage.getItem("cropcode", (err, res) => {
                const cropcode = res;
                console.log(cropcode);
                NetInfo.fetch().then(state => {
                    if (state.type == "none") {
                        console.log(state.type);
                        Snackbar.show({
                            title: 'No Internet Connection',
                            backgroundColor: 'red',
                            duration: Snackbar.LENGTH_LONG,
                        });
                    } else {

                        fetch(API + 'getProfile.php', {
                            method: 'POST',
                            headers: {
                                Accept: 'application/json',
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                action: 'updatestatus',
                                crop: cropcode,
                                status: status,
                                empId: empId

                            })
                        })
                            .then((response) => response.json())
                            .then((responseJson) => {
                                console.log(responseJson)

                                if (responseJson.status == 'True') {
                                    this.setState({

                                        empStatus: status
                                    });
                                    //  alert("Updated Successfully")


                                } else {
                                //    alert("user already exist");
                                    log("Warn", "status of employee is not able to update");
                                }

                            })
                            .catch((error) => {
                                console.error(error);
                                log("Error", "error in updating status of employee");
                            });
                    }
                });
            });
        });

    }
    // Update Status of Employee end

    render() {
        if (this.state.isLoading) {
            return (
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <DotIndicator color='#00A2C1' />
                </View>
            );

        }
        // let data2 = [{ value: 'commericial', }, { value: 'residencial', }];
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
                        <Icon name="md-menu" style={{ color: '#fff' }} onPress={() =>
                            this.props.navigation.toggleDrawer()} />
                    </Left>
                    <Body>
                        <Title style={{ color: '#fff', fontWeight: '600' }}>Profile</Title>
                    </Body>
                    <Right></Right>
                </Header>
                <Content>

                    <View style={{ padding: 25 }}>
                        <View style={{ justifyContent: 'center', alignItems: 'center', height: hp('25%') }}>
                            <Image source={require('../Images/profile.jpeg')} style={{ width: wp('35%'), height: hp('20%'), margin: 10, borderRadius: 150 / 2, }} />
                            <Text >{this.state.fullName}</Text>
                            {/* <Text>FullName</Text> */}

                        </View>
                        <View style={{ paddingTop: 40, height: hp('50%') }}>
                            <View style={{ flexDirection: 'row', }}>
                                <View style={{ paddingLeft: '2%', width: wp('30%') }}>
                                    <Text>Employee ID</Text>

                                </View>
                                <View>
                                    <Text>{this.state.empid}</Text>
                                </View>

                            </View>



                            <View style={{ flexDirection: 'row', paddingTop: 10, }}>
                                <View style={{ paddingLeft: '2%', width: wp('30%') }}>
                                    <Text>Username</Text>

                                </View>
                                <View>

                                    <Text>{this.state.username}</Text>
                                </View>



                            </View>


                            <View style={{ flexDirection: 'row', paddingTop: 10, }}>
                                <View style={{ paddingLeft: '2%', width: wp('30%') }}>
                                    <Text>Email</Text>

                                </View>
                                <View>
                                    <Text>{this.state.email}</Text>
                                </View>



                            </View>


                            <View style={{ flexDirection: 'row', paddingTop: 10, }}>
                                <View style={{ paddingLeft: '2%', width: wp('30%') }}>
                                    <Text>Designation</Text>

                                </View>
                                <View>
                                    <Text>developer</Text>
                                </View>



                            </View>

                            <View style={{ flexDirection: 'row', paddingTop: 10, }}>
                                <View style={{ paddingLeft: '2%', width: wp('30%') }}>
                                    <Text>Team</Text>

                                </View>
                                <View>
                                    <Text>{this.state.team}</Text>
                                </View>



                            </View>

                            <View style={{ flexDirection: 'row', }}>
                                <View style={{ paddingLeft: '2%', width: wp('30%'), paddingTop: 14, }}>
                                    <Text>Mobile</Text>

                                </View>
                                <View style={styles.mobile}>

                                    <TextInput
                                        maxLength={10}
                                        keyboardType='phone-pad'
                                        placeholder=''
                                        
                                        value={this.state.mobile}
                                        onChangeText={(text) => this.setState({ mobile: text })}
                                        >
                                    </TextInput>

                                </View>



                            </View>

                            <View style={styles.role}>
                                <View style={{ paddingLeft: '2%', width: wp('30%') }}>
                                    <Text>Role</Text>

                                </View>
                                <View>
                                    <Text>{this.state.role}</Text>
                                </View>



                            </View>

                            <View style={{ flexDirection: 'row', paddingTop: 10 }}>
                                <View style={{ paddingLeft: '2%', width: wp('30%'), }}>
                                    <Text>Status</Text>
                                    <View style={{ marginLeft: 120, width: 100 }}>
                                        <Dropdown

                                            data={this.state.data2}
                                            label={"Select"}
                                            textColor='#000000'
                                            baseColor='#000000'
                                            itemColor='black'
                                            selectedItemColor='black'
                                            //onChangeText={itemValue => this.setState({ status:itemValue})}
                                            onChangeText={(itemValue) => { this.UpdateStatus(itemValue) }}
                                        />
                                    </View>

                                </View>
                                <TouchableOpacity><Text>{this.state.empStatus}</Text></TouchableOpacity>


                            </View>

                        </View>
                        <View style={{ paddingTop: 50, paddingLeft: '40%', justifyContent: 'center', }}>
                            <TouchableOpacity onPress={this.save.bind(this)} >
                                <Text style={styles.submit}>SUBMIT</Text>
                            </TouchableOpacity>
                        </View>





                    </View>
                </Content>

            </Container>
        );
    }
}

const styles = StyleSheet.create({
    submit: {
      flex: 1,
      ...Platform.select({
        ios: {
            color: 'white', paddingTop: 3, fontSize: 15, width: 100, 
            height: 30, backgroundColor: '#00A2C1', 
            textAlign: 'center', borderRadius: 10
        },
        android: {
            color: 'white', paddingTop: 3, fontSize: 15, width: 100, 
            height: 30, backgroundColor: '#00A2C1', 
            textAlign: 'center', borderRadius: 70
        },
      }),
    },
      mobile: {
      flex: 1,
      ...Platform.select({
        ios: {
            marginTop:12
        },
        android: {
           
        },
      }),
    },
     role: {
      flex: 1,
      ...Platform.select({
        ios: {
            flexDirection: 'row',marginTop:10
        },
        android: {
            flexDirection: 'row'
           
        },
      }),
    },
   
  });