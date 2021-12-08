import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  FlatList,
  ActivityIndicator,
  Modal,
  Alert,
  TextInput,
  Pressable,
} from "react-native";
import Firebase from "./src/config/firebase/firebase";
import ActionButton from "react-native-action-button";
import { Ionicons } from "@expo/vector-icons";
import { AuthContext } from "./context";

const ScreenContainer = ({ children }) => (
  <View style={styles.container}>{children}</View>
);

export const Home = ({ navigation }) => {
  const { signOut } = React.useContext(AuthContext);

  return (
    <ScreenContainer>
      <Text>Master List Screen on number</Text>
      <Button
        title="React Native by Example"
        onPress={() =>
          navigation.push("Details", { name: "React Native by Example " })
        }
      />
      <Button
        title="React Native School"
        onPress={() =>
          navigation.push("Details", { name: "React Native School" })
        }
      />
      <Button title="SignOut" onPress={() => signOut()} />
    </ScreenContainer>
  );
};
export const Details = ({ route }) => (
  <ScreenContainer>
    <Text>Details Screen</Text>
    {route.params.name && <Text>{route.params.name}</Text>}
  </ScreenContainer>
);

export const Search = ({ navigation }) => (
  <ScreenContainer>
    <Text>Search Screen</Text>
    <Button title="Search 2" onPress={() => navigation.push("Search2")} />
    <Button
      title="React Native School"
      onPress={() => {
        navigation.navigate("Home", {
          screen: "Details",
          params: { name: "React Native School" },
        });
      }}
    />
  </ScreenContainer>
);

export const Search2 = () => (
  <ScreenContainer>
    <Text>Search2 Screen</Text>
  </ScreenContainer>
);

export const Profile = ({ navigation }) => {
  const { signOut } = React.useContext(AuthContext);

  return (
    <ScreenContainer>
      <Text>Profile Screen</Text>
      <Button title="Drawer" onPress={() => navigation.toggleDrawer()} />
      <Button title="Sign Out" onPress={() => signOut()} />
    </ScreenContainer>
  );
};

export const Splash = () => (
  <ScreenContainer>
    <Text>Loading...</Text>
  </ScreenContainer>
);

export const SignIn = ({ navigation }) => {
  const { signIn } = React.useContext(AuthContext);

  return (
    <ScreenContainer>
      <Text>Sign In Screen</Text>
      <Button title="Sign In" onPress={() => signIn()} />
      <Button
        title="Create Account"
        onPress={() => navigation.push("CreateAccount")}
      />
    </ScreenContainer>
  );
};

export const CreateAccount = () => {
  const { signUp } = React.useContext(AuthContext);

  return (
    <ScreenContainer>
      <Text>Create Account Screen</Text>
      <Button title="Sign Up" onPress={() => signUp()} />
    </ScreenContainer>
  );
};

export const ListPost = ({ navigation }) => {
  // const { user } = React.useContext(AuthContext);
  const [loading, setLoading] = useState(true); // Set loading to true on component mount
  const [messages, setMessages] = useState([]); // Initial empty array of messages

  useEffect(() => {
    const subscriber = Firebase.firestore()
      .collection("messages")
      .onSnapshot((querySnapshot) => {
        const messages = [];
        querySnapshot.forEach((documentSnapshot) => {
          messages.push({
            ...documentSnapshot.data(),
            key: documentSnapshot.id,
          });
        });

        setMessages(messages);
        setLoading(false);
      });

    // Unsubscribe from events when no longer in use
    return () => subscriber();
  }, []);
  if (loading) {
    return <ActivityIndicator />;
  }
  Firebase.firestore()
    .collection("allusers")
    .where("email", "==" ,Firebase.auth().currentUser.email)
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach(() => {
        console.log(doc.id, "=>", doc.data());
      });
    });

  return (
    <View>
      <Text>{Firebase.auth().currentUser.email}</Text>
      <FlatList
        data={messages}
        contentContainerStyle={{ paddingBottom: 20 }}
        renderItem={({ item }) => (
          <View
            style={{
              height: 50,
              flex: 1,
              alignItems: "left",
              justifyContent: "center",
              paddingLeft: "10%",
              marginBottom: "10%",
            }}
          >
            <Text style={{ color: "#000" }}>{item.title}</Text>
            <Text style={{ color: "#808080" }}>{item.content}</Text>
          </View>
        )}
      />
      <ActionButton buttonColor="#000">
        <ActionButton.Item
          buttonColor="black"
          title="Add post"
          onPress={() => navigation.navigate("MyModal")}
        >
          <Ionicons name="md-checkmark-circle" size={32} color="green" />
        </ActionButton.Item>
      </ActionButton>
    </View>
  );
};

export const ModalScreen = ({ navigation }) => {
  const [title, setTitle] = useState(""); // Set loading to true on component mount
  const [content, setContent] = useState(""); // Initial empty array of messages

  const postAnnouncement = (title, content) => {
    if (title === "" || content === "" || !title || !content) {
      Alert.alert(
        "Error",
        "Please Enter A tittle and a content to post",
        [{ text: "OK", onPress: () => console.log("Cancel Pressed!") }],
        { cancelable: false }
      );
    } else {
      Firebase.firestore()
        .collection("messages")
        .add({
          title: title,
          content: content,
          datetime: new Date(),
        })
        .then(() => {
          console.log("Annouced");
          navigation.goBack();
        })
        .catch((error) => {
          // console.log(error)
          Alert.alert("Error posting announcment", [
            {
              text: "OK",
              onPress: () => console.log(error),
              style: "cancel",
            },
          ]);
        });
    }
  };
  return (
    <View style={styles.modalView}>
      <Text>Announce</Text>
      <TextInput
        style={styles.input}
        underlineColorAndroid="transparent"
        placeholder="Tittle"
        placeholderTextColor="grey"
        autoCapitalize="none"
        onChangeText={(title) => setTitle(title)}
        value={title}
      />
      <TextInput
        style={styles.input}
        underlineColorAndroid="transparent"
        placeholder="Content"
        placeholderTextColor="grey"
        autoCapitalize="none"
        onChangeText={(content) => setContent(content)}
        value={content}
      />
      <Pressable
        style={[styles.button, styles.buttonAnnounce]}
        onPress={() => postAnnouncement(title, content)}
      >
        <Text style={styles.textStyle}>Announce</Text>
      </Pressable>
      <Pressable
        style={[styles.button, styles.buttonClose]}
        onPress={() => navigation.goBack()}
        title="Dismiss"
      >
        <Text style={styles.textStyle}>Close</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginVertical: 10,
    borderRadius: 5,
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
    margin: 0,
    height: "100%",
    backgroundColor: "white",
    padding: 35,
    alignItems: "center",
  },
  button: {
    borderRadius: 20,
    padding: 10,
    marginBottom: 20,
    elevation: 2,
    width: "80%",
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
    height: 70,
    width: "100%",
    borderColor: "#2196F3",
    borderWidth: 0.5,
  },
  welcomeText: {
    fontSize: 20,
  },
});
