import { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.nebula.chopncharm",
  appName: "ChopNCharm",
  webDir: "dist",
  server: {
    androidScheme: "https",
  },
  plugins: {
    Keyboard: {
      resize: "body",
      style: "dark",
      resizeOnFullScreen: true,
    },
    StatusBar: {
      style: "dark",
      backgroundColor: "#ffffff",
    },
    CapacitorAssets: {
      iconSource: "./assets/logo.png",
      splashSource: "./assets/splash.png",
    },
  },
};

export default config;
