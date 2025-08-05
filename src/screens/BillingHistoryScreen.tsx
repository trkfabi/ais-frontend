import React, { useState, useCallback } from "react";
import { View, Text, StyleSheet, FlatList, RefreshControl } from "react-native";

const generateBillingData = (count: number) => {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    date: `2024-07-${(i % 30) + 1}`,
    amount: `$${(Math.random() * 100 + 10).toFixed(2)}`,
    status: i % 3 === 0 ? "Paid" : i % 3 === 1 ? "Pending" : "Failed",
    method: ["Visa", "Mastercard", "PayPal"][i % 3],
  }));
};

const PAGE_SIZE = 10;
const ALL_BILLING_DATA = generateBillingData(50);

const BillingHistoryScreen = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [data, setData] = useState(ALL_BILLING_DATA.slice(0, PAGE_SIZE));
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setData(ALL_BILLING_DATA.slice(0, PAGE_SIZE));
      setPage(1);
      setRefreshing(false);
    }, 1000);
  }, []);

  const loadMore = () => {
    if (loadingMore) return;
    if (data.length >= ALL_BILLING_DATA.length) return;
    setLoadingMore(true);
    setTimeout(() => {
      const nextPage = page + 1;
      setData(ALL_BILLING_DATA.slice(0, nextPage * PAGE_SIZE));
      setPage(nextPage);
      setLoadingMore(false);
    }, 800);
  };

  const renderItem = ({ item }: any) => (
    <View style={styles.row}>
      <View style={styles.rowLeft}>
        <Text style={styles.date}>{item.date}</Text>
        <Text style={styles.method}>{item.method}</Text>
      </View>
      <View style={styles.rowRight}>
        <Text style={styles.amount}>{item.amount}</Text>
        <Text
          style={[
            styles.status,
            item.status === "Paid"
              ? styles.paid
              : item.status === "Pending"
              ? styles.pending
              : styles.failed,
          ]}
        >
          {item.status}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        onEndReached={loadMore}
        onEndReachedThreshold={0.2}
        ListFooterComponent={
          loadingMore ? (
            <Text style={styles.loading}>Loading more...</Text>
          ) : null
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    paddingTop: 8,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "white",
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 10,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 1,
  },
  rowLeft: {
    flex: 1,
  },
  rowRight: {
    alignItems: "flex-end",
  },
  date: {
    fontSize: 15,
    color: "#333",
    fontWeight: "bold",
  },
  method: {
    fontSize: 13,
    color: "#ff8b32",
    marginTop: 2,
  },
  amount: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  status: {
    fontSize: 13,
    marginTop: 2,
    fontWeight: "bold",
  },
  paid: {
    color: "#2ecc71",
  },
  pending: {
    color: "#f1c40f",
  },
  failed: {
    color: "#e74c3c",
  },
  loading: {
    textAlign: "center",
    color: "#aaa",
    marginVertical: 10,
  },
});

export default BillingHistoryScreen;
