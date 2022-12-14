import { Schema } from "rsuite";
const { StringType } = Schema.Types;

export const model = Schema.Model({
  username: StringType().isRequired("กรุณากรอกชื่อเข้าใช้งาน."),
  password: StringType().isRequired("กรุณากรอกรหัสผ่าน."),
});
