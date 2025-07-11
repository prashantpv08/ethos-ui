import * as yup from "yup";
import { ErrorMsg } from "../helpers/contants";
import { businessType } from "./constantData";

export const regexForZipcode = /^[A-Za-z0-9\s]+$/;

export const RegisterFormSchema = yup
  .object({
    firstName: yup
      .string()
      .required(ErrorMsg("First Name").required)
      .min(3, ErrorMsg(3).min)
      .max(50, ErrorMsg(50).max)
      .matches(/^[a-zA-Z]+$/, ErrorMsg("First Name").onlyLetter),
    lastName: yup
      .string()
      .required("Last Name is required.")
      .min(3, ErrorMsg(3).min)
      .max(50, ErrorMsg(50).min)
      .matches(/^[a-zA-Z]+$/, "Last Name should only contain letters"),
    email: yup
      .string()
      .required("Email is required.")
      .matches(
        /^[a-zA-Z0-9]+(\.[a-zA-Z0-9]+)*@[a-zA-Z0-9]+(\.[a-zA-Z0-9]+)+$/,
        "Please enter a valid email."
      )
      .max(100, "Email must be at most 100 characters long.")
      .email("Please enter valid email."),
    password: yup
      .string()
      .min(6, "Password must be at least 6 characters")
      .max(16, "Password must be less then 17 characters")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
        "Password must include at least one uppercase letter, one lowercase letter, and one numeric digit"
      )
      .required("Password is required"),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password"), ""], "Passwords must match")
      .required("Confirm Password is required"),
    termsAndConditions: yup
      .boolean()
      .oneOf([true], "You must accept the Terms and Conditions"),
  })
  .required();

export const numberValidation = (nullable: boolean = false) => {
  if (nullable) {
    return yup
      .number()
      .typeError("Enter a valid number ") // Display custom error message for non-numeric values
      .test(
        "is-decimal",
        "Enter a valid number with up to two decimal places",
        (value: any) => {
          if (!value) return true; // Allow empty string or undefined

          // Check if the value is a valid number with up to two decimal places
          return /^\d+(\.\d{0,2})?$/.test(value);
        }
      )

      .min(0, "Value must be 0 or positive")
      .transform((value, originalValue) => {
        return originalValue === "" ? null : value;
      })
      .nullable();
  } else {
    return yup
      .number()
      .typeError("Enter a valid number") // Display custom error message for non-numeric values
      .test(
        "is-decimal",
        "Enter a valid number with up to two decimal places",
        (value: any) => {
          if (!value) return true; // Allow empty string or undefined

          // Check if the value is a valid number with up to two decimal places
          return /^\d+(\.\d{0,2})?$/.test(value);
        }
      )
      .min(0, "Value must be 0 or positive"); // Optional: Ensure the number is positive
  }
};

export const nullableStringValidation = yup
  .string()
  .transform((value, originalValue) => {
    return originalValue === "" ? null : value;
  })
  .nullable();

export const AddProductFormSchema = yup
  .object({
    // department: yup.string().required('Please select department.'),
    department: yup
      .array()
      .min(1)
      .required("at least one item needs to be here"),
    category: yup.array().min(1).required("at least one item needs to be here"),
    type: yup.string().required("Please select Type."),
    title: yup
      .string()
      .required(ErrorMsg("Title").required)
      .min(3, ErrorMsg(3).min)
      .max(60, ErrorMsg(60).max),
    productModel: nullableStringValidation
      .min(3, ErrorMsg(3).min)
      .max(60, ErrorMsg(60).min),
    sku: nullableStringValidation
      .min(3, ErrorMsg(3).min)
      .max(50, ErrorMsg(50).min),

    description: yup.string().max(500, ErrorMsg(500).max),

    files: yup
      .mixed()
      .test(
        "fileSize",
        "Total files should be less than 35MB",
        (value: any) => {
          if (!value) return true;
          const totalSize: any = Array.from(value).reduce(
            (acc, file: any) => acc + file.size,
            0
          );
          return totalSize <= 36700160;
        }
      )
      .test("fileType", "Invalid file type", (value: any) => {
        if (!value) return true;

        const imageCount = Array.from(value).filter(
          (file: any) =>
            file.type === "image/jpeg" ||
            file.type === "image/jpg" ||
            file.type === "image/png"
        ).length;

        const videoCount = Array.from(value).filter(
          (file: any) => file.type === "video/mp4"
        ).length;

        return imageCount + videoCount === Array.from(value).length;
      })
      .test("imageSize", "Each image should be less than 3MB", (value: any) => {
        if (!value) return true;
        return Array.from(value).every((file: any) =>
          file.type.startsWith("video/")
            ? true
            : file.type.startsWith("image/") && file.size <= 3145728
        ); // 3MB in bytes
      })
      .test("videoSize", "Video should be less than 30MB", (value: any) => {
        if (!value) return true;
        return Array.from(value).every((file: any) =>
          file.type.startsWith("image/")
            ? true
            : file.type.startsWith("video/") && file.size <= 31457280
        );
      }),

    attributes: yup
      .array()
      .of(
        yup.object().shape({
          key: yup
            .string()
            .required(ErrorMsg("Attribute name").required)
            .max(30, ErrorMsg(30).max),
          value: yup
            .string()
            .required(ErrorMsg("Description").required)
            .max(30, ErrorMsg(30).max),
        })
      )
      .test(
        "atLeastOneValue",
        "At least one value is required",
        function (value) {
          if (Array.isArray(value)) {
            return value.length > 0;
          }
          // Handle other types if needed
          return false;
        }
      ),
  })
  .required();

const TagsSchema = yup.object({
  tags: yup
    .array()
    .of(
      yup.object().shape({
        tag: yup
          .string()
          .required("String is required")
          .max(20, "String must have at most 20 characters"),
      })
    )
    .min(1, "At least one tag is required")
    .max(3, "Maximum of three tags allowed"),
  cardTags: yup
    .array()
    .of(
      yup.object().shape({
        tag: yup
          .string()
          .required("String is required")
          .max(20, "String must have at most 20 characters"),
      })
    )
    .min(1, "At least one tag is required")
    .max(3, "Maximum of three tags allowed"),
});

export const AddServiceFormSchema = yup
  .object({
    department: yup
      .array()
      .min(1)
      .required("at least one item needs to be here"),
    category: yup.array().min(1).required("at least one item needs to be here"),
    // type: yup.string().default('Service'),
    title: yup
      .string()
      .required(ErrorMsg("Title").required)
      .min(3, ErrorMsg(3).min)
      .max(60, ErrorMsg(60).max),
    // subTitle: yup.string().min(3, ErrorMsg(3).min).max(60, ErrorMsg(60).max),
    // isFeatureProduct: yup.boolean().default(false),
    description: yup.string().max(500, ErrorMsg(500).max),
    // isRushEnable: yup.boolean().default(false),
    // rushFee: numberValidation(false).when('isRushEnable', {
    //   is: (val: boolean) => val,
    //   then: (schema) => schema.required(ErrorMsg('Rush Fee').required),
    // }),
    // rushEta: numberValidation(true)
    //   .integer()
    //   .when('isRushEnable', {
    //     is: (val: boolean) => val,
    //     then: (schema) => schema.required(ErrorMsg('Rush Eta').required),
    //   }),
    files: yup
      .mixed()
      .test(
        "fileSize",
        "Total files should be less than 35MB",
        (value: any) => {
          if (!value) return true;
          const totalSize: any = Array.from(value).reduce(
            (acc, file: any) => acc + file.size,
            0
          );
          return totalSize <= 36700160;
        }
      )
      .test("fileType", "Invalid file type", (value: any) => {
        if (!value) return true;

        const imageCount = Array.from(value).filter(
          (file: any) =>
            file.type === "image/jpeg" ||
            file.type === "image/jpg" ||
            file.type === "image/png"
        ).length;

        const videoCount = Array.from(value).filter(
          (file: any) => file.type === "video/mp4"
        ).length;

        return imageCount + videoCount === Array.from(value).length;
      })
      .test("imageSize", "Each image should be less than 3MB", (value: any) => {
        if (!value) return true;
        return Array.from(value).every((file: any) =>
          file.type.startsWith("video/")
            ? true
            : file.type.startsWith("image/") && file.size <= 3145728
        ); // 3MB in bytes
      })
      .test("videoSize", "Video should be less than 30MB", (value: any) => {
        if (!value) return true;
        return Array.from(value).every((file: any) =>
          file.type.startsWith("image/")
            ? true
            : file.type.startsWith("video/") && file.size <= 31457280
        );
      }),
    // rateModel: yup.string().required(ErrorMsg('Rate Model').required),
    // rentPeriod: yup.string().required(ErrorMsg('Billable Minimums').required),
    // rentPerPeriod: numberValidation(false).required(
    //   ErrorMsg('Price ').required
    // ),
    // rentPeriodVal: numberValidation(false).when('rentPeriod', {
    //   is: (val: string) => val === 'Others',
    //   then: (schema) => schema.required(ErrorMsg('Billable Minimums').required),
    // }),
    // OTFee: numberValidation(true),
    // DTFee: numberValidation(true),
    // rentPerDiemCost: numberValidation(true),
    // rentTravelCost: numberValidation(true),
    // rentCancellationFee: numberValidation(true),
    // rentDeliveryFee: numberValidation(false).required(
    //   ErrorMsg('Rent Delivery Fee').required
    // ),
    // rentDiscountType: yup.string().default('%'),
    // rentDiscount: numberValidation(true).when('rentDiscountType', {
    //   is: (val: string) => val === '%',
    //   then: (schema) => schema.max(100, ErrorMsg('').percentage),
    // }),
    attributes: yup
      .array()
      .of(
        yup.object().shape({
          key: yup
            .string()
            .required(ErrorMsg("Attribute name").required)
            .max(30, ErrorMsg(30).max),
          value: yup
            .string()
            .required(ErrorMsg("Description").required)
            .max(30, ErrorMsg(30).max),
        })
      )
      .test(
        "atLeastOneValue",
        "At least one value is required",
        function (value) {
          if (Array.isArray(value)) {
            return value.length > 0;
          }
          // Handle other types if needed
          return false;
        }
      ),
  })
  .concat(TagsSchema)
  .required();

export const BusinessSchema = yup
  .object({
    businessLocation: yup
      .object()
      .typeError(ErrorMsg("Business Location").required)
      .required(ErrorMsg("Business Location").required),
    businessType: yup
      .string()
      .required(ErrorMsg("Business Type").required)
      .default(businessType[0]),
    businessName: yup
      .string()
      .required("Business Name is required")
      .matches(
        /^[a-zA-Z0-9_\s]+$/,
        "Value can only contain letters, numbers, and underscores"
      )
      .min(3, ErrorMsg(3).min)
      .max(50, ErrorMsg(50).min),
    department: yup
      .array()
      .min(1, "Select at least one value")
      .required("Select at least one value"),
    businessAddress: yup
      .string()
      .required("Address is required")
      .max(500, "Address must be at most 500 characters long"),
    businessZipCode: yup
      .string()
      .matches(regexForZipcode, "Invalid Zip code.")
      .required("Zip code is required.")
      .max(10, "Invalid Zip code."),
  })
  .required();

export const ContactInfoSchema = yup
  .object({
    firstName: yup
      .string()
      .required("First Name is required")
      .matches(/^[a-zA-Z]+$/, "First Name should only contain letters")
      .min(3, ErrorMsg(3).min)
      .max(50, ErrorMsg(50).max),
    middleName: yup
      .string()
      .transform((value, originalValue) => {
        return originalValue === "" ? null : value;
      })
      .matches(/^[a-zA-Z]*$/, "Middle Name should only contain letters")
      .min(3, ErrorMsg(3).min)
      .max(50, ErrorMsg(50).max)
      .nullable(),
    lastName: yup
      .string()
      .required("Last Name is required")
      .min(3, ErrorMsg(3).min)
      .max(50, ErrorMsg(50).max)
      .matches(/^[a-zA-Z]+$/, "Last Name should only contain letters"),
    dob: yup
      .string()
      .test("validDateOfBirth", "Invalid date of birth", function (value) {
        if (!value) return true; // Allow empty input
        const today = new Date();
        const dob = new Date(value);
        const age = today.getFullYear() - dob.getFullYear();
        if (dob > today || age < 18) {
          return false;
        }
        return true;
      })
      .required("Date of birth is required"),
    zipCode: yup
      .string()
      .matches(regexForZipcode, "Invalid Zip code.")
      .required("Zip code is required.")
      .max(10, "Invalid Zip code."),
    city: yup
      .string()
      .required("City is required")
      .matches(/^[a-zA-Z\s]+$/, "Only alphabets are allowed.")
      .max(30, "City must be at most 30 characters long"),
    state: yup.string().required("State is required"),
    addressLineOne: yup
      .string()
      .required("Address is required")
      .max(500, "Address must be at most 500 characters long"),
    addressLineTwo: yup
      .string()
      .max(500, "Address must be at most 500 characters long"),
    country: yup.object().required("Country is required"),
    // business_location: yup.object().required('Country is required'),
  })
  .required();
