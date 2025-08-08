/**
 * This file will automatically be loaded by webpack and run in the "renderer" context.
 * To learn more about the differences between the "main" and the "renderer" context in
 * Electron, visit:
 *
 * https://electronjs.org/docs/tutorial/process-model
 *
 * By default, Node.js integration in this file is disabled. When enabling Node.js integration
 * in a renderer process, please be aware of potential security implications. You can read
 * more about security risks here:
 *
 * https://electronjs.org/docs/tutorial/security
 *
 * To enable Node.js integration in this file, open up `main.js` and enable the `nodeIntegration`
 * flag:
 *
 * ```
 *  // Create the browser window.
 *  mainWindow = new BrowserWindow({
 *    width: 800,
 *    height: 600,
 *    webPreferences: {
 *      nodeIntegration: true
 *    }
 *  });
 * ```
 */
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';
import PortalLayout from './PortalLayout';
import WorldBuilder from '../pages/WorldList';
import WorldEditor from '../pages/WorldEditor';
import { SettingsProvider } from '../context/SettingsContext';

function Home() {
  return <h1>Home Page</h1>;
}
function About() {
  return <h1>About Page</h1>;
}
function Generator() {
  return <h1>Character Generator Page</h1>;
}
function HomebrewManager() {
  return <h1>Homebrew Manager Page</h1>;
}

function App() {
  return (
    <SettingsProvider>
      <Router>
        <PortalLayout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/worldbuilder" element={<WorldBuilder />} />
            <Route path="/generator" element={<Generator />} />
            <Route path="/homebrew" element={<HomebrewManager />} />
            <Route path="/world/new" element={<WorldEditor />} />
            <Route path="/world/:worldId/edit" element={<WorldEditor />} />
          </Routes>
        </PortalLayout>
      </Router>
    </SettingsProvider>
  );
}

export default App;
