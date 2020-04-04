import React from 'react';
import { StyleSheet, Text, View, ScrollView, ActivityIndicator} from 'react-native';

import { Entypo } from '@expo/vector-icons';
import { colors } from '../Colors';

export default class Datass extends React.Component {
  
    constructor(props){
        super(props);
        this.state = {
            idDoc: this.props.navigation.getParam("idDoc"),
            datas: this.props.navigation.getParam("datas"),
            alunos: this.props.navigation.getParam("alunos"),
            nomeMateria: this.props.navigation.getParam("nomeMateria"),
        }
        this.mostrarLista = this.mostrarLista.bind(this);
        this.mostrarChamada = this.mostrarChamada.bind(this);
    }

    mostrarLista(){
        return(
            <View style={styles.lista}>

                <View style={styles.headerChamada}>
                    <Text style={styles.headerChamadaData}>Data</Text>
                    
                    <View style={styles.headerChamadaAcoes}>
                        <Text style={styles.headerChamadaAcoesText}>Entrar</Text>
                    </View>
                </View>

                <View style={styles.content}>
                    <ScrollView>
                        {this.mostrarChamada()}
                    </ScrollView>
                </View>
                
            </View>
        );
    }

    mostrarChamada(){
        let { alunos } = this.state;
        let { datas } = this.state;
        let { nomeMateria } = this.state;
        return datas.map((data, key) => {
            let dia = data.toDate().getDate();
            let mes = data.toDate().getMonth() + 1;
            let ano = data.toDate().getFullYear();

            if(mes < 10) mes = '0' + mes;
            let dataExibida = dia + '/' + mes + '/' + ano;
            return(
                <View key={key} style={styles.rowChamada}>
                    <View style={styles.data}>
                    <Text>{dataExibida}</Text>
                    </View>

                    <View style={styles.acao}>
                        <Entypo color={colors.accent} size={30} onPress={() => this.props.navigation.navigate( 'Frequencia', {alunos, nomeMateria, data, idDoc: this.state.idDoc} )} name="eye"/>
                    </View>
                </View>
            );
        });
    }

    render(){
        Datass.navigationOptions = {
          title: this.state.nomeMateria,
          headerStyle: {
            backgroundColor: colors.primary,
          },
          headerTintColor: 'white',
          headerTitleStyle: {
            color: 'white',
          },
        };

        return (
            <View style={styles.container}>
                <View style={styles.lista}>
                    { this.state.datas.length === 0 ? <ActivityIndicator size='large' color={colors.accent}/> : this.mostrarLista() }
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: colors.background,
  },
  headerChamada: {
    backgroundColor: colors.darkPrimary,
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    flexDirection: 'row',
  },
  headerChamadaData: {
    flex: 1,
    color: colors.textIcons,
  },
  headerChamadaAcoes: {
    flex: 1,
    alignItems: 'flex-end',
  },
  headerChamadaAcoesText: {
    color: colors.textIcons,
  },
  lista: {
    justifyContent: 'center',
    flex: 1,
  },
  content: {
    flex: 9,
  },
  rowChamada: {
    flex: 1,
    flexDirection: 'row',
    padding: 10,
  },
  data: {
    flex: 1,
  },
  acao: {
    flex: 1,
    alignItems: 'flex-end',
  },
});
