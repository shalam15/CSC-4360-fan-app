import React from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Modal,
  Pressable,
  TextInput,
} from "react-native";
import Users from '../components/Messages'
import ActionButton from "react-native-action-button";
import Firebase from "../config/firebase/firebase";
import { Ionicons } from "@expo/vector-icons";


export default class Home extends React.Component {
  constructor(){
      super();
      this.state = {
        email:'',
        password: '',
        currentUser:'',
        announcementTitle:'',
        announcementContent:'',
        isCurrenUserAdmin:false,
        isLoading: '',
        modalVisible: false,
        loginModalVisible: true,
      };
    
      
  }
  updateInputVal = (val, prop) => {
    const state = this.state;
    state[prop] = val;
    this.setState(state);
  }
  userLogin = () => {
    if(this.state.email === '' && this.state.password === '') {
      Alert.alert('Enter details to signin!')
    } else {
      this.setState({
        isLoading: true,
      })
      Firebase
      .auth()
      .signInWithEmailAndPassword(this.state.email, this.state.password)
      .then((res) => {
        console.log(res)
        console.log('User logged-in successfully!')
        this.setState({
          isLoading: false,
          email: '', 
          password: '',
          currentUser:res.user.displayName,
          loginModalVisible:false
        })
      })
      .catch(error => this.setState({ errorMessage: error.message }))
    }
  }
postAnnouncement(title, content){
    Firebase.firestore().collection("messages").add({
      title: title,
      content: content,
      datetime: new Date()
    }).then((res)=>{
        console.log(res,"Annouced");
        this.setState({
            modalVisible:false
        })
    })
    .catch((error) =>{
        console.log(error)
        this.setState({
            errorMessage:error.message
        })
    })
}
  
    
  setModalVisible = (visible) => {
    this.setState({ modalVisible: visible });
  };

  render() {
    const { modalVisible, loginModalVisible } = this.state;
    return (
        
      <View style={styles.container}>
          {/* <Text style={styles.welcomeText}>Welcome {this.state.currentUser} </Text> */}
        <Users></Users>

        <Modal
          animationType="slide"
          transparent={true}
          visible={loginModalVisible}
          useNativeDriver={true}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
            this.loginModalVisible(!loginModalVisible);
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <TextInput
                style={styles.input}
                underlineColorAndroid="transparent"
                placeholder="Email"
                placeholderTextColor="grey"
                autoCapitalize="none"
                onChangeText={(email)=>this.setState({email})}
                value={this.state.email}
              />
              <TextInput
                style={styles.input}
                underlineColorAndroid="transparent"
                placeholder="Password"
                placeholderTextColor="grey"
                autoCapitalize="none"
                secureTextEntry={true}
                onChangeText={(password)=>this.setState({password})}
                value={this.state.password}
              />
              <Pressable
                style={[styles.button, styles.buttonAnnounce]}
                onPress={() =>  this.userLogin()}
              >
                <Text style={styles.textStyle}>Login</Text>
              </Pressable>
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => console.log("close")}
              >
                <Text style={styles.textStyle}>Close</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
        <ActionButton buttonColor="#000">
          <ActionButton.Item
            buttonColor="#9b59b6"
            title="New Task"
            onPress={() => this.setModalVisible(true)}
          >
            <Ionicons name="md-checkmark-circle" size={32} color="green" />
          </ActionButton.Item>
        </ActionButton>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          useNativeDriver={true}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
            this.setModalVisible(!modalVisible);
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
            <Text>Announce</Text>
              <TextInput
                style={styles.input}
                underlineColorAndroid="transparent"
                placeholder="Tittle"
                placeholderTextColor="grey"
                autoCapitalize="none"
                onChangeText={(announcementTitle) => this.setState({announcementTitle})}
                value={this.state.announcementTitle}
              />
            <TextInput
                style={styles.input}
                underlineColorAndroid="transparent"
                placeholder="Content"
                placeholderTextColor="grey"
                autoCapitalize="none"
                onChangeText={(announcementContent) => this.setState({announcementContent})}
                value={this.state.announcementContent}
              />
              <Pressable
                style={[styles.button, styles.buttonAnnounce]}
                onPress={() => this.postAnnouncement(this.state.announcementTitle, this.state.announcementContent)}
              >
                <Text style={styles.textStyle}>Announce</Text>
              </Pressable>
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => this.setModalVisible(!modalVisible)}
              >
                <Text style={styles.textStyle}>Close</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 22,
    backgroundColor:"#f8fafc"
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    marginBottom: 20,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "red",
  },
  buttonAnnounce: {
    backgroundColor: "blue",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  input: {
    padding: 10,
    margin: 15,
    height: 40,
    width: 150,
    borderColor: "#2196F3",
    borderWidth: 0.5,
  },
  welcomeText:{
      fontSize:20
  }
});
