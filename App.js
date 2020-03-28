import React from 'react';

import Login from './screens/Login';
import Materias from './screens/Materias';
import Datas from './screens/Datas';
import Frequencia from './screens/Frequencia';

import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';

import { Entypo } from '@expo/vector-icons';
import { colors } from './Colors';

import * as firebase from 'firebase/app';
import 'firebase/auth';

function logout(){
  firebase.auth().signOut();
}

Materias.navigationOptions = {
  headerStyle: {
    backgroundColor: colors.primary,
  },
  headerTitleStyle: {
    color: 'white',
  },
  headerRight: () => (
    <Entypo
      onPress={() => logout()}
      size={28}
      name="log-out"
      color={colors.textIcons}
      style={{padding: 10}}
    />
  ),
};

Login.navigationOptions = {
  headerStyle: {
    backgroundColor: colors.primary,
  },
  headerTitleStyle: {
    color: 'white',
  },
};
export default class App extends React.Component {
  
  constructor(){
    super();
    this.state = {
      chamada: [],
      screenInitial: '',
    }
  }

  componentDidMount(){
    firebase.auth().onAuthStateChanged((user) => {
      let screenInitial = user !== null ?  'Materias' : 'Login';
      this.setState({screenInitial});
    });
  }

  render(){
    const MainNavigator = createStackNavigator({
      Materias,
      Datas,
      Frequencia,
      Login,
    },{
      initialRouteName: this.state.screenInitial,
    });

    const AppContainer = createAppContainer(MainNavigator);

    return (
      <AppContainer/>
    );
  }
}