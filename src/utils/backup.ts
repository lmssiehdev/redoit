export function download(content: string, fileName: string, contentType: string) {
  const a = document.createElement("a"), file = new Blob([content], { type: contentType })
  a.href = URL.createObjectURL(file)
  a.download = fileName
  a.click();
  URL.revokeObjectURL(a.href);
}

export function importBackup(handle) {

  const promise = new Promise((res, rej) => {
    const file = handle?.target?.files[0] || handle?.files[0]

    if (!file || file.type !== 'text/plain' && file.type !== 'application/json') return

    const reader = new FileReader()
    reader.readAsText(file, "UTF-8")

    return reader.onload = async (evt) => {
      const backup = JSON.parse(evt.target.result);
      res(backup)
    }
  })

  return promise
}
