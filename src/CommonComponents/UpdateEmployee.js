import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, StatusBar, Dimensions, TouchableOpacity, Linking, TextInput } from 'react-native';
import { Title, Button, Container, Content, Header, Right, Left, Body, Tab, Tabs, TabHeading, Footer, Item, Input, FooterTab } from 'native-base';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/FontAwesome';
import SearchableDropdown from 'react-native-searchable-dropdown';
import RadioGroup from 'react-native-radio-button-group';
import {API }from "../WebServices/RestClient";
import NetInfo from '@react-native-community/netinfo';
import Snackbar from 'react-native-snackbar';
import AsyncStorage from '@react-native-community/async-storage';



export default class UpdateEmployee extends Component {

    constructor(props) {
        super(props);

        this.state = {
            //  maintask: '',
            // description: '',

            team: '',
            designation: '',
            modalVisible: false,
            usertype: '',
            user_status: '',
            //usertype1: '',
            password: '',

            designation : [

                { id: 1, name: 'angellist' },
                { id: 2, name: 'codepen' },
                { id: 3, name: 'envelope' },
                { id: 4, name: 'etsy' },
                { id: 5, name: 'facebook' },
                { id: 6, name: 'foursquare' },
                { id: 7, name: 'github-alt' },
                { id: 8, name: 'github' },
                { id: 9, name: 'gitlab' },
                { id: 10, name: 'instagram' },
            ],
            
            
             team : [
            
                { id: 1, name: 'angellist' },
                { id: 2, name: 'codepen' },
                { id: 3, name: 'envelope' },
                { id: 4, name: 'etsy' },
                { id: 5, name: 'facebook' },
                { id: 6, name: 'foursquare' },
                { id: 7, name: 'github-alt' },
                { id: 8, name: 'github' },
                { id: 9, name: 'gitlab' },
                { id: 10, name: 'instagram' },
            ],
            
             radiogroup_options : [
                { id: 0, label: 'active' },
                { id: 1, label: 'inactive' },
                { id: 2, label: 'other' },
            ],
           radiogroup_options : [
                { id: 0, label: 'manager' },
                { id: 1, label: 'employee' },
                { id: 2, label: 'approver' },
            ]


        };
    }



    isValid() {
        var { designation, team, usertype, user_status, password } = this.state;
        let valid = false;

        if (designation.length === 0) {
            alert("Enter Designation");
        }

        else if (team.length === 0) {
            alert("Enter Team");
        }
        else if (usertype.length === 0) {
            alert("Enter User Type");
        }

        else if (user_status.length === 0) {
            alert("Enter User Status");
        }

        else if (password.length === 0) {
            alert("Enter Password");
        }

        else {
            valid = true;
        }
        return valid;
    }
    //  verifyEmail(email) {



    // nav(){
    //     console.log("dvcdwvciuwdviwu");
    //     alert("mahesh");
    //     this.props.navigation.navigate("AddUser1");
    // }


    onSignIn() {
        alert("Gel");
        if (this.isValid()) {
            console.log("staredt.,.................");
            console.log(this.state.designation);
            console.log(this.state.team);
            console.log(this.state.usertype);
            console.log(this.state.user_status);
            console.log(this.state.password);
            const { designation, team, usertype, user_status, password, } = this.state;

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
                fetch(API+'add_edit_employee.php', {
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
                        alert(JSON.stringify(responseJson));
                        if (responseJson.status === 'True') {

                            this.props.navigation.navigate('AdminManageEmployees');

                        }
                        else {
                            console.log(JSON.stringify(responseJson));
                           alert("error");
                        }

                    }).catch((error) => {
                        console.error(error);
                    });
                }
            });
            });

        }
    }


    render() {

        // let data1 = [{ value: 'acres', }, { value: 'units', }, { value: 'squares', }, { value: 'cents', },];
        // let data2 = [{ value: 'industries', }, { value: 'offices', }];

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
                        <Icon name="arrow-left" size={25} style={{ color: '#fff', }} onPress={() =>
                            this.props.navigation.toggleDrawer()} />
                    </Left>
                    <Body style={{ paddingRight: 60, }}>
                        <Title style={{ color: '#fff', fontWeight: '600', }}>Add User</Title>
                    </Body>

                    <Right>

                    </Right>

                </Header>

                {/* <Content> */}
                < View style={{ paddingTop: 30, }}>

                    <View style={{ paddingLeft: 10, }}>
                        <Text style={{ fontSize: 20, color: 'black' }}>Enter Other Details </Text>




                    </View>

                    <View style={{ flexDirection: 'row' }}>

                        <View style={{ height: 50, width: "30%", position: 'relative', left: '4%', marginTop: '10%' }} >
                            {/* <View style={{ paddingLeft: 10, }}> */}

                            {/* <TextInput style={{ width: wp('50%'), height: 45, color: 'white', }}
                                placeholder='Designation*'
                                // underlineColorAndroid='transparent'
                                selectionColor='white'
                                onChangeText={(maintask) => this.setState({ maintask })}
                            /> */}
                            <Text style={{ width: wp('50%'), height: 45, paddingTop: 20 }}> Designation*</Text>
                        </View>
                        <View style={{ paddingLeft: 130 }}>
                            <SearchableDropdown
                                onTextChange={text => console.log(text)}
                                onItemSelect={item => alert(JSON.stringify(item))}
                                containerStyle={{ padding: 5 }}
                                textInputStyle={{
                                    padding: 12,
                                    borderWidth: 1,
                                    borderColor: '#ccc',
                                    backgroundColor: '#FAF7F6',
                                }}
                                itemStyle={{
                                    padding: 10,
                                    marginTop: 2,
                                    backgroundColor: '#FAF9F8',
                                    borderColor: '#bbb',
                                    borderWidth: 1,
                                }}
                                itemTextStyle={{

                                    color: '#222',
                                }}
                                itemsContainerStyle={{

                                    maxHeight: '60%',
                                }}
                                items={this.state.designation}

                                defaultIndex={2}

                                placeholder="placeholder"

                                resetValue={false}

                                underlineColorAndroid="transparent"

                            />

                            {/* <Dropdown
                                //label={this.state.saleLabel}     
                                data={data1}
                                value={this.state.saleLabel}
                                onChangeText={saleValue => this.setState({ saleLabel: saleValue, })}
                            /> */}


                        </View>

                    </View>





                    <View style={{ flexDirection: 'row' }}>
                        <View style={{ paddingLeft: 10, }}>


                            <Text style={{ width: wp('50%'), height: 45, paddingTop: 20 }}>Team*</Text>
                        </View>
                        <View style={{ paddingLeft: 30 }}>
                            <SearchableDropdown
                                onTextChange={text => console.log(text)}
                                onItemSelect={team => alert(JSON.stringify(team))}
                                containerStyle={{ padding: 5 }}
                                textInputStyle={{
                                    padding: 12,
                                    borderWidth: 1,
                                    borderColor: '#ccc',
                                    backgroundColor: '#FAF7F6',
                                }}
                                itemStyle={{
                                    padding: 10,
                                    marginTop: 2,
                                    backgroundColor: '#FAF9F8',
                                    borderColor: '#bbb',
                                    borderWidth: 1,
                                }}
                                itemTextStyle={{

                                    color: '#222',
                                }}
                                itemsContainerStyle={{

                                    maxHeight: '60%',
                                }}
                                items={this.state.team}

                                defaultIndex={2}

                                placeholder="placeholder"

                                resetValue={false}

                                underlineColorAndroid="transparent"

                            />


                        </View>

                    </View>











                    <View style={{ paddingLeft: 10, }}>


                        <TextInput style={{ width: wp('95%'), height: 45, borderBottomWidth: 1, }}
                            placeholder='Password *'
                            secureTextEntry={true}
                            underlineColorAndroid='transparent'
                            selectionColor='white'
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
                                        id: 'active',
                                        labelView: (
                                            <Text>
                                                <Text style={{ color: 'Black' }}>Active
                  </Text>
                                            </Text>
                                        ),
                                    },
                                    {
                                        id: 'inactive',
                                        labelView: (
                                            <Text>
                                                <Text style={{ color: 'black' }}>In-Active
                  </Text>
                                            </Text>
                                        ),
                                    },

                                    {
                                        id: 'other',
                                        labelView: (
                                            <Text>
                                                <Text style={{ color: 'black' }}>Other
                  </Text>
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
                                        id: 'manager',
                                        labelView: (
                                            <Text>
                                                <Text style={{ color: 'Black' }}>Manager
                  </Text>
                                            </Text>
                                        ),
                                    },
                                    {
                                        id: 'employee',
                                        labelView: (
                                            <Text>
                                                <Text style={{ color: 'black' }}>Employee
                  </Text>
                                            </Text>
                                        ),
                                    },

                                    {
                                        id: 'approver',
                                        labelView: (
                                            <Text>
                                                <Text style={{ color: 'black' }}>Approver
                  </Text>
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


                    {/* <View style={{ paddingLeft: 10, }}>


                        <TextInput style={{ width: wp('95%'), height: 45, color: 'white', borderBottomWidth: 1, }}
                            placeholder='Username *'
                            underlineColorAndroid='transparent'
                            selectionColor='white'
                            onChangeText={(description) => this.setState({ description })}

                        />
                    </View> */}
                    {/* <View style={{ paddingLeft: 10, }}>


                        <TextInput style={{ width: wp('95%'), height: 45, color: 'white', borderBottomWidth: 1, }}
                            placeholder='Mobile *'
                            underlineColorAndroid='transparent'
                            selectionColor='white'
                            onChangeText={(description) => this.setState({ description })}

                        />
                    </View> */}

                </View >
                <View style={{ paddingTop: 20, }}>
                    {/* <SearchableDropdown
                onTextChange={text => console.log(text)}
                onItemSelect={item => alert(JSON.stringify(item))}
                containerStyle={{ padding: 5 }}
                textInputStyle={{
                  padding: 12,
                  borderWidth: 1,
                  borderColor: '#ccc',
                  backgroundColor: '#FAF7F6',
                }}
                itemStyle={{
                  padding: 10,
                  marginTop: 2,
                  backgroundColor: '#FAF9F8',
                  borderColor: '#bbb',
                  borderWidth: 1,
                }}
                itemTextStyle={{

                  color: '#222',
                }}
                itemsContainerStyle={{

                  maxHeight: '60%',
                }}
                items={items}

                defaultIndex={2}

                placeholder="placeholder"

                resetValue={false}

                underlineColorAndroid="transparent"

              />
            </View> */}

                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', }}>
                        <TouchableOpacity onPress={()=>this.onSignIn()} style={{ margin: 5, backgroundColor: '#00A2C1', borderRadius: 5, padding: 19, height: 30, alignItems: "center", justifyContent: 'center' }}>
                            <Text style={{ color: 'white' }}> Submit</Text>
                        </TouchableOpacity>

                    </View>

                </View>
                {/* </Content> */}






            </Container >
        );
    }
}