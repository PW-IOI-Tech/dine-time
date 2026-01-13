import { slots} from "@/store/restaurants"
import { collection, setDoc, doc } from "firebase/firestore";
import { db } from "./firebaseConfig";
const restaurantData = slots

const uploadData = async () => {
    try {
        for (let i = 0; i < restaurantData.length; i++) {
            const restaurant = restaurantData[i];
            const docref = doc(collection(db, "slots"),`slots_${i+1}`);
            await setDoc(docref, restaurant);
        }
        console.log("Data uploaded successfully");
    }
    catch (error) {
        console.error("Error uploading data: ", error);
    }
}

export default uploadData;

// import { carouselImages} from "@/store/restaurants"
// import { collection, setDoc, doc } from "firebase/firestore";
// import { db } from "./firebaseConfig";
// const restaurantData = carouselImages

// const uploadData = async () => {
//     try {
//         for (let i = 0; i < restaurantData.length; i++) {
//             const restaurant = restaurantData[i];
//             const docref = doc(collection(db, "carousel"),`carousel_${i+1}`);
//             await setDoc(docref, restaurant);
//         }
//         console.log("Data uploaded successfully");
//     }
//     catch (error) {
//         console.error("Error uploading data: ", error);
//     }
// }

// export default uploadData;

// import { restaurants } from "@/store/restaurants"
// import { collection, setDoc, doc } from "firebase/firestore";
// import { db } from "./firebaseConfig";


// const restaurantData = restaurants

// const uploadData = async () => {
//     try {
//         for (let i = 0; i < restaurantData.length; i++) {
//             const restaurant = restaurantData[i];
//             const docref = doc(collection(db, "restaurants"),`restaurant_${i+1}`);
//             await setDoc(docref, restaurant);
//         }
//         console.log("Data uploaded successfully");
//     }
//     catch (error) {
//         console.error("Error uploading data: ", error);
//     }
// }

// export default uploadData;