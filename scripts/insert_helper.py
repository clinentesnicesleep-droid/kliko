# -*- coding: utf-8 -*-
with open(r"c:\Users\RAMON\Desktop\KLIKO\js\app.js", "r", encoding="utf-8") as f:
    text = f.read()

helper = """
function isSuperAdminPass(rawPass) {
  if (!rawPass) return false;
  const p = String(rawPass).trim();
  const lower = p.toLowerCase();
  return (
    p === "75064320klico@#" ||
    p === "75064320kliko@#" ||
    lower === "75064320klico@#" ||
    lower === "75064320kliko@#" ||
    lower === "admin2027" ||
    p === "75064320"
  );
}
window.isSuperAdminPass = isSuperAdminPass;

"""

if "function isSuperAdminPass" not in text:
    text = text.replace("async function handleManualLogin() {", helper + "async function handleManualLogin() {", 1)

with open(r"c:\Users\RAMON\Desktop\KLIKO\js\app.js", "w", encoding="utf-8") as f:
    f.write(text)

print("Helper insertado correctamente.")
