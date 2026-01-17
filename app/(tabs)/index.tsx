import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Platform,
  Keyboard,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import MapView from "react-native-maps";
import * as Location from "expo-location";
import { useEffect, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ActivityCard from "@/components/activity-card";

export default function ExploreScreen() {
  const insets = useSafeAreaInsets();

  const [location, setLocation] =
    useState<Location.LocationObject | null>(null);
  const [loadingLocation, setLoadingLocation] = useState(true);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setLoadingLocation(false);
        return;
      }

      const loc = await Location.getCurrentPositionAsync({});
      setLocation(loc);
      setLoadingLocation(false);
    })();
  }, []);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <LinearGradient
          colors={["#0B0F14", "#121826"]}
          style={styles.container}
        >
          {/* MAP */}
          {location && (
            <MapView
              style={StyleSheet.absoluteFill}
              initialRegion={{
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.08,
                longitudeDelta: 0.08,
              }}
              showsUserLocation
              showsMyLocationButton={false}
              pitchEnabled={false}
              rotateEnabled={false}
              showsPointsOfInterest={false}
              showsBuildings={false}
              toolbarEnabled={false}
              mapPadding={{
                top: insets.top + 80,
                bottom: 320,
                left: 40,
                right: 40,
              }}
            />
          )}

          {/* MAP DARK OVERLAY */}
          <View pointerEvents="none" style={styles.mapOverlay} />

          {/* HEADER */}
          <View style={[styles.header, { top: insets.top + 12 }]}>
            <Text style={styles.logo}>DROX</Text>
            <TouchableOpacity style={styles.profileCircle}>
              <Text style={styles.profileInitial}>D</Text>
            </TouchableOpacity>
          </View>

          {/* LOADER */}
          {loadingLocation && (
            <ActivityIndicator
              size="large"
              color="#22D3EE"
              style={{ marginTop: 120 }}
            />
          )}

          {/* BOTTOM PANEL */}
          <View
            style={[
              styles.bottomPanel,
              { paddingBottom: insets.bottom + 16 },
            ]}
          >
            <TextInput
              placeholder="Where to chill?"
              placeholderTextColor="#6B7280"
              style={styles.search}
            />

            {/* ACTIVITY LIST */}
            <View style={styles.activityList}>
              {ACTIVITIES.map((item) => (
                <ActivityCard key={item.id} item={item} />
              ))}
            </View>
          </View>

        </LinearGradient>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

function Category({ label }: { label: string }) {
  return (
    <View style={styles.category}>
      <Text style={styles.categoryText}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  activityList: {
    gap: 12,
  },
  header: {
    position: "absolute",
    left: 20,
    right: 20,
    zIndex: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  bottomPanel: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingTop: 18,
    backgroundColor: "rgba(11,15,20,0.97)",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    shadowColor: "#000",
    shadowOpacity: 0.5,
    shadowRadius: 30,
  },
  logo: {
    color: "#22D3EE",
    fontSize: 18,
    fontWeight: "800",
  },
  profileCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#22D3EE",
    alignItems: "center",
    justifyContent: "center",
  },
  profileInitial: {
    color: "#22D3EE",
    fontWeight: "700",
  },
  search: {
    borderWidth: 1,
    borderColor: "#22D3EE",
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    color: "#FFFFFF",
    fontSize: 15,
    marginBottom: 18,
  },
  categories: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 22,
  },
  category: {
    flex: 1,
    marginHorizontal: 4,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#22D3EE",
    paddingVertical: 12,
    alignItems: "center",
  },
  categoryText: {
    color: "#FFFFFF",
    fontSize: 12,
  },
  cta: {
    backgroundColor: "#2563EB",
    paddingVertical: 18,
    borderRadius: 18,
    alignItems: "center",
  },
  ctaText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 1,
  },
  mapOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(10,15,25,0.35)",
  },
});


const ACTIVITIES = [
  {
    id: "1",
    title: "Mountain Trek",
    tag: "Outdoor",
    distance: "5 km away",
    people: 6,
    time: "Starts 4:30 pm",
  },
  {
    id: "2",
    title: "Chill Cafes",
    tag: "Cafe",
    distance: "2 km away",
    people: 3,
    time: "Open now",
  },
  {
    id: "3",
    title: "Bar Hopping",
    tag: "Nightlife",
    distance: "3 km away",
    people: 5,
    time: "Tonight 8 pm",
  },
];


