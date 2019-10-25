/*
FileName:UserCompletedProjects.js
Version:1.0.0
Purpose:Getting the List of completed Projects list
Devloper:Raju
*/
import React, { Component } from 'react';
import { Alert, Platform, StyleSheet, Text, View, TouchableOpacity, Dimensions, FlatList, TouchableHighlight, Image } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { Title, Button, Container, Content, Header, Right, Left, Body, Tab, Tabs, TabHeading, Footer, Item, Input, FooterTab } from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { API } from "../WebServices/RestClient";
import NetInfo from '@react-native-community/netinfo';
import Snackbar from 'react-native-snackbar';

class ListItem extends React.Component {

    render() {
        const { item } = this.props;
        return (
            <View style={styles.container}>
                <TouchableOpacity onPress={this.props.Module}>
                    <View style={styles.signup}>
                        <View style={[styles.buttonContainer, styles.signupButton]} >
                            <View style={styles.box}>

                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={styles.signUpText0} >Project No:</Text>
                                    <Text style={styles.signUpText1} >{item.idea_id}</Text>
                                </View>
                                <Text style={styles.signUpText2} >{item.created_on}</Text>
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
                                <TouchableOpacity style={{ width: 100, backgroundColor: '#6cbb3f', marginLeft: 220,marginTop:15 }}>
                <Text style={{ color: '#fff', textAlign: 'center' }}>Re Open</Text></TouchableOpacity>
                            </View>

                            <View style={{ flexDirection: 'row', paddingRight: 25 }}>
                                <Text style={styles.signUpText4} >Requested By:</Text>
                                <Text style={styles.signUpText3} >{item.userName}</Text>
                            </View>

                        </View>

                    </View>
                </TouchableOpacity>
            </View>

        )
    }
}
export default class UserCompletedProjects extends Component {
    constructor(props) {

        super(props);
        this.state = {
            isLoading: true,
            dataSource: [],
            isFetching: false,
            role: '',
            userToken: '',
            idea_id: '',
            empId: '',
        }
        this.arrayholder = [];
    }
    onRefresh() {
        this.setState({ isFetching: true }, function () { this.userCompletedProjects() });
      }
    async componentDidMount() {

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

        console.log(this.state.userToken);
        console.log(this.state.role);
        this.userCompletedProjects(this.state.role, this.state.userToken, this.state.cropcode)
    }

    //get AdminApprovedProjects list start
    userCompletedProjects(role, userToken, cropcode) {

        console.log(userToken);
        console.log(role);
    
            NetInfo.fetch().then(state => {
                if (state.type == "none") {
                  console.log(state.type);
                  Snackbar.show({
                    title: 'No Internet Connection',
                    backgroundColor: 'red',
                    duration: Snackbar.LENGTH_LONG,
                  });
                }else{
        fetch(API + 'ReactgetIdeas.php',
            {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    crop: cropcode,
                    action: 'completed',
                    empId: userToken,
                    userType: role,
                    // empId:empId
                })
            })
            .then((response) => response.json())
            .then((responseJson) => {
                   //alert(JSON.stringify(responseJson));
                console.log(responseJson)
                if(responseJson.status=='True'){
                
                
                this.setState({
                    isLoading: false,
                    dataSource: responseJson.data,
                    isFetching: false
                }, function () {

                });
                this.arrayholder = responseJson.data;
            }
            else{
                Snackbar.show({
                    title: 'No CompletedProjects',
                    backgroundColor: '#3BB9FF',
                    duration: Snackbar.LENGTH_LONG,
                  });
            }
            })
            .catch((error) => {
                //console.error(error);
            });
        }
    });
}


    FlatListItemSeparator = Module = (item, index) => {

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

    //For Search 
    SearchFilterFunction(text) {
        console.log(text);
        const newData = this.arrayholder.filter(function (item) {
            const idea_id = item.idea_id.toUpperCase()
            const idea_id1 = text.toUpperCase()
            const idea_title = item.idea_title.toUpperCase()
            const idea_title1 = text.toUpperCase()
            const userName = item.userName.toUpperCase()
            const userName1 = text.toUpperCase()

            return idea_id.indexOf(idea_id1) > -1 ||
                idea_title.indexOf(idea_title1) > -1 ||
                userName.indexOf(userName1) > -1

        })
        this.setState({
            dataSource: newData,
            text: text
        })
    }


    render() {

        return (
            <Container style={{ height: Dimensions.get('window').height }}>
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
            <Icon size={25} name="navicon" style={{ color: '#fff' }} onPress={() =>
              this.props.navigation.toggleDrawer()} />
          </Left>
          <Body>
            <Title style={{ color: '#fff', fontWeight: '600', }}>Completed Ideas    </Title>
          </Body>


        </Header>

                <Item>
                    <Input placeholder="Search"
                        onChangeText={(text) => this.SearchFilterFunction(text)} />
                    <Icon name="search" />
                </Item>
                <Content>
                    <View>
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
                                        
                                        />
                                    </View>
                                }
                                keyExtractor={item => item.id}
                                ListEmptyComponent={this._listEmptyComponent}
                            />

                        </View>
                    </View>
                </Content>



            </Container>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '90%',
        paddingLeft: hp('2%'),
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

    },
    signUpText1: {
        fontSize: 13,
        color: 'green',
        paddingTop: 10,

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
        marginLeft: 200,
        fontSize: 13,
        color: 'green',
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