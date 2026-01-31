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
  Image,
  Alert,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import MapView from "react-native-maps";
import * as Location from "expo-location";
import { useEffect, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ActivityCard from "@/components/activity-card";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withTiming, withRepeat, Easing } from "react-native-reanimated";
import { interpolate, Extrapolation } from "react-native-reanimated";
import { router } from "expo-router";
import ActivityJoinModal from "@/components/activity-join-modal";
import { getActivities, Activity } from "@/api/activity";
import { getAccessToken } from "@/constants/auth";
import { Marker } from "react-native-maps";
import { useUserApi } from "@/api/user";


const SHEET_MAX_HEIGHT = 520;
const SHEET_MIN_HEIGHT = 260;

export default function ExploreScreen() {
  const insets = useSafeAreaInsets();
  const translateY = useSharedValue(0);
  const startY = useSharedValue(0);

  const { getMe } = useUserApi();
  const [user, setUser] = useState<any>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [loadingLocation, setLoadingLocation] = useState(true);
  const [selectedActivity, setSelectedActivity] = useState<any | null>(null);
  const isJoinOpen = selectedActivity !== null;
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loadingActivities, setLoadingActivities] = useState(false);
  const [showProfileHint, setShowProfileHint] = useState(true);


  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Denied", "Location permission is required");
        setLoadingLocation(false);
        return;
      }

      const loc = await Location.getCurrentPositionAsync({});
      setLocation(loc);
      setLoadingLocation(false);
    })();
  }, []);

  useEffect(() => {
    fetchActivities();
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const me = await getMe();
        setUser(me);
      } catch (err) {
        console.error("Failed to load user", err);
      } finally {
        setLoadingUser(false);
      }
    };

    fetchUser();
  }, []);

  const pulse = useSharedValue(0);

  useEffect(() => {
    pulse.value = withRepeat(
      withTiming(1, {
        duration: 2000,
        easing: Easing.out(Easing.ease),
      }),
      -1,
      false
    );
  }, []);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale: 1 + pulse.value * 0.6,
      },
    ],
    opacity: 1 - pulse.value,
  }));



  const fetchActivities = async () => {
    try {
      setLoadingActivities(true);
      const token = await getAccessToken();

      if (!token) {
        Alert.alert("Error", "Please login again");
        router.replace("/auth");
        return;
      }

      const data = await getActivities(token);
      setActivities(data);
    } catch (error: any) {
      console.error("Failed to fetch activities:", error);
      if (error.response?.status === 401) {
        Alert.alert("Error", "Session expired. Please login again");
        router.replace("/auth");
      } else {
        Alert.alert("Error", "Failed to load activities");
      }
    } finally {
      setLoadingActivities(false);
    }
  };

  const calculateDistance = (activityLat: number, activityLng: number) => {
    if (!location) return "N/A";

    const userLat = location.coords.latitude;
    const userLng = location.coords.longitude;

    const R = 6371;
    const dLat = (activityLat - userLat) * Math.PI / 180;
    const dLon = (activityLng - userLng) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(userLat * Math.PI / 180) * Math.cos(activityLat * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    if (distance < 1) {
      return `${Math.round(distance * 1000)}m`;
    }
    return `${distance.toFixed(1)}km`;
  };

  const panGesture = Gesture.Pan().activeOffsetY([-10, 10])
    .onBegin(() => {
      startY.value = translateY.value;
    })
    .onUpdate((e) => {
      const nextY = startY.value + e.translationY;
      translateY.value = Math.max(
        -SHEET_MAX_HEIGHT + SHEET_MIN_HEIGHT,
        Math.min(nextY, 0)
      );
    })
    .onEnd((e) => {
      if (e.velocityY < -500 || translateY.value < -SHEET_MAX_HEIGHT / 2) {
        translateY.value = withSpring(-SHEET_MAX_HEIGHT + SHEET_MIN_HEIGHT);
      } else {
        translateY.value = withSpring(0);
      }
    });

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const handleJoined = (activityId: string) => {
    setActivities(prev =>
      prev.map(a =>
        a.id === activityId
          ? { ...a, people: (a.people || 0) + 1 }
          : a
      )
    );
  };

  return (
    <LinearGradient colors={["#B3E0F2", "#FFFFFF"]} style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <LinearGradient
          colors={["#0B0F14", "#121826"]}
          style={styles.container}
        >
          {/* MAP */}
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={StyleSheet.absoluteFill}>
              {location ? (
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
                    bottom: SHEET_MIN_HEIGHT,
                    left: 40,
                    right: 40,
                  }}
                >
                  {activities.map((activity) => (
                    <Marker
                      key={activity.id}
                      coordinate={{
                        latitude: activity.location.lat,
                        longitude: activity.location.lng,
                      }}
                      title={activity.title}
                      description={activity.location.name}
                      onPress={() => setSelectedActivity(activity)}
                    />
                  ))}
                </MapView>
              ) : (
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                  <ActivityIndicator size="large" color="#5674A6" />
                  <Text style={{ color: "#9AA6B2", marginTop: 12 }}>
                    Loading map...
                  </Text>
                </View>
              )}
            </View>
          </TouchableWithoutFeedback>

          {/* MAP OVERLAY */}
          <View pointerEvents="none" style={styles.mapOverlay} />

          {/* HEADER */}
          <View style={[styles.header, { top: insets.top + 12 }]}>
            <View style={styles.profileWrapper}>
              {/* Pulse ring */}
              <Animated.View style={[styles.pulseRing, pulseStyle]} />

              {/* Profile avatar */}
              <TouchableOpacity
                style={styles.profileOuter}
                onPress={() => {
                  setShowProfileHint(false);
                  router.push("/profile");
                }}
              >
                <View style={styles.profileCircle}>
                  <Image
                    source={
                      user?.avatarUrl
                        ? { uri: user.avatarUrl }
                        : require("@/assets/images/cat-icon.png")
                    }
                    style={styles.profileImage}
                  />
                </View>
              </TouchableOpacity>

              {/* Tooltip */}
              {showProfileHint && (
                <View style={styles.tooltip}>
                  <Text style={styles.tooltipText}>
                    Tap here to view your profile!
                  </Text>
                  <View style={styles.tooltipArrow} />
                </View>
              )}
            </View>
          </View>

          {/* BOTTOM PANEL */}
          {!isJoinOpen && (
            <GestureDetector gesture={panGesture}>
              <Animated.View
                style={[
                  styles.bottomPanel,
                  sheetStyle,
                  { paddingBottom: insets.bottom + 16 },
                ]}
              >
                <View style={styles.dragHandle} />

                <TextInput
                  placeholder="Where to chill?"
                  placeholderTextColor="#9AA6B2"
                  style={styles.search}
                />

                {loadingActivities ? (
                  <ActivityIndicator
                    size="large"
                    color="#5674A6"
                    style={{ marginTop: 40 }}
                  />
                ) : activities.length === 0 ? (
                  <View style={{ alignItems: "center", marginTop: 40 }}>
                    <Text style={{ color: "#9AA6B2", fontSize: 16 }}>
                      No activities nearby
                    </Text>
                  </View>
                ) : (
                  <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.activityList}
                    showsVerticalScrollIndicator={false}
                  >
                    {activities.map((item) => (
                      <ActivityCard
                        key={item.id}
                        item={{
                          ...item,
                          distance: calculateDistance(
                            item.location.lat,
                            item.location.lng
                          ),
                          people: item.participantCount ?? 0
                          ,
                        }}
                        onJoin={() => setSelectedActivity(item)}
                      />
                    ))}
                  </ScrollView>
                )}
              </Animated.View>
            </GestureDetector>
          )}
        </LinearGradient>
      </KeyboardAvoidingView>

      {selectedActivity && (
        <ActivityJoinModal
          activity={selectedActivity}
          onClose={() => {
            setSelectedActivity(null);
            translateY.value = withSpring(0);
          }}
          onJoined={handleJoined}
        />
      )}
    </LinearGradient>
  );

}


const styles = StyleSheet.create({

  scrollView: {
    flex: 1,
  },

  container: {
    flex: 1,
  },

  activityList: {
    gap: 12,
    paddingBottom: 20,
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
    bottom: -SHEET_MAX_HEIGHT + SHEET_MIN_HEIGHT,
    left: 0,
    right: 0,
    height: SHEET_MAX_HEIGHT,
    paddingHorizontal: 20,
    paddingTop: 18,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    shadowColor: "#5674A6",
    shadowOpacity: 0.25,
    shadowRadius: 30,
    elevation: 8,
  },

  logo: {
    color: "#8B2F4B",
    fontSize: 18,
    fontWeight: "800",
  },

  profileCircle: {
    width: 46,
    height: 46,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: "#E6A57E",
    backgroundColor: "#FFFFFF",
    shadowColor: "#5674A6",
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 4,
    alignItems: "center",
    justifyContent: "center",
  },

  profileImage: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },

  search: {
    borderWidth: 1,
    borderColor: "#D6E3F0",
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: "#FFFFFF",
    color: "#2E2E2E",
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
    backgroundColor: "rgba(255,255,255,0.25)",
  },

  dragHandle: {
    width: 44,
    height: 5,
    borderRadius: 3,
    backgroundColor: "#D6E3F0",
    alignSelf: "center",
    marginBottom: 12,
  },

  profileOuter: {
    width: 60,
    height: 60,
    borderRadius: 28,
    backgroundColor: "#FFFFFF", // outer ring
    alignItems: "center",
    justifyContent: "center",

    // shadow for map contrast
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 6,
  },

  profileWrapper: {
    position: "relative",
  },

  pulseRing: {
    position: "absolute",
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(255, 99, 132, 0.35)", // soft pink
  },

  tooltip: {
    position: "absolute",
    top: 56,
    left: 0,

    minWidth: 220,          // ✅ KEY FIX
    maxWidth: 260,

    backgroundColor: "#FFFFFF",
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,

    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },


  tooltipText: {
    color: "#8B2F4B",
    fontSize: 14,
    fontWeight: "600",
    flexShrink: 1,
  },

  tooltipArrow: {
    position: "absolute",
    top: -6,
    left: 18,
    width: 12,
    height: 12,
    backgroundColor: "#FFFFFF",
    transform: [{ rotate: "45deg" }],
  },





});