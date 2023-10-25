import { useState } from 'react'
import './App.css'
import MonacoEditor from 'react-monaco-editor';
import 'monaco-editor/min/vs/editor/editor.main.css';

import { run as runCode } from "./utils/api"
import { ExecuteResult } from './types/base';

function extractPatterns(s: string) {
  const regex = /(\d+):(\d+): (error:)([^1-9]*)/g;
  const matches = [];
  let match;

  while ((match = regex.exec(s)) !== null) {
      matches.push({
          location: {
              line: match[1],
              char: match[2]
          },
          errorType: match[3].slice(0, -1),
          message: match[4].trim()
      });
  }

  return matches;
}

function App() {
  const [code, setCode] = useState<string>('');
  const [executeResult, setExecuteResult] = useState<ExecuteResult>({data: "", code: 1});

  const handleChange = (newValue: string) => {
    setCode(newValue);
  };

  const options = {
    selectOnLineNumbers: true,
    roundedSelection: false,
    readOnly: false,
    glyphMargin: false,
    lineDecorationsWidth: 0,
    minimap: {
      enabled: false
    }
  };

  const run = async () => {
    const result = await runCode(code);
    console.log(result);
    setExecuteResult(result)
    console.log(extractPatterns(result.data));
  }

  const clear = () => {
    setCode("")
  }

  return (
    <div className='app'>
      <div className='left'>
        <h2 className='title'>Editor</h2>
        <div className='editor-area'>
          <MonacoEditor
            className="lean-monaco-editor"
            language="lean"
            height="100%"
            value={code}
            options={options}
            onChange={handleChange}
          />
        </div>
        <div className='operating-area'>
          <button onClick={clear}>Clear</button>
          <button onClick={run}>Execute</button>
        </div>
      </div>
      <div className='right'>
        <h2 className='title'>Output</h2>
        <div className="output-area">
          {/* 在此处显示代码的输出或其他信息 */}
        </div>
      </div>
    </div>
  )
}

export default App
