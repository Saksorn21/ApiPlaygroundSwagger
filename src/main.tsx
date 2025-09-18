import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
// Supports weights 100-900
import '@fontsource-variable/roboto';
import '@fontsource/prompt'
import '@fontsource/prompt/100.css';
import '@fontsource/prompt/200.css';
import '@fontsource/prompt/300.css';
import '@fontsource/prompt/400.css';
import '@fontsource/prompt/500.css';
import '@fontsource/prompt/600.css';
import '@fontsource/prompt/700.css';
import '@fontsource/prompt/800.css';
import '@fontsource/prompt/900.css';
import "./i18n"
const rootElement = document.getElementById('root') as HTMLElement;
const root = ReactDOM.createRoot(rootElement);

root.render(
  <StrictMode>
    <App />
  </StrictMode>,
);
