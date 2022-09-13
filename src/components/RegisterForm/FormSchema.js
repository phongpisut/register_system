import { Schema } from "rsuite";
const { StringType, NumberType } = Schema.Types;

export const model = Schema.Model({
  name: StringType().isRequired("กรุณากรอกข้อมูลชื่อ."),
  surname: StringType().isRequired("กรุณากรอกข้อมูลนามสกุล."),
  tel: StringType()
    .minLength(10, "กรุณากรอกเบอร์ติดต่อให้ถูกต้อง")
    .isRequired("กรุณากรอกเบอร์ติดต่อ"),
});
