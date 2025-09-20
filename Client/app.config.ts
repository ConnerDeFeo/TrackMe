import {ConfigContext, ExpoConfig} from 'expo/config';

const EAS_PROJECT_ID = '7a30db18-1202-43a9-9ca5-8c93acc236ed';
const EAS_PROJECT_OWNER = 'connerjackdefeo';
const EAS_ORG_SLUG = 'Client';

const APP_NAME = "Track Me";
const BUNDLE_IDENTIFIER = "com.connerdefeo.trackme.prod";
const PACKAGE_NAME = "com.connerdefeo.trackme.prod";


export default ({ config }: ConfigContext): ExpoConfig => {
  return {
    ...config,
    name: APP_NAME,
    slug: EAS_ORG_SLUG,
    version: "1.0.0",
    orientation: "portrait",
    userInterfaceStyle: "light",
    newArchEnabled: true,
    splash: {
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.connerdefeo.trackme",
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false,
      },
    },
    android: {
      adaptiveIcon: {
        backgroundColor: "#ffffff",
      },
      edgeToEdgeEnabled: true,
      package: "com.connerdefeo.trackme",
    },
    web: {},
    plugins: ["expo-secure-store"],
    extra: {
      eas: {
        projectId: "7a30db18-1202-43a9-9ca5-8c93acc236ed",
      },
      apiUrl: process.env.EXPO_PUBLIC_API_URL
    },
  };
};