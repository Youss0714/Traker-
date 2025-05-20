import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.youssoufapp.gys',
  appName: 'gYS',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  android: {
    buildOptions: {
      keystorePath: './android.keystore',
      keystorePassword: 'gysapp2024',
      keystoreAlias: 'gyskey',
      keystoreAliasPassword: 'gysapp2024'
    }
  }
};

export default config;