import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Dimensions,
} from "react-native";

const { height, width } = Dimensions.get("window");

export default function ViewPage() {
  const params = useLocalSearchParams<{ selectedJob: string }>();
  const selectedJob = params.selectedJob;

  const parsedJob = JSON.parse(decodeURIComponent(selectedJob));

  // Optional: format salary and date similar to Home screen
  const formatSalary = (salary: number) => `$${salary.toLocaleString()}`;
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <View style={style.container}>
      <StatusBar barStyle="light-content" />

      {/* Go to Homepage Button */}
      <TouchableOpacity
        style={style.goHomepageBtn}
        onPress={() => router.push("/(screens)/Home")}
        activeOpacity={1}
      >
        <Text style={style.goHomepageText}>Go to Homepage</Text>
      </TouchableOpacity>

      <Text style={style.title}>This is your selected job:</Text>

      {/* The JobCard */}
      <View style={style.jobCard}>
        <View style={style.cardHeader}>
          <View style={style.jobInfo}>
            <Text style={style.jobTitle}>{parsedJob.title}</Text>
            <Text style={style.company}>{parsedJob.company}</Text>
          </View>
        </View>

        <Text style={style.description}>{parsedJob.description}</Text>

        <View style={style.jobDetails}>
          <View style={style.detailRow}>
            <Ionicons name="location-outline" size={16} color="#666" />
            <Text style={style.detailText}>{parsedJob.location}</Text>
          </View>

          <View style={style.detailRow}>
            <Ionicons name="time-outline" size={16} color="#666" />
            <Text style={style.detailText}>{parsedJob.jobType}</Text>
          </View>

          <View style={style.detailRow}>
            <Ionicons name="cash-outline" size={16} color="#666" />
            <Text style={style.detailText}>
              {formatSalary(parsedJob.salary)}
            </Text>
          </View>
        </View>

        <View style={style.skillsContainer}>
          {parsedJob.skills.map((skill: string, index: number) => (
            <View key={index} style={style.skillTag}>
              <Text style={style.skillText}>{skill}</Text>
            </View>
          ))}
        </View>

        <View style={style.cardFooter}>
          <Text style={style.experienceLevel}>{parsedJob.experienceLevel}</Text>
          <Text style={style.deadline}>
            Deadline: {formatDate(parsedJob.applicationDeadline)}
          </Text>
        </View>
      </View>
    </View>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1e3a8a",
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#ffffff",
    marginTop: 40,
    textAlign: "center",
  },
  goHomepageBtn: {
    backgroundColor: "#F1F4FF",
    marginTop: height * 0.07,
    marginHorizontal: width * 0.2,
    paddingVertical: height * 0.02,
    borderWidth: 1.5,
    borderRadius: width * 0.025,
    elevation: 8,
    shadowColor: "black",
    shadowOffset: { width: 2, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
  },
  goHomepageText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1e3a8a",
    textAlign: "center",
  },
  jobCard: {
    backgroundColor: "white",
    borderRadius: width * 0.03,
    padding: width * 0.05,
    marginBottom: height * 0.02,
    marginTop: height * 0.05,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: height * 0.015,
  },
  jobInfo: {
    flex: 1,
  },
  jobTitle: {
    fontSize: width * 0.045,
    fontWeight: "bold",
    color: "#333",
    marginBottom: height * 0.005,
  },
  company: {
    fontSize: width * 0.035,
    color: "#1F41BB",
    fontWeight: "500",
  },
  menuButton: {
    padding: width * 0.01,
  },
  description: {
    fontSize: width * 0.035,
    color: "#666",
    marginBottom: height * 0.02,
    lineHeight: height * 0.025,
  },
  jobDetails: {
    marginBottom: height * 0.02,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: height * 0.01,
  },
  detailText: {
    fontSize: width * 0.035,
    color: "#333",
    marginLeft: width * 0.02,
  },
  skillsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: height * 0.02,
  },
  skillTag: {
    backgroundColor: "#f0f0f0",
    paddingHorizontal: width * 0.03,
    paddingVertical: height * 0.008,
    borderRadius: width * 0.05,
    marginRight: width * 0.02,
    marginBottom: height * 0.01,
  },
  skillText: {
    fontSize: width * 0.03,
    color: "#333",
    fontWeight: "500",
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: height * 0.02,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  experienceLevel: {
    fontSize: width * 0.03,
    color: "#1F41BB",
    fontWeight: "600",
    backgroundColor: "#f0f4ff",
    paddingHorizontal: width * 0.02,
    paddingVertical: height * 0.005,
    borderRadius: width * 0.03,
  },
  deadline: {
    fontSize: width * 0.03,
    color: "#666",
  },
});
