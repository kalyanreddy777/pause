const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const regex = /  const backgroundColor = useTransform\([\s\S]*?\);\n\n  const borderColor = useTransform\([\s\S]*?\);\n\n  const backdropFilter = useTransform\([\s\S]*?\);\n\n  const boxShadow = useTransform\([\s\S]*?\);/g;

code = code.replace(regex, `  const backgroundColor = "rgba(255, 255, 255, 0.5)";
  const borderColor = "rgba(255, 255, 255, 0.2)";
  const backdropFilter = "blur(16px)";
  const boxShadow = "0 8px 32px rgba(0,0,0,0.08)";`);

fs.writeFileSync('src/App.tsx', code);
console.log("Success");
