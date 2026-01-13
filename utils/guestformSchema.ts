import * as Yup from "yup";

const validationSchema = Yup.object({
  fullName: Yup.string()
    .required("Full name is required"),
  phoneNumber: Yup.string()
    .required("Phone number is required")
    .matches(/^[0-9]{10}$/, "Phone number must be exactly 10 digits")
    .min(10, "Phone number must be exactly 10 digits")
});

export default validationSchema;