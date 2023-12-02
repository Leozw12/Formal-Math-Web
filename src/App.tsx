import {useState} from 'react'
import './App.css'

import MonacoEditor, {monaco} from 'react-monaco-editor'
import 'monaco-editor/min/vs/editor/editor.main.css'
import {leanSyntax} from './syntax'
// import langConfig from './lang-config'

import {Button, Alert} from 'antd'
import {CaretRightOutlined, ReloadOutlined} from '@ant-design/icons'

import {run as runCode} from './utils/api'
import {ExecuteResult} from './types/base'

// 语法高亮
monaco.languages.register({id: 'lean4'})
monaco.languages.setMonarchTokensProvider('lean4', leanSyntax)
// monaco.languages.setLanguageConfiguration('lean4', {langConfig})

function extractPatterns(s: string) {
  const regex = /(\d+):(\d+): (error:)([^1-9]*)/g
  const matches = []
  let match

  while ((match = regex.exec(s)) !== null) {
    matches.push({
      location: {
        line: match[1],
        char: match[2]
      },
      errorType: match[3].slice(0, -1),
      message: match[4].trim()
    })
  }

  return matches
}

// 输出组件
function Output({result}) {
  if(result.code == 0){
    return <Alert type="info" message="info" description={result.data} showIcon></Alert>
  }else if(result != '') {
    return extractPatterns(result.data).map((item) => (
          <Alert
            key={item.location.line}
            type="error"
            message={`${item.errorType} ${item.location.line}:${item.location.char}`}
            description={item.message}
            showIcon
          ></Alert>
        ))
  }
}

function App() {
  const [code, setCode] = useState<string>('#eval Lean.versionString')
  const [executeResult, setExecuteResult] = useState<ExecuteResult>({
    code: 1,
    data: ''
  })

  const handleChange = (newValue: string) => {
    setCode(newValue)
  }

  const options = {
    automaticLayout: true,
    lineNumbersMinChars: 1,
    selectOnLineNumbers: true,
    roundedSelection: false,
    readOnly: false,
    glyphMargin: false,
    lineDecorationsWidth: 0,
    minimap: {
      enabled: false
    }
  }

  const run = async () => {
    if(code.trim() != ''){
      const result = await runCode(code.trim())
      // console.log(result)
      setExecuteResult(result)
      // console.log(extractPatterns(result.data))
    }
    
  }

  const clear = () => {
    setCode('')
    setExecuteResult({code: 1, data: ''})
  }

  return (
    <div className="app">
      <div className="left">
        <h2 className="title">
          Editor
          <div className="operating-area">
            <Button onClick={clear} icon={<ReloadOutlined />}></Button>
            <Button
              onClick={run}
              icon={<CaretRightOutlined style={{color: '#2EAA33'}} />}
            >
              Execute
            </Button>
          </div>
        </h2>
        <div className="editor-area">
          <MonacoEditor
            className="lean-monaco-editor"
            language="lean4"
            height="100%"
            value={code}
            options={options}
            onChange={handleChange}
          />
        </div>
      </div>
      <div className="right">
        <h2 className="title">Output</h2>
        <div className="output-area">
          {/* 在此处显示代码的输出或其他信息 */}
          <Output result={executeResult} />
        </div>
      </div>
    </div>
  )
}

export default App
