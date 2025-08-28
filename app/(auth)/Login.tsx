import React, { useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  Dimensions,
  StatusBar,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons"; // Where The eye icon comes from
import { router } from "expo-router";

import AsyncStorage from "@react-native-async-storage/async-storage"; // AsyncStorage = LocalStorage in mobile version to store the token
import axios from "axios"; // For fetching URLs (more secure that a regular fetch)

const { height, width } = Dimensions.get("window"); // For a responsive styling based on the window dimensions

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [focusedInput, setFocusedInput] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please Fill all Fields!");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Error", "Invalid Email Format!");
      return;
    }

    // Call the Backend
    try {
      // Fetch the API: Send a HTTP POST request to the Backend
      // 10.0.2.2: Only works on android studio (We do NOT put the keyword "localhost")
      const response = await axios.post("http://10.0.2.2:3000/api/login", {
        email, // This the request body that contains the email and password to verify in the backend
        password,
      });

      // Verify our response
      if (response.status === 200) {
        const { token, userId, role } = response.data.result; // From the response get the token, userId and the role

        // Save in AsyncStorage
        await AsyncStorage.setItem("token", token);
        await AsyncStorage.setItem("userId", userId);
        await AsyncStorage.setItem("role", role);

        Alert.alert(
          "Success",
          "Login Done Successfully , Welcome to chebebTN!"
        );

        setTimeout(() => {
          router.push("/(screens)/Home");
        }, 2000);
      }
    } catch (err: any) {
      console.log("Login Error: ", err);

      // We do this checking here because axios goes to this catch bloc if the res'status is not 200 or 201
      if (err.response && err.response.status < 500) {
        Alert.alert("Error", "Email or Password Incorrect!");
      } else {
        Alert.alert("Error", "Login Failed due to a Network or Server error!");
      }
    }
  };

  const goToRegister = () => {
    router.push("/(auth)/Register");
  };

  return (
    <>
      <StatusBar barStyle="dark-content" />

      <View style={style.container}>
        <View style={style.headerSection}>
          <Text style={style.mainText}>Sign In</Text>
          <Text style={style.welcomeText}>
            {" "}
            Welcome Back to{" "}
            <Text style={[style.welcomeText, style.welcomeMainText]}>
              ChebebTN
            </Text>
            {"\n"}
            You&apos;ve been Missed
          </Text>
        </View>

        <View style={style.formSection}>
          <View style={style.inputContainer}>
            <TextInput
              style={[
                style.input,
                focusedInput === "email" && style.inputFocused,
              ]} // If the Currently focused input is "email", apply the "inputFocused" style
              placeholder="Email"
              placeholderTextColor="#000000"
              value={email}
              onChangeText={setEmail}
              onFocus={() => setFocusedInput("email")}
              onBlur={() => setFocusedInput("")} // When the user leaves (or unfocuses) the input field, remove the "inputFocused" style
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
                placeholderTextColor="#000000"
                value={password}
                onChangeText={setPassword}
                onFocus={() => setFocusedInput("password")}
                onBlur={() => setFocusedInput("")}
                secureTextEntry={!showPassword} // Only hide the text if showPassword is false
              />

              <TouchableOpacity
                style={style.eyeIcon}
                onPress={toggleShowPassword}
              >
                <Ionicons
                  name={showPassword ? "eye-off" : "eye"}
                  size={width * 0.06}
                  color="#800e13"
                />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            style={style.loginBtn}
            onPress={handleLogin}
            activeOpacity={0.8}
          >
            <Text style={style.loginText}>Sign In</Text>
          </TouchableOpacity>

          {/* Or Sign In with Google or facebook section */}
          <View>
            <View style={style.orContainer}>
              <View style={style.line} />
              <Text style={style.text}>Or</Text>
              <View style={style.line} />
            </View>
          </View>

          <View style={style.outsideIcons}>
            <TouchableOpacity style={style.outsideIcon} activeOpacity={0.7}>
              <Ionicons
                name="logo-google"
                size={width * 0.11}
                color="#800e13"
              />
            </TouchableOpacity>
            <TouchableOpacity style={style.outsideIcon} activeOpacity={0.7}>
              <Ionicons
                name="logo-facebook"
                size={width * 0.11}
                color="#800e13"
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={style.createAccountBtn}
            onPress={goToRegister}
            activeOpacity={0.8} // Controls how much the button fades (becomes transparent) when the user presses it
          >
            <Text style={style.createAccountText}>
              Don&apos;t have an account?{" "}
              <Text style={style.createAccountTextLink}>Sign Up</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f6ededff",
  },
  headerSection: {
    height: height * 0.3,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: width * 0.05, // Sets left and right padding of a component equally
  },
  mainText: {
    fontFamily: "DosisExtraBold",
    fontSize: width * 0.08,
    color: "#640d14",
    marginBottom: height * 0.02,
    textAlign: "center",
  },
  welcomeText: {
    fontFamily: "DosisRegular",
    fontSize: width * 0.06,
    color: "#000000",
    textAlign: "center",
    lineHeight: height * 0.04,
  },
  welcomeMainText: {
    fontFamily: "DosisExtraBold",
    color: "#800e13",
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
    backgroundColor: "#f7dedfc7",
    borderRadius: width * 0.025,
    paddingHorizontal: width * 0.05,
    fontFamily: "DosisMedium",
    fontSize: width * 0.045,
    color: "black",
    borderWidth: 1,
    borderColor: "#800e13",
  },
  inputFocused: {
    borderWidth: 3,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: width * 0.84,
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
    backgroundColor: "#800e13",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: height * 0.04,
    shadowColor: "#800e13",
    shadowOffset: {
      // Tells the Component where the shadow should be placed horizontally(width) and vertically(height)
      width: 0,
      height: height * 0.005,
    },
    shadowOpacity: 0.3, // Controls how transparent the shadow is
    shadowRadius: width * 0.02, // Controls how blurry(large value) or sharp(low value) the shadow looks.
    elevation: 8, // When it's a large value, the button looks like it's floating on the screen
    borderRadius: width * 0.025,
  },
  loginText: {
    color: "#FFFFFF",
    fontSize: width * 0.06,
    fontFamily: "DosisBold",
  },
  createAccountBtn: {
    alignItems: "center",
    marginTop: height * 0.02,
  },
  createAccountText: {
    fontSize: width * 0.038,
    color: "#494949",
    fontFamily: "DosisMedium",
  },
  createAccountTextLink: {
    fontSize: width * 0.04,
    color: "#800e13",
    fontFamily: "DosisBold",
  },
  orContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#640d14",
  },
  text: {
    marginHorizontal: 10,
    fontSize: 20,
    fontFamily: "DosisBold",
    color: "#800e13",
  },
  outsideIcons: {
    marginTop: 10,
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  outsideIcon: {
    marginHorizontal: 15
  }
});
