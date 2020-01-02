/*
FileName:NavigationRouter.js
Version:1.0.0
Purpose:Navgate to all classes from Here
Devloper:Rishitha,Naveen,Harsha,Mahesh,Raju,MaheshReddy
*/
import React, { Component } from 'react';
import { ActivityIndicator, Button, StatusBar, StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { widthPercentageToDP } from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { createStackNavigator, createSwitchNavigator, createAppContainer, createDrawerNavigator } from 'react-navigation';
import Login from '../LaunchScreens/Login';
import Maintenance from '../Maintenance/Maintenance'
import drawerContentComponents from './UserDrawerComponents';

import AdminDrawerComponents from '../Navigation/AdminDrawerComponents';
import UserDrawerComponents from '../Navigation/UserDrawerComponents';

import AdminManageProjects from '../AdminComponets/AdminManageProjects';
import AdminManageTask from '../AdminComponets/AdminManageTask';
import AdminManageEmployees from '../AdminComponets/AdminManageEmployees';
import AdminUserPreference from '../AdminComponets/AdminUserPreference';
import AdminCompletedProjects from '../AdminComponets/AdminCompletedProjects';
import AdminViewModules from '../AdminComponets/AdminViewModules';
import AdminManageEmployeesTasks from '../AdminComponets/AdminManageEmployeesTasks';
import Updates1 from '../AdminComponets/Updates1';
import AdminProjectInfo from '../AdminComponets/AdminProjectInfo';

import UserMyTask from '../UserComponents/UserMyTask';
import Updates from '../UserComponents/Updates';

import UserManageProjects from '../UserComponents/UserManageProjects';
import UserProfile from '../UserComponents/UserProfile';
import UserManageEmployees from '../UserComponents/UserManageEmployees';
import UserManageTask from '../UserComponents/UserManageTask';
import UserPreference from '../UserComponents/UserPreference';
import UserCompletedProjects from '../UserComponents/UserCompletedProjects';
import UserProjectInfo from '../UserComponents/UserProjectInfo';
import UserManageEmployeesTasks from '../UserComponents/UserManageEmployeesTasks';

import AddModule from '../CommonComponents/AddModule';
import AddMainTask from '../CommonComponents/AddMainTask';
import AddTask from '../CommonComponents/AddTask';
import EditUser from '../CommonComponents/EditUser';
import AddUser from '../CommonComponents/AddUser';
import ViewSubTasks from '../CommonComponents/ViewSubTasks';
import UpdateEmployee from '../CommonComponents/UpdateEmployee';
import ModuleAdd from '../CommonComponents/ModuleAdd';
import ReleaseOwner from '../CommonComponents/ReleaseOwner';
import ModifySubTask from '../CommonComponents/ModifySubTask';
import AddSubTaskModal from '../CommonComponents/AddSubTaskModal';
import RoadBlocks from '../CommonComponents/RoadBlock';
import TaskChat from '../CommonComponents/TaskChat';

import RoadBlockList from '../CommonComponents/RoadBlockList';
import CriticalRoadBlockList from '../CommonComponents/CriticalRoadBlockList';
import SolvedRoadBlockList from '../CommonComponents/SolvedRoadBlockList';
import OfflineCheck from '../Maintenance/OfflineCheck';
import EmployeeInfo from '../CommonComponents/EmployeeInfo';
import { API } from "../WebServices/RestClient";
import { nullLiteral } from '@babel/types';
import ManageProjects from "../EmployeeInfo/ManageProjects";
import ProjectInfo from "../EmployeeInfo/ProjectInfo";
import RequestedProjects from "../EmployeeInfo/RequestedProjects";
import ApprovedProjects from "../EmployeeInfo/ApprovedProjects";
import EmployeeModules from "../EmployeeInfo/EmployeeModules";
import EmployeeManageTask from "../EmployeeInfo/EmployeeManageTask";
import EmployeePendingManageTask from "../EmployeeInfo/EmployeePendingManageTask";
import EmployeeCompletedManageTask from "../EmployeeInfo/EmployeeCompletedManageTask";
import RoadBlockInfo from '../EmployeeInfo/RoadBlockInfo';


class NavigationRouter extends Component {

  constructor() {
    super();
    this._bootstrapAsync();
  }

  //Maintanace Page for Checking the Heathcheck
  Maintenance = () => {

    fetch(API + "healthCheck.php")
      .then((response) => response.json())
      .then((responseJson) => {

        if (responseJson.status === 'True') {

          this._bootstrapAsync();
        }
        else {
          this.props.navigation.navigate('Maintenance');
        }
      })
      .catch((error) => {

        console.log(error);

      });
  };

  // Fetch the token from storage then navigate to our appropriate place
  _bootstrapAsync = async () => {

    const userToken = await AsyncStorage.getItem('userToken');

    const role = await AsyncStorage.getItem('emp_role');



    console.log(userToken);
    // This will switch to the App screen or Auth screen and this loading
    // screen will be unmounted and thrown away.
    if (userToken) {
      if (role == "admin") {
        this.props.navigation.navigate('AdminAppStack');
      }
      else {
        this.props.navigation.navigate('UserAppStack');
      }
    }
    else {
      this.props.navigation.navigate('Auth');
    }
  };

  // Render any loading content that you like here
  render() {
    return (
      <View><OfflineCheck /></View>
      // <AppContainer/>

    );
  }
}

//Admin Navigation 
const AdminDrawer = createDrawerNavigator(
  {
    AdminManageProjects: { screen: AdminManageProjects },
    AdminManageTask: { screen: AdminManageTask },
    AdminManageEmployees: { screen: AdminManageEmployees },
    AdminUserPreference: { screen: AdminUserPreference},
    AdminCompletedProjects: { screen: AdminCompletedProjects },
    Updates1: { screen: Updates1 },
    RoadBlockList: { screen: RoadBlockList },
    //EmployeeInfo: { screen: EmployeeInfo },
    //EmployeeManageTask: { screen: EmployeeManageTask },
    // AddModule : {screen: AddModule},
    Logout: { screen: Login },
  },
  {
    drawerWidth: widthPercentageToDP('65%'),
    contentComponent: AdminDrawerComponents
  }

);
//User Navigation 
const UserDrawer = createDrawerNavigator(
  {

    UserMyTask: { screen: UserMyTask },
    UserManageProjects: { screen: UserManageProjects },
    UserProfile: { screen: UserProfile },
    UserManageTask: { screen: UserManageTask },
    //EmployeeInfo: { screen: EmployeeInfo },
    UserManageEmployees: { screen: UserManageEmployees },
    UserPreference: { screen: UserPreference },
    UserCompletedProjects: { screen: UserCompletedProjects },
    RoadBlockList: { screen: RoadBlockList },
    //EmployeeManageTask: { screen: EmployeeManageTask },
    // AddModule : {screen: AddModule},
    Updates: { screen: Updates },
    Logout: { screen: Login },

  }, {
  drawerWidth: widthPercentageToDP('65%'),
  contentComponent: UserDrawerComponents
}


);

//Admin Navigation classes 
const adminAppStack = createStackNavigator({

  ManageTask1: {
    screen: AdminDrawer,
    navigationOptions: {
      header: null,
    },
  },
  UserManageTask: {
    screen: UserManageTask,
    navigationOptions: {
      header: null,
    },
  },

  AddModule: {
    screen: AddModule,
    navigationOptions: {
      header: null,
    },
  },
  AddMainTask: {
    screen: AddMainTask,
    navigationOptions: {
      header: null,
    },
  },
  AddTask: {
    screen: AddTask,
    navigationOptions: {
      header: null,
    },
  },
  ViewSubTasks: {
    screen: ViewSubTasks,
    navigationOptions: {
      header: null,
    },
  },
  AdminProjectInfo: {
    screen: AdminProjectInfo,
    navigationOptions: {
      header: null,
    },
  },
  Maintenance: {
    screen: Maintenance,
    navigationOptions: {
      header: null,
    },
  },


  ModuleAdd: {
    screen: ModuleAdd,
    navigationOptions: {
      header: null,
    },
  },
  ReleaseOwner: {
    screen: ReleaseOwner,
    navigationOptions: {
      header: null,
    },
  },
  AdminManageEmployeesTasks: {
    screen: AdminManageEmployeesTasks,
    navigationOptions: {
      header: null,
    },
  },
  AddUser: {
    screen: AddUser,
    navigationOptions: {
      header: null,
    },
  },
  UpdateEmployee: {
    screen: UpdateEmployee,
    navigationOptions: {
      header: null,
    },
  },
  ModifySubTask: {
    screen: ModifySubTask,
    navigationOptions: {
      header: null,
    },
  },
  AddSubTaskModal: {
    screen: AddSubTaskModal,
    navigationOptions: {
      header: null,
    },
  },
  EditUser: {
    screen: EditUser,
    navigationOptions: {
      header: null,
    },
  },
  RoadBlocks: {
    screen: RoadBlocks,
    navigationOptions: {
      header: null,
    },
  },
  RoadBlockList: {
    screen: RoadBlockList,
    navigationOptions: {
      header: null,
    },

  },

  CriticalRoadBlockList: {
    screen: CriticalRoadBlockList,
    navigationOptions: {
      header: null,
    },

  },
  SolvedRoadBlockList: {
    screen: SolvedRoadBlockList,
    navigationOptions: {
      header: null,
    },

  },
  TaskChat: {
    screen: TaskChat,
    navigationOptions: {
      header: null,
    },
  },
  EmployeeInfo: {
    screen: EmployeeInfo,
    navigationOptions: {
      header: null,
    }
  },
  // Projects Information of Employees Start
  ManageProjects: {
    screen: ManageProjects,
    navigationOptions: {
      header: null,
    }
  },
  RequestedProjects: {
    screen: RequestedProjects,
    navigationOptions: {
      header: null,
    }
  },
  ApprovedProjects: {
    screen: ApprovedProjects,
    navigationOptions: {
      header: null,
    },
  },
  ProjectInfo: {
    screen: ProjectInfo,
    navigationOptions: {
      header: null,
    },
  },
  EmployeeModules: {
    screen: EmployeeModules,
    navigationOptions: {
      header: null,
    },
  },
  EmployeeManageTask: {
    screen: EmployeeManageTask,
    navigationOptions: {
      header: null,
    },
  },
  EmployeePendingManageTask: {
    screen: EmployeePendingManageTask,
    navigationOptions: {
      header: null,
    },
  },
  EmployeeCompletedManageTask: {
    screen: EmployeeCompletedManageTask,
    navigationOptions: {
      header: null,
    },
  },
  RoadBlockInfo: {
    screen: RoadBlockInfo,
    navigationOptions: {
      header: null,
    },
  },
  //Projects Information of Employees End
});

//User Navigation classes 
const userAppStack = createStackNavigator({

  MyTask: {
    screen: UserDrawer,
    navigationOptions: {
      header: null,
    },
  },
  AddModule: {
    screen: AddModule,
    navigationOptions: {
      header: null,
    },
  },
  AddMainTask: {
    screen: AddMainTask,
    navigationOptions: {
      header: null,
    },
  },
  AddTask: {
    screen: AddTask,
    navigationOptions: {
      header: null,
    },
  },
  ViewSubTasks: {
    screen: ViewSubTasks,
    navigationOptions: {
      header: null,
    },
  },
  AdminProjectInfo: {
    screen: AdminProjectInfo,
    navigationOptions: {
      header: null,
    },
  },
  UserProjectInfo: {
    screen: UserProjectInfo,
    navigationOptions: {
      header: null,
    },
  },
  ModuleAdd: {
    screen: ModuleAdd,
    navigationOptions: {
      header: null,
    },
  },
  ReleaseOwner: {
    screen: ReleaseOwner,
    navigationOptions: {
      header: null,
    },
  },
  AddUser: {
    screen: AddUser,
    navigationOptions: {
      header: null,
    },
  },
  ModifySubTask: {
    screen: ModifySubTask,
    navigationOptions: {
      header: null,
    },
  },
  AddSubTaskModal: {
    screen: AddSubTaskModal,
    navigationOptions: {
      header: null,
    },
  },


  UpdateEmployee: {
    screen: UpdateEmployee,
    navigationOptions: {
      header: null,
    },
  },
  RoadBlocks: {
    screen: RoadBlocks,
    navigationOptions: {
      header: null,
    },
  },
  TaskChat: {
    screen: TaskChat,
    navigationOptions: {
      header: null,
    },
  },
  UserManageEmployeesTasks: {
    screen: UserManageEmployeesTasks,
    navigationOptions: {
      header: null,
    },
  },
  RoadBlockList: {
    screen: RoadBlockList,
    navigationOptions: {
      header: null,
    },

  },
  CriticalRoadBlockList: {
    screen: CriticalRoadBlockList,
    navigationOptions: {
      header: null,
    },

  },
  SolvedRoadBlockList: {
    screen: SolvedRoadBlockList,
    navigationOptions: {
      header: null,
    },

  },
  EmployeeInfo: {
    screen: EmployeeInfo,
    navigationOptions: {
      header: null,
    }
  },
  // Projects Information of Employees Start
  ManageProjects: {
    screen: ManageProjects,
    navigationOptions: {
      header: null,
    },
  },
  RequestedProjects: {
    screen: RequestedProjects,
    navigationOptions: {
      header: null,
    },
  },
  ApprovedProjects: {
    screen: ApprovedProjects,
    navigationOptions: {
      header: null,
    },
  },
  ProjectInfo: {
    screen: ProjectInfo,
    navigationOptions: {
      header: null,
    },
  },
  EmployeeModules: {
    screen: EmployeeModules,
    navigationOptions: {
      header: null,
    },
  },
  EmployeeManageTask: {
    screen: EmployeeManageTask,
    navigationOptions: {
      header: null,
    },
  },
  EmployeePendingManageTask: {
    screen: EmployeePendingManageTask,
    navigationOptions: {
      header: null,
    },
  },
  EmployeeCompletedManageTask: {
    screen: EmployeeCompletedManageTask,
    navigationOptions: {
      header: null,
    },
  },
  RoadBlockInfo: {
    screen: RoadBlockInfo,
    navigationOptions: {
      header: null,
    },
  },
  //Projects Information of Employees End

});

//Authentication to Login Screen
const AuthStack = createStackNavigator({
  Login: {
    screen: Login,
    navigationOptions: {
      header: null,
    },
  },

});
//Navigation by Autherization and Authentication from here
export default createAppContainer(createSwitchNavigator(
  {
    AuthLoading: NavigationRouter,
    AdminAppStack: adminAppStack,
    UserAppStack: userAppStack,
    Auth: AuthStack,

  },
  {
    initialRouteName: 'AuthLoading',
  }
));

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  home: {
    paddingLeft: 20,
  }
});