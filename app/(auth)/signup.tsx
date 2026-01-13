import {
  TouchableOpacity,
  View,
  Text,
  ScrollView,
  Image,
  StatusBar,
  TextInput,
  Alert
} from "react-native";
import { Formik, FormikHelpers } from "formik";
import { SafeAreaView } from "react-native-safe-area-context";
import validationSchema from "@/utils/signupSchema";
import { useRouter } from "expo-router";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { doc, getFirestore, setDoc } from "firebase/firestore";
import AsyncStorage from '@react-native-async-storage/async-storage';
interface FormValues {
  email: string;
  password: string;
}
const logo = require("../../assets/images/dinetimelogo.png");
const entryImg = require("../../assets/images/Frame.png");

const Signup = () => {
  const router = useRouter();
  const auth = getAuth();
  const db = getFirestore();
  const handleGuest = async () => {
    if (await AsyncStorage.getItem('userEmail')) {
      alert("You are already logged in!");
      router.push("/home")
    }
    else {
      await AsyncStorage.setItem('isGuest', "true");
      router.push("/home")
    }
  }
  const handleSignup = async (values: FormValues, { setSubmitting, setErrors }: FormikHelpers<FormValues>) => {
    try {
      console.log("Submitting Credentials:", values);
      const userCredentials = await createUserWithEmailAndPassword(
        auth, values.email, values.password
      );
      const user = userCredentials.user;
      await setDoc(doc(db, "users", user.uid), {
        email: values.email,
        createdAt: new Date()
      });
      await AsyncStorage.setItem('userEmail', values.email);
      await AsyncStorage.setItem('isGuest', "false");
      console.log(user, AsyncStorage.getItem('userEmail'));
      router.push("/home");

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      const errorCode = (error as any)?.code;
      if (errorCode === 'auth/email-already-in-use') {
        setErrors({ email: "Email is already in use." });
        Alert.alert("Signup Error", "Email is already in use.");
      } else {
        Alert.alert("Signup Error", "An unexpected error occurred. Please try again.");
        console.error("Signup Error:", errorMessage);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="bg-[#2b2b2b]">
      <ScrollView contentContainerStyle={{ height: "100%" }}>
        <View className="w-full flex justify-center items-center">
          <Image source={logo} style={{ width: 220, height: 160 }} resizeMode="contain" />
          <Text className="text-lg text-center text-white font-bold mb-10">
            Let&apos;s Get You Started
          </Text>
        </View>

        <View className="w-full items-center">
          <View className="w-5/6">
            <Formik
              initialValues={{ email: "", password: "" }}
              validationSchema={validationSchema}
              onSubmit={handleSignup}
            >
              {({
                handleChange,
                handleBlur,
                handleSubmit,
                values,
                errors,
                touched,
                isSubmitting
              }) => (
                <View className="w-full">
                  <Text className="text-[#f49b33] mt-4 mb-2">Email</Text>
                  <TextInput
                    className="h-10 border border-white text-white rounded px-2"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    onChangeText={handleChange("email")}
                    value={values.email}
                    onBlur={handleBlur("email")}
                  />
                  {touched.email && errors.email && (
                    <Text className="text-red-500 text-xs mb-2">{errors.email}</Text>
                  )}
                  <Text className="text-[#f49b33] mt-4 mb-2">Password</Text>
                  <TextInput
                    className="h-10 border border-white text-white rounded px-2"
                    secureTextEntry
                    onChangeText={handleChange("password")}
                    value={values.password}
                    onBlur={handleBlur("password")}
                  />
                  {touched.password && errors.password && (
                    <Text className="text-red-500 text-xs mb-2">{errors.password}</Text>
                  )}
                  <TouchableOpacity
                    onPress={() => handleSubmit()}
                    disabled={isSubmitting}
                    className={`p-2 my-2 bg-[#f49b33] rounded-lg mt-10 ${isSubmitting ? 'opacity-50' : ''}`}
                  >
                    <Text className="text-lg font-semibold text-center text-black">
                      {isSubmitting ? "Creating Account..." : "Sign Up"}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </Formik>
            <View className="flex justify-center items-center">

              <TouchableOpacity
                className="flex flex-row justify-center mt-5 p-2 items-center"
                onPress={() => router.push("/signin")}
              >
                <Text className="font-semibold text-white">Already a User? </Text>
                <Text className="text-base font-semibold underline text-[#f49b33]">
                  Sign in
                </Text>
              </TouchableOpacity>
              <Text className="text-center text-lg font-semibold mb-4 text-white">
                <View className="border-b-2 border-[#f49b33] p-2 w-24" /> or{" "}
                <View className="border-b-2 border-[#f49b33] p-2 w-24" />
              </Text>
              <TouchableOpacity
                className="flex flex-row justify-center mb-5 p-2 items-center"
                onPress={handleGuest}
              >
                <Text className="font-semibold text-white">Be a </Text>
                <Text className="text-base font-semibold underline text-[#f49b33]">
                  {" "}Guest User
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View className="flex-1">
          <Image
            source={entryImg}
            className="w-full h-full"
            resizeMode="contain"
          />
        </View>
        <StatusBar barStyle={"light-content"} backgroundColor={"#2b2b2b"} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Signup;