import { Ionicons } from "@expo/vector-icons"; // Icons
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Dimensions,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import axios from "axios";

const { width, height } = Dimensions.get("window");

// A TypeScript Interface to define the structure of our form
interface FormData {
  username: string;
  email: string;
  password: string;
  repeatPassword: string;
}

// Our Register Component
const RegisterScreen = () => {
  // A State to stock all the data from the form
  const [formData, setFormData] = useState<FormData>({
    username: "",
    email: "",
    password: "",
    repeatPassword: "",
  });
  const [isAdmin, setIsAdmin] = useState(false);
  const [focusedInput, setFocusedInput] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  /**
   * A generic function to update any form field from "formData"
   * @param field - The name of the field to be modified
   * @param value - The new Value
   */
  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  /**
   * Form Validation Function
   * @returns true if all is valid, otherwise false
   */
  const validateForm = (): boolean => {
    const { username, email, password, repeatPassword } = formData; // Destructuring

    // Verify if any field is empty
    if (!username || !email || !password || !repeatPassword) {
      Alert.alert("Error", "Please Fill all the Fields!");
      return false;
    }

    // Verify the Username Length (At least 2 Characters)
    if (username.length < 2) {
      Alert.alert("Error", "The Username must contain at least 2 characters!");
      return false;
    }

    // Verify the Email Format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Error", "Invalid Email Format!");
      return false;
    }

    // Verify the Password Length (At least 8 characters)
    if (password.length < 8) {
      Alert.alert("Error", "The Password must contain at least 8 Characters!");
      return false;
    }
    // Verify if the password contains at least one capital letter
    const capitalLetterRegex = /[A-Z]/;
    if (!capitalLetterRegex.test(password)) {
      Alert.alert(
        "Error",
        "The Password must contain at least one capital letter"
      );
      return false;
    }

    // Verify the matching passwords
    if (password !== repeatPassword) {
      Alert.alert("Error", "Passwords do not match!");
      return false;
    }

    return true;
  };

  /**
   * Registration function
   */
  const handleRegister = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      const response = await axios.post("http://10.0.2.2:3000/api/register", {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        repeatPassword: formData.repeatPassword,
        role: isAdmin ? "Admin" : "Job Seeker",
      });

      if (response.status === 200) {
        Alert.alert(
          "Success",
          `Registered Successfully ${formData.username} , Your new Account is Saved !`,
          [
            {
              text: "OK",
              onPress: () => router.push("/(auth)/Login"),
            },
          ]
        );
      } else {
        Alert.alert("Error", response.data.message || "Failed to Register!");
      }
    } catch (err: any) {
      if (err.response && err.response.status === 400) {
        Alert.alert(
          "Error",
          err.response.data.message || "Failed to Register!"
        );
      }
      else{
        console.log("Error: ", err);
        Alert.alert("Error", "Register Error");
      }
    }
  };

  /**
   * Redirection to the Login Page
   */
  const goToLogin = () => {
    router.push("/(auth)/Login");
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const toggleAdminCheckbox = () => {
    setIsAdmin(!isAdmin);
  };

  return (
    <>
      <StatusBar barStyle="dark-content" />

      <View style={styles.container}>

        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {/* Header Section */}
          <View style={styles.headerSection}>
            <Text style={styles.mainTitle}>Join ChebebTN</Text>
            <Text style={styles.welcomeText}>Create Your Account</Text>
          </View>

          {/* Form Section */}
          <View style={styles.formSection}>

            {/* Username Input */}
            <View style={styles.inputContainer}>
              <TextInput
                style={[
                  styles.input,
                  focusedInput === "name" && styles.inputFocused,
                ]}
                placeholder="Username"
                placeholderTextColor="#626262"
                value={formData.username}
                onChangeText={(value) => handleInputChange("username", value)}
                onFocus={() => setFocusedInput("name")}
                onBlur={() => setFocusedInput("")}
                autoCapitalize="words" // Controls how the text input capitalizes letters automatically while typing
                autoComplete="name"    // Helps the user type less by suggesting stored names
              />
            </View>

            {/* Email Input */}
            <View style={styles.inputContainer}>
              <TextInput
                style={[
                  styles.input,
                  focusedInput === "email" && styles.inputFocused,
                ]}
                placeholder="Email"
                placeholderTextColor="#626262"
                value={formData.email}
                onChangeText={(value) => handleInputChange("email", value)}
                onFocus={() => setFocusedInput("email")}
                onBlur={() => setFocusedInput("")}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
              />
            </View>

            {/* Password Input */}
            <View style={styles.inputContainer}>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={[
                    styles.input,
                    focusedInput === "password" && styles.inputFocused,
                    styles.passwordInput,
                  ]}
                  placeholder="Password (min: 8 Characterss)"
                  placeholderTextColor="#626262"
                  value={formData.password}
                  onChangeText={(value) => handleInputChange("password", value)}
                  onFocus={() => setFocusedInput("password")}
                  onBlur={() => setFocusedInput("")}
                  secureTextEntry={!showPassword}
                  autoComplete="password-new"
                />
                <TouchableOpacity
                  style={styles.eyeIcon}
                  onPress={toggleShowPassword}
                >
                  <Ionicons
                    name={showPassword ? "eye-off" : "eye"}
                    size={width * 0.06}
                    color="#626262"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* repeatPassword Input */}
            <View style={styles.inputContainer}>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={[
                    styles.input,
                    focusedInput === "confirmPassword" && styles.inputFocused,
                    styles.passwordInput,
                  ]}
                  placeholder="Confirm Password"
                  placeholderTextColor="#626262"
                  value={formData.repeatPassword}
                  onChangeText={(value) =>
                    handleInputChange("repeatPassword", value)
                  }
                  onFocus={() => setFocusedInput("confirmPassword")}
                  onBlur={() => setFocusedInput("")}
                  secureTextEntry={!showConfirmPassword}
                />
                <TouchableOpacity
                  style={styles.eyeIcon}
                  onPress={toggleShowConfirmPassword}
                >
                  <Ionicons
                    name={showConfirmPassword ? "eye-off" : "eye"}
                    size={width * 0.06}
                    color="#626262"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Admin Checkbox */}
            <View style={styles.checkboxContainer}>
              <TouchableOpacity
                style={styles.checkbox}
                onPress={toggleAdminCheckbox}
              >
                <Ionicons
                  name={isAdmin ? "checkbox" : "square-outline"}
                  size={width * 0.06}
                  color={isAdmin ? "#1F41BB" : "#626262"}
                />
              </TouchableOpacity>
              <Text style={styles.checkboxLabel}>I&apos;m an admin</Text>
            </View>

            {/* Register Button */}
            <TouchableOpacity
              style={styles.signInButton}
              onPress={handleRegister}
              activeOpacity={0.8}
            >
              <Text style={styles.signInButtonText}>Register</Text>
            </TouchableOpacity>

            {/* Go to Login */}
            <TouchableOpacity
              style={styles.createAccountContainer}
              onPress={goToLogin}
            >
              <Text style={styles.createAccountText}>
                Already have an account ? Login
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF", 
  },

  // ScrollView for scrolling
  scrollContainer: {
    flexGrow: 1, // Expand to take up all remaining space if possible
  },

  // Header Section
  headerSection: {
    height: height * 0.3, // 30% of the window height
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: width * 0.05
  },

  // Title: "Join ChebebTN"
  mainTitle: {
    fontSize: width * 0.08,
    fontWeight: "bold",
    color: "#1F41BB",
    marginBottom: height * 0.03, 
    textAlign: "center",
  },

  // "Create Your Account" message
  welcomeText: {
    fontSize: width * 0.05, 
    color: "#000000",
    textAlign: "center",
    lineHeight: height * 0.04,
    fontWeight: "500",
  },

  // Form Section
  formSection: {
    height: height * 0.6, 
    paddingHorizontal: width * 0.08,
  },

  // Input Containers
  inputContainer: {
    marginBottom: height * 0.03,
  },

  // TextInputs
  input: {
    height: height * 0.08, 
    width: width * 0.84, 
    backgroundColor: "#F1F4FF",
    borderRadius: width * 0.025, 
    paddingHorizontal: width * 0.05, 
    fontSize: width * 0.04,
    color: "black",
    borderWidth: 1, 
    borderColor: "#1F41BB",
  },

  // When Input is focused on
  inputFocused: {
    borderWidth: 3,
  },

  // Password Container
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: width * 0.84,
  },

  // The Password Input
  passwordInput: {
    flex: 1,
  },

  // Eye Icon
  eyeIcon: {
    position: "absolute",
    right: width * 0.03,
    height: height * 0.08,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: width * 0.02,
  },

  // Register Button
  signInButton: {
    height: height * 0.075,
    width: width * 0.84, 
    backgroundColor: "#1F41BB", 
    borderRadius: width * 0.025, 
    justifyContent: "center",
    alignItems: "center",
    marginBottom: height * 0.04,
    shadowColor: "#1F41BB",
    shadowOffset: {
      width: 0,
      height: height * 0.005, // Shadow Height
    },
    shadowOpacity: 0.3,
    shadowRadius: width * 0.02,
    elevation: 8, // Shadow in Android
  },

  // Register Text
  signInButtonText: {
    color: "#FFFFFF",
    fontSize: width * 0.05, 
    fontWeight: "bold",
  },

  // Container for the link "Already have an account ? Login"
  createAccountContainer: {
    alignItems: "center",
    marginTop: height * 0.01, // 1.5% de la hauteur pour l'espacement
  },

  // Link to the Login Page
  createAccountText: {
    fontSize: width * 0.035, 
    color: "#494949",
    fontWeight: "400",
  },
  // Container pour le checkbox
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: height * 0.03,
  },

  // Style pour le checkbox personnalisé
  checkbox: {
    width: width * 0.06,
    height: width * 0.06,
    justifyContent: "center",
    alignItems: "center",
  },

  // Style pour le label du checkbox
  checkboxLabel: {
    fontSize: width * 0.04,
    color: "black",
    marginLeft: width * 0.02,
  },
});

export default RegisterScreen;
