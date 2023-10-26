"use strict";
function testPhone(num) {
  if (!num)
    return false;
  const reg = /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/;
  if (!reg.test(num))
    return false;
  return true;
}
exports.testPhone = testPhone;
