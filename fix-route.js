const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');
code = code.replace(
  '<Route path="/widget/thaiwater-level" element={<ThaiWaterLevelWidget />} />',
  '<Route path="/widget/thaiwater-level" element={<ThaiWaterLevelWidget />} />\n        <Route path="/widget/thaiwater-levels" element={<ThaiWaterLevelWidget />} />'
);
fs.writeFileSync('src/App.tsx', code);
