import { Ionicons } from "@expo/vector-icons";
import React, { useState, useEffect } from "react";
import {
  Alert,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import axios, { AxiosError } from "axios";
import { router, useLocalSearchParams } from "expo-router";

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

const JobDetails: React.FC = () => {
  const [job, setJob] = useState<Job | null>(null);

  // Retrieve the job ID from URL parameters
  const { id } = useLocalSearchParams();

  // Fetch job details from backend on component mount
  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await axios.get(`http://10.0.2.2:3000/api/jobs/${id}`);
        setJob(response.data);
      } catch (error) {
        const err = error as AxiosError<{ message?: string }>;
        Alert.alert(
          "Error",
          err.response?.data?.message || "Unable to show Job details!"
        );
      }
    };

    if (id) {
      fetchJob();
    }
  }, [id]); // Changes each time the id changes

  const formatSalary = (salary: number): string => {
    return `$${salary.toLocaleString()}`;
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  if (!job) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading Job...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={25} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{job.title}</Text>
      </View>

      {/* Job Details */}
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.jobCard}>
          <Text style={styles.company}>{job.company}</Text>
          <Text style={styles.description}>{job.description}</Text>

          <View style={styles.jobDetails}>
            <View style={styles.detailRow}>
              <Ionicons name="location-outline" size={18} color="#640d14" />
              <Text style={styles.detailText}>{job.location}</Text>
            </View>
            <View style={styles.detailRow}>
              <Ionicons name="time-outline" size={18} color="#640d14" />
              <Text style={styles.detailText}>{job.jobType}</Text>
            </View>
            <View style={styles.detailRow}>
              <Ionicons name="cash-outline" size={18} color="#640d14" />
              <Text style={styles.detailText}>{formatSalary(job.salary)}</Text>
            </View>
            <View style={styles.detailRow}>
              <Ionicons name="briefcase-outline" size={18} color="#640d14" />
              <Text style={styles.detailText}>{job.experienceLevel}</Text>
            </View>
            <View style={styles.detailRow}>
              <Ionicons name="calendar-outline" size={18} color="#640d14" />
              <Text style={styles.detailText}>
                Deadline: {formatDate(job.applicationDeadline)}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Ionicons
                name="document-text-outline"
                size={18}
                color="#640d14"
              />
              <Text style={styles.detailText}>Status: {job.status}</Text>
            </View>
            <View style={styles.detailRow}>
              <Ionicons name="time-outline" size={18} color="#640d14" />
              <Text style={styles.detailText}>
                Date of Creation: {formatDate(job.createdAt)}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Ionicons name="time-outline" size={18} color="#640d14" />
              <Text style={styles.detailText}>
                Last Date of Modification: {formatDate(job.updatedAt)}
              </Text>
            </View>
          </View>

          <View style={styles.skillsContainer}>
            <Text style={styles.sectionTitle}>Skills :</Text>
            {job.skills.map((skill, index) => (
              <View key={index} style={styles.skillTag}>
                <Text style={styles.skillText}>{skill}</Text>
              </View>
            ))}
          </View>

          <View style={styles.applicationsContainer}>
            <Text style={styles.sectionTitle}>
              Applications ({job.applications.length}) :
            </Text>
            {job.applications.length > 0 ? (
              job.applications.map((application, index) => (
                <View key={application._id} style={styles.applicationItem}>
                  <Text style={styles.detailText}>
                    Email: {application.userId}
                  </Text>
                  <Text style={styles.detailText}>
                    Application Date: {formatDate(application.appliedAt)}
                  </Text>
                </View>
              ))
            ) : (
              <Text style={styles.detailText}>
                No Appilcations so far for this job.
              </Text>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f6ededff",
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
  contentContainer: {
    paddingHorizontal: width * 0.05,
    paddingBottom: height * 0.025,
  },
  jobCard: {
    backgroundColor: "white",
    borderRadius: width * 0.04,
    padding: width * 0.05,
    marginTop: height * 0.05,
    elevation: 3,
    shadowColor: "#800e13",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  company: {
    fontSize: width * 0.06,
    fontFamily: "DosisBold",
    color: "#800e13",
    marginBottom: height * 0.015,
  },
  description: {
    fontSize: width * 0.045,
    fontFamily: "DosisMedium",
    color: "#000",
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
    fontSize: width * 0.042,
    fontFamily: "DosisMedium",
    color: "#333",
    marginLeft: width * 0.02,
  },
  skillsContainer: {
    marginBottom: height * 0.02,
  },
  sectionTitle: {
    fontSize: width * 0.05,
    fontFamily: "DosisBold",
    color: "#640d14",
    marginBottom: height * 0.01,
  },
  skillTag: {
    backgroundColor: "#f7dedfff",
    paddingHorizontal: width * 0.03,
    paddingVertical: height * 0.008,
    borderRadius: width * 0.06,
    borderWidth:1,
    borderColor:"#800e13",
    marginRight: width * 0.02,
    marginBottom: height * 0.01,
  },
  skillText: {
    fontSize: width * 0.035,
    fontFamily: "DosisMedium",
    color: "#800e13",
  },
  applicationsContainer: {
    marginBottom: height * 0.02,
  },
  applicationItem: {
    borderBottomWidth: 1,
    borderBottomColor: "#640d1496",
    paddingVertical: height * 0.015,
  },
  loadingText: {
    fontSize: width * 0.04,
    fontFamily: "DosisBold",
    color: "#800e13",
    textAlign: "center",
    marginTop: height * 0.1,
  },
});

export default JobDetails;
