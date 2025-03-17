interface Props {
  theme: 'light' | 'dark',
  onSet: (theme: 'light' | 'dark' | 'system') => void
}

const Sun = ({ className }: { className?: string }) => <svg className={`w-5 h-5 ${className}`} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4" /><path d="M12 2v2" /><path d="M12 20v2" /><path d="m4.93 4.93 1.41 1.41" /><path d="m17.66 17.66 1.41 1.41" /><path d="M2 12h2" /><path d="M20 12h2" /><path d="m6.34 17.66-1.41 1.41" /><path d="m19.07 4.93-1.41 1.41" /></svg>
const Moon = ({ className }: { className?: string }) => <svg className={`w-5 h-5 ${className}`} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" /></svg>
const System = ({ className }: { className?: string }) => <svg className={`w-5 h-5 ${className}`} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 17v4" /><path d="m15.2 4.9-.9-.4" /><path d="m15.2 7.1-.9.4" /><path d="m16.9 3.2-.4-.9" /><path d="m16.9 8.8-.4.9" /><path d="m19.5 2.3-.4.9" /><path d="m19.5 9.7-.4-.9" /><path d="m21.7 4.5-.9.4" /><path d="m21.7 7.5-.9-.4" /><path d="M22 13v2a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7" /><path d="M8 21h8" /><circle cx="18" cy="6" r="3" /></svg>

export const ButtonTheme = ({ theme, onSet }: Props) => {
  const [show, setShow] = React.useState(false)

  const onSetHandler = (theme: 'light' | 'dark' | 'system') => {
    onSet(theme)
    setShow(false)
  }

  React.useEffect(() => {
    const windowClick = (e: MouseEvent) => {
      if (show && !e.composedPath().includes(document.querySelector('#button-theme')!))
        setShow(false)
    }

    window.addEventListener('click', windowClick)
    return () => window.removeEventListener('click', windowClick)
  }, [show])

  return (
    <div id="button-theme" className="relative">
      <button type="button" onClick={() => setShow(s => !s)} className="flex w-9 h-9 items-center justify-center rounded-radius hover:bg-muted cursor-pointer">
        <span className="sr-only">Theme</span>
        {theme === 'light'
          ? <Sun />
          : <Moon />}
      </button>

      {show && (
        <div className="flex flex-col w-42 rounded-radius bg-card border border-border absolute top-full right-0 p-1 text-sm z-40">
          <button
            type="button"
            className="flex items-center justify-start gap-x-2 py-2 px-4 hover:bg-muted rounded-radius cursor-pointer"
            onClick={() => onSetHandler('light')}
          >
            <Sun className="text-muted-foreground" /> Light
          </button>

          <button
            type="button"
            className="flex items-center justify-start gap-x-2 py-2 px-4 hover:bg-muted rounded-radius cursor-pointer"
            onClick={() => onSetHandler('dark')}
          >
            <Moon className="text-muted-foreground" /> Dark
          </button>

          <button
            type="button"
            className="flex items-center justify-start gap-x-2 py-2 px-4 hover:bg-muted rounded-radius cursor-pointer"
            onClick={() => onSetHandler('system')}
          >
            <System className="text-muted-foreground" /> System
          </button>
        </div>
      )}
    </div>
  )
}