import { router } from "expo-router";
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";

const { height, width } = Dimensions.get("window");

const Add = () => {
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [description, setDescription] = useState("");
  const [salary, setSalary] = useState("");
  const [location, setLocation] = useState("");
  const [jobType, setJobType] = useState("");
  const [status, setStatus] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("");
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");
  const [year, setYear] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [currentSkill, setCurrentSkill] = useState("");
  const [focusedInput, setFocusedInput] = useState("");

  // Add Skill function
  const addSkill = () => {
    const trimmed = currentSkill.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills([...skills, trimmed]);
      setCurrentSkill("");
    }
  };

  // Remove a Skill
  const removeSkill = (index: number) => {
    const updated = [...skills];
    updated.splice(index, 1);
    setSkills(updated);
  };

  return (
    <ScrollView  style={style.container} contentContainerStyle={{ justifyContent: 'center', alignItems: 'center' }}>
      <Text style={style.title}>+ Add a new Job:</Text>

      <View style={style.inputContainer}>
        <TextInput
          style={[style.input, focusedInput === "title" && style.inputFocused]}
          placeholder="Title"
          placeholderTextColor="#626262"
          value={title}
          onChangeText={setTitle}
          onFocus={() => setFocusedInput("title")}
          onBlur={() => setFocusedInput("")}
        />
      </View>
      <View style={style.inputContainer}>
        <TextInput
          style={[
            style.input,
            focusedInput === "company" && style.inputFocused,
          ]}
          placeholder="Company"
          placeholderTextColor="#626262"
          value={company}
          onChangeText={setCompany}
          onFocus={() => setFocusedInput("company")}
          onBlur={() => setFocusedInput("")}
        />
      </View>
      <View style={style.inputContainer}>
        <TextInput
          style={[
            style.input,
            focusedInput === "description" && style.inputFocused,
          ]}
          placeholder="Description of the job"
          placeholderTextColor="#626262"
          value={description}
          onChangeText={setDescription}
          onFocus={() => setFocusedInput("description")}
          onBlur={() => setFocusedInput("")}
          multiline={true}
          numberOfLines={4}
          textAlignVertical="top"
        />
      </View>
      <View style={style.inputDivContainer}>
        <TextInput
          style={[
            style.divInput,
            style.input,
            focusedInput === "salary" && style.inputFocused,
          ]}
          placeholder="Salary"
          placeholderTextColor="#626262"
          value={salary}
          onChangeText={setSalary}
          onFocus={() => setFocusedInput("salary")}
          onBlur={() => setFocusedInput("")}
        />

        <TextInput
          style={[
            style.divInput,
            style.input,
            focusedInput === "location" && style.inputFocused,
          ]}
          placeholder="Location"
          placeholderTextColor="#626262"
          value={location}
          onChangeText={setLocation}
          onFocus={() => setFocusedInput("location")}
          onBlur={() => setFocusedInput("")}
        />

        <TextInput
          style={[
            style.divInput,
            style.input,
            focusedInput === "jobType" && style.inputFocused,
          ]}
          placeholder="Job Type"
          placeholderTextColor="#626262"
          value={jobType}
          onChangeText={setJobType}
          onFocus={() => setFocusedInput("jobType")}
          onBlur={() => setFocusedInput("")}
        />
      </View>

      <View style={style.inputContainer}>
        <TextInput
          style={[style.input, focusedInput === "status" && style.inputFocused]}
          placeholder="Status"
          placeholderTextColor="#626262"
          value={status}
          onChangeText={setStatus}
          onFocus={() => setFocusedInput("status")}
          onBlur={() => setFocusedInput("")}
        />
      </View>
      <View style={style.inputContainer}>
        <TextInput
          style={[
            style.input,
            focusedInput === "experienceLevel" && style.inputFocused,
          ]}
          placeholder="Experience Level"
          placeholderTextColor="#626262"
          value={experienceLevel}
          onChangeText={setExperienceLevel}
          onFocus={() => setFocusedInput("experienceLevel")}
          onBlur={() => setFocusedInput("")}
        />
      </View>
      
      <Text style={style.subtitle}>Application Deadline: </Text>
      <View style={style.inputDivContainer}>
        <TextInput
          style={[
            style.divInput,
            style.input,
            focusedInput === "day" && style.inputFocused,
          ]}
          placeholder="Day"
          placeholderTextColor="#626262"
          value={day}
          onChangeText={setDay}
          onFocus={() => setFocusedInput("day")}
          onBlur={() => setFocusedInput("")}
        />

        <TextInput
          style={[
            style.divInput,
            style.input,
            focusedInput === "month" && style.inputFocused,
          ]}
          placeholder="Month"
          placeholderTextColor="#626262"
          value={month}
          onChangeText={setMonth}
          onFocus={() => setFocusedInput("month")}
          onBlur={() => setFocusedInput("")}
        />

        <TextInput
          style={[
            style.divInput,
            style.input,
            focusedInput === "year" && style.inputFocused,
          ]}
          placeholder="Year"
          placeholderTextColor="#626262"
          value={year}
          onChangeText={setYear}
          onFocus={() => setFocusedInput("year")}
          onBlur={() => setFocusedInput("")}
        />
      </View>

      <View style={style.skillContainer}>
        <TextInput
          style={[style.skillInput , style.divInput]}
          placeholder="Add a skill"
          value={currentSkill}
          onChangeText={setCurrentSkill}
          onSubmitEditing={addSkill}
        />
        <TouchableOpacity onPress={addSkill} style={style.addButton}>
          <Text style={style.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>

      <View style={style.tagsContainer}>
        {skills.map((skill, index) => (
          <View key={index} style={style.tag}>
            <Text style={style.tagText}>{skill}</Text>
            <TouchableOpacity onPress={() => removeSkill(index)}>
              <Text style={style.removeText}>×</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {/* Add Button */}
      <TouchableOpacity
        style={style.addButton}
        onPress={() => {
          Alert.alert("Success", "Added Successfully!");

          setTimeout(() => {
            router.push("/(screens)/Home");
          }, 1000);
        }}
      >
        <Text style={style.addButtonText}>Add job</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default Add;

const style = StyleSheet.create({
  container: {
    backgroundColor: "#F1F4FF",
    flex: 1,
    borderWidth: 1,
    borderColor: "#666",
    borderRadius: width * 0.04,
    shadowColor: "gray",
    shadowOffset: {
      width: 0,
      height: height * 0.004,
    },
    shadowOpacity: 0.3,
    shadowRadius: width * 0.01,
    elevation: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#1e3a8a",
    textAlign: "center",
    marginTop: 30
  },
  subtitle: {
    marginTop: 15,
    fontSize: 20,
    fontWeight: "600",
    color: "#1e3a8a",
  },
  inputContainer: {
    marginTop: height * 0.02,
  },
  inputDivContainer: {
    flexDirection: "row",
    marginTop: height * 0.02,
  },
  divInput: {
    maxWidth: "28%",
    marginHorizontal: 2,
  },
  input: {
    height: height * 0.08,
    width: width * 0.7,
    backgroundColor: "white",
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
  addButton: {
    backgroundColor: "#1e3a8a",
    padding: height * 0.02,
    borderWidth: 1.5,
    borderRadius: width * 0.025,
    elevation: 8,
    shadowColor: "black",
    shadowOffset: { width: 2, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
  },
  addButtonText: {
    color: "white",
    fontSize: 20,
    fontWeight: "600",
  },

  skillContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    marginTop: height * 0.02,
  },
  skillInput: {
    flex: 1,
    padding: 10,
    marginRight: 10,
    height: height * 0.08,
    width: "40%",
    backgroundColor: "white",
    borderRadius: width * 0.025,
    fontSize: width * 0.04,
    color: "#626262",
    borderWidth: 1,
    borderColor: "#1F41BB",
  },
  addSkillButton: {
    backgroundColor: "#007bff",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
  },
  addSkillText: {
    color: "white",
    fontWeight: "bold",
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: 20,
  },
  tag: {
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    alignItems: "center",
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#007bff",
    color: "#626262",
  },
  tagText: {
    marginRight: 6,
  },
  removeText: {
    color: "red",
    fontWeight: "bold",
    fontSize: 16,
  },
});
