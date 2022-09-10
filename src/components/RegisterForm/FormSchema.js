import { Schema } from "rsuite";
const { StringType, NumberType } = Schema.Types;

export const model = Schema.Model({
  name: StringType().isRequired("กรุณากรอกข้อมูลชื่อ."),
  email: StringType()
    .isEmail("Please enter a valid email address.")
    .isRequired("This field is required."),
  contact: StringType()
    .minLength(10, "กรุณากรอกเบอร์ติดต่อให้ถูกต้อง")
    .isRequired("กรุณากรอกเบอร์ติดต่อ"),
  password: StringType().isRequired("กรุณากรอกรหัสผ่าน."),
  verifyPassword: StringType()
    .addRule((value, data) => {
      console.log(data);

      if (value !== data.password) {
        return false;
      }

      return true;
    }, "The two passwords do not match")
    .isRequired("กรุณากรอกรหัสผ่านอีกรอบ."),
});
