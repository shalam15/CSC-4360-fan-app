import * as React from 'react';
import { Text, View , Button, Alert} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from "./src/screens/Home"
import Icon from 'react-native-vector-icons/AntDesign'
import Firebase from './src/config/firebase/firebase'
const screenOptions = (route, color) => {
  let iconName;

  switch (route.name) {
    case 'Home':
      iconName = 'home';
      break;
    default:
      break;
  }
  return <Icon name={iconName} color={"black"} size={20} />;
};

function HomeScreen() {
  return (
    // <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Home></Home>
    // </View>
  );
}
function SettingsScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Settings!</Text>
    </View>
  );
}
function createTwoButtonAlert(){
  Alert.alert(
    "Are you sure",
    "You want to logout?",
    [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel"
      },
      { text: "OK", onPress: () => 
        Firebase.auth()
        .signOut()
        .then(() => console.log('User signed out!'))
        .catch(error => console.log(error))

      
      }
        
    ]
  );
  
}
const Tab = createBottomTabNavigator();
export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({color}) => screenOptions(route, color),
      })}
      >
        <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{
          // props => <LogoTitle {...props}
          headerTitle: "Home",
          headerRight: () => (
            <Button style={{backgrundColor:"blue"}}
              onPress={() => createTwoButtonAlert()}
              title="Logout"
              color="#000"
            />
          ),
        }}
        />
        {/* <Tab.Screen name="Settings" component={SettingsScreen}  color={"red"}/> */}
      </Tab.Navigator>
    </NavigationContainer>
  );
}
