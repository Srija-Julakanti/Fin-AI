// frontend/app/(tabs)/plaid.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  Button,
  Alert,
  ScrollView,
  StyleSheet,
  Platform,
} from "react-native";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import { useRouter } from 'expo-router';
import { Feather } from "@expo/vector-icons";

import {
  create,
  open,
  LinkTokenConfiguration,
  LinkSuccess,
  LinkExit,
  LinkLogLevel,
} from "react-native-plaid-link-sdk";
import { SafeAreaView } from "react-native-safe-area-context";

const API_BASE_URL =
  Platform.OS === "android" ? "http://10.0.2.2:8000" : "http://localhost:8000";

export default function PlaidScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [linkToken, setLinkToken] = useState<string | null>(null);
  const [plaidItemId, setPlaidItemId] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<string>(
    "No transactions yet."
  );
  const [loadingLinkToken, setLoadingLinkToken] = useState(false);
  const [loadingTransactions, setLoadingTransactions] = useState(false);

  const userId = user?.id;

  if (!userId) {
    return (
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Feather 
            name="arrow-left" 
            size={24} 
            color="#0d9488" 
            onPress={() => router.back()} // Changed to goBack()
            style={styles.backButton}
          />
          <Text style={styles.header}>Link Bank Account</Text>
        </View>
        
        <Text>You must be logged in to link a bank.</Text>
      </View>
    );
  }

  // 1️⃣ Ask backend for link_token and preload Link
  const createLinkToken = async () => {
    try {
      setLoadingLinkToken(true);
      const resp = await axios.post(
        `${API_BASE_URL}/api/plaid/create_link_token`,
        { userId }
      );
      const token = resp.data.link_token;
      console.log("Link token from backend:", resp.data);
      setLinkToken(token);

      // Preload Plaid Link with this token
      const config: LinkTokenConfiguration = {
        token,
        // optional: noLoadingState: false,
      };
      create(config);

      Alert.alert("Success", "Link token created & Link preloaded!");
    } catch (e: any) {
      console.error("createLinkToken error:", e?.response?.data ?? e);
      Alert.alert("Error", "Failed to create link token");
    } finally {
      setLoadingLinkToken(false);
    }
  };

  // 2️⃣ Open Plaid Link (native SDK)
  const openPlaidLink = () => {
    if (!linkToken) {
      Alert.alert("Error", "Create a link token first");
      return;
    }

    console.log("Opening Plaid Link with token:", linkToken);

    open({
      onSuccess: async (success: LinkSuccess) => {
        try {
          console.log("Plaid onSuccess:", success);

          const publicToken = success.publicToken;
          const institution = success.metadata.institution;

          const resp = await axios.post(
            `${API_BASE_URL}/api/plaid/get_access_token`,
            {
              userId,
              publicToken,
              institution,
            }
          );

          console.log("Exchange response:", resp.data);

          setPlaidItemId(resp.data.plaidItemId);
          Alert.alert("Success", "Bank linked!");
        } catch (err: any) {
          console.error(
            "Error exchanging public token:",
            err?.response?.data ?? err
          );
          Alert.alert("Error", "Failed to save linked account");
        }
      },
      onExit: (exit: LinkExit) => {
        console.log("Plaid onExit:", exit);
        if (exit.error) {
          Alert.alert(
            "Error",
            "There was an issue linking your account. Please try again."
          );
        }
      },
      logLevel: LinkLogLevel.ERROR,
      // iosPresentationStyle: "MODAL", // optional
    });
  };

  // 3️⃣ Sync + display transactions via backend
  const fetchTransactions = async () => {
    if (!plaidItemId) {
      Alert.alert("Error", "Link an account first");
      return;
    }

    try {
      setLoadingTransactions(true);
      const resp = await axios.post(
        `${API_BASE_URL}/api/plaid/transactions/sync`,
        {
          userId,
          plaidItemId
        }
      );

      console.log("Transactions sync response:", resp.data);
      setTransactions(JSON.stringify(resp.data.transactions, null, 2));
    } catch (e: any) {
      console.error("fetchTransactions error:", e?.response?.data ?? e);
      Alert.alert("Error", "Failed to fetch transactions");
    } finally {
      setLoadingTransactions(false);
    }
  };

  return (
    <SafeAreaView edges={["top", "left", "right"]}>
    <View style={styles.container}>
       <View style={styles.headerContainer}>
          <Feather 
            name="arrow-left" 
            size={24} 
            color="#0d9488" 
            onPress={() => router.back()} // Changed to goBack()
            style={styles.backButton}
          />
        </View>
      <Text style={styles.header}>Plaid Integration</Text>

      <Button
        title={
          loadingLinkToken
            ? "Creating Link Token..."
            : "1. Create Link Token (preload)"
        }
        onPress={createLinkToken}
        disabled={loadingLinkToken}
      />

      <Button
        title="2. Open Plaid"
        onPress={openPlaidLink}
        disabled={!linkToken}
      />

      <Button
        title={
          loadingTransactions
            ? "Fetching Transactions..."
            : "3. Fetch Transactions"
        }
        onPress={fetchTransactions}
        disabled={!plaidItemId || loadingTransactions}
      />

      <ScrollView style={styles.txContainer}>
        <Text>{transactions}</Text>
      </ScrollView>
    </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    marginRight: 15,
    padding: 5,
  },
  header: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 20,
    textAlign: "center",
  },
  txContainer: {
    flex: 1,
    marginTop: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "#fff",
  },
});
