import { ConfigContext, ExpoConfig } from "expo/config";

const APP_ID = "7a30db18-1202-43a9-9ca5-8c93acc236ed";
const APP_NAME = "TrackMe";
const BUNDLE_IDENTIFIER = "com.connerdefeo.trackme.prod";
const PACKAGE_NAME = "com.connerdefeo.trackme.prod";
const ICON = "./assets/images/Track.png";

export default ({ config }: ConfigContext): ExpoConfig => {
  return {
    ...config,
    name: APP_NAME,
    slug: "Client",
    version: "2.3.0",
    orientation: "portrait",
    userInterfaceStyle: "light",
    newArchEnabled: true,
    icon: ICON,
    splash: {
      resizeMode: "contain",
      backgroundColor: "#ffffff",
      image: ICON,
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: BUNDLE_IDENTIFIER,
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false,
      }
    },
    android: {
      adaptiveIcon: {
        backgroundColor: "#ffffff",
      },
      edgeToEdgeEnabled: true,
      package: PACKAGE_NAME,
      versionCode: 20,
    },
    plugins: ["expo-secure-store"],
    extra: {
      eas: {
        projectId: APP_ID,
         
      }
    },
    updates: {
      url: "https://u.expo.dev/7a30db18-1202-43a9-9ca5-8c93acc236ed", 
      fallbackToCacheTimeout: 0
    },
    runtimeVersion: {
      policy: "appVersion",
    },
  };
};