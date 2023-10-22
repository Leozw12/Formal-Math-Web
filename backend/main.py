import subprocess

from fastapi import FastAPI, Body

app = FastAPI()


@app.post('/run')
def run_lean(data: dict = Body(...)):
    lean_process = subprocess.Popen(['lean', '--stdin'],
                                    stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    stdout, stderr = lean_process.communicate(data['lean_code'].encode('utf-8'))
    lean_process.wait()
    return {
        'code': lean_process.returncode,
        'data': stdout.decode('utf-8').strip()
    }


if __name__ == '__main__':
    print(run_lean({'lean_code': 'example : 1 + 1 = 3 := by rfl'}))
    print(run_lean({'lean_code': '#eval Lean.versionString'}))
