import React, { useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  Dimensions,
  StatusBar,
  TouchableOpacity,
  Alert
} from "react-native";
import { Ionicons } from "@expo/vector-icons"; // The eye icon
import { router } from "expo-router";

const { height, width } = Dimensions.get("window");

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [focusedInput, setFocusedInput] = useState("");
  const [showPassword , setShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  }

  const handleLogin = () => {
    if(!email || !password){
        Alert.alert('Error', 'Please fill all fields!')
        return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!emailRegex.test(email)){
        Alert.alert('Error', 'Invalid Email Format!')
        return;
    }

    if(email === "test@chebebtn.com" && password === "123456"){
        Alert.alert('Success', 'Successful Login!')
        router.replace("/(screens)/Home")
    }
    else{
        Alert.alert('Error', 'Invalid Email or Password!')
    }
  }

  const goToRegister = () => {
    router.push("/(auth)/Register")
  }

  return (
    <>
      <StatusBar barStyle="dark-content"/>
      <View style={style.container}>

        <View style={style.headerSection}>
          <Text style={style.mainText}>Login</Text>
          <Text style={style.welcomeText}>
            {" "}
            Welcome back to ChebebTN{"\n"} you&apos;ve been missed
          </Text>
        </View>

        <View style={style.formSection}>

            <View style={style.inputContainer}>
              <TextInput
                style={[
                  style.input,
                  focusedInput === "email" && style.inputFocused,
                ]} // If the currently focused input is "email", apply the inputFocused style.
                placeholder="Email"
                placeholderTextColor="#626262"
                value={email}
                onChangeText={setEmail}
                onFocus={() => setFocusedInput("email")}
                onBlur={() => setFocusedInput("")} // When the user leaves (or unfocuses) the input field, remove the focus style
              />
            </View>

            <View style={style.inputContainer}>
                <View style={style.passwordContainer}>
                    <TextInput
                        style={[
                        style.input,
                        focusedInput === "password" && style.inputFocused,
                        ]}
                        placeholder="Password"
                        placeholderTextColor="#626262"
                        value={password}
                        onChangeText={setPassword}
                        onFocus={() => setFocusedInput("password")}
                        onBlur={() => setFocusedInput("")}
                        secureTextEntry={!showPassword} // Only hide the text if showPassword is false
                    />

                    <TouchableOpacity style={style.eyeIcon} onPress={toggleShowPassword}>
                        <Ionicons name={showPassword? 'eye-off' : 'eye'}
                                  size= {width * 0.06}
                                  color="#626262"
                        />
                    </TouchableOpacity>
                </View>
            </View>

            <TouchableOpacity style={style.loginBtn} 
                              onPress={handleLogin} 
                              activeOpacity={0.8}
            >
                    <Text style={style.loginText}>Login</Text>
            </TouchableOpacity>

            <TouchableOpacity style={style.createAccountBtn} 
                              onPress={goToRegister} 
                              activeOpacity={0.8}
            >
                    <Text style={style.createAccountText}>Create a new account</Text>
            </TouchableOpacity>

          </View>

      </View>
    </>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  headerSection: {
    height: height * 0.4,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: width * 0.05, // Sets left and right padding of a component (equally)
  },
  mainText: {
    fontSize: width * 0.08,
    fontWeight: "bold",
    color: "#1F41BB",
    marginBottom: height * 0.02,
    textAlign: "center",
  },
  welcomeText: {
    fontSize: width * 0.05,
    color: "000000",
    textAlign: "center",
    lineHeight: height * 0.04,
    fontWeight: "600",
  },
  formSection: {
    height: height * 0.6,
    paddingHorizontal: width * 0.08,
    paddingTop: height * 0.05,
  },
  inputContainer: {
    marginBottom: height * 0.03,
  },
  input: {
    height: height * 0.08,
    width: width * 0.84,
    backgroundColor: "#F1F4FF",
    borderRadius: width * 0.025,
    paddingHorizontal: width * 0.05,
    fontSize: width * 0.04,
    color: "#626262",
    borderWidth: 1,
    borderColor: "#1F41BB",
  },
  inputFocused: {
    borderWidth: 3,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: "center",
    width:width * 0.84
  },
  eyeIcon: {
    position: "absolute",
    right: width * 0.03,
    height: height * 0.08,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: width * 0.02,
  },
  loginBtn: {
    height: height * 0.075,
    width: width * 0.84,
    backgroundColor: "#1F41BB",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: height * 0.04,
    shadowColor: "#1F41BB",
    shadowOffset: {     // Controls how far the shadow is offset from the component
        width: 0,
        height: height * 0.005
    },
    shadowOpacity: 0.3, // Controls how transparent the shadow is
    shadowRadius: width * 0.02,
    elevation: 8,       // How strong the shadow is
    borderRadius: width * 0.025
  },
  loginText: {
    color: "#FFFFFF",
    fontSize: width * 0.05,
    fontWeight: "bold"
  },
  createAccountBtn: {
    alignItems: "center",
    marginTop: height * 0.02,
  },
  createAccountText: {
    fontSize: width * 0.035,
    color: "#494949",
    fontWeight: "600",
  },
});
