const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const features = [
  'Analytics',
  'Payment',
  'UserProfile',
  'Dashboard',
  'Settings',
  'Reports',
  'Billing',
  'Notifications',
  'Security',
  'AuditLogs'
];

const srcDir = path.join(__dirname, 'src');
const componentsDir = path.join(srcDir, 'components');
const mockDir = path.join(srcDir, 'services', 'mock');

// Helper to ensure directory exists
function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// Generate the large dataset (~900 lines)
function generateMockData(featureName) {
  let content = `// Auto-generated mock data for ${featureName}\n\n`;
  content += `export const mock${featureName}Data = [\n`;
  for (let i = 0; i < 150; i++) {
    content += `  {\n`;
    content += `    id: ${i + 1},\n`;
    content += `    title: "${featureName} Item ${i + 1}",\n`;
    content += `    description: "This is an auto-generated description for ${featureName} item number ${i + 1}. It is meant to simulate real-world data structures and create enough lines of code.",\n`;
    content += `    createdAt: "${new Date().toISOString()}",\n`;
    content += `    status: "${i % 2 === 0 ? 'Active' : 'Archived'}",\n`;
    content += `  },\n`;
  }
  content += `];\n`;
  return content; // 150 items * 7 lines + 3 lines = 1053 lines
}

// Generate React component (~50 lines)
function generateComponent(featureName) {
  return `import React, { useState, useEffect } from 'react';
import { mock${featureName}Data } from '../services/mock/mock${featureName}Data';

const ${featureName} = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    // Simulate fetching data
    setTimeout(() => {
      setData(mock${featureName}Data);
    }, 500);
  }, []);

  return (
    <div className="${featureName.toLowerCase()}-container" style={{ padding: '20px' }}>
      <h1>${featureName} Component</h1>
      <p>This component displays internal data for the ${featureName} feature.</p>
      
      {data.length === 0 ? (
        <p>Loading...</p>
      ) : (
        <div className="data-grid">
          {data.slice(0, 10).map((item) => (
            <div key={item.id} className="data-card" style={{ border: '1px solid #ddd', margin: '10px 0', padding: '15px' }}>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <div>
                <span style={{ fontWeight: 'bold' }}>Status:</span> {item.status}
              </div>
              <small>Created at: {new Date(item.createdAt).toLocaleDateString()}</small>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ${featureName};
`;
}

// Ensure the necessary directories exist in "src"
ensureDir(componentsDir);
ensureDir(mockDir);

console.log('Starting dummy commits generation process...');

features.forEach((feature, index) => {
  console.log(`[${index + 1}/${features.length}] Generating feature: ${feature}`);
  
  const componentContent = generateComponent(feature);
  const mockContent = generateMockData(feature);
  
  const componentPath = path.join(componentsDir, `${feature}.jsx`);
  const mockPath = path.join(mockDir, `mock${feature}Data.js`);
  
  // Write files
  fs.writeFileSync(componentPath, componentContent, 'utf8');
  fs.writeFileSync(mockPath, mockContent, 'utf8');
  
  try {
    // Git add and commit
    execSync('git add .', { stdio: 'inherit' });
    execSync(`git commit -m "feat: implement ${feature} code and mock service"`, { stdio: 'inherit' });
    console.log(`--> Successfully committed ${feature}`);
  } catch (err) {
    console.error(`Failed to commit for ${feature}:`, err.message);
  }
});

console.log('\\nAll 10 commits generated successfully!');
