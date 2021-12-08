import * as React from "react";
import { Text, View, Button, Alert } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/AntDesign";
import Firebase from "./src/config/firebase/firebase";

import { AuthContext } from "./context";

import { Search, ModalScreen, ListPost } from "./Screens";
import SignInScreen from "./src/screens/SignInScreen";
import SignUpScreen from "./src/screens/SignUpScreen";
import * as firebase from "firebase";

const screenOptions = (route, color) => {
  let iconName;
  switch (route.name) {
    case "AppHome":
      iconName = "home";
      break;
    case "Search":
      iconName = "setting";
    default:
      break;
  }
  return <Icon name={iconName} color={"black"} size={20} />;
};

export default function App() {
  const [user, setUser] = React.useState(null);
  const Tabs = createBottomTabNavigator();

  const RootStack = createStackNavigator();
  const AuthStack = createStackNavigator();
  const HomeStack = createStackNavigator();
  const SearchStack = createStackNavigator();

  const doSome=(uid, firstName, lastName, userEmail)=>{
    Firebase.firestore().collection("allusers").add({
      uid:uid,
      email: userEmail,
      firstName: firstName,
      lastName: lastName,
      datetime: new Date(),
      userRole:"customer"
    }).then((res)=>{
        console.log("User Creted in firestore");
    })
    .catch((error) =>{
        Alert.alert("Error creating user", [
          {
            text: "OK",
            onPress: () =>console.log(error),
            style: "cancel"
          },
        ]);
    });
  }
  


  const HomeStackScreen = () => {
    const { signOut } = React.useContext(AuthContext);

    return (
      <HomeStack.Navigator>
        <HomeStack.Screen
          name="Home"
          component={ListPost}
          options={{
            headerRight: () => (
              <Button
                style={{ backgrundColor: "blue" }}
                onPress={() => signOut()}
                title="Logout"
                color="#000"
              />
            ),
          }}
        />
        <HomeStack.Group screenOptions={{ presentation: "modal" }}>
          <HomeStack.Screen
            name="MyModal"
            component={ModalScreen}
            options={{ header: () => null }}
          />
        </HomeStack.Group>
      </HomeStack.Navigator>
    );
  };

  const SearchStackScreen = () => (
    <SearchStack.Navigator>
      <SearchStack.Screen name="Search" component={Search} />
    </SearchStack.Navigator>
  );

  const TabScreen = () => {
    return (
      <Tabs.Navigator
        initialRouteName="AppHome"
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color }) => screenOptions(route, color),
          headerShown: false,
        })}
      >
        {/* Registering all the screen in the app */}
        <Tabs.Screen name="AppHome" component={HomeStackScreen} color={"red"} />
        <Tabs.Screen
          name="Search"
          component={SearchStackScreen}
          color={"red"}
        />
      </Tabs.Navigator>
    );
  };
  // AuthStack Navigation
  const AuthStackScreen = () => {
    return (
      <AuthStack.Navigator>
        <AuthStack.Screen name="Signin" component={SignInScreen} />
        <AuthStack.Screen name="Signup" component={SignUpScreen} />
      </AuthStack.Navigator>
    );
  };

  // Appstack Navigation
  const RootStackScreen = ({ user }) => (
    <RootStack.Navigator>
      {user ? (
        // Main App flow
        <RootStack.Screen
          name="Tab"
          component={TabScreen}
          options={{
            headerShown: false,
            animationEnabled: false,
          }}
        />
      ) : (
        // Auth flow
        <RootStack.Screen
          name="Auth"
          component={AuthStackScreen}
          options={{
            animationEnabled: false,
            headerShown: false,
          }}
        />
      )}
    </RootStack.Navigator>
  );

  // State management using React hooks/ Context
  const authContext = React.useMemo(() => {
    return {
      users: () =>{

      }, 
      signIn: (props) => {
        Firebase.auth()
          .signInWithEmailAndPassword(props.emailAddress, props.password)
          .then((res) => {
            console.log("User logged-in  to firebase successfully!");
            // setUser(user);
            Firebase.auth().onAuthStateChanged(function (user) {
              if (user) {
                // User is signed in.
                setUser(user);
                console.log(user.uid);
              } else {
                // No user is signed in.
                setUser(null);
              }
            });
          })
          .catch((error) =>
          {
            Alert.alert(
              'Wrong credentials',
              '', // <- this part is optional, you can pass an empty string
              [
                {text: 'OK', onPress: () => console.log('OK Pressed')},
              ],
              {cancelable: false},
            );
            console.log("unable to login through fireabser", error)

          }
            
          );
      },
       
      signUp: (props) => {

          const isAdminComfirmed = props.isAdmin ? "Admin": "customer";
        Firebase.auth()
          .createUserWithEmailAndPassword(props.emailAddress, props.password)
          .then((res) => {

            Firebase.auth().onAuthStateChanged(function (user) {
              if (user) {
                // User is signed in.
                setUser(user);
                doSome(user.uid, user.firstName, user.lastName, user.email);
              } else {
                // No user is signed in.
                setUser(null);
              }
            });
            console.log("User account created & signed in!");
            Firebase.firestore().collection("allusers").add({
              datetime: firebase.firestore.FieldValue.serverTimestamp(),
              firstName: "No first name yet",
              lastName: "No last name yet",
              email: props.emailAddress,
              userRole: isAdminComfirmed
            });

          })
          .catch((error) => {
            if (error.code === "auth/email-already-in-use") {
              console.log("That email address is already in use!");
            }

            if (error.code === "auth/invalid-email") {
              console.log("That email address is invalid!");
            }

            console.error(error);
          });
      },
      signOut: () => {
        Alert.alert("Are you sure", "You want to logout?", [
          {
            text: "Cancel",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel",
          },
          {
            text: "OK",
            onPress: () =>
              Firebase.auth()
                .signOut()
                .then(() => console.log("User signed out!"), setUser(null))
                .catch((error) => console.log(error)),
          },
        ]);
      },
    };
  }, []);

  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer>
        <RootStackScreen user={user} />
      </NavigationContainer>
    </AuthContext.Provider>
  );
}
