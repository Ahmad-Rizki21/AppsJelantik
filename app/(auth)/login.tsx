import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Image, KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function LoginScreen() {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  
  // State for inputs can be added here
  
  const handleBack = () => {
    router.replace('/(auth)/onboarding');
  };

  const handleLogin = () => {
    // Implement login logic here
    router.replace('/(tabs)');
  };

  const handleRegister = () => {
    // Implement register logic here (navigate to OTP usually)
    // For now, go to main
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={{ height: 40 }} />

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Header */}
        <View style={styles.header}>
            <Image source={require('../../assets/images/Jelantik_Logo.png')} style={styles.logo} resizeMode="contain" />
            <Text style={styles.headerSubtext}>Additional information provided here.</Text>
        </View>

        {/* Tabs */}
        <View style={styles.tabContainer}>
            <TouchableOpacity 
                style={[styles.tab, activeTab === 'login' && styles.activeTab]} 
                onPress={() => setActiveTab('login')}
            >
                <Text style={[styles.tabText, activeTab === 'login' && styles.activeTabText]}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity 
                style={[styles.tab, activeTab === 'register' && styles.activeTab]} 
                onPress={() => setActiveTab('register')}
            >
                <Text style={[styles.tabText, activeTab === 'register' && styles.activeTabText]}>Register</Text>
            </TouchableOpacity>
        </View>
        <View style={styles.tabDivider} />

        {/* content */}
        <View style={styles.formContainer}>
            {activeTab === 'login' ? (
                <LoginForm onLogin={handleLogin} />
            ) : (
                <RegisterForm onRegister={handleRegister} />
            )}
        </View>

      </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function LoginForm({ onLogin }: { onLogin: () => void }) {
    return (
        <View>
            <CustomTextField hint="Username" />
            <View style={{ height: 20 }} />
            <CustomTextField hint="Password" secureTextEntry />
            <View style={{ height: 40 }} />
            
            <PrimaryButton title="Login" onPress={onLogin} />
            
            <View style={{ height: 20 }} />
            <DividerWithText text="OR" />
            <View style={{ height: 20 }} />
            
            <GoogleButton text="Login with Google" />
        </View>
    )
}

function RegisterForm({ onRegister }: { onRegister: () => void }) {
    return (
        <View>
            <CustomTextField hint="Email Address" />
            <View style={{ height: 20 }} />
            <CustomTextField hint="Create a Password" secureTextEntry />
            <View style={{ height: 20 }} />
            <CustomTextField hint="Confirm Password" secureTextEntry />
            <View style={{ height: 40 }} />
            
            <PrimaryButton title="Create Account" onPress={onRegister} />
            
            <View style={{ height: 20 }} />
            <DividerWithText text="OR" />
            <View style={{ height: 20 }} />
            
            <GoogleButton text="Register with Google" />
        </View>
    )
}

function CustomTextField({ hint, secureTextEntry }: { hint: string, secureTextEntry?: boolean }) {
    return (
        <View style={styles.inputContainer}>
            <TextInput 
                placeholder={hint} 
                secureTextEntry={secureTextEntry}
                style={styles.input}
                placeholderTextColor="rgba(0,0,0,0.38)"
            />
        </View>
    )
}

function PrimaryButton({ title, onPress }: { title: string, onPress: () => void }) {
    return (
        <TouchableOpacity style={styles.primaryButton} onPress={onPress}>
            <Text style={styles.primaryButtonText}>{title}</Text>
        </TouchableOpacity>
    )
}

function GoogleButton({ text }: { text: string }) {
    return (
       <TouchableOpacity style={styles.googleButton}>
           <Image source={require('../../assets/images/google_logo.png')} style={{ width: 24, height: 24, marginRight: 12 }} />
           <Text style={styles.googleButtonText}>{text}</Text>
       </TouchableOpacity>
    )
}

function DividerWithText({ text }: { text: string }) {
    return (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ flex: 1, height: 1, backgroundColor: 'rgba(0,0,0,0.12)' }} />
            <Text style={{ marginHorizontal: 16, color: 'rgba(0,0,0,0.54)', fontFamily: 'Poppins-Regular' }}>{text}</Text>
            <View style={{ flex: 1, height: 1, backgroundColor: 'rgba(0,0,0,0.12)' }} />
        </View>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  appBar: {
    height: 56,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  backButton: {
    padding: 8,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 16,
  },
  headerSubtext: {
    fontSize: 14,
    color: 'grey',
    fontFamily: 'Poppins-Regular',
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 40,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#3B82F6',
  },
  tabText: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: 'rgba(0,0,0,0.54)',
  },
  activeTabText: {
    color: '#3B82F6',
  },
  tabDivider: {
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.12)',
    marginHorizontal: 40,
  },
  formContainer: {
    paddingHorizontal: 40,
    paddingVertical: 40,
  },
  inputContainer: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: Platform.OS === 'ios' ? 16 : 4,
  },
  input: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: 'black',
  },
  primaryButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 16,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 5,
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
  },
  googleButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      height: 56,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: 'grey',
      backgroundColor: 'white',
  },
  googleButtonText: {
      fontSize: 16,
      color: 'rgba(0,0,0,0.87)',
      fontFamily: 'Poppins-SemiBold',
  }

});
