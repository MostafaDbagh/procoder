import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

import ts from "typescript";
const source = fs.readFileSync(new URL("../src/lib/validation.ts", import.meta.url), "utf8");
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
const validators = {};
new Function("exports", compiled)(validators);
const { isValidPublicPhone } = validators;

const examples = {
 Oman: '+96890681829', UAE: '+971 50 224 9596', Saudi: '+966501234567',
 Qatar: '+97455123456', Kuwait: '+96551234567', Bahrain: '+97336123456',
 Syria: '+963944123456', Lebanon: '+96171123456', Jordan: '+962791234567',
 Turkey: '+905321234567', Iran: '+989121234567', Egypt: '+201012345678',
 India: '+919876543210', Pakistan: '+923001234567', Bangladesh: '+8801712345678',
 China: '+8613812345678', Japan: '+819012345678', Korea: '+821012345678',
 Singapore: '+6591234567', Indonesia: '+6281234567890', Philippines: '+639171234567',
 UK: '+447911123456', France: '+33612345678', Germany: '+4915123456789',
 Italy: '+390612345678', Spain: '+34612345678', Netherlands: '+31612345678',
 US: '+12025550123', Brazil: '+5511912345678', Australia: '+61412345678',
};
for (const [country, phone] of Object.entries(examples)) {
 test(country + ' international and 00 formats', () => {
  assert.equal(isValidPublicPhone(phone), true);
  assert.equal(isValidPublicPhone(phone.replace('+', '00')), true);
 });
}
test('local numbers, separators, and localized digits', () => {
 for (const phone of ['90681829', '0502249596', '07911123456', '9876543210', '03001234567',
 '1234567', '+1 (202) 555-0123', '+49.151.23456789', '+٩٦٨٩٠٦٨١٨٢٩',
 '+۹۶۸۹۰۶۸۱۸۲۹', '+९१९८७६५४३२१०', '+৮৮০১৭১২৩৪৫৬৭৮', '＋９６８９０６８１８２９',
 '+123456789012345']) assert.equal(isValidPublicPhone(phone), true, phone);
});
test('reject malformed, empty, too short or too long numbers', () => {
 for (const phone of ['', ' ', '12345', '00000000', 'abc90681829', '++96890681829',
 '968+90681829', '+0123456789', '+1234567890123456', '1234567890123456', '--------'])
 assert.equal(isValidPublicPhone(phone), false, phone);
});
