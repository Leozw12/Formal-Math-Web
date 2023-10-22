import { useState } from 'react'
import './App.css'
import MonacoEditor from 'react-monaco-editor';
import 'monaco-editor/min/vs/editor/editor.main.css';

function App() {
  const [code, setCode] = useState<string>('');

  const handleChange = (newValue: string) => {
    setCode(newValue);
  };

  const options = {
    selectOnLineNumbers: true,
    roundedSelection: false,
    readOnly: false,
    language: "lean", 
    glyphMargin: false,   
    lineDecorationsWidth: 0,  
    minimap: {
      enabled: false
    }
  };

  return (
    <div className='app'>
      <div className='left'>
        <h2>Editor</h2>
        <MonacoEditor
          className="lean-monaco-editor"
          language="lean"
          height="92%"
          value={code}
          options={options}
          onChange={handleChange}
        />
      </div>
      <div className='right'>
      <h2>Output</h2>
        <div className="output-area">
          {/* 在此处显示代码的输出或其他信息 */}
        </div>
      </div>
    </div>
  )
}

export default App
