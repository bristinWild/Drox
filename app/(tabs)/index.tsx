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
  Image
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import MapView from "react-native-maps";
import * as Location from "expo-location";
import { useEffect, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ActivityCard from "@/components/activity-card";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from "react-native-reanimated";
import { interpolate, Extrapolation } from "react-native-reanimated";
import { router } from "expo-router";
import ActivityJoinModal from "@/components/activity-join-modal";




const SHEET_MAX_HEIGHT = 520;
const SHEET_MIN_HEIGHT = 260;

export default function ExploreScreen() {
  const insets = useSafeAreaInsets();
  const translateY = useSharedValue(0);
  const startY = useSharedValue(0);



  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [loadingLocation, setLoadingLocation] = useState(true);
  const [selectedActivity, setSelectedActivity] = useState<any | null>(null);
  const isJoinOpen = selectedActivity !== null;


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
        translateY.value = withSpring(
          -SHEET_MAX_HEIGHT + SHEET_MIN_HEIGHT
        );
      } else {
        translateY.value = withSpring(0);
      }
    });


  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      translateY.value,
      [-SHEET_MAX_HEIGHT + SHEET_MIN_HEIGHT, 0],
      [0.6, 0],
      Extrapolation.CLAMP
    ),
  }));



  return (
    <LinearGradient colors={["#0B0F14", "#121826"]} style={styles.container}>
      {/* <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}> */}
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
                    bottom: SHEET_MIN_HEIGHT,
                    left: 40,
                    right: 40,
                  }}
                />
              )}
            </View>
          </TouchableWithoutFeedback>


          {/* MAP DARK OVERLAY */}
          <View pointerEvents="none" style={styles.mapOverlay} />

          {/* HEADER */}
          <View style={[styles.header, { top: insets.top + 12 }]}>
            <Text style={styles.logo}>DROX</Text>
            <TouchableOpacity style={styles.profileCircle}
              onPress={() => router.push("/profile")}>
              <Image
                source={require('@/assets/images/cat-icon.png')}
                style={styles.profileImage}
              />
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
                  placeholderTextColor="#6B7280"
                  style={styles.search}
                />

                <View style={styles.activityList}>
                  {ACTIVITIES.map((item) => (
                    <ActivityCard
                      key={item.id}
                      item={item}
                      onJoin={() => {
                        setSelectedActivity(item);
                      }}
                    />
                  ))}
                </View>
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
            translateY.value = withSpring(0); // reopen explore sheet
          }}
        />
      )}

      {/* </TouchableWithoutFeedback> */}

    </LinearGradient>
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
    bottom: -SHEET_MAX_HEIGHT + SHEET_MIN_HEIGHT, // 👈 KEY
    left: 0,
    right: 0,
    height: SHEET_MAX_HEIGHT, // 👈 KEY
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

  profileImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
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

  dragHandle: {
    width: 44,
    height: 5,
    borderRadius: 3,
    backgroundColor: "#374151",
    alignSelf: "center",
    marginBottom: 12,
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
    description: "Early morning trek with fellow solo travelers. Moderate difficulty.",
    image: require("@/assets/images/hiking.png"),
    joiningFee: "₹299",
    online: 8,
    male: 5,
    female: 3,
  },

  {
    id: "2",
    title: "Chill Cafes",
    tag: "Cafe",
    distance: "2 km away",
    people: 3,
    time: "Open now",
    description: "Cafe hopping, conversations, and meeting like-minded travelers.",
    image: require("@/assets/images/cafe.png"),
    joiningFee: "Free",
    online: 4,
    male: 2,
    female: 2,
  },

  {
    id: "3",
    title: "Bar Hopping",
    tag: "Nightlife",
    distance: "3 km away",
    people: 5,
    time: "Tonight 8 pm",
    description: "Explore the city nightlife with a friendly group.",
    image: require("@/assets/images/beer-mug.png"),
    joiningFee: "₹499",
    online: 6,
    male: 4,
    female: 2,
  },
];


