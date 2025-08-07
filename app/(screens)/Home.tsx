import React, { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TextInput,
  TouchableOpacity,
  FlatList,
  Modal,
  Alert,
} from "react-native";
import { router } from "expo-router";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { height, width } = Dimensions.get("window");

// Fake Schema
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
  postedBy?: string; // Option ken fama wa7det fer8in
  createdAt: string;
  updatedAt: string;
  applications: { userId: string; appliedAt: string; _id: string }[];
}

export default function Home() {
  const [searchText, setSearchText] = useState("");
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [jobs, setJobs] = useState<Job[]>([]);

  // Get jobs from DB
  const fetchJobs = async () => {
    try {
      const response = await axios.get("http://10.0.2.2:3000/api/jobs");
      setJobs(response.data);
    } catch (err) {
      console.log("Error", err);
      Alert.alert("Error", "Error in getting jobs from database!");
    }
  };

  // Fetch data from backend and user role from asyncstorage
  useEffect(() => {
    const checkUserRole = async () => {
      try {
        const role = await AsyncStorage.getItem("role");
        setIsAdmin(role === "Admin");
      } catch (err) {
        console.log("Error in fetching jobs", err);
      }
    };
    fetchJobs();
    checkUserRole();
  }, []);

  // Format the salary
  const formatSalary = (salary: number): string => {
    return `$${salary.toLocaleString()}`; // 60000 => $60.000
  };

  // Format the Date
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString(); // 2025-07-27T09:37:27.495Z => 31/08/2025
  };

  // Handle Action
  const handleAction = (action: string) => {
    setModalVisible(false);
    switch (action) {
      case "edit":
        router.push({
          pathname: "/(screens)/Edit",
          params: {
            selectedJob: encodeURIComponent(JSON.stringify(selectedJob)),
          },
        });
        break;
      case "delete":
        Alert.alert(
          "Delete",
          `Are you sure you want to delete the Job: ${selectedJob?.title} ?`,
          [
            { text: "Cancel", style: "cancel" },
            { text: "Delete", style: "destructive" },
          ]
        );
        break;
      case "view":
        router.push({
          pathname: "/(screens)/ViewPage",
          params: {
            selectedJob: encodeURIComponent(JSON.stringify(selectedJob)),
          },
        });
        break;
    }
  };

  // Handle Logout
  const handleLogout = () => {
    try{
      AsyncStorage.clear()
      router.push("/(auth)/Login")
    }
    catch(err){
      console.error("Error clearing AsyncStorage" , err);
      Alert.alert("Error" , "Error in loging out")
    }
  }

  // JobCard Component
  const JobCard: React.FC<{ item: Job }> = ({ item }) => (
    <View style={style.jobCard}>
      <View style={style.cardHeader}>
        <View style={style.jobInfo}>
          <Text style={style.jobTitle}>{item.title}</Text>
          <Text style={style.company}>{item.company}</Text>
        </View>
        <TouchableOpacity
          style={style.menuButton}
          onPress={() => {
            setSelectedJob(item);
            setModalVisible(true);
          }}
        >
          <Ionicons name="ellipsis-vertical" size={20} color="#666" />
        </TouchableOpacity>
      </View>

      <Text style={style.description}>{item.description}</Text>

      <View style={style.jobDetails}>
        <View style={style.detailRow}>
          <Ionicons name="location-outline" size={16} color="#666" />
          <Text style={style.detailText}>{item.location}</Text>
        </View>

        <View style={style.detailRow}>
          <Ionicons name="time-outline" size={16} color="#666" />
          <Text style={style.detailText}>{item.jobType}</Text>
        </View>

        <View style={style.detailRow}>
          <Ionicons name="cash-outline" size={16} color="#666" />
          <Text style={style.detailText}>{formatSalary(item.salary)}</Text>
        </View>
      </View>

      <View style={style.skillsContainer}>
        {item.skills.slice(0, 3).map((skill, index) => (
          <View key={index} style={style.skillTag}>
            <Text style={style.skillText}>{skill}</Text>
          </View>
        ))}
      </View>

      <View style={style.cardFooter}>
        <Text style={style.experienceLevel}>{item.experienceLevel}</Text>
        <Text style={style.deadline}>
          Deadline: {formatDate(item.applicationDeadline)}
        </Text>
      </View>
    </View>
  );

  return (
    <>
      <View style={style.container}>
        {/* Header */}
        <View style={style.header}>
          <Text style={style.headerTitle}>Jobs Available</Text>
          <TouchableOpacity
            style={style.logoutButton}
            onPress={handleLogout}
          >
            <Ionicons name="log-out-outline" size={24} color="white"/>
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={style.searchContainer}>
          <View style={style.searchInputContainer}>
            <Ionicons
              name="search"
              size={20}
              color="#666"
              style={style.searchIcon}
            />
            <TextInput
              style={style.searchInput}
              placeholder="Search a job"
              placeholderTextColor="#999"
              value={searchText}
              onChangeText={setSearchText}
            />
          </View>
        </View>

        {/* Add Job */}
        {isAdmin ? (
          <TouchableOpacity
            style={style.addButton}
            onPress={() => router.push("/(screens)/Add")}
          >
            <Ionicons name="add" size={24} color="white" />
            <Text style={style.addButtonText}>Add a job</Text>
          </TouchableOpacity>
        ) : (
          <></>
        )}

        {/* List of jobs */}
        <FlatList
          data={jobs}
          keyExtractor={(item) => item._id.toString()}
          renderItem={({ item }) => <JobCard item={item} />} // How to display each item
          contentContainerStyle={style.listContainer} // Style the content
          showsVerticalScrollIndicator={false} // Hide the scrollBar
        />

        {/* Modal */}
        <Modal
          visible={modalVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setModalVisible(false)} // Close the modal
        >
          <TouchableOpacity // When i click outside, the modal disappears
            style={style.modalOverlay}
            activeOpacity={1}
            onPress={() => setModalVisible(false)}
          >
            <View style={style.modalContent}>
              <TouchableOpacity
                style={style.modalOption}
                onPress={() => handleAction("view")}
              >
                <Ionicons name="eye-outline" size={20} color="#333" />
                <Text style={style.modalOptionText}>View</Text>
              </TouchableOpacity>

              {isAdmin && (
                <TouchableOpacity
                  style={style.modalOption}
                  onPress={() => handleAction("edit")}
                >
                  <Ionicons name="create-outline" size={20} color="#333" />
                  <Text style={style.modalOptionText}>Edit</Text>
                </TouchableOpacity>
              )}

              {isAdmin && (
                <TouchableOpacity
                  style={style.modalOption}
                  onPress={() => handleAction("delete")}
                >
                  <Ionicons name="trash-outline" size={20} color="#e74c3c" />
                  <Text style={[style.modalOptionText, { color: "#e74c3c" }]}>
                    Delete
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </TouchableOpacity>
        </Modal>
      </View>
    </>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    paddingTop: height * 0.06,
    paddingHorizontal: width * 0.05,
    paddingBottom: height * 0.025,
    backgroundColor: "#1F41BB",
  },
  headerTitle: {
    fontSize: width * 0.06,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
   logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1F41BB",
    paddingVertical: height * 0.01,
    paddingHorizontal: width * 0.03,
    borderRadius: width * 0.03,
  },
  searchContainer: {
    paddingHorizontal: width * 0.05,
    paddingVertical: height * 0.02,
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: width * 0.03,
    paddingHorizontal: width * 0.04,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  searchIcon: {
    marginRight: width * 0.025,
  },
  searchInput: {
    flex: 1,
    height: height * 0.06,
    fontSize: width * 0.04,
    color: "#333",
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1F41BB",
    marginHorizontal: width * 0.05,
    marginBottom: height * 0.025,
    paddingVertical: height * 0.015,
    borderRadius: width * 0.03,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  addButtonText: {
    color: "white",
    fontSize: width * 0.04,
    fontWeight: "600",
    marginLeft: width * 0.02,
  },
  listContainer: {
    paddingHorizontal: width * 0.05,
    paddingBottom: height * 0.025,
  },
  jobCard: {
    backgroundColor: "white",
    borderRadius: width * 0.04,
    padding: width * 0.05,
    marginBottom: height * 0.02,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: width * 0.03,
    padding: width * 0.02,
    minWidth: width * 0.4,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.04,
  },
  modalOptionText: {
    fontSize: width * 0.04,
    color: "#333",
    marginLeft: width * 0.03,
  },
});
