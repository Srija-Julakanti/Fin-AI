import React, { useState } from "react";
import { View, Text, Button, Alert, ScrollView, StyleSheet, Platform, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { WebView } from "react-native-webview";
import axios from "axios";

const API_BASE_URL =
  Platform.OS === "android" ? "http://10.0.2.2:8000" : "http://localhost:8000";

export default function PlaidScreen() {
  const router = useRouter();
  const [linkToken, setLinkToken] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<string>("No transactions yet.");
  const [openWebView, setOpenWebView] = useState(false);

  // 1️⃣ Create Link Token
  const createLinkToken = async () => {
    try {
      const resp = await axios.post(`${API_BASE_URL}/create_link_token`);
      setLinkToken(resp.data.link_token);
      Alert.alert("Success", "Link token created!");
    } catch (e) {
      console.error(e);
      Alert.alert("Error", "Failed to create link token");
    }
  };

  // 2️⃣ Capture public_token from WebView redirect
  const handleWebViewNavigation = async (event: any) => {
    const url = event.url;

    if (url.includes("public_token")) {
      setOpenWebView(false);

      const params = new URLSearchParams(url.split("?")[1]);
      const publicToken = params.get("public_token");

      if (!publicToken) return;

      // Exchange token
      try {
        const resp = await axios.post(`${API_BASE_URL}/get_access_token`, {
          publicToken,
        });

        setAccessToken(resp.data.accessToken);
        Alert.alert("Success", "Bank Linked!");
        router.replace("/(tabs)");
      } catch (error) {
        console.error(error);
        Alert.alert("Error", "Failed to exchange token");
      }
    }
  };

  // 3️⃣ Fetch Transactions
  const fetchTransactions = async () => {
    if (!accessToken) return Alert.alert("Error", "Link account first");
    try {
      const resp = await axios.post(`${API_BASE_URL}/get_transactions`, {
        token: accessToken,
      });
      setTransactions(JSON.stringify(resp.data.transactions, null, 2));
    } catch (e) {
      console.error(e);
      Alert.alert("Error", "Failed to fetch transactions");
    }
  };

  // 4️⃣ Render WebView Plaid Link Flow
  if (openWebView && linkToken) {
    return (
      <WebView
        source={{
          uri: `https://cdn.plaid.com/link/v2/stable/link.html?token=${linkToken}`,
        }}
        onNavigationStateChange={handleWebViewNavigation}
        startInLoadingState
        renderLoading={() => <ActivityIndicator size="large" style={{ marginTop: 80 }} />}
      />
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Plaid Integration (WebView)</Text>

      <Button title="1. Create Link Token" onPress={createLinkToken} />

      <Button
        title="2. Open Plaid (WebView)"
        onPress={() => setOpenWebView(true)}
        disabled={!linkToken}
      />

      <Button
        title="3. Fetch Transactions"
        onPress={fetchTransactions}
        disabled={!accessToken}
      />

      <ScrollView style={styles.txContainer}>
        <Text>{transactions}</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  header: { fontSize: 24, fontWeight: "700", marginBottom: 20, textAlign: "center" },
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
