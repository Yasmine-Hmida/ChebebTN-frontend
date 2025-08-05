import React, {useEffect} from "react";
import { router } from "expo-router";
import {StyleSheet , View , ActivityIndicator , Text} from "react-native";

export default function Index() {
  
  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/(auth)/Login')
    } , 1000);

    return (() => clearTimeout(timer));
  } , []);

  return (
    <View>
        <View style={style.container}>
            <Text style={style.title}>Welcome</Text>
            <Text style={style.subtitle}>Loading...</Text>
        </View>
        <ActivityIndicator size="large"
                           color="#007AFF"
                           style={style.loader}
        />
    </View>
  );
}

const style = StyleSheet.create({
    container: {
      flex:1,
      justifyContent: "center",
      alignContent: "center",
      backgroundColor: "#FFFFFF"
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
      color: "#1F41BB",
    },
    subtitle: {
      fontSize:16,
      color:"#666",
      marginBottom: 30,
    },
    loader:{
      marginTop:20
    }
});
