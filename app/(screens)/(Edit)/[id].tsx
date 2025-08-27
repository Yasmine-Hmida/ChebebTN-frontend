import React, { useState, useEffect } from "react";
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
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");

// Interface Job
interface Job {
  _id: string;
  title: string;
  company: string;
  description: string;
  salary: number;
  location: string;
  jobType: string;
  status: string;
  experienceLevel: string;
  skills: string[];
  applicationDeadline: string;
  postedBy?: string;
  createdAt: string;
  updatedAt: string;
  applications: { userId: string; appliedAt: string; _id: string }[];
}

const EditJob: React.FC = () => {
  // Retrieve id from URL params
  const { id } = useLocalSearchParams();

  // formData State
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

  // Loading State
  const [loading, setLoading] = useState(true);

  // Retreive Job details on mount
  useEffect(() => {
    const fetchJob = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) {
          Alert.alert("Error", "No Token found!");
          router.push("/(screens)/Home");
          return;
        }

        const response = await axios.get(
          `http://10.0.2.2:3000/api/jobs/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const job: Job = response.data;
        setFormData({
          title: job.title,
          company: job.company,
          description: job.description,
          location: job.location,
          salary: job.salary.toString(),
          jobType: job.jobType,
          experienceLevel: job.experienceLevel,
          skills: job.skills.join(", "), // Array -> String
          applicationDeadline: job.applicationDeadline.split("T")[0], // Format YYYY-MM-DD
          status: job.status,
        });
        setLoading(false);
      } catch (error) {
        const err = error as AxiosError<{ message?: string }>;
        Alert.alert(
          "Error",
          err.response?.data?.message || "Unable to load the Job details!"
        );
        router.push("/(screens)/Home");
      }
    };

    fetchJob();
  }, [id]);

  // Manage the form changes
  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // onSubmit
  const handleSubmit = async () => {
    try {
      // Input Validation
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
          Alert.alert("Error", `The ${field} is required to fill!`);
          return;
        }
      }

      const salary = parseFloat(formData.salary);
      if (isNaN(salary)) {
        Alert.alert("Error", "Salary has to be a valid number!");
        return;
      }

      // Convert skills to an array
      const skills = formData.skills
        .split(",")
        .map((skill) => skill.trim())
        .filter((skill) => skill); // Removes "", null, undefined, 0, etc.

      // Verify the Date
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
        Alert.alert("Error", "No Token found!");
        return;
      }

      // Send the PUT request
      await axios.put(
        `http://10.0.2.2:3000/api/jobs/${id}`,
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

      Alert.alert("Success", "Job Edited Successfully", [
        {
          text: "OK",
          onPress: () => router.push("/(screens)/Home"),
        },
      ]);
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>;
      Alert.alert(
        "Error",
        err.response?.data?.message || "Unable to Edit the Job!"
      );
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.headerTitle}>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={25} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit the Job</Text>
      </View>

      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Title"
          value={formData.title}
          onChangeText={(text) => handleInputChange("title", text)}
          placeholderTextColor="#333"
        />
        <TextInput
          style={styles.input}
          placeholder="Company"
          value={formData.company}
          onChangeText={(text) => handleInputChange("company", text)}
          placeholderTextColor="#333"
        />
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Description"
          value={formData.description}
          onChangeText={(text) => handleInputChange("description", text)}
          multiline
          numberOfLines={4}
          placeholderTextColor="#333"
        />
        <TextInput
          style={styles.input}
          placeholder="Location"
          value={formData.location}
          onChangeText={(text) => handleInputChange("location", text)}
          placeholderTextColor="#333"
        />
        <TextInput
          style={styles.input}
          placeholder="Salary"
          value={formData.salary}
          onChangeText={(text) => handleInputChange("salary", text)}
          keyboardType="numeric"
          placeholderTextColor="#333"
        />
        <TextInput
          style={styles.input}
          placeholder="Job Type (ex: Full-time)"
          value={formData.jobType}
          onChangeText={(text) => handleInputChange("jobType", text)}
          placeholderTextColor="#333"
        />
        <TextInput
          style={styles.input}
          placeholder="Level of Expertise (ex: Mid)"
          value={formData.experienceLevel}
          onChangeText={(text) => handleInputChange("experienceLevel", text)}
          placeholderTextColor="#333"
        />
        <TextInput
          style={styles.input}
          placeholder="Skills (',' Separated)"
          value={formData.skills}
          onChangeText={(text) => handleInputChange("skills", text)}
          placeholderTextColor="#333"
        />
        <TextInput
          style={styles.input}
          placeholder="Deadline (YYYY-MM-DD)"
          value={formData.applicationDeadline}
          onChangeText={(text) =>
            handleInputChange("applicationDeadline", text)
          }
          placeholderTextColor="#333"
        />
        <TextInput
          style={styles.input}
          placeholder="Status (ex: Open)"
          value={formData.status}
          onChangeText={(text) => handleInputChange("status", text)}
          placeholderTextColor="#333"
        />

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Update the Job</Text>
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
    fontSize: width * 0.04,
    color: "#000",
    elevation: 2,
    shadowColor: "#800e13",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
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

export default EditJob;
