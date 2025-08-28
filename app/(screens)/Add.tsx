import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import {
  Alert,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import axios, { AxiosError } from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { Dropdown } from "react-native-element-dropdown";

const { width, height } = Dimensions.get("window");

const AddJob: React.FC = () => {
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    description: "",
    location: "",
    salary: "",
    jobType: "",
    experienceLevel: "",
    skills: "",
    applicationDeadline: "",
    status: "Open",
  });
  const [focusedInput, setFocusedInput] = useState("");

  // Levels of Expertise allowed
  const levels = [
    { label: "Entry", value: "Entry" },
    { label: "Mid", value: "Mid" },
    { label: "Senior", value: "Senior" },
  ];

  // Job Types allowed
  const jobTypes = [
    { label: "Full-time", value: "Full-time" },
    { label: "Part-time", value: "Part-time" },
    { label: "Contract", value: "Contract" },
    { label: "Internship", value: "Internship" },
  ];

  // Statuses allowed
  const status = [
    { label: "Open", value: "Open" },
    { label: "Closed", value: "Closed" },
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      // Validate Inputs
      const requiredFields: (keyof typeof formData)[] = [
        "title",
        "company",
        "description",
        "location",
        "salary",
        "jobType",
        "experienceLevel",
        "applicationDeadline",
        "status",
      ];
      for (const field of requiredFields) {
        if (!formData[field]) {
          Alert.alert("Error", `The ${field} is required!`);
          return;
        }
      }

      const salary = parseFloat(formData.salary);
      if (isNaN(salary)) {
        Alert.alert("Error", "Salary has to be a valid number!");
        return;
      }

      // Convert skills in array
      const skills = formData.skills
        .split(",")
        .map((skill) => skill.trim())
        .filter((skill) => skill);

      // Verify deadline
      const deadline = new Date(formData.applicationDeadline);
      if (isNaN(deadline.getTime())) {
        Alert.alert(
          "Error",
          "The Deadline has to be a valid date (YYYY-MM-DD)"
        );
        return;
      }

      // Retrieve the token
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Error", "No token found!");
        return;
      }

      // Send the POST Request
      await axios.post(
        "http://10.0.2.2:3000/api/jobs",
        {
          title: formData.title,
          company: formData.company,
          description: formData.description,
          location: formData.location,
          salary: salary,
          jobType: formData.jobType,
          experienceLevel: formData.experienceLevel,
          skills: skills,
          applicationDeadline: formData.applicationDeadline,
          status: formData.status,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      Alert.alert("Success", "Job Added Successfully!", [
        {
          text: "OK",
          onPress: () => router.push("/(screens)/Home"),
        },
      ]);
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>;
      Alert.alert(
        "Error",
        err.response?.data?.message || "Unable to add the Job!"
      );
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={25} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add a new Job</Text>
      </View>

      <View style={styles.formContainer}>
        <TextInput
          style={[
            styles.input,
            focusedInput === "title" && styles.inputFocused,
          ]}
          placeholder="Title"
          value={formData.title}
          onChangeText={(text) => handleInputChange("title", text)}
          placeholderTextColor="#333"
          onFocus={() => setFocusedInput("title")}
          onBlur={() => setFocusedInput("")}
        />
        <TextInput
          style={[
            styles.input,
            focusedInput === "company" && styles.inputFocused,
          ]}
          placeholder="Company"
          value={formData.company}
          onChangeText={(text) => handleInputChange("company", text)}
          placeholderTextColor="#333"
          onFocus={() => setFocusedInput("company")}
          onBlur={() => setFocusedInput("")}
        />
        <TextInput
          style={[styles.input, styles.textArea , focusedInput === "description" && styles.inputFocused,]}
          placeholder="Description"
          value={formData.description}
          onChangeText={(text) => handleInputChange("description", text)}
          multiline
          numberOfLines={4}
          placeholderTextColor="#333"
          onFocus={() => setFocusedInput("description")}
          onBlur={() => setFocusedInput("")}
        />
        <TextInput
          style={[
            styles.input,
            focusedInput === "location" && styles.inputFocused,
          ]}
          placeholder="Location"
          value={formData.location}
          onChangeText={(text) => handleInputChange("location", text)}
          placeholderTextColor="#333"
          onFocus={() => setFocusedInput("location")}
          onBlur={() => setFocusedInput("")}
        />
        <TextInput
          style={[
            styles.input,
            focusedInput === "salary" && styles.inputFocused,
          ]}
          placeholder="Salary"
          value={formData.salary}
          onChangeText={(text) => handleInputChange("salary", text)}
          keyboardType="numeric"
          placeholderTextColor="#333"
          onFocus={() => setFocusedInput("salary")}
          onBlur={() => setFocusedInput("")}
        />

        {/* Job Type Dropdown */}
        <Dropdown
          style={[
            styles.input,
            focusedInput === "jobType" && styles.inputFocused,
          ]}
          data={jobTypes}
          labelField="label"
          valueField="value"
          placeholder="Job Type"
          placeholderStyle={{
            color: "#000",
            fontSize: width * 0.045,
            fontFamily: "DosisMedium",
          }}
          containerStyle={[styles.input, { borderRadius: width * 0.02 }]}
          selectedTextStyle={{
            color: "#000",
            fontFamily: "DosisMedium",
            fontSize: width * 0.042,
          }}
          itemTextStyle={{
            color: "#800e13",
            fontSize: width * 0.045,
            fontFamily: "DosisBold",
          }} // Dropdown Items
          value={formData.jobType}
          onChange={(item) => handleInputChange("jobType", item.value)}
          onFocus={() => setFocusedInput("jobType")}
          onBlur={() => setFocusedInput("")}
        />

        {/* Level of Expertise Dropdown */}
        <Dropdown
          style={[
            styles.input,
            focusedInput === "levelExpertise" && styles.inputFocused,
          ]}
          data={levels}
          labelField="label"
          valueField="value"
          placeholder="Level of Expertise"
          placeholderStyle={{
            color: "#000",
            fontSize: width * 0.045,
            fontFamily: "DosisMedium",
          }}
          containerStyle={[styles.input, { borderRadius: width * 0.02 }]}
          selectedTextStyle={{
            color: "#000",
            fontFamily: "DosisMedium",
            fontSize: width * 0.042,
          }}
          itemTextStyle={{
            color: "#800e13",
            fontSize: width * 0.045,
            fontFamily: "DosisBold",
          }} // Dropdown Items
          value={formData.experienceLevel}
          onChange={(item) => handleInputChange("experienceLevel", item.value)}
          onFocus={() => setFocusedInput("levelExpertise")}
          onBlur={() => setFocusedInput("")}
        />

        <TextInput
          style={[
            styles.input,
            focusedInput === "skills" && styles.inputFocused,
          ]}
          placeholder="Skills (',' separated)"
          value={formData.skills}
          onChangeText={(text) => handleInputChange("skills", text)}
          placeholderTextColor="#333"
          onFocus={() => setFocusedInput("skills")}
          onBlur={() => setFocusedInput("")}
        />
        <TextInput
          style={[
            styles.input,
            focusedInput === "deadline" && styles.inputFocused,
          ]}
          placeholder="Deadline (YYYY-MM-DD)"
          value={formData.applicationDeadline}
          onChangeText={(text) =>
            handleInputChange("applicationDeadline", text)
          }
          placeholderTextColor="#333"
          onFocus={() => setFocusedInput("deadline")}
          onBlur={() => setFocusedInput("")}
        />

        {/* Status Dropdown */}
        <Dropdown
          style={[
            styles.input,
            focusedInput === "status" && styles.inputFocused,
          ]}
          data={status}
          labelField="label"
          valueField="value"
          placeholder="Status"
          placeholderStyle={{
            color: "#000",
            fontSize: width * 0.045,
            fontFamily: "DosisMedium",
          }}
          containerStyle={[styles.input, { borderRadius: width * 0.02 }]}
          selectedTextStyle={{
            color: "#000",
            fontFamily: "DosisMedium",
            fontSize: width * 0.042,
          }}
          itemTextStyle={{
            color: "#800e13",
            fontSize: width * 0.045,
            fontFamily: "DosisBold",
          }} // Dropdown Items
          value={formData.status}
          onChange={(item) => handleInputChange("status", item.value)}
          onFocus={() => setFocusedInput("status")}
          onBlur={() => setFocusedInput("")}
        />

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Add job</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffffd1",
  },
  header: {
    paddingTop: height * 0.06,
    paddingHorizontal: width * 0.05,
    paddingBottom: height * 0.025,
    backgroundColor: "#800e13",
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: height * 0.01,
  },

  headerTitle: {
    fontSize: width * 0.065,
    fontFamily: "DosisBold",
    color: "white",
    textAlign: "center",
    flex: 1,
  },
  formContainer: {
    paddingHorizontal: width * 0.05,
    paddingVertical: height * 0.02,
  },
  input: {
    backgroundColor: "#f6ededff",
    borderRadius: width * 0.03,
    borderWidth: 1,
    borderColor: "#800e13",
    padding: width * 0.04,
    marginBottom: height * 0.02,
    fontSize: width * 0.042,
    fontFamily: "DosisMedium",
    color: "#000",
    elevation: 2,
    shadowColor: "#800e13",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  inputFocused: {
    // use it lateer
    borderWidth: 3,
  },
  textArea: {
    height: height * 0.15,
    textAlignVertical: "top",
  },
  submitButton: {
    backgroundColor: "#800e13",
    paddingVertical: height * 0.015,
    marginBottom: 10,
    borderRadius: width * 0.03,
    alignItems: "center",
    shadowColor: "#800e13",
    shadowOffset: {
      width: 0,
      height: height * 0.005,
    },
    shadowOpacity: 0.3,
    shadowRadius: width * 0.02,
    elevation: 8,
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontSize: width * 0.05,
    fontFamily: "DosisBold",
  },
});

export default AddJob;
