import { clsx } from "../utils"

const Info = ({ className }: { className?: string }) => <svg className={`w-5 h-5 ${className}`} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" /></svg>

export const ButtonInfo = () => {
  const [show, setShow] = React.useState(false)
  const [info, setInfo] = React.useState<null | { smtpHost: string, smtpPort: string }>(null)

  React.useEffect(() => {
    fetch('/api/info')
      .then(res => res.json())
      .then(setInfo)
  }, [])

  React.useEffect(() => {
    const windowClick = (e: MouseEvent) => {
      if (show && !e.composedPath().includes(document.querySelector('#button-info')!))
        setShow(false)
    }

    window.addEventListener('click', windowClick)
    return () => window.removeEventListener('click', windowClick)
  }, [show])

  if (!info) return null

  return (
    <div id="button-info" className="relative">
      <button type="button" onClick={() => setShow(s => !s)} className="flex w-9 h-9 items-center justify-center rounded-radius hover:bg-muted cursor-pointer">
        <span className="sr-only">Info</span>
        <Info />
      </button>
      {show && (
        <div className="flex flex-col w-56 rounded-radius bg-card border border-border absolute top-full right-0 p-4 text-sm z-40" >
          <div className="text-base font-semibold mb-4">SMTP Info</div>
          <div className="flex items-center justify-between">
            <div className="text-muted-foreground">SMTP Host:</div>
            <div className="flex items-center gap-x-2">
              <span className="font-bold">{info.smtpHost}</span>
              <ButtonCopy text={info.smtpHost} />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="text-muted-foreground">SMTP Port:</div>
            <div className="flex items-center gap-x-2">
              <span className="font-bold">{info.smtpPort}</span>
              <ButtonCopy text={info.smtpPort} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}


const ButtonCopy = ({ text, className }: { text: string, className?: string }) => {
  const [copied, setCopied] = React.useState(false)

  const onCopyHandler = () => {
    navigator.clipboard.writeText(text)
      .then(() => setCopied(true))
      .catch(() => setCopied(false))
  }

  React.useEffect(() => {
    if (copied) {
      const t = setTimeout(() => setCopied(false), 2000)
      return () => clearTimeout(t)
    }
  }, [copied])

  return (
    <button onClick={onCopyHandler} className="cursor-pointer group">
      <span className="sr-only">Copy</span>
      {!copied
        ? <svg className={clsx("w-4 h-4 text-muted-foreground group-hover:text-foreground", className)} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2" /><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" /></svg>
        : <svg className={clsx("w-4 h-4 text-green-500 dark:text-green-400", className)} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ><path d="M20 6 9 17l-5-5" /></svg>}
    </button>
  )
}
