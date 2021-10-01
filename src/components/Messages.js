import React, { useState, useEffect } from "react";
import { ActivityIndicator, FlatList, View, Text } from "react-native";
import Firebase from "../config/firebase/firebase";

export default function Messages() {
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


  
  return (
    
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
  );



}