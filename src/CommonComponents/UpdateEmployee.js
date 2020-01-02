/*
FileName:UpdateEmployee.js
Version:1.0.0
Purpose:
Devloper:Mahesh
*/
import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, StatusBar, Dimensions, TouchableOpacity, Linking, TextInput } from 'react-native';
import { Title, Button, Container, Content, Header, Right, Left, Body, Tab, Tabs, TabHeading, Footer, Item, Input, FooterTab, Subtitle } from 'native-base';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/FontAwesome';
import SearchableDropdown from 'react-native-searchable-dropdown';
import RadioGroup from 'react-native-radio-button-group';
import { Dropdown } from 'react-native-material-dropdown';
import { API } from "../WebServices/RestClient";
import NetInfo from '@react-native-community/netinfo';
import Snackbar from 'react-native-snackbar';
import AsyncStorage from '@react-native-community/async-storage';
import log from '../LogFile/Log';



export default class UpdateEmployee extends Component {

    constructor(props) {
        super(props);

        this.state = {
      
            team: '',
            designation: '',
            modalVisible: false,
            usertype: '',
            user_status: '',
       
            password: '',

         
            radiogroup_options: [
                { id: 0, label: 'Active' },
                { id: 1, label: 'Inactive' },
                { id: 2, label: 'other' },
            ],
            radiogroup_options: [
                { id: 0, label: 'Manager' },
                { id: 1, label: 'Emp' },
                { id: 2, label: 'Approver' },
            ]


        };
    }
    componentDidMount(){
        this.empDesignationSearch();
        this.empRoleSearch();
    }
      //fetch disgnation dropdown 
      empDesignationSearch() {
        log("Info", " empDesignationSearch(cropcode) is used to fetch disgnation dropdown ");
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
                    fetch(API + 'spinner.php',
                        {
                            method: 'POST',
                            headers: {
                                Accept: 'application/json',
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                crop: cropcode,
                                // mainTaskId: taskId,
                                action: 'desig'
                            })
                        })
                        .then((response) => response.json())
                        .then((responseJson) => {
                            this.setState({
                                designationData: [...responseJson.data],
                            });
                          
                        }
                        )
                        .catch((error) => {
                            console.error(error);
                            log("Error", "fetch disgnation dropdown  error");
                        });
                }
            });
        });

    }
    //fetch role dropdown 
    empRoleSearch() {
        log("Info", "     empRoleSearc(cropcode) is used to fetch role dropdown  ");
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
                    fetch(API + 'spinner.php',
                        {
                            method: 'POST',
                            headers: {
                                Accept: 'application/json',
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                crop: cropcode,
                                // mainTaskId: taskId,
                                action: 'team'
                            })
                        })
                        .then((response) => response.json())
                        .then((responseJson) => {

                            this.setState({
                                roleData: [...responseJson.data],
                            });
                        }
                        )
                        .catch((error) => {
                            console.error(error);
                            log("Error", "fetch role dropdown  error");
                        });
                }
            });
        });

    }


    //Checking the Validation
    isValid() {
        var { designation, team, usertype, user_status, password } = this.state;
        let valid = false;

        if (designation.length === 0) {
            log("Warn", "designation should not be empty");
            alert("Enter Designation");
        }

        else if (team.length === 0) {
            log("Warn", "team should not be empty");
            alert("Enter Team");
        }
        else if (usertype.length === 0) {
            log("Warn", "usertype should not be empty");
            alert("Enter User Type");
        }

        else if (user_status.length === 0) {
            log("Warn", "user_status should not be empty");
            alert("Enter User Status");
        }

        else if (password.length === 0) {
            log("Warn", "password should not be empty");
            alert("Enter Password");
        }

        else {
            valid = true;
        }
        return valid;
    }
  

    //Adding the new Employee
    onSignIn() {
        log("Info", " onSignIn( designation, team, usertype, user_status, password) is used to Adding the new Employee");
 
        if (this.isValid()) {
            console.log("staredt.,.................");
            console.log(this.state.designation);
            console.log(this.state.team);
            console.warn(this.state.usertype);
            console.log(this.state.user_status);
            console.warn(this.state.user_status);
            console.log(this.state.password);
            const { designation, team, usertype, user_status, password, } = this.state;

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
                                empId: this.props.navigation.state.params.empId,
                                fullname: this.props.navigation.state.params.fullname,
                                email: this.props.navigation.state.params.email,
                                username: this.props.navigation.state.params.username,
                                mobile: this.props.navigation.state.params.mobile,
                                action: "save",
                                crop: cropcode,
                                password: password,
                                team: team,
                                designation: designation,
                                userType: usertype,
                                user_status: user_status,
                                created_by: "admin",
                            })
                        }).then((response) => response.json())
                            .then((responseJson) => {
                                //alert(responseJson);
                                console.log(JSON.stringify(responseJson));
                                console.log(responseJson);
                                //  alert(JSON.stringify(responseJson));
                                if (responseJson.status === 'True') {

                                    this.props.navigation.navigate('AdminManageEmployees');

                                }
                                else {
                                    console.log(JSON.stringify(responseJson));
                                    log("Warn", "Error  found");
                                    alert("error");
                                }

                            }).catch((error) => {
                                console.error(error);
                                log("Error", "Adding the new Employee error");
                            });
                    }
                });
            });

        }
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

                    <Icon name="arrow-left" size={25} style={{ color: '#fff', paddingTop: 17 }} onPress={() =>
                        this.props.navigation.navigate('AdminManageEmployees')} />

                    <Body style={{ paddingLeft: 30, }}>
                        <Title style={{ color: '#fff', fontWeight: '600', }}>Add Employee</Title>
                        <Subtitle></Subtitle>
                    </Body>

                </Header>

                {/* <Content> */}
                < View style={{ paddingTop: 30, }}>

                    <View style={{ paddingLeft: 10, }}>
                        <Text style={{ fontSize: 20, color: 'black' }}>Enter Other Details </Text>
                    </View>

                    <View >

                        <Dropdown
                           
                                style={{ paddingLeft: 10 }}
                                placeholder='Select Designation *'
                               // value={this.state.designation}
                                onChangeText={typeValue => this.setState({ designation: typeValue })}

                                data={this.state.designationData}
                            />
                            <Dropdown
                                //   ref={this.nameRef}
                                style={{ paddingLeft: 10 }}
                                placeholder='Select Role *'
                                //value={this.state.team}
                                onChangeText={typeValue => this.setState({ team: typeValue })}

                                data={this.state.roleData}
                            />

                    </View>
                  
                    <View style={{ paddingLeft: 10, }}>
                        <TextInput style={{ width: wp('95%'), height: 45, borderBottomWidth: 1, }}
                            placeholder='Password *'
                            secureTextEntry={true}
                            underlineColorAndroid='transparent'
                           // selectionColor='white'
                            onChangeText={(password) => this.setState({ password })}

                        />
                    </View>
                    <View style={{ paddingLeft: 10, paddingTop: 10, }}>
                        <Text>User Account Status</Text>
                        <View style={{ flexDirection: 'row', paddingTop: 10, }}>

                            <RadioGroup
                                horizontal
                                options={[
                                    {
                                        id: 'Active',
                                        labelView: (
                                            <Text>
                                                <Text style={{ color: 'Black' }}>Active
                  </Text>
                                            </Text>
                                        ),
                                    },
                                    {
                                        id: 'Inactive',
                                        labelView: (
                                            <Text>
                                                <Text style={{ color: 'black' }}>In-Active
                  </Text>
                                            </Text>
                                        ),
                                    },

                                    {
                                        id: 'Other',
                                        labelView: (
                                            <Text>
                                                <Text style={{ color: 'black' }}>Other</Text>
                                            </Text>
                                        ),
                                    },

                                ]}
                                activeButtonId={'user'}
                                circleStyle={{ fillColor: 'black', borderColor: 'black' }}
                                onChange={(option) => this.setState({ user_status: option.id })}
                            />
                        </View>
                    </View>
                    <View style={{ paddingLeft: 10, paddingTop: 10, }}>
                        <Text>Select User Type</Text>
                        <View style={{ flexDirection: 'row', paddingTop: 10, }}>

                            <RadioGroup
                                horizontal
                                options={[
                                    {
                                        id: 'Manager',
                                        labelView: (
                                            <Text>
                                                <Text style={{ color: 'Black' }}>Manager</Text>
                                            </Text>
                                        ),
                                    },
                                    {
                                        id: 'Emp',
                                        labelView: (
                                            <Text>
                                                <Text style={{ color: 'black' }}>Employee</Text>
                                            </Text>
                                        ),
                                    },

                                    {
                                        id: 'Approver',
                                        labelView: (
                                            <Text>
                                                <Text style={{ color: 'black' }}>Approver</Text>
                                            </Text>
                                        ),
                                    },

                                ]}
                                activeButtonId={'user'}
                                circleStyle={{ fillColor: 'black', borderColor: 'black' }}
                                onChange={(option) => this.setState({ usertype: option.id })}
                            />
                        </View>
                    </View>



                </View >
                <View style={{ paddingTop: 20, }}>
                  

                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', }}>
                        <TouchableOpacity onPress={() => this.onSignIn()} style={styles.submit}>
                            <Text style={{ color: 'white' ,fontSize:15}}> Submit</Text>
                        </TouchableOpacity>

                    </View>

                </View>
                {/* </Content> */}
            </Container >
        );
    }
}
//Styles for UI
const styles = StyleSheet.create(
    {
    
    submit: {
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