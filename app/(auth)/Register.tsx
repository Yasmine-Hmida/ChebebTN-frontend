import { Ionicons } from "@expo/vector-icons"; // Importation pour les icônes
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

import axios from "axios" // fetch (more secure)

// Récupération des dimensions de l'écran pour un design responsive
const { width, height } = Dimensions.get("window");

/**
 * Interface TypeScript pour définir la structure des données du formulaire
 * Aide à avoir un code plus robuste et éviter les erreurs
 */
interface FormData {
  username: string;
  email: string;
  password: string;
  repeatPassword: string;
}

/**
 * Composant de la page d'inscription
 * Permet à un nouvel utilisateur de créer un compte sur ChabebTN
 */
const RegisterScreen = () => {
  // État pour stocker toutes les données du formulaire
  const [formData, setFormData] = useState<FormData>({
    username: "",
    email: "",
    password: "",
    repeatPassword: "",
  });
  const [isAdmin , setIsAdmin] = useState(false);
  const [focusedInput, setFocusedInput] = useState(""); // État pour gérer le focus des inputs
  const [showPassword, setShowPassword] = useState(false); // État pour la visibilité du mot de passe
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // État pour la visibilité de la confirmation

  /**
   * Fonction générique pour mettre à jour n'importe quel champ du formulaire
   * @param field - Le nom du champ à modifier
   * @param value - La nouvelle valeur
   */
  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  /**
   * Fonction de validation complète du formulaire
   * Vérifie tous les critères avant de permettre l'inscription
   * @returns true si tout est valide, false sinon
   */
  const validateForm = (): boolean => {
    const { username, email, password, repeatPassword } = formData;

    // Vérifier que tous les champs sont remplis
    if (!username || !email || !password || !repeatPassword) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs");
      return false;
    }

    // Vérifier la longueur du nom (au moins 2 caractères)
    if (username.length < 2) {
      Alert.alert("Erreur", "Le nom doit contenir au moins 2 caractères");
      return false;
    }

    // Vérifier le format de l'email avec une regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Erreur", "Format email invalide");
      return false;
    }

    // Vérifier la force du mot de passe (au moins 8 caractères)
    if (password.length < 8) {
      Alert.alert(
        "Erreur",
        "Le mot de passe doit contenir au moins 8 caractères"
      );
      return false;
    }
    // Vérifier la présence d'au moins une lettre majuscule
    const capitalLetterRegex = /[A-Z]/;
    if (!capitalLetterRegex.test(password)) {
      Alert.alert(
        "Erreur",
        "Le mot de passe doit contenir au moins une lettre majuscule"
      );
      return false;
    }

    // Vérifier que les deux mots de passe correspondent
    if (password !== repeatPassword) {
      Alert.alert("Erreur", "Les mots de passe ne correspondent pas");
      return false;
    }

    return true;
  };

  /**
   * Fonction qui gère la tentative d'inscription
   * Valide les données puis simule la création de compte
   */
  const handleRegister = async () => {
    if (!validateForm()) {
      return;
    }

    try{
      const response = await axios.post("http://10.0.2.2:3000/api/register" , {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        repeatPassword: formData.repeatPassword,
        role: isAdmin? 'Admin' : 'Job Seeker'
      });

      if(response.data.status === "Success"){
        Alert.alert("Success" , `Registered Successfully ${formData.username} , your new account is saved !`, [
          {
            text: "OK",
            onPress:() => router.push("/(auth)/Login")
          }
        ])
      }
      else{
        Alert.alert("Error", response.data.message || "Failed to Register!")
      }
    }
    catch(err){
      console.log("Erreur: " , err);
      Alert.alert("Error", "Register Error")
    }
  };

  /**
   * Fonction pour naviguer vers la page de connexion
   */
  const goToLogin = () => {
    router.push("/(auth)/Login");
  };

  /**
   * Fonction pour basculer la visibilité du mot de passe
   */
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  /**
   * Fonction pour basculer la visibilité de la confirmation du mot de passe
   */
  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const toggleAdminCheckbox = () => {
    setIsAdmin(!isAdmin)
  }

  return (
    <>
      {/* Configuration de la barre de statut pour un design moderne */}
      <StatusBar barStyle="light-content" backgroundColor="#1F41BB" />

      {/* Container principal */}
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {/* Section supérieure avec titre et sous-titre */}
          <View style={styles.headerSection}>
            <Text style={styles.mainTitle}>Rejoindre ChabebTN</Text>
            <Text style={styles.welcomeText}>Créez votre compte</Text>
          </View>

          {/* Section du formulaire */}
          <View style={styles.formSection}>
            {/* Champ Nom complet */}
            <View style={styles.inputContainer}>
              <TextInput
                style={[
                  styles.input,
                  focusedInput === "name" && styles.inputFocused,
                ]}
                placeholder="Nom complet"
                placeholderTextColor="#626262"
                value={formData.username}
                onChangeText={(value) => handleInputChange("username", value)}
                onFocus={() => setFocusedInput("name")}
                onBlur={() => setFocusedInput("")}
                autoCapitalize="words"
                autoComplete="name"
              />
            </View>

            {/* Champ Email */}
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

            {/* Champ Mot de passe */}
            <View style={styles.inputContainer}>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={[
                    styles.input,
                    focusedInput === "password" && styles.inputFocused,
                    styles.passwordInput,
                  ]}
                  placeholder="Mot de passe (min. 8 caractères)"
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
                    name={showPassword ? "eye" : "eye-off"}
                    size={width * 0.06}
                    color="#626262"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Champ Confirmation mot de passe */}
            <View style={styles.inputContainer}>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={[
                    styles.input,
                    focusedInput === "confirmPassword" && styles.inputFocused,
                    styles.passwordInput,
                  ]}
                  placeholder="Confirmer le mot de passe"
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
                    name={showConfirmPassword ? "eye" : "eye-off"}
                    size={width * 0.06}
                    color="#626262"
                  />
                </TouchableOpacity>
              </View>
            </View>
            
            {/* Choix de admin ou nom */}
            <View style={styles.checkboxContainer}>
                  <TouchableOpacity
                    style={styles.checkbox}
                    onPress={toggleAdminCheckbox}
                  >
                    <Ionicons name={isAdmin? "checkbox": "square-outline"} 
                              size={width * 0.06} 
                              color={isAdmin?"#1F41BB" : "#626262"}
                    />
                  </TouchableOpacity>
                  <Text style={styles.checkboxLabel}>I&apos;m an admin</Text>
            </View>

            {/* Bouton d'inscription */}
            <TouchableOpacity
              style={styles.signInButton}
              onPress={handleRegister}
              activeOpacity={0.8}
            >
              <Text style={styles.signInButtonText}>Créer mon compte</Text>
            </TouchableOpacity>

            {/* Lien vers la connexion */}
            <TouchableOpacity
              style={styles.createAccountContainer}
              onPress={goToLogin}
            >
              <Text style={styles.createAccountText}>
                Déjà un compte ? Se connecter
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </>
  );
};

// Styles suivant le design de LoginScreen
const styles = StyleSheet.create({
  // Container principal occupant tout l'écran
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF", // Fond blanc comme dans LoginScreen
  },

  // ScrollView pour gérer le défilement
  scrollContainer: {
    flexGrow: 1,
  },

  // Section supérieure avec le titre et message de bienvenue
  headerSection: {
    height: height * 0.3, // 30% de la hauteur de l'écran
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: width * 0.05, // 5% de la largeur pour les marges
  },

  // Titre principal "Rejoindre ChabebTN" en bleu
  mainTitle: {
    fontSize: width * 0.08, // Taille relative à la largeur de l'écran
    fontWeight: "bold",
    color: "#1F41BB", // Couleur bleue exacte
    marginBottom: height * 0.03, // 3% de la hauteur pour l'espacement
    textAlign: "center",
  },

  // Message de bienvenue en noir
  welcomeText: {
    fontSize: width * 0.05, // Taille relative à la largeur
    color: "#000000",
    textAlign: "center",
    lineHeight: height * 0.04, // Interligne relatif à la hauteur
    fontWeight: "600",
  },

  // Section contenant le formulaire
  formSection: {
    height: height * 0.6, // 60% de la hauteur de l'écran
    paddingHorizontal: width * 0.08, // 8% de la largeur pour les marges
  },

  // Container pour chaque champ de saisie
  inputContainer: {
    marginBottom: height * 0.03, // 3% de la hauteur pour l'espacement
  },

  // Style des champs de saisie
  input: {
    height: height * 0.08, // 8% de la hauteur de l'écran
    width: width * 0.84, // 84% de la largeur de l'écran
    backgroundColor: "#F1F4FF",
    borderRadius: width * 0.025, // Coins arrondis relatifs à la largeur
    paddingHorizontal: width * 0.05, // Padding horizontal relatif
    fontSize: width * 0.04, // Taille de police relative
    color: "#626262",
    borderWidth: 1, // Bordure de 1px par défaut
    borderColor: "#1F41BB",
  },

  // Style appliqué quand l'input est focus
  inputFocused: {
    borderWidth: 3, // Bordure de 3px quand l'utilisateur écrit
  },

  // Container pour le champ mot de passe avec icône
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: width * 0.84,
  },

  // Input du mot de passe avec espace pour l'icône
  passwordInput: {
    flex: 1,
  },

  // Style pour l'icône œil
  eyeIcon: {
    position: "absolute",
    right: width * 0.03,
    height: height * 0.08,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: width * 0.02,
  },

  // Bouton "Créer mon compte" avec fond bleu
  signInButton: {
    height: height * 0.075, // 7.5% de la hauteur de l'écran
    width: width * 0.84, // 84% de la largeur de l'écran
    backgroundColor: "#1F41BB", // Couleur bleue exacte
    borderRadius: width * 0.025, // Coins arrondis relatifs
    justifyContent: "center",
    alignItems: "center",
    marginBottom: height * 0.04, // 4% de la hauteur pour l'espacement
    shadowColor: "#1F41BB",
    shadowOffset: {
      width: 0,
      height: height * 0.005, // Ombre relative à la hauteur
    },
    shadowOpacity: 0.3,
    shadowRadius: width * 0.02, // Rayon d'ombre relatif
    elevation: 8, // Ombre sur Android
  },

  // Texte du bouton "Créer mon compte" en blanc
  signInButtonText: {
    color: "#FFFFFF",
    fontSize: width * 0.05, // Taille relative à la largeur
    fontWeight: "bold",
  },

  // Container pour le lien "Déjà un compte ? Se connecter"
  createAccountContainer: {
    alignItems: "center",
    marginTop: height * 0.01, // 1.5% de la hauteur pour l'espacement
  },

  // Texte du lien "Déjà un compte ? Se connecter" en gris foncé
  createAccountText: {
    fontSize: width * 0.035, // Taille relative à la largeur
    color: "#494949",
    fontWeight: "600",
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
    color: "#626262",
    marginLeft: width * 0.02,
  },
});

export default RegisterScreen;